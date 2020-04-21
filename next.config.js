const compose = require('next-compose-plugins');
const withCSS = require('@zeit/next-css');
const nextConfig = {
    webpack: (config) => {
        config.module.rules.push({
            test: /\.svg$/,
            exclude: /node_modules/,
            use: ['@svgr/webpack'],
        });
        return config;
    },
    env: {
        secretAccessKey: "EtAC13qOHyLhyAh/ha9vdKrlm9S6mowWeywGAtVd",
        JWT_SECRET: "7447bhjhbh?-!@#$%%^**$HB@BHhhb```bhdbdubu>",
        accessKeyId: "AKIAVVKH7VVUCRR2SRNS",
        region: "us-east-1",
        Bucket: "bucketeer-c655f294-62a1-4abb-a015-7b4331d63cdd",
        PK: "PK"
    }
};
module.exports = compose([[withCSS({
    cssModules: true,
    cssLoaderOptions: {
        importLoaders: 1,
        localIdentName: "[local]___[hash:base64:5]",
    }
})], nextConfig]);