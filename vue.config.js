const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
})
// vue.config.js
// module.exports = {
//   devServer: {
//     proxy: {
//       '/upload': {
//         target: 'http://localhost:3000',
//         changeOrigin: true
//       },
//       '/files': {
//         target: 'http://localhost:3000',
//         changeOrigin: true
//       }
//     }
//   }
// };