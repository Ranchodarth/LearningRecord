# Webpack 初识

 [toc]

## 简单介绍

* 本质上，*webpack*是一个现代的JavaScript应用程序的静态模块打包器（我更愿意叫构建工具）
* 当webpack处理应用程序时，会递归的构建一个依赖关系图（dependency graph）(我更愿意叫*chunk*)
* webpack会把高级的语法方式或资源内容转化为浏览器兼容的内容，从而打包成一个或多个模块，我们称为*bundle*
* webpack是高度可配置的，它拥有5个核心模块：
  * entry
  * output
  * loader
  * plugins
  * mode

## 核心模块

### entry

* *entry point* 指示webpack应该使用哪个模块，来作为构建内部以来图的开始。进入entry point 后，webpack会找出有哪些模块和库是入口起点（直接和间接）依赖的。
* 每个依赖项随即被处理，最后输出到称之为bundles的文件中。
* 可以通过webpack配置中配置entry属性，来指定一个或多个entry point ，默认值为 ./src
* 例子：

​    

```
module.exports = {
  entry: './path/to/my/entry/file.js'
};
```

### output

* output属性告诉 webpack 在哪里输出它所创建的 *bundles*，以及如何命名这些文件。
* 默认值为 **./dist**
* 例子：

```
const path = require('path');

module.exports = {
  entry: './path/to/my/entry/file.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-first-webpack.bundle.js'
  }
};
```

### loader

* *loader* 可以让webpack能够去处理非JavaScript文件（webpack 自身只理解 JavaScript）。

* *loader* 可以将所有类型的文件转换为 webpack 能够处理的有效模块，然后你就可以利用 webpack 的打包能力，对它们进行处理。

* 本质上，webpack loader 将所有类型的文件，转换为应用程序的依赖图（和最终的 bundle）可以直接引用的模块。

* 在更高层面，在 webpack 的配置中 **loader** 有两个目标：

  * `test` 属性，用于标识出应该被对应的 loader 进行转换的某个或某些文件。
  * `use` 属性，表示进行转换时，应该使用哪个 loader。

* 例子：

  ```
  const path = require('path');
  
  const config = {
    output: {
      filename: 'my-first-webpack.bundle.js'
    },
    module: {
      rules: [
        { test: /\.txt$/, use: 'raw-loader' }
      ]
    }
  };
  
  module.exports = config;
  ```

### plugins

* loader 被用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。

* 想要使用一个插件，你只需要 `require()` 它，然后把它添加到 `plugins` 数组中。

* 例子：

  ```
  const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
  const webpack = require('webpack'); // 用于访问内置插件
  
  const config = {
    module: {
      rules: [
        { test: /\.txt$/, use: 'raw-loader' }
      ]
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin(),
      new HtmlWebpackPlugin({template: './src/index.html'})
    ]
  };
  
  module.exports = config;
  ```

### mode

* *mode*指示webpack使用相应模式的配置

| 选项        |                             描述                             | 特点                       |
| ----------- | :----------------------------------------------------------: | -------------------------- |
| development | 会将process.env.NODE_ENV的值设为development。启用NamedChunksPlugin 和 NamedModulesPlugin。 | 能让代码本地调试运行环境   |
| production  | 会将process.env.NODE_ENV的值设为production。启用FlagDependencyUsagePlugin，ModuleConcatenationPluhin,NoEmitOnErrorsPlugin,OccurrenceOrderPlugin,SideEffectsFlagPlugin 和 UglifyJsPlugin | 能让代码优化上线运行的环境 |



## 模式

* 通过选择 `development` 或 `production` 之中的一个，来设置 `mode` 参数，你可以启用相应模式下的 webpack 内置的优化

```
module.exports = {
  mode: 'production'
};
```

## 个人看法

webpack是前端进阶路上必不可少的一块台阶，很多时候虽然我都在使用vue-cli。但是定制化的项目构建会桎梏我前进的脚步。从今天开始我将记录我学习webpack的历程，尤其是webpack5发布在即的情况下。