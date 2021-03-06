function catchErrors(error) {
    let errorMsg;
    if (error.response) {
        // The request was made and the server responsed with a status code that is not in the range of 2XX
        errorMsg = error.response.data;
        console.error("Error response", errorMsg.message);

        // For Cloudinary image uploads
        if (errorMsg.message) {
            errorMsg = errorMsg.message;
        }
        if (error.response.data.error) {
            errorMsg = error.response.data.error.message;
        }
    } else if (error.request) {
        // The request was made, but no response was received
        errorMsg = error.request;
        console.error("Error request", errorMsg);
    } else {
        // Something else happened in making the request that triggered an error
        errorMsg = error.message;
        console.error("Error message", errorMsg);
    }
    return errorMsg;
}

export default catchErrors;
