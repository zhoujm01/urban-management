import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { mars3dPlugin } from 'vite-plugin-mars3d';
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.kml', '**/*.kmz'],
  plugins: [vue(), mars3dPlugin()],
  //解决“vite use `--host` to expose”
  base: './',	//不加打包后白屏
  server: {
    host: '0.0.0.0',
    // port: 8080,      
    open: true
  },
  resolve: {
    //别名配置，引用src路径下的东西可以通过@如：import Layout from '@/layout/index.vue'
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, 'src')
      }
    ]
  },
  build: {
    // 输出路径
    outDir: path.join("./dist"),
    // outDir: path.resolve(__dirname, "dist"),
    // // 小于此阈值的导入或引用资源将内联为 base64 编码， 以避免额外的http请求， 设置为 0, 可以完全禁用此项，
    // assetsInlineLimit: 4096,
    // // 启动 / 禁用 CSS 代码拆分
    // cssCodeSplit: true,
    // // 构建后是否生成 soutrce map 文件
    // sourcemap: false,
    // // 自定义rollup-commonjs插件选项
    // commonjsOptions: {
    //   include: /node_modules|src\/marsgis\/common/
    // },
    // // 自定义底层的 Rollup 打包配置
    // rollupOptions: {
    //   treeshake: false,
    //   input: {
    //     index: path.resolve(__dirname, "index.html")
    //   },
    //   output: {
    //     manualChunks: {
    //       "mars3d-cesium": ["mars3d-cesium"]
    //     }
    //   }
    // },
    // // 当设置为 true, 构建后将会生成 manifest.json 文件
    // manifest: false,
    // // 设置为 false 可以禁用最小化混淆,或是用来指定是应用哪种混淆器 boolean | 'terser' | 'esbuild'
    // minify: "terser",
    // // 传递给 Terser 的更多 minify 选项
    // terserOptions: {},
    // // 设置为false 来禁用将构建好的文件写入磁盘
    // write: true,
    // // 默认情况下 若 outDir 在 root 目录下， 则 Vite 会在构建时清空该目录。
    // emptyOutDir: true
  },
  optimizeDeps: {
    include: ["mars3d", "kml-geojson"]
  },

})
