# 安装node
FROM node:10
# 标签
LABEL version="stable@1.0"
LABEL description="Eggjs框架开发的定时爬取B站用户基础数据,构建基于功能镜像"
# 作者
MAINTAINER Taylor <2237221210@qq.com>
# 创建项目空间
RUN mkdir -p /web-project/node/bilibili-reptile
# 将当前代码文件复制到工作区域
COPY . /web-project/node/bilibili-reptile
# 进入 vendors
WORKDIR /web-project/node/bilibili-reptile
# 指定npm仓库
RUN npm install --registry https://registry.npm.taobao.org
EXPOSE 7921
# 项目启动 
CMD ["npm","run","start"]