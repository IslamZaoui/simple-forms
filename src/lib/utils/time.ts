import ms from 'ms'

export const formatSeconds = (duration: number) => ms(duration * 1000, { long: true })
