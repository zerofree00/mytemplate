# 多页面，多入口打包


同一个框架搭建两个项目，使用 vue 的多页面打包配置，分别打包出来

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### 启动项目怎么切换两个项目

```
OAV版本，路由开头直接 / 访问

OAR版本，路由开头添加 oar/ 访问
```

### 根据打包命令不同，修改打包出来的接口环境

```
文件名： .env.local  打包本地环境
文件名： .env.test  打包测试环境
文件名： .env.production  打包生产环境
```

### 多页面配置

```
同一个框架，包含两个项目，使用多页面配置，分别打包出来
package.json 文件里面

以oav结尾的是OAV版本
"build-oav": "vue-cli-service build index",
"local-oav": "vue-cli-service build index --mode local",
"test-oav": "vue-cli-service build index --mode test",

以oar结尾的是OAr版本
"build-oar": "vue-cli-service build oar",
"test-oar": "vue-cli-service build oar --mode test",
"local-oar": "vue-cli-service build oar --mode local",

打包出来的文件，
oar 以oar.html为开始页面
oav index.html为开始页面
```
