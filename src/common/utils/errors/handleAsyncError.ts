import getErrorMessage from './getErrorMessage';

async function handleAsyncError<T>(
    methodName: string,
    contextMessage: string,
    fn: () => Promise<T>,
) {
    try {
        return await fn();
    } catch (error) {
        throw new Error(`${contextMessage} | ${methodName}: ${getErrorMessage(error)}`);
    }
}

export default handleAsyncError;
