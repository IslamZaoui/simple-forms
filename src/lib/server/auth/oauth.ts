import { AUTH_GITHUB_ID, AUTH_GITHUB_SECRET } from '$env/static/private';
import { GitHub } from 'arctic';

export const github = new GitHub(AUTH_GITHUB_ID, AUTH_GITHUB_SECRET, null);
