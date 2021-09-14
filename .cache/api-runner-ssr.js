var plugins = [{
      name: 'gatsby-plugin-mdx',
      plugin: require('/Users/kimhajin/hello-gatsby/node_modules/gatsby-plugin-mdx/gatsby-ssr'),
      options: {"plugins":[],"extensions":[".mdx",".md"],"gatsbyRemarkPlugins":[{"resolve":"gatsby-remark-images","options":{"maxWidth":1380,"linkImagesToOriginal":false}},{"resolve":"gatsby-remark-copy-linked-files"},{"resolve":"gatsby-remark-smartypants"}],"remarkPlugins":[null],"defaultLayouts":{},"lessBabel":false,"rehypePlugins":[],"mediaTypes":["text/markdown","text/x-markdown"],"root":"/Users/kimhajin/hello-gatsby"},
    },{
      name: 'gatsby-plugin-image',
      plugin: require('/Users/kimhajin/hello-gatsby/node_modules/gatsby-plugin-image/gatsby-ssr'),
      options: {"plugins":[]},
    },{
      name: 'gatsby-plugin-react-helmet',
      plugin: require('/Users/kimhajin/hello-gatsby/node_modules/gatsby-plugin-react-helmet/gatsby-ssr'),
      options: {"plugins":[]},
    },{
      name: 'gatsby-plugin-theme-ui',
      plugin: require('/Users/kimhajin/hello-gatsby/node_modules/gatsby-plugin-theme-ui/gatsby-ssr'),
      options: {"plugins":[],"preset":{"initialColorModeName":"light","colors":{"text":"#232129","background":"#fff","primary":"#663399","secondary":"#1B1F23","muted":"hsla(0, 0%, 0%, 0.2)","highlight":"rgba(255, 229, 100, 0.2)","heading":"#232129","prism":{"background":"#011627","comment":"#809393","string":"#addb67","var":"#d6deeb","number":"#f78c6c","constant":"#82aaff","punctuation":"#c792ea","className":"#ffc98b","tag":"#ffa7c4","boolean":"#ff5874","property":"#80cbc4","namespace":"#b2ccd6","highlight":"hsla(207, 95%, 15%, 1)"},"modes":{"dark":{"text":"rgba(255, 255, 255, 0.86)","background":"#232129","primary":"#D9BAE8","secondary":"rgba(255, 255, 255, 0.86)","muted":"hsla(0, 0%, 100%, 0.2)","highlight":"#663399","heading":"#fff"}}},"fonts":{"body":"system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", sans-serif","heading":"inherit","monospace":"Menlo, monospace"},"sizes":{"container":672},"styles":{"root":{"fontFamily":"body"},"pre":{"variant":"prism","fontFamily":"monospace","tabSize":4,"hyphens":"none","marginBottom":2,"color":"white","bg":"prism.background","overflow":"auto","borderRadius":10,"p":3,".highlight":{"background":"hsla(0, 0%, 40%, .5)"}},"code":{"fontFamily":"monospace","fontSize":"inherit"},"inlineCode":{"borderRadius":"0.3em","color":"secondary","bg":"highlight","paddingTop":"0.15em","paddingBottom":"0.05em","paddingX":"0.2em"},"a":{"color":"primary"},"hr":{"borderColor":"muted"},"p":{"code":{"fontSize":"inherit"}},"li":{"code":{"fontSize":"inherit"}},"blockquote":{"color":"inherit","borderLeftColor":"inherit","opacity":0.8,"&.translation":{"fontSize":"1em"}}},"prism":{".attr-name":{"fontStyle":"italic"},".comment":{"color":"prism.comment"},".attr-name, .string, .url":{"color":"prism.string"},".variable":{"color":"prism.var"},".number":{"color":"prism.number"},".builtin, .char, .constant, .function":{"color":"prism.constant"},".punctuation, .selector, .doctype":{"color":"prism.punctuation"},".class-name":{"color":"prism.className"},".tag, .operator, .keyword":{"color":"prism.tag"},".boolean":{"color":"prism.boolean"},".property":{"color":"prism.property"},".namespace":{"color":"prism.namespace"}}}},
    }]
/* global plugins */
// During bootstrap, we write requires at top of this file which looks like:
// var plugins = [
//   {
//     plugin: require("/path/to/plugin1/gatsby-ssr.js"),
//     options: { ... },
//   },
//   {
//     plugin: require("/path/to/plugin2/gatsby-ssr.js"),
//     options: { ... },
//   },
// ]

const apis = require(`./api-ssr-docs`)

function augmentErrorWithPlugin(plugin, err) {
  if (plugin.name !== `default-site-plugin`) {
    // default-site-plugin is user code and will print proper stack trace,
    // so no point in annotating error message pointing out which plugin is root of the problem
    err.message += ` (from plugin: ${plugin.name})`
  }

  throw err
}

export function apiRunner(api, args, defaultReturn, argTransform) {
  if (!apis[api]) {
    console.log(`This API doesn't exist`, api)
  }

  const results = []
  plugins.forEach(plugin => {
    const apiFn = plugin.plugin[api]
    if (!apiFn) {
      return
    }

    try {
      const result = apiFn(args, plugin.options)

      if (result && argTransform) {
        args = argTransform({ args, result })
      }

      // This if case keeps behaviour as before, we should allow undefined here as the api is defined
      // TODO V4
      if (typeof result !== `undefined`) {
        results.push(result)
      }
    } catch (e) {
      augmentErrorWithPlugin(plugin, e)
    }
  })

  return results.length ? results : [defaultReturn]
}

export async function apiRunnerAsync(api, args, defaultReturn, argTransform) {
  if (!apis[api]) {
    console.log(`This API doesn't exist`, api)
  }

  const results = []
  for (const plugin of plugins) {
    const apiFn = plugin.plugin[api]
    if (!apiFn) {
      continue
    }

    try {
      const result = await apiFn(args, plugin.options)

      if (result && argTransform) {
        args = argTransform({ args, result })
      }

      // This if case keeps behaviour as before, we should allow undefined here as the api is defined
      // TODO V4
      if (typeof result !== `undefined`) {
        results.push(result)
      }
    } catch (e) {
      augmentErrorWithPlugin(plugin, e)
    }
  }

  return results.length ? results : [defaultReturn]
}
