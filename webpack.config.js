const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        localizify: path.resolve(__dirname, './src/localizify.ts'),
        'localizify.min': path.resolve(__dirname, './src/localizify.ts'),
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js',
        library: 'localizify',
        libraryTarget: 'umd',
        globalObject: '(typeof window !== "undefined" ? window : this)',
    },
    resolve: {
        extensions: ['.ts', '.tsx'],
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                include: /\.min\.js$/,
            }),
        ],
    },
};
