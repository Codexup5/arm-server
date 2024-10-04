const getErrorMessage = (error: unknown) => {
    let errorMeassage = '';

    if (error instanceof Error) {
        errorMeassage = error.message;
    }

    return errorMeassage;
};

export default getErrorMessage;
