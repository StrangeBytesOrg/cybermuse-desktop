import {Collection} from '@strangebytes/pouchdb-orm'
import PouchDB from 'pouchdb'
import find from 'pouchdb-find'
import {z} from 'zod'

const dbName = 'devdb'
export const db = new PouchDB(dbName, {
    revs_limit: 10, // TODO verify if auto-compaction is necessary with revs_limit
})
PouchDB.plugin(find)

const baseSchema = z.object({
    _id: z.string(),
    _rev: z.string().optional(),
})

/** Character */
const characterSchema = baseSchema.extend({
    _id: z.string().default(() => `character-${Math.random().toString(36).slice(2)}`),
    name: z.string(),
    type: z.union([z.literal('user'), z.literal('character')]),
    description: z.string(),
    firstMessage: z.string().optional(),
    image: z.string().optional(),
})
export const characterCollection = new Collection(db, 'character', characterSchema)

/** Lore */
const loreSchema = baseSchema.extend({
    _id: z.string().default(() => `lore-${Math.random().toString(36).slice(2)}`),
    name: z.string(),
    entries: z.array(
        z.object({
            name: z.string(),
            content: z.string(),
        }),
    ),
})
export const loreCollection = new Collection(db, 'lore', loreSchema)

/** Chat */
const chatSchema = baseSchema.extend({
    _id: z.string().default(() => `chat-${Math.random().toString(36).slice(2)}`),
    name: z.string(),
    userCharacter: z.string(),
    characters: z.array(z.string()),
    lore: z.array(z.string()),
    createDate: z.string().datetime(),
    messages: z.array(
        z.object({
            characterId: z.string(),
            type: z.union([z.literal('user'), z.literal('model'), z.literal('system')]),
            content: z.array(z.string()),
            activeIndex: z.number(),
        }),
    ),
})
export const chatCollection = new Collection(db, 'chat', chatSchema)
export type Chat = z.infer<typeof chatSchema>
export type Message = z.infer<typeof chatSchema>['messages'][0]

/** Template */
const templateSchema = baseSchema.extend({
    _id: z.string().default(() => `template-${Math.random().toString(36).slice(2)}`),
    name: z.string(),
    template: z.string(),
})
export const templateCollection = new Collection(db, 'template', templateSchema)

/** Generation Preset */
const generationPresetSchema = baseSchema.extend({
    _id: z.string().default(() => `generationPreset-${Math.random().toString(36).slice(2)}`),
    name: z.string(),
    context: z.number(),
    maxTokens: z.number(),
    temperature: z.number(),
    seed: z.number().optional(),
    topK: z.number().optional(),
    topP: z.number().optional(),
    minP: z.number().optional(),
    repeatPenalty: z.number().optional(),
    repeatLastN: z.number().optional(),
    penalizeNL: z.boolean().optional(),
    presencePenalty: z.number().optional(),
    frequencyPenalty: z.number().optional(),
})
export const generationPresetCollection = new Collection(db, 'generationPreset', generationPresetSchema)

/** User */
const userSchema = baseSchema.extend({
    name: z.string(),
    generatePresetId: z.string(),
    promptTemplateId: z.string(),
})
export const userCollection = new Collection(db, 'user', userSchema)