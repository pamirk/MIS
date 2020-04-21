const AWS = require("aws-sdk");

module.exports  = async function saveFile(file) {
    let s3 = new AWS.S3({
        accessKeyId: "AKIAVVKH7VVUCRR2SRNS",
        secretAccessKey: "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",
        region: "us-east-1"
    });
    let params = {
        Bucket: "bucketeer-c655f294-62a1-4abb-a015-7b4331d63cdd", // BUCKETEER_BUCKET_NAME
        Key: Date.now() + Math.random() + '-' + file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read"
    };
    return new Promise((resolve, reject) => {
        s3.upload(params, function (err, data) {
            if (err) return reject(err);
            resolve({fileLink: data});
        });
    });
};