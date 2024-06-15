import url from 'node:url'
import path from 'node:path'
import {drizzle} from 'drizzle-orm/better-sqlite3'
import {migrate} from 'drizzle-orm/better-sqlite3/migrator'
import Database from 'better-sqlite3'
import appDataPath from './util/app-data.js'

import * as schema from './schema.js'
export * from './schema.js'

let databasePath = path.resolve(appDataPath, 'app-data.db')
if (process.env.DEV) {
    databasePath = path.resolve('./dev.db')
}

const esmDirName = url.fileURLToPath(new URL('.', import.meta.url))
const sqlite = new Database(databasePath)
export const db = drizzle(sqlite, {schema, logger: true})

if (!process.env.DEV) {
    migrate(db, {migrationsFolder: path.resolve(esmDirName, '../migrations')})
} else {
    console.log('DEV mode skipping migrations')
}