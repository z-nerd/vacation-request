import RedisCache from "@/lib/redis"

export interface BlockSpamServiceProps {
    redisCache: RedisCache
}

export class BlockSpamService {
    _props!: BlockSpamServiceProps
    blockIpCountNameSpace = 'blockIpCount'
    blockIpNameSpace = 'blockIp'
    blockIpCheckNameSpace = 'blockIpCheck'

    constructor(blockSpamServiceProps: BlockSpamServiceProps = {
        redisCache: RedisCache.Instance
    }) {
        this._props = blockSpamServiceProps
    }

    /**
     * detect if any IP spaming or not
     * 
     * @param {string} ip The IP of the api call.
     * @param {number} allowCount The number of allow api calls.
     * @param {number} allowTtl The duration of allow api calls in second.
     * @returns {boolean}
     * 
     * @example
     * 
     *      detect('192.168.1.1', 1, 1)
     * 
     */
    check = async (
        api: string,
        ip: string,
        allowCount: number,
        allowTtl: number
    ) => {
        const redisBlockIpKey = `${this.blockIpNameSpace}:${api}:${ip}`
        const redisSpamIpKey = `${this.blockIpCheckNameSpace}:${api}:${ip}`
        const redisBlockIpCounttKey = `${this.blockIpCountNameSpace}:${api}:${ip}`

        const [isBlock, ttl, count] = await
            (this._props.redisCache.client as any).spamingCheck(
                redisBlockIpKey,
                redisSpamIpKey,
                redisBlockIpCounttKey,
                allowTtl.toString()) as [string, string, string];

        return {
            isSpam: Number(count) > allowCount,
            isBlock: isBlock === 'true',
            ttl: Number(ttl),
            count: Number(count),
        }
    }


    block = async (
        api: string, 
        ip: string, 
        ttl: number[], 
        blockIpCountTtl: number = 86400): Promise<[number, number, "OK" | null]> => {
        const redisBlockIpKey = `${this.blockIpNameSpace}:${api}:${ip}`
        const redisBlockIpCounttKey = `${this.blockIpCountNameSpace}:${api}:${ip}`

        let blockCount: number = await
            (this._props.redisCache.client as any)
                .blockReport(redisBlockIpCounttKey, blockIpCountTtl)

        if (Number(blockCount) >= ttl.length) {
            (await this._props.redisCache.client as any).multi()
                .del(redisBlockIpCounttKey)
                .blockReport(redisBlockIpCounttKey, blockIpCountTtl)
                .exec()

            blockCount = 0
        }

        const duration = ttl[blockCount]

        return [duration, blockCount, await this._props.redisCache.client.set(redisBlockIpKey, ip, 'EX', duration, 'NX')]
    }
}