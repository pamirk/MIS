const compose = require('next-compose-plugins');
const withCSS = require('@zeit/next-css');
module.exports = compose([
    [withCSS({
        cssModules: true,
        cssLoaderOptions: {
            importLoaders: 1,
            localIdentName: "[local]___[hash:base64:5]",
        }
    })],
    {
        webpack: (config) => {
            config.module.rules.push({
                test: /\.svg$/,
                exclude: /node_modules/,
                use: ['@svgr/webpack'],
            });

            return config;
        },
        env: {
            MONGO_SRV: "<insert-mongo-srv>",
            JWT_SECRET: "7447bhjhbh?-!@#$%%^**$HB@BHhhb```bhdbdubu>",
            CLOUDINARY_URL: "<insert-cloudinary-url>",
            PK: "PK"
        }
    },

]);
