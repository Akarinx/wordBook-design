module.exports = function(config) {
    const styleRules = config.module.rules.filter(rule =>
      rule.test.toString().match(/css|less|s\(\[ac\]\)ss/)
    )
  
    styleRules.forEach(rule => {
      const cssLoader = rule.use.find(use => use.loader === 'css-loader')
      // this is the actual modification we make:
      cssLoader.options.modules = {
        localIdentName: '[name]__[local]--[hash:base64:5]'
      }
      cssLoader.options.sourceMap = true
    })

    return config
  }