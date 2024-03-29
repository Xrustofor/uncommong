const webpack = require('webpack')
module.exports = {
    css: {
        loaderOptions: {
            scss: {
                additionalData: `@import "~@/assets/style/variables.scss";`
            },
        }
    },
    configureWebpack: {
        plugins: [
            new webpack.IgnorePlugin({
                resourceRegExp: /^\.\/locale$/,
                contextRegExp: /moment$/
            })
        ],

    },
    chainWebpack: config => {
        config.module.rule('pdf')
            .test(/\.pdf$/)
            .use('file-loader').loader('file-loader')
    },
    devServer: {
        port: 3001,
    },
}
