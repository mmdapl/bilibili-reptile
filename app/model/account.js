'use strict';
/**
 * 客户端创建应用对应的版本数据
 *
 */
const Sequelize = require('sequelize');
module.exports = app => {
  const accountInfo = app.model.define('accountInfo', {
    id: {
      filed: 'id',
      type: Sequelize.BIGINT(13),
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      comment: '主键',
    },
    mid: {
      filed: 'mid',
      type: Sequelize.BIGINT(13),
      allowNull: false,
      comment: 'b站用户账号',
    },
    name: {
      filed: 'app_id',
      type: Sequelize.STRING(30),
      allowNull: false,
      comment: '用户昵称',
    },
    sex: {
      filed: 'app_id',
      type: Sequelize.STRING(4),
      allowNull: false,
      comment: '性别',
    },
    face: {
      filed: 'face',
      type: Sequelize.STRING(100),
      allowNull: false,
      defaultValue: '',
      comment: '图像url',
    },
    sign: {
      filed: 'sign',
      type: Sequelize.STRING(600),
      allowNull: false,
      defaultValue: '',
      comment: '个签',
    },
    rank: {
      filed: 'rank',
      type: Sequelize.BIGINT(8),
      allowNull: false,
      defaultValue: 0,
      comment: '权限范围',
    },
    level: {
      filed: 'level',
      type: Sequelize.INTEGER(4),
      allowNull: false,
      defaultValue: 0,
      comment: '账号等级',
    },
    jointime: {
      filed: 'jointime',
      type: Sequelize.BIGINT(13),
      allowNull: false,
      comment: '注册b站账号时间',
    },
    moral: {
      filed: 'jointime',
      type: Sequelize.INTEGER(4),
      allowNull: false,
      comment: '',
    },
    silence: {
      filed: 'jointime',
      type: Sequelize.INTEGER(4),
      allowNull: false,
      comment: '',
    },
    birthday: {
      filed: 'birthday',
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: '',
      comment: '用户生日',
    },
    coins: {
      filed: 'coins',
      type: Sequelize.INTEGER(4),
      allowNull: false,
      comment: '硬币数',
    },
    fans_badge: {
      filed: 'fans_badge',
      type: Sequelize.STRING(4),
      allowNull: false,
      comment: '粉丝牌',
    },
    official: {
      filed: 'official_verify',
      type: Sequelize.STRING(600),
      allowNull: false,
      defaultValue: '',
      comment: '官方账号属性信息【对象序列化处理】',
    },
    vip: {
      filed: 'vip',
      type: Sequelize.STRING(600),
      allowNull: false,
      defaultValue: '',
      comment: 'vip属性信息【对象序列化处理】',
    },
    pendant: {
      filed: 'pendant',
      type: Sequelize.STRING(600),
      allowNull: false,
      defaultValue: '',
      comment: '【对象序列化处理】',
    },
    nameplate: {
      filed: 'nameplate',
      type: Sequelize.STRING(600),
      allowNull: false,
      defaultValue: '',
      comment: '【对象序列化处理】',
    },
    is_followed: {
      filed: 'is_followed',
      type: Sequelize.STRING(600),
      allowNull: false,
      defaultValue: '',
      comment: '',
    },
    top_photo: {
      filed: 'top_photo',
      type: Sequelize.STRING(600),
      allowNull: false,
      defaultValue: '',
      comment: '主页顶部logo',
    },
    theme: {
      filed: 'theme',
      type: Sequelize.STRING(600),
      allowNull: false,
      defaultValue: '',
      comment: '主题【对象序列化处理】',
    },
    sys_notice: {
      filed: 'sys_notice',
      type: Sequelize.STRING(600),
      allowNull: false,
      defaultValue: '',
      comment: '系统通知【对象序列化处理】',
    },
    archive_view: {
      filed: 'archive_view',
      type: Sequelize.BIGINT(13),
      allowNull: false,
      comment: '播放量',
    },
    article_view: {
      filed: 'article_view',
      type: Sequelize.BIGINT(13),
      allowNull: false,
      comment: '文章阅读量',
    },
    likes: {
      filed: 'likes',
      type: Sequelize.BIGINT(13),
      allowNull: false,
      comment: '点赞数',
    },
    following_count: {
      filed: 'following_count',
      type: Sequelize.BIGINT(6),
      allowNull: false,
      comment: '关注up数',
    },
    whisper_count: {
      filed: 'mid',
      type: Sequelize.BIGINT(4),
      allowNull: false,
      comment: '',
    },
    black_count: {
      filed: 'black_count',
      type: Sequelize.BIGINT(4),
      allowNull: false,
      comment: '黑名单数',
    },
    follower_count: {
      filed: 'follower_count',
      type: Sequelize.BIGINT(13),
      allowNull: false,
      comment: '粉丝数',
    },
    create_time: {
      filed: 'create_time',
      type: Sequelize.BIGINT(13),
      allowNull: false,
      comment: '数据爬取时间',
    },
    modify_time: {
      filed: 'modify_time',
      type: Sequelize.BIGINT(10),
      allowNull: false,
      defaultValue: 0,
      comment: '数据更新时间',
    },
    delete_time: {
      filed: 'delete_time',
      type: Sequelize.BIGINT(10),
      allowNull: false,
      defaultValue: 0,
      comment: '删除时间',
    },
  }, {
    // 指定数据库中对应的tbl_app_version表
    tableName: 'tbl_account_info',
    freezeTableName: false,
    // 是否自动添加时间戳createAt，updateAt
    timestamps: false,
  });
  return accountInfo;
};
