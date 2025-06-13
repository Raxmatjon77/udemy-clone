import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Injectable, Logger } from '@nestjs/common'
import { ChatService } from './chat.service'
import { JwtService } from '@nestjs/jwt'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  readonly #_chatService: ChatService
  readonly #_jwtService: JwtService

  @WebSocketServer() server: Server
  private logger = new Logger('ChatGateway')

  constructor(chatService: ChatService, jwtService: JwtService) {
    this.#_chatService = chatService
    this.#_jwtService = jwtService
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token
      const payload = this.#_jwtService.verify(token, { secret: process.env.JWT_AT_SECRET })
      client.data.userId = payload.sub

      client.join(client.data.userId) // This is crucial

      this.logger.log(`Client connected: ${client.id}, User: ${client.data.userId}`)
    } catch (error) {
      client.disconnect()
      this.logger.error(`Connection failed: ${error.message}`)
    }
  }
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`)
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(client: Socket, payload: { conversationId: string; content: string }) {
    const { conversationId, content } = payload
    const senderId = client.data.userId

    // Save message to database
    const message = await this.#_chatService.createMessage({
      conversationId,
      senderId,
      content,
    })

    // Broadcast message to both user and admin in the conversation
    const conversation = await this.#_chatService.getConversation(conversationId)
    this.server.to([conversation.userId, conversation.adminId].filter(Boolean)).emit('receiveMessage', message)
    return message
  }
}
