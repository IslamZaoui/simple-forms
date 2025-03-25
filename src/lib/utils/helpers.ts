type Success<T> = {
	success: true;
	data: T;
};

type Failure<E> = {
	success: false;
	error: E;
};

type SafeResult<T, E = Error> = Success<T> | Failure<E>;

export async function tryCatch<T, E = Error>(promise: Promise<T>): Promise<SafeResult<T, E>> {
	try {
		const data = await promise;
		return { data, success: true };
	} catch (error) {
		return { error: error as E, success: false };
	}
}
