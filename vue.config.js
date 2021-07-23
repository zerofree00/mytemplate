// vue.config.js
const path = require('path')
const resolve = (dir) => path.join(__dirname, dir)
const vConsolePlugin = require('vconsole-webpack-plugin')
// 文件打包
const FileManagerPlugin = require('filemanager-webpack-plugin')

let objectProject = {
    index: {
        entry: 'src/view/oav/main.js', // page 的入口
        template: 'src/public/index.html', // 模板来源
        filename: 'index.html', // 在 dist/index.html 的输出
        // 当使用 title 选项时，template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
        title: 'OAV',
        // 在这个页面中包含的块，默认情况下会包含,提取出来的通用 chunk 和 vendor chunk。
        chunks: ['chunk-vendors', 'chunk-common', 'index'],
    },
    oar: {
        entry: 'src/view/oar/main.js',
        template: 'src/public/oar.html',
        filename: 'oar.html',
        title: 'OAR',
        chunks: ['chunk-vendors', 'chunk-common', 'oar'],
    },
}
let page = {}
let projectname = process.argv[3] // 获取执行哪个文件

if (process.env.NODE_ENV == 'development') {
    page = objectProject
} else {
    page[projectname] = objectProject[projectname]
}

// 配置打包出来的名字
const outputDirName = process.env.VUE_APP_MODE + projectname
module.exports = {
    publicPath: './', // 基本路径
    outputDir: outputDirName, //标识是打包哪个文件
    devServer: {
        open: false, // 项目构建成功之后，自动弹出页面
        // host: 'localhost', // 主机名，也可以127.0.0.0 || 做真机测试时候0.0.0.0
        // port: 8081, // 端口号，默认8080
        https: false, // 协议
        hotOnly: false, // 没啥效果，热模块，webpack已经做好了
        proxy: {
            '/apis': {
                target: 'http://192.168.2.134:92/suncn-twoa6-system',
                // target: 'http://192.168.4.163:90/suncn-twoa6-system',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/apis': '',
                },
            },
        },
    },
    filenameHashing: true,
    pages: page,
    productionSourceMap: false, // 生产环境 sourceMap

    lintOnSave: true,
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@', resolve('src'))
            .set('assets', resolve('src/assets'))
            .set('utils', resolve('src/assets/utils'))
            .set('api', resolve('src/api'))
            .set('components', resolve('src/components'))
            .set('stylus', resolve('src/assets/stylus'))
            .set('view', resolve('src/view'))
            .set('viewOav', resolve('src/view/oav'))
            .set('viewOar', resolve('src/view/oar'))
    },
    configureWebpack: (config) => {
        //生产环境去掉vconsole调试器
        let envFlag = process.env.NODE_ENV != 'production'
        let pluginsDev = [
            new vConsolePlugin({
                filter: [],
                enable: envFlag,
            }),
        ]

        if (process.env.NODE_ENV == 'production') {
            // 打包压缩
            config.plugins.push(
                new FileManagerPlugin({
                    onStart: {
                        delete: ['./*.zip', './dist', './test', './local'],
                    },
                    onEnd: {
                        archive: [
                            {
                                source: `./${outputDirName}`,
                                destination: `./${outputDirName}.zip`,
                            },
                        ],
                    },
                })
            )
        }

        config.plugins = [...config.plugins, ...pluginsDev]
    },
}
