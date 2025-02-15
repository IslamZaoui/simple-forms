import { building, dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { Redis } from '@upstash/redis';

let redis: Redis;

if (!dev && !building && env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
	redis = new Redis({
		url: env.UPSTASH_REDIS_REST_URL,
		token: env.UPSTASH_REDIS_REST_TOKEN
	});
}

export { redis };
