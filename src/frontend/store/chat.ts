import {defineStore} from 'pinia'
import {chatCollection} from '@/db'
import type {Chat} from '@/db'

export const useChatStore = defineStore('chat', {
    state: () => {
        return {chat: {} as Chat}
    },
    actions: {
        async getChat(chatId: string) {
            this.chat = await chatCollection.findById(chatId)
        },
        async save() {
            await chatCollection.update(this.chat)
        },
        async updateMessage(index: number, content: string) {
            const message = this.chat.messages[index]
            if (message) {
                message.content[message.activeIndex] = content
                await this.save()
            }
        },
        async deleteMessage(index: number) {
            this.chat.messages.splice(index, 1)
            await this.save()
        },
        async swipeLeft(index: number) {
            const message = this.chat.messages[index]
            if (message && message.activeIndex > 0) {
                message.activeIndex -= 1
                await this.save()
            }
        },
        async swipeRight(index: number) {
            const message = this.chat.messages[index]
            if (message && message.activeIndex < message.content.length - 1) {
                message.activeIndex += 1
                await this.save()
            }
        },
    },
})