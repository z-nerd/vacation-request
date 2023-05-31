import "server-only"

import { Redis } from "ioredis"
import { BlockReport, SpamingCheck } from "./script"
import { AppError } from "../error"

if (!process.env.REDIS_URI)
    throw new AppError({
        cause: { type: 'CONFIG', name: 'ENV' },
        status: 500,
        message: `Invalid/Missing environment variable: "REDIS_URI"`,
    })


const uri = process.env.REDIS_URI

export default class RedisCache {
    static #instance: RedisCache
    #client: Redis

    private constructor() {
        this.#client = new Redis(uri, {})
        SpamingCheck(this.#client)
        BlockReport(this.#client)
    }

    public static get Instance() {
        return this.#instance || (this.#instance = new this());
    }

    public get client(): Redis {
        return this.#client
    }
}