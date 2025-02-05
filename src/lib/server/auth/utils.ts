import { alphabet, generateRandomString } from 'oslo/crypto'

export const generateRandomOTP = (length: number = 6) =>
	generateRandomString(length, alphabet('0-9', 'A-Z'))
