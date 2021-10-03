export const __prod__ = process.env.NODE_ENV === "production"
export const __dbname__ = process.env.DB_NAME ?? 'db'
export const __dbuser__ = process.env.DB_USER_NAME ?? 'root'
export const __dbpassword__ = process.env.DB_PASSWORD ?? 'root'
export const __dbhost__ = process.env.DB_HOST ?? 'localhost'
export const __dbport__ = process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432

export const __redishost__ = process.env.REDIS_HOST ?? 'localhost'
export const __redisport__ = process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379
export const __redispassword__ = process.env.REDIS_PASSWORD ?? ''

export const __redisttl__ = process.env.REDIS_TTL ? Number(process.env.REDIS_TTL) : 6000

export const __sessionsecret__ = process.env.SESSION_SECRET ?? 'asdfalsrtuidvkjrtydyvdsqew[to;jdcv;fdg'
export const __uiurl__ = process.env.UI_URL ?? 'http://localhost:3000'
export const __whitelisturl__ = process.env.WHITE_LIST_URL ? JSON.parse(process.env.WHITE_LIST_URL) : ['http://localhost:3000','https://studio.apollographql.com']