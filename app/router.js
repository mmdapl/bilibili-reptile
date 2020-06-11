'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // router.get('/', controller.home.index);

  router.get('/api/reptile/account', controller.search.getUpAccountInfo);
  router.get('/api/reptile/following', controller.search.getUpFollowingsInfo);
  router.get('/api/reptile/followers', controller.search.getUpFollowersInfo);

  // 数据同步
  router.get('/api/reptile/sync/followers', controller.search.reptileTotalFollowers);
  router.get('/api/reptile/sync/followings', controller.search.reptileTotalFollowings);

  // 是否正在关注
  router.get('/api/reptile/isFollowing', controller.search.isFollowingBSiteUp);

  // 健康检测
  router.get('/api/reptile/health', controller.home.health);
};
