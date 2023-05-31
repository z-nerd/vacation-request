import { Redis } from "ioredis";

export const BlockReport = (redis: Redis) => {
    redis.defineCommand("blockReport", {
        numberOfKeys: 1,
        lua: `
        if (redis.call('TTL', KEYS[1]) <= -1) then
            redis.call('SET', KEYS[1], 0)
            redis.call('EXPIRE', KEYS[1], ARGV[1])
            return 0
        end

        return redis.call('INCR', KEYS[1])
        `,
    });
}