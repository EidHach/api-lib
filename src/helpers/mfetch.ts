export async function mfetch<T>(
  ...promiseFns: (() => Promise<T>)[]
): Promise<(T | { status: string; message: string; data: null })[]> {
  const responses: (T | { status: string; message: string; data: null })[] =
    await Promise.all(
      promiseFns.map((promiseFn) =>
        promiseFn().catch((error) =>
          Promise.resolve({
            status: 'error',
            message: error.message,
            data: null,
          })
        )
      )
    );
  return responses;
}
