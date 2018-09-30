const lessOptions = {
  javascriptEnabled: true
}

module.exports = {
  transpileDependencies: [
    /\bnode_modules\/veui\b/,
    /\bvue-awesome\b/,
    /\bresize-detector\b/
  ],
  chainWebpack: config => {
    config.module
      .rule('veui')
      .test(/\.vue$/)
      .pre()
      .use('veui-loader')
      .loader('veui-loader')
      .tap(() => {
        return {
          modules: [
            {
              package: 'veui-theme-one',
              fileName: '${module}.less'
            },
            {
              package: 'veui-theme-one',
              fileName: '${module}.js',
              transform: false
            }
          ]
        }
      })

    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => {
      config.module
        .rule('less')
        .oneOf(type)
        .use('less-loader')
        .tap(options => Object.assign({}, options, lessOptions))
    })
  }
}

