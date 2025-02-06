import { hash, verify } from '@node-rs/argon2'
import { alphabet, generateRandomString } from 'oslo/crypto'

export async function hashPassword(password: string): Promise<string> {
	return await hash(password, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	})
}

export async function verifyPasswordHash(hash: string, password: string): Promise<boolean> {
	return await verify(hash, password)
}

export const generateRandomOTP = (length: number = 6) =>
	generateRandomString(length, alphabet('0-9', 'A-Z'))
