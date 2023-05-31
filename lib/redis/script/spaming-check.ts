import { Redis } from "ioredis";

export const SpamingCheck = (redis: Redis) => {
    redis.defineCommand("spamingCheck", {
        numberOfKeys: 3,
        lua: `
        local bttl = redis.call('TTL', KEYS[1])
    
        if (bttl <= -1) then
            if(redis.call('TTL', KEYS[2]) <= -1) then
                redis.call('SET', KEYS[2], 0)
                redis.call('EXPIRE', KEYS[2], ARGV[1])
            end
    
            local count = redis.call('INCR', KEYS[2])
            local ttl = redis.call('TTL', KEYS[2])
    
            return {'false', ttl, count}
        end
    
        --redis.call('DEL', KEYS[2])
        local bcount = redis.call('GET', KEYS[3])

        return {'true', bttl, bcount}
        `,
    });
}