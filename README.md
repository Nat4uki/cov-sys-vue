# cov-sys-vue

## 项目简介
cov-sys-vue为密接人群传播路径可视化平台前端项目。采用Vue为基本框架，搭配ElementUI、Echart、Amap等模块为使用者预测与展示密接人群的传播路径。
### 平台功能
- 人员的数据展示、修改、导入、删除
- 人员状态、流动数据的展示、更新
- 疫情趋势的发展的预测与展示

## 项目前置
- Visual Studio C++桌面开发模块
- Nodejs 16.20.2
- npm 8.19.4

## 项目安装
```
npm install
```

### 开发环境编译运行
```
npm run serve
```

### 生产环境编译打包
```
npm run build
```

### 检查与修复
```
npm run lint
```
## 项目后端
- 使用django实现疫情趋势的发展的预测与展示
- 使用springboot实现基本数据的增删改查
