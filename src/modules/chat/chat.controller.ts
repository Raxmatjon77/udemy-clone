import { Controller, Get, Post, Body, Request, UseGuards } from '@nestjs/common'
import { ChatService } from './chat.service'
import { JwtGuard } from '@guards'
import { Role } from '@enums'
import { Roles } from '@decorators'
import { CustomUser } from '@modules'

@Controller('chat')
export class ChatController {
  readonly #_service: ChatService
  constructor(service: ChatService) {
    this.#_service = service
  }

  @UseGuards(JwtGuard)
  @Post('conversation')
  async createConversation(@Request() req: CustomUser) {
    return this.#_service.createConversation(req.user.id)
  }

  @UseGuards(JwtGuard)
  @Get('conversations')
  async getConversations(@Request() req: CustomUser) {
    return this.#_service.getUserConversations(req.user.id)
  }

  @UseGuards(JwtGuard)
  @Post('assign-admin')
  @Roles(Role.ADMIN)
  async assignAdmin(@Body() body: { conversationId: string; adminId: string }, @Request() req: CustomUser) {
    return this.#_service.assignAdminToConversation(body.conversationId, body.adminId)
  }
}
