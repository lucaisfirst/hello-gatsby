
// prefer default export if available
const preferDefault = m => (m && m.default) || m


exports.components = {
  "component---cache-dev-404-page-js": preferDefault(require("/Users/kimhajin/hello-gatsby/.cache/dev-404-page.js")),
  "component---node-modules-gatsby-theme-blog-core-src-templates-post-query-js": preferDefault(require("/Users/kimhajin/hello-gatsby/node_modules/gatsby-theme-blog-core/src/templates/post-query.js")),
  "component---node-modules-gatsby-theme-blog-core-src-templates-posts-query-js": preferDefault(require("/Users/kimhajin/hello-gatsby/node_modules/gatsby-theme-blog-core/src/templates/posts-query.js"))
}

