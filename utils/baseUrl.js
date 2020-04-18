const baseUrl =
    process.env.NODE_ENV === "production"
        ? "https://qwasa.herokuapp.com"
        : "http://localhost:3000";
export default baseUrl;

export const awsb = "https://bucketeer-c655f294-62a1-4abb-a015-7b4331d63cdd.s3.amazonaws.com";