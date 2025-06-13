import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '@prisma'

@Injectable()
export class ChatService {
  readonly #_prisma: PrismaService
  constructor(prisma: PrismaService) {
    this.#_prisma = prisma
  }

  async createConversation(userId: string) {
    return await this.#_prisma.conversation
      .create({
        data: {
          userId,
        },
        include: { user: true, messages: true },
      })
      .catch((error) => {
        console.log(error)
        throw new BadRequestException('Failed to create conversation')
      })
  }

  async getConversation(conversationId: string) {
    return this.#_prisma.conversation.findUnique({
      where: { id: conversationId },
      select: {
        id: true,
        user: true,
        userId:true,
        adminId:true,
        messages: { include: { sender: true } },
      },
    })
  }

  async getUserConversations(userId: string) {
    return this.#_prisma.conversation.findMany({
      where: { OR: [{ userId }, { adminId: userId }] },
      select: {
        id:true,
        user: {
          select: {
            id: true,
            messages: true,
            email: true,
            name: true,
          },
        },
        admin: {
          select: {
            id: true,
            messages: true,
            email: true,
            name: true,
          },
        },
      },
    })
  }

  async createMessage(data: { conversationId: string; senderId: string; content: string }) {
    console.log('data',data);
    
    return this.#_prisma.message.create({
      data: {
        conversationId: data.conversationId,
        senderId: data.senderId,
        content: data.content,
      },
      include: { sender: true },
    })
  }

  async assignAdminToConversation(conversationId: string, adminId: string) {
    return this.#_prisma.conversation.update({
      where: { id: conversationId },
      data: { adminId },
      include: { user: true, admin: true, messages: true },
    })
  }
}
