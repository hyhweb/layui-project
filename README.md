## 项目配置
- npm install 安装依赖
先执行npm run build
再执行npm run dev命令

## 文件结构介绍
- 「src」为源代码文件夹
  - 「source」UI框架资源文件夹
  - 「views」业务代码文件夹的内容。
- 「dist」是项目发布后的文件夹

## 工程化命令介绍
- npm run init      首次执行，则初始化项目

- npm run dev   启动开发模式，项目将监听并编译源文件中的代码。但为了运行性能，不会监听并更新ace代码

- npm run build     发布项目，项目发布前，需要先dev一遍。因为项目发布的文件来源是「dev-temp」文件夹
