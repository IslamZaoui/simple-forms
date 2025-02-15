import dayjs from 'dayjs';
import 'dayjs/locale/en';
import relativeTime from 'dayjs/plugin/relativeTime';
import ms from 'ms';

export const formatSeconds = (duration: number) => ms(duration * 1000, { long: true });

dayjs.extend(relativeTime);
export const formatTimeDistance = (date: Date) => dayjs(date).fromNow();
