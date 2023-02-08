<p align="left">
  <a href="https://deschool.app/">
    <img width="200" src="https://i.postimg.cc/wTTm4CdR/logo-main.png">
  </a>
</p>

<h2 align="left">

DeSchool-Lens 是一款由 Deschool 孵化的专注于提供 Web3 Resume 工具 & 平台。

</h2>

<p align="left">
  <!-- <a href="https://github.com/seedao/deschool-lite">
    <img src="https://img.shields.io/github/contributors/seedao/deschool-lite" alt="contributors">
  </a>
  <a href="https://github.com/seedao/deschool-lite">
    <img src="https://img.shields.io/github/issues-closed/seedao/deschool-lite" alt="issues">
  </a> -->
  <a href="https://dev.deschool.app">
    <img src="https://img.shields.io/badge/dev.deschool.app-dev-blue.svg" alt="Published on deschool.app">
  </a>
  <a href="https://stg.deschool.app">
    <img src="https://img.shields.io/badge/stg.deschool.app-stg-blue.svg" alt="Published on deschool.app">
  </a>
  <a href="https://deschool.app">
    <img src="https://img.shields.io/badge/deschool.app-published-blue.svg" alt="Published on deschool.app">
  </a> 
</p>

## 安装本地运行环境

node Version 16+

```bash
pnpm install
```

## 本地运行

### Step 1 配置服务代理，设置 vite.config.js 文件

在根目录下的.vite.config.js 文件，有代理配置样例和注释，默认为 dev 版本，访问后台配置的 dev 服务器。

```js
server: {
  host: 'localhost',
  proxy: {
    '/apiDevelopment': {
      target: 'http://dev.node-api.deschool.app:8001',
      secure: false,
      ws: true,
      changeOrigin: true,
      rewrite: pathApi => pathApi.replace(/^\/apiDevelopment/, '/api'),
    },
    '/apiStaging': {
      target: 'http://stg.node-api.deschool.app:8000',
      secure: false,
      ws: true,
      changeOrigin: true,
      rewrite: pathApi => pathApi.replace(/^\/apiStaging/, '/api'),
    },
    '/apiProduction': {
      target: 'http://node-api.deschool.app',
      secure: false,
      ws: true,
      changeOrigin: true,
      rewrite: pathApi => pathApi.replace(/^\/apiProduction/, '/api'),
    },
  },
},
```

### Step 2 运行

```bash
// env dev
pnpm run dev

// env staging
pnpm run dev:stg

// env production
pnpm run dev:prd
```

如果成功运行，命令行中可以看到：

```bash
> 下午2:36:21 [vite] vite.config.js changed, restarting server...
> 下午2:36:21 [vite] server restarted.
  > Local: http://127.0.0.1/
```


<br/>

---

<br/>


## Test

- 单元测试使用 [vitest](https://cn.vitest.dev/)，[Vite 原生测试运行器的必要性该框架主要](https://cn.vitest.dev/guide/why.html)以及[与其他框架对比](https://cn.vitest.dev/guide/comparisons.html)

- E2E() 测试使用 [playwright](https://playwright.dev)

<br/>

---

<br/>

## 关于技术栈

* 本项目采取敏捷开发的模式，延用 Vite + React17 + TS + antd + Unocss，以及 eslint 规范代码

<br/>

---

<br/>

## 关于项目结构

分文件夹进行描述

- api 项目中前端需要调用的不同服务
- assets 静态资源文件
- components 各 page 拆分出来的公共组件
- layout 页面的统一布局
- context 全局状态管理
- data 前期开发时候遗留的本地模拟测试数据
- locales 双语配置文件夹
- pages 存放各页面入口和非公用组件
- router 是整个项目的路由配置
- styles 用于配置一些特定的全局样式和自定义样式
- utils 配置了项目中常用的一些工具，包括前端存储、时间转换、语言配置、后台请求封装等

<br/>

---

<br/>

## 关于相关人员贡献

- SeeDAO以及Deschool社区产生需求
- KC、CL & Victor 负责项目产品设计和技术实现
- RebeccaWong、Shawn参与项目顾问

欢迎进入 SeeDAO Discord，找到 DeSchool - 开发小组 Channel 联系我们，期待大家的交流！

<br/>

---

<br/>

## 目前项目进度

- [ ] Init Layout and tools
- [ ] Connect By Lens API + connect from Deschool  
- [ ] Resume Page
- [ ] Profile Page of Follow Following 
- [ ] Landing Page
- [ ] Explore Page
- [ ] SBT Detail Page
