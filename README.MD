## 安装
````
npm install include-html-loader
````

## 使用
本插件仅用于在html文档中插入其它的html文档，实现子模板的功能，在引入子模板同时，可以设置变量传入子模板，实现子模板可配置功能。

#### 父模板引入时使用方式：
- 不带参数
````
${require("../layout/sub.html")}
````
- 带参数
````
${require("../layout/sub.html",{"title": "this is title"})}
````
#### 子模板设置变量：
````
#{title}
````
## webpack配置

````
module.exports = {
  entry: "bundle.js",
  output: {
    path: "dist"
  },
  module: {
    loaders: [
      {
        test: /\.html$/,
        loader: "include-html",
        query: {
          root: "./src"  // 请一定配置这里，是子模板相对在项目中的相对目录
        }
      }
    ]
  }

}
````

## 例子
> parent.html
````
<!DocType html>
<html>
  <head>
    <title>this is parent html</title>
  </head>
  <body>
  ${require("./sub-1.html",{"title": "this is sub title"})}
  </body>
</html>
````
> sub-1.html
````
#{title}, hello, world!
````

#### 编译后结果
> parent.html
````
<!DocType html>
<html>
  <head>
    <title>this is parent html</title>
  </head>
  <body>
  this is sub title, hello, world!
  </body>
</html>
````