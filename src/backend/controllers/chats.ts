import type {TypeBoxTypeProvider} from '@fastify/type-provider-typebox'
import type {FastifyPluginAsync} from 'fastify'
import {Type as t} from '@sinclair/typebox'
import {eq, inArray} from 'drizzle-orm'
import {Template} from '@huggingface/jinja'
import {logger} from '../logging.js'
import {
    db,
    Chat,
    ChatCharacters,
    Character,
    Message,
    ChatLore,
    selectChatSchema,
    selectMessageSchema,
    selectCharacterSchema,
    selectChatCharactersSchema,
    selectLoreSchema,
} from '../db.js'

export const chatRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.withTypeProvider<TypeBoxTypeProvider>().route({
        url: '/chats',
        method: 'GET',
        schema: {
            operationId: 'GetAllChats',
            tags: ['chats'],
            summary: 'Get all Chats',
            response: {
                200: t.Object({
                    chats: t.Array(
                        t.Object({
                            ...selectChatSchema.properties,
                            characters: t.Array(
                                t.Object({
                                    ...selectChatCharactersSchema.properties,
                                    character: selectCharacterSchema,
                                }),
                            ),
                        }),
                    ),
                }),
            },
        },
        handler: async () => {
            const chats = await db.query.Chat.findMany({
                with: {characters: {with: {character: true}}},
            })
            if (!chats) {
                throw new Error('No chats found')
            }
            return {chats}
        },
    })

    fastify.withTypeProvider<TypeBoxTypeProvider>().route({
        url: '/chat/:id',
        method: 'GET',
        schema: {
            operationId: 'GetChatById',
            tags: ['chats'],
            summary: 'Get a Chat by ID',
            params: t.Object({
                id: t.String(),
            }),
            response: {
                200: t.Object({
                    chat: t.Object({
                        ...selectChatSchema.properties,
                        messages: t.Array(selectMessageSchema),
                    }),
                    characters: t.Array(selectCharacterSchema),
                    lore: t.Array(selectLoreSchema),
                }),
            },
        },
        handler: async (req) => {
            const chat = await db.query.Chat.findFirst({
                where: eq(Chat.id, Number(req.params.id)),
                with: {
                    messages: true,
                    characters: {with: {character: true}},
                    lore: {with: {lore: true}},
                },
            })
            const characters = chat?.characters.map((c) => {
                return c.character
            })

            if (!characters) {
                throw new Error('No characters found')
            }

            const lore = chat?.lore.map((l) => {
                return l.lore
            })

            if (!lore) {
                throw new Error('No lore found')
            }

            if (chat) {
                return {chat, characters, lore}
            } else {
                throw new Error('Chat not found')
            }
        },
    })

    fastify.withTypeProvider<TypeBoxTypeProvider>().route({
        url: '/create-chat',
        method: 'POST',
        schema: {
            operationId: 'CreateChat',
            tags: ['chats'],
            summary: 'Create a Chat',
            body: t.Object({
                characters: t.Array(t.Number()),
                lore: t.Array(t.Number()),
            }),
            response: {
                200: t.Object({
                    id: t.Number(),
                }),
            },
        },
        handler: async (req) => {
            const {characters} = req.body
            if (characters.length === 0) {
                throw new Error('At least one character is required')
            }

            const [newChat] = await db.insert(Chat).values({}).returning({id: Chat.id})
            const chatCharacters = await db.query.Character.findMany({
                where: inArray(Character.id, characters),
            })
            const userCharacter = chatCharacters.find((character) => character.type === 'user')
            logger.debug(`User character: ${userCharacter?.name}`)

            // Add chat characters
            // TODO change to a multi insert
            for (let i = 0; i < characters.length; i += 1) {
                const characterId = characters[i]
                logger.debug(`Inserting character ${characterId} into chat ${newChat.id}`)
                await db.insert(ChatCharacters).values({
                    chatId: newChat.id,
                    characterId,
                })

                // If characters have a first message, add it
                const resCharacter = await db.query.Character.findFirst({
                    where: eq(Character.id, characterId),
                })
                if (resCharacter?.firstMessage) {
                    const firstMessage = new Template(resCharacter.firstMessage).render({
                        char: resCharacter.name,
                        user: userCharacter?.name || 'User',
                    })
                    await db
                        .insert(Message)
                        .values({
                            chatId: newChat.id,
                            characterId,
                            type: 'model',
                            activeIndex: 0,
                            content: [firstMessage],
                        })
                        .returning({id: Message.id})
                }
            }

            // Add chat lore
            // TODO change to a multi insert
            const {lore} = req.body
            for (let i = 0; i < lore.length; i += 1) {
                const loreId = lore[i]
                await db.insert(ChatLore).values({
                    chatId: newChat.id,
                    loreId,
                })
                logger.debug(`Adding lore: ${loreId} into chat: ${newChat.id}`)
            }

            return {id: newChat.id}
        },
    })

    fastify.withTypeProvider<TypeBoxTypeProvider>().route({
        url: '/delete-chat/:id',
        method: 'POST',
        schema: {
            operationId: 'DeleteChat',
            tags: ['chats'],
            summary: 'Delete a Chat',
            params: t.Object({id: t.String()}),
        },
        handler: async (req) => {
            await db.delete(Chat).where(eq(Chat.id, Number(req.params.id)))
        },
    })
}
