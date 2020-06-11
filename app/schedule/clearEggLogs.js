'use strict';
const Subscription = require('egg').Subscription;
const fs = require('fs');
const path = require('path');
class ClearEggLogs extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    // const { app } = this;
    return {
      cron: '14 13 1 * * *', // 每天1点13执行
      //   interval: '1s', // 1 分钟间隔
      type: 'worker', // all:指定所有worker执行，worker:随机指定一个worker执行
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    const { app } = this;
    const logsPath = app.config.logger.dir;

    // 删除前一天的日志
    deleteBeforeDayLogInfo(logsPath);

  }
}

module.exports = ClearEggLogs;

/**
 * 获取前一天的年月日
 */
function getTimeStr() {
  const date = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
  const Y = date.getFullYear() + '-';
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  const D = date.getDate();

  return Y + M + D;
  // 输出结果：2014-04-23
}
/**
 *  删指定日期后缀的日志文件
 * @param {String} logMainPath 日志的主要路径
 */
function deleteBeforeDayLogInfo(logMainPath) {
  let files = [];
  if (fs.existsSync(logMainPath)) {
    files = fs.readdirSync(logMainPath);
    files.forEach((file, index) => {
      const curPath = logMainPath + path.sep + file;
      // 判断后缀是否为前一天
      if (path.extname(curPath) === `.${getTimeStr()}`) { fs.unlinkSync(curPath); } // 删除文件
    });

  }
}
