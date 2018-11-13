
## Html-auto-template is automatically compiled code.

 * html-auto-template 是自动编译代码

## git 地址 

```
https://github.com/jian22446688/html-auto-template.git
```

## 项目启动
```
// 安装依懒
cd html-auto-template
npm install

// 常用命令
开发环境： npm run dev  
生产环境： npm run build

// 单任务命令 (需要全局安装 gulp ) npm install -g gulp
执行压缩： gulp zip
编译页面： gulp html
编译脚本： gulp script
编译样式： gulp styles
语法检测： gulp eslint
压缩图片： gulp images
```

## 项目目录
```
├── README.md         # 项目说明
├── config            # gulp路径配置
├── dist              # 打包路径
|
├── gulpfile.js       # gulp配置文件
├── package.json      # 依赖包
|
├── src               # 项目文件夹
│   ├── include       # 公用页面引入
│   ├── index.html    # 首页
│   ├── static        # 资源文件夹
│   │   ├── images    # 图库
│   │   ├── js        # 脚本
│   │   └── css       # 样式（less, css）
│   └── views         # 页面
|
├── static            # 打包到dist中static文件中
├── vendor            # 打包到dist中vendor文件中 
|   ├──iconfont       # 淘宝图标字体库
|   └──...            # 其他第三方库文件 例如: jquery, layer, lodash.js 
└── webpack.config.js # webpack配置文件
```

## 项目约定
1、 如果不想使用eslint，可以gulpfile文件中去掉该任务

2、使用less预处理, 可以根据个人喜好，去配置不同的预处理工具

3、static文件夹
* 一级目录中static文件夹，可以存放不需要编译的文件内容，比如一些插件，图片，字体文件等
* 每次npm run dev or build 都会把static文件夹下的内容，打包到dist/static里

## 代理模式
* config/server.js文件中配置

**例子如下**
``` javascript
 middleware: [
  proxyPrase(
    {
      target: 'http://localhost:8000/api',
      route: '/api'
    }
  )
]
```

## 使用Eslint 
config/index.js文件
```
useEslint: false // 是否启用eslint
```

## 使用webpack
* 集成webpack功能，可以自行选择 默认关闭 webpack 功能

config/index.js文件
```
useWebpack: false // 是否启用webpack
```

## 模板引入
* include 文件中的模板
```
<div>
    @@include('header.html', {
        "title": "indexPage"
    })
</div>
```

## 添加 淘宝字体  
* 打开 http://www.iconfont.cn/ 
* 搜索需要的字体添加到购物车中
* 点击购物车 
* 点击 <下载代码> 字体包 

```

  使用步骤如下：
    // 第一步：引入项目下面生成的fontclass代码：
    <link rel="stylesheet" type="text/css" href="./iconfont.css">
  
    //第二步：挑选相应图标并获取类名，应用于页面：
    <i class="iconfont icon-xxx"></i>
    
```