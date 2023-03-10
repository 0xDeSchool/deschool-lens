// <reference types="vitest" />
/* eslint-disable */
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
// https://vitejs.dev/config/
// vite对jsx语法只认tsx和jsx后缀的文件，可是项目中有很多js类型的文件也是jsx；
import vitePluginReactJsSupport from 'vite-plugin-react-js-support'
// 为打包后的文件提供传统浏览器兼容性支持
import legacyPlugin from '@vitejs/plugin-legacy'
import { visualizer } from 'rollup-plugin-visualizer'
import Unocss from 'unocss/vite'

export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  return {
    // 开发或生产环境服务的公共基础路径
    base: '/',
    // 项目根目录
    root: './',
    // 别名
    resolve: {
      alias: {
        '~/': `${path.resolve(__dirname, 'src')}/`,
        '/images': `${path.resolve(__dirname, 'src/assets/images')}/`,
        '/fonts': `${path.resolve(__dirname, 'src/assets/fonts')}/`,
        stream: 'stream-browserify',
      },
    },
    define: {
      'process.env': process.env,
    },
    server: {
      host: 'localhost',
      cors: true,
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
        '/goapiDevelopment': {
          // target: 'http://localhost:5000',
          target: 'http://dev.api.deschool.app:8001',
          secure: false,
          ws: true,
          changeOrigin: true,
          rewrite: pathGoapi => pathGoapi.replace(/^\/goapiDevelopment/, '/api'),
        },
        '/goapiStaging': {
          target: 'http://stg.api.deschool.app:8000',
          secure: false,
          ws: true,
          changeOrigin: true,
          rewrite: pathGoapi => pathGoapi.replace(/^\/goapiStaging/, '/api'),
        },
        '/goapiProduction': {
          target: 'http://api.deschool.app',
          secure: false,
          ws: true,
          changeOrigin: true,
          rewrite: pathGoapi => pathGoapi.replace(/^\/goapiProduction/, '/api'),
        },
        '/goapiBoothLocal': {
          target: 'http://localhost:9000',
          secure: false,
          ws: true,
          changeOrigin: true,
          rewrite: pathGoapi => pathGoapi.replace(/^\/goapiBoothLocal/, '/api'),
        },
        '/goapiBoothStg': {
          // target: 'http://localhost:9000',
          target: 'http://107.21.139.86:80',
          // target: 'http://ec2-54-90-108-215.compute-1.amazonaws.com:80',
          secure: false,
          ws: true,
          changeOrigin: true,
          rewrite: pathGoapi => pathGoapi.replace(/^\/goapiBoothStg/, '/api'),
        },
        '/goapiBoothPrd': {
          target: 'http://ec2-54-211-102-5.compute-1.amazonaws.com:80',
          secure: false,
          ws: true,
          changeOrigin: true,
          rewrite: pathGoapi => pathGoapi.replace(/^\/goapiBoothPrd/, '/api'),
        },
        '/ccProfile': {
          target: 'https://api.cyberconnect.dev/profile/',
          secure: false,
          ws: true,
          changeOrigin: true,
          rewrite: pathGoapi => pathGoapi.replace(/^\/ccProfile/, ''),
        },
        '/mypinata':{
          target: 'https://deschool.mypinata.cloud/ipfs/',
          secure: false,
          ws: true,
          changeOrigin: true,
          headers: {
            'x-pinata-gateway-token':'6aiuIxB2BLgtHohX8bbyn7rA8CFFxqffIvMZwePri0iM-z2H_PkgyuRv5j7r8URF'
          },
          rewrite: pathGoapi => pathGoapi.replace(/^\/mypinata/, ''),
        }
      },
    },
    // 构建
    build: {
      // target: 'es2015',
      minify: 'terser',
      sourcemap: false, // 是否产出sourcemap.json
      outDir: 'build', // 产出目录
      // polyfillModulePreload: true, // 预加载polyfillModule
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
    esbuild: {},
    // 依赖优化选项
    optimizeDeps: {
      esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
          global: 'globalThis',
        },
      },
    },
    plugins: [
      Unocss(),
      react(),
      vitePluginReactJsSupport([], { jsxInject: true }),
      legacyPlugin({
        targets: ['defaults', 'not IE 11'],
        modernPolyfills: true,
        renderLegacyChunks: false,
      }),
      // last one
      process.env.VISUALIZER !== undefined ? visualizer({ open: true }) : null,
    ],
    // https://github.com/vitest-dev/vitest
    test: {
      include: ['test/unit/**/*.test.ts', 'test/unit/**/*.test.tsx'],
      environment: 'happy-dom',
      globals: true,
      deps: {},
    },
  }
})


