import type {TypeBoxTypeProvider} from '@fastify/type-provider-typebox'
import type {FastifyPluginAsync} from 'fastify'
import {Type as t} from '@sinclair/typebox'
import {eq} from 'drizzle-orm'
import {db, GeneratePreset, selectPresetSchema, insertPresetSchema, User} from '../db.js'

export const generatePresetsRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.withTypeProvider<TypeBoxTypeProvider>().route({
        url: '/presets',
        method: 'GET',
        schema: {
            operationId: 'GetAllGenerationPresets',
            tags: ['generate-presets'],
            summary: 'Get all generation presets',
            response: {
                200: t.Object({
                    presets: t.Array(selectPresetSchema),
                    activePresetId: t.Number(),
                }),
            },
        },
        handler: async () => {
            const presets = await db.query.GeneratePreset.findMany()
            const user = await db.query.User.findFirst({
                with: {generatePreset: true},
            })
            if (!presets) {
                throw new Error('No presets found')
            }
            if (!user || !user.generatePreset) {
                throw new Error('No user found')
            }

            return {presets, activePresetId: user.generatePreset.id}
        },
    })

    fastify.withTypeProvider<TypeBoxTypeProvider>().route({
        url: '/preset/:id',
        method: 'GET',
        schema: {
            operationId: 'GetGenerationPresetById',
            tags: ['generate-presets'],
            summary: 'Get a generation preset',
            params: t.Object({
                id: t.String(),
            }),
            response: {
                200: t.Object({preset: selectPresetSchema}),
            },
        },
        handler: async (req) => {
            const preset = await db.query.GeneratePreset.findFirst({
                where: eq(GeneratePreset.id, Number(req.params.id)),
            })
            if (!preset) {
                throw new Error('Preset not found')
            }
            return {preset}
        },
    })

    fastify.withTypeProvider<TypeBoxTypeProvider>().route({
        url: '/create-preset',
        method: 'POST',
        schema: {
            operationId: 'CreateGenerationPreset',
            tags: ['generate-presets'],
            summary: 'Create a generation preset',
            body: insertPresetSchema,
        },
        handler: async (req) => {
            try {
                await db.insert(GeneratePreset).values({
                    name: req.body.name,
                    context: req.body.context,
                    maxTokens: req.body.maxTokens,
                    temperature: req.body.temperature,
                    seed: req.body.seed,
                    topK: req.body.topK,
                    topP: req.body.topP,
                    minP: req.body.minP,
                    repeatPenalty: req.body.repeatPenalty,
                    repeatLastN: req.body.repeatLastN,
                    penalizeNL: req.body.penalizeNL,
                    presencePenalty: req.body.presencePenalty,
                    frequencyPenalty: req.body.frequencyPenalty,
                })
            } catch (err) {
                console.error(err)
                // TODO use proper error handling and response
                throw new Error('Failed to create generate preset')
            }
        },
    })

    fastify.withTypeProvider<TypeBoxTypeProvider>().route({
        url: '/update-preset/:id',
        method: 'POST',
        schema: {
            operationId: 'UpdateGenerationPreset',
            tags: ['generate-presets'],
            summary: 'Update a generation preset',
            params: t.Object({
                id: t.String(),
            }),
            body: insertPresetSchema,
        },
        handler: async (req) => {
            try {
                await db
                    .update(GeneratePreset)
                    .set({
                        name: req.body.name,
                        context: req.body.context,
                        maxTokens: req.body.maxTokens,
                        temperature: req.body.temperature,
                        seed: req.body.seed,
                        topK: req.body.topK,
                        topP: req.body.topP,
                        minP: req.body.minP,
                        repeatPenalty: req.body.repeatPenalty,
                        repeatLastN: req.body.repeatLastN,
                        penalizeNL: req.body.penalizeNL,
                        presencePenalty: req.body.presencePenalty,
                        frequencyPenalty: req.body.frequencyPenalty,
                    })
                    .where(eq(GeneratePreset.id, Number(req.params.id)))
            } catch (err) {
                console.error(err)
                // TODO use proper error handling and response
                throw new Error('Failed to update generate preset')
            }
        },
    })

    fastify.withTypeProvider<TypeBoxTypeProvider>().route({
        url: '/delete-preset/:id',
        method: 'POST',
        schema: {
            operationId: 'DeleteGenerationPreset',
            tags: ['generate-presets'],
            summary: 'Delete a generation preset',
            params: t.Object({
                id: t.String(),
            }),
        },
        handler: async (req, reply) => {
            if (req.params.id === '1') {
                return reply.status(400).send({message: 'Cannot delete the default preset'})
            }
            await db.update(User).set({generatePreset: 1}).where(eq(User.id, 1))
            await db.delete(GeneratePreset).where(eq(GeneratePreset.id, Number(req.params.id)))
        },
    })

    fastify.withTypeProvider<TypeBoxTypeProvider>().route({
        url: '/set-active-preset/:id',
        method: 'POST',
        schema: {
            operationId: 'SetActiveGenerationPreset',
            tags: ['generate-presets'],
            summary: 'Set the active generation preset',
            params: t.Object({
                id: t.String(),
            }),
        },
        handler: async (req) => {
            await db
                .update(User)
                .set({generatePreset: Number(req.params.id)})
                .where(eq(User.id, 1))
        },
    })
}
