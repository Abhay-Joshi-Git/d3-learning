module.exports = {
    entry: ['./main.js'],
    output: {
        path: './',
        filename: 'bundle.js'
    },
    devserver: {
        contentBase: './',
        inline: true,
        port: 8080
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel'
            }
        ]
    }
}