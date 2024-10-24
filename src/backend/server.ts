import path from 'node:path'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import fastifyStatic from '@fastify/static'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import {TypeBoxValidatorCompiler} from '@fastify/type-provider-typebox'
import {avatarsPath} from './paths.js'
import {logger} from './logging.js'
import {getConfig} from './config.js'
import {loadModel} from './llama-cpp.js'

// Routes
import {characterRoutes} from './controllers/character.js'
import {chatRoutes} from './controllers/chats.js'
import {loreRoutes} from './controllers/lore.js'
import {messageRoutes} from './controllers/message.js'
import {swipeRoutes} from './controllers/swipes.js'
import {templateRoutes} from './controllers/templates.js'
import {generatePresetsRoutes} from './controllers/generate-presets.js'
import {modelRoutes} from './controllers/models.js'
import {llamaCppRoutes} from './controllers/llama-cpp.js'

// Fixture DB data
import {fixtureData} from './fixture.js'
await fixtureData()

const config = getConfig()

export const server = Fastify({
    // logger: true,
    bodyLimit: 1024 * 1024 * 5, // 5MB
})
server.register(cors)
server.setValidatorCompiler(TypeBoxValidatorCompiler)
server.setErrorHandler((error, request, reply) => {
    console.error(error)
    // logger.error(error)
    reply.status(500).send(error)
})

await server.register(fastifySwagger, {
    openapi: {
        openapi: '3.1.0',
        info: {
            title: 'Chat App builtin server API',
            version: '0.1.0',
        },
        servers: [{url: '/api'}],
    },
    refResolver: {
        buildLocalReference(json, baseUrl, fragment, i) {
            return String(json.$id) || `def-${i}`
        },
    },
})

await server.register(fastifySwaggerUI, {
    routePrefix: '/docs',
})

// Set media type for error responses
// server.setErrorHandler((error, request, reply) => {
//     reply.headers({'Content-Type': 'application/problem+json'})
//     if (error.validation) {
//         reply.status(400).send({
//             statusCode: 400,
//             error: 'Bad Request',
//             message: error.message,
//         })
//     }
// })

// Create error schema
server.addSchema({
    $id: 'err',
    type: 'object',
    title: 'Default Error',
    properties: {
        statusCode: {type: 'integer'},
        code: {type: 'string'},
        error: {type: 'string'},
        message: {type: 'string'},
    },
})

// Add default error response to all routes
server.addHook('onRoute', (routeOptions) => {
    const defaultSchema = {
        description: 'Default error response',
        content: {'application/problem+json': {schema: {$ref: 'err#'}}},
    }
    if (!routeOptions.schema) {
        routeOptions.schema = {}
    }
    if (!routeOptions.schema.response) {
        routeOptions.schema.response = {default: defaultSchema}
    }
    // @ts-expect-error - Hack because I'm pretty sure that the Fastify type is intentionally overly vague
    if (!routeOptions.schema.response.default) routeOptions.schema.response.default = defaultSchema
})

// Serve avatars
await server.register(async (instance) => {
    await instance.register(fastifyStatic, {
        root: avatarsPath,
        prefix: '/avatars/',
    })
})

// Register controller routes
await server.register(characterRoutes, {prefix: '/api'})
await server.register(chatRoutes, {prefix: '/api'})
await server.register(loreRoutes, {prefix: '/api'})
await server.register(messageRoutes, {prefix: '/api'})
await server.register(swipeRoutes, {prefix: '/api'})
await server.register(modelRoutes, {prefix: '/api'})
await server.register(generatePresetsRoutes, {prefix: '/api'})
await server.register(templateRoutes, {prefix: '/api'})
await server.register(llamaCppRoutes, {prefix: '/api'})

// Serve frontend
await server.register(fastifyStatic, {
    root: path.resolve(import.meta.dirname, '../'),
})

server.listen({port: config.serverPort, host: '0.0.0.0'}, (error) => {
    if (error) {
        logger.error(error)
    }
    logger.info(`Server running on port ${config.serverPort}`)
})

if (config.autoLoad) {
    logger.info('auto loading')
    await loadModel(
        config.modelsPath,
        config.lastModel,
        config.contextSize,
        config.batchSize,
        config.gpuLayers,
        config.useFlashAttn,
    )
}

// SIGINT is fired on ctrl+c
process.on('SIGINT', () => {
    server.close()
})
// TSX sends a SIGTERM when using watch mode
process.on('SIGTERM', () => {
    server.close()
})
