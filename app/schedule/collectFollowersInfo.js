'use strict';
const Subscription = require('egg').Subscription;

class CollectFollowersInfo extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      // cron: '14 20 5 * * * ', // 每天5点20执行
      // interval: '1m', // 1 分钟间隔
      type: 'worker', // all:指定所有worker执行，worker:随机指定一个worker执行
      disable: true,
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    // 从基础用户列表中收集【即更新当前用户列表】
    await this.collectFollowersInfoByAccountTable();

    // 生成随机数
    const collectFollowersInfoByFollowingsTableIntervalTime = Math.floor(Math.random() * (15 - 5 + 1) + 5);
    // 从正在关注人表里
    setTimeout(async () => {
      await this.collectFollowersInfoByFollowingsTable();
    }, collectFollowersInfoByFollowingsTableIntervalTime * 60 * 1000);


    const collectFollowersInfoByFollowersTableIntervalTime = Math.floor(Math.random() * (30 - 15 + 1) + 15);
    // 根据关注人列表的用户id进行收集【从关注人列表里面收集】
    setTimeout(async () => {
      await this.collectFollowersInfoByFollowersTable();
    }, collectFollowersInfoByFollowersTableIntervalTime);
  }


  async collectFollowersInfoByAccountTable() {
    const { ctx } = this;
    // 生成动态计时
    const intervalTime = Math.floor(Math.random() * (5 - 1 + 1) + 1);
    // 查询mid数组
    const midArrayRes = await ctx.service.account.getMidArray();

    if (midArrayRes && midArrayRes.code === 0) {
      // 对mid进行循环表里
      const midArray = midArrayRes.data;
      for (let index = 0; index < midArray.length; index++) {

        (i => {
          setTimeout(async () => {
            const element = midArray[i];
            // 获取该用户正在关注人的列表信息
            const followersInfo = await ctx.service.reptile.getUpFollowersInfo(element.mid, 1, 50);
            if (followersInfo) {
              // 写入数据库
              const { total } = followersInfo;
              // 分页遍历请求
              await this.collectFollowersInfoByAccountTableForPage(element.mid, total);
            }
          }, i * 1000 * intervalTime);
        })(index);
      }
    }
  }

  async collectFollowersInfoByAccountTableForPage(mid, total, order = 'desc') {
    // 生成动态计时
    const intervalTime = Math.floor(Math.random() * (5 - 1 + 1) + 1);
    const { ctx } = this;
    // 循环请求【从第2页查询】
    for (let page = 1; page < total / 50 + 1; page++) {
      // 延时
      (i => {
        setTimeout(async () => {
          const followersInfo = await ctx.service.reptile.getUpFollowersInfo(mid, i, 50, order);
          //
          if (followersInfo) {
            const { list } = followersInfo;
            // 循环写入到表中
            await this.updateOrCreateData(mid, list, 'followers');
          }
        }, i * 1000 * intervalTime);
      })(page);

    }
  }


  async collectFollowersInfoByFollowingsTable() {
    // 生成动态计时
    const intervalTime = Math.floor(Math.random() * (5 - 1 + 1) + 1);
    const { ctx } = this;
    // 查询mid数组
    const midArrayRes = await ctx.service.followings.getMidArray();

    if (midArrayRes && midArrayRes.code === 0) {
      // 对mid进行循环表里
      const midArray = midArrayRes.data;
      for (let index = 0; index < midArray.length; index++) {

        (i => {
          setTimeout(async () => {
            const element = midArray[i];
            // 获取该用户正在关注人的列表信息
            const followersInfo = await ctx.service.reptile.getUpFollowersInfo(element.mid, 1, 50);
            if (followersInfo) {
              // 写入数据库
              const { total } = followersInfo;
              // 分页遍历请求
              await this.collectFollowingsInfoByFollowingsTableForPage(element.mid, total);

            }
          }, i * 1000 * intervalTime);
        })(index);

      }
    }
  }

  async collectFollowingsInfoByFollowingsTableForPage(mid, total, order = 'desc') {
    // 生成动态计时
    const intervalTime = Math.floor(Math.random() * (5 - 1 + 1) + 1);
    const { ctx } = this;
    // 循环请求【从第2页查询】
    for (let page = 1; page < total / 50 + 1; page++) {
      // 延时
      (i => {
        setTimeout(async () => {
          const followersInfo = await ctx.service.reptile.getUpFollowersInfo(mid, i, 50, order);
          //
          if (followersInfo) {
            const { list } = followersInfo;
            // 循环写入到表中
            await this.updateOrCreateData(mid, list, 'followers');
          }
        }, i * 1000 * intervalTime);
      })(page);

    }
  }


  async collectFollowersInfoByFollowersTable() {
    const { ctx } = this;
    // 生成动态计时
    const intervalTime = Math.floor(Math.random() * (5 - 1 + 1) + 1);
    // 查询mid数组
    const midArrayRes = await ctx.service.followers.getMidArray();

    if (midArrayRes && midArrayRes.code === 0) {
      // 对mid进行循环表里
      const midArray = midArrayRes.data;
      for (let index = 0; index < midArray.length; index++) {

        (i => {
          setTimeout(async () => {
            const element = midArray[i];
            // 获取该用户正在关注人的列表信息
            const followersInfo = await ctx.service.reptile.getUpFollowersInfo(element.mid, 1, 50);
            if (followersInfo) {
              // 写入数据库
              const { total } = followersInfo;
              // 分页遍历请求
              await this.collectFollowersInfoByFollowersTableForPage(element.mid, total);

            }
          }, i * 1000 * intervalTime);
        })(index);

      }
    }
  }

  async collectFollowersInfoByFollowersTableForPage(mid, total, order = 'desc') {
    // 生成动态计时
    const intervalTime = Math.floor(Math.random() * (5 - 1 + 1) + 1);
    const { ctx } = this;
    // 循环请求【从第2页查询】
    for (let page = 1; page < total / 50 + 1; page++) {
      // 延时
      (i => {
        setTimeout(async () => {
          const followersInfo = await ctx.service.reptile.getUpFollowersInfo(mid, i, 50, order);
          if (followersInfo) {
            const { list } = followersInfo;
            // 循环写入到表中
            await this.updateOrCreateData(mid, list, 'followers');
          }
        }, i * 1000 * intervalTime);
      })(page);
    }

  }


  /**
   * 向关注人表或者粉丝表中写入数据
   * @param {integer} account 用户账号
   * @param {Array} list 用户正在关注人列表信息
   * @param {string} table 待操作的表，可选following follower
   */
  async updateOrCreateData(account, list, table = 'followings') {
    // 生成动态计时
    const intervalTime = Math.floor(Math.random() * (5 - 1 + 1) + 1);
    const { ctx } = this;
    for (let index = 0; index < list.length; index++) {

      if (table === 'followings') {
        // 写入followings表
        (i => {
          setTimeout(async () => {
            const element = list[i];
            // 当前mid是否存在
            const isExistFollowingsInfo = await ctx.service.followings.isExistFollowingInfo(account, element.mid);
            // 添加account属性
            element.account = account;
            if (isExistFollowingsInfo) {
              // 更新
              await ctx.service.followings.update(element);
            } else {
              // 添加
              await ctx.service.followings.create(element);
            }
          }, i * 1000 * intervalTime);
        })(index);
      } else if (table === 'followers') {
        // 写入followers表
        (i => {
          setTimeout(async () => {
            const element = list[i];
            // 当前mid是否存在
            const isExistFollowerInfo = await ctx.service.followers.isExistFollowerInfo(account, element.mid);
            // 添加account属性
            element.account = account;
            if (isExistFollowerInfo) {
              // 更新
              await ctx.service.followers.update(element);
            } else {
              // 添加
              await ctx.service.followers.create(element);
            }
          }, i * 1000 * intervalTime);
        })(index);
      }


    }
  }

}

module.exports = CollectFollowersInfo;
