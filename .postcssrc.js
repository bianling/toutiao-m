module.exports = {
  plugins: {
    autoprefixer: {
      browsers: ['Android >= 4.0', 'iOS >= 8']
    },
    'postcss-pxtorem': {
      //如果是vant组件，则返回37.5，不是的话就返回75
      rootValue: (module) => (/vant/gi.test(module.file) ? 37.5 : 75),
      propList: ['*']
    }
  }
}
