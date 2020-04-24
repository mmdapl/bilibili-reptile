'use strict';
/**
 * 用户正在关注B站up信息
 *
 */
const Sequelize = require('sequelize');
module.exports = app => {
  const followingsInfo = app.model.define('followings', {
    id: {
      filed: 'id',
      type: Sequelize.BIGINT(13),
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      comment: '主键',
    },
    account: {
      filed: 'mid',
      type: Sequelize.BIGINT(13),
      allowNull: false,
      comment: 'b站被用户账号，即一对多',
    },
    mid: {
      filed: 'mid',
      type: Sequelize.BIGINT(13),
      allowNull: false,
      comment: 'b站用户账号',
    },
    attribute: {
      filed: 'attribute',
      type: Sequelize.INTEGER(4),
      allowNull: false,
      defaultValue: 0,
      comment: '',
    },
    mtime: {
      filed: 'mtime',
      type: Sequelize.BIGINT(10),
      allowNull: false,
      defaultValue: 0,
      comment: '关注时间',
    },
    tag: {
      filed: 'tag',
      type: Sequelize.STRING(60),
      allowNull: false,
      defaultValue: '',
      comment: '标签',
    },
    special: {
      filed: 'special',
      type: Sequelize.INTEGER(4),
      allowNull: false,
      defaultValue: 0,
      comment: '',
    },
    uname: {
      filed: 'uname',
      type: Sequelize.STRING(60),
      allowNull: false,
      defaultValue: '',
      comment: '昵称',
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
      type: Sequelize.STRING(200),
      allowNull: false,
      defaultValue: '',
      comment: '个签',
    },
    official_verify: {
      filed: 'official_verify',
      type: Sequelize.STRING(600),
      allowNull: false,
      defaultValue: '',
      comment: '官方账号属性信息',
    },
    vip: {
      filed: 'vip',
      type: Sequelize.STRING(600),
      allowNull: false,
      defaultValue: '',
      comment: 'vip属性信息',
    },
    create_time: {
      filed: 'create_time',
      type: Sequelize.BIGINT(13),
      allowNull: false,
      comment: '创建时间',
    },
    modify_time: {
      filed: 'modify_time',
      type: Sequelize.BIGINT(10),
      allowNull: false,
      defaultValue: 0,
      comment: '修改时间，大于0,即用户数据有改动',
    },
    delete_time: {
      filed: 'delete_time',
      type: Sequelize.BIGINT(10),
      allowNull: false,
      defaultValue: 0,
      comment: '删除时间,大于0即曾经关注过',
    },
  }, {
    // 指定数据库中对应的tbl_user_followings表
    tableName: 'tbl_user_followings',
    freezeTableName: false,
    // 是否自动添加时间戳createAt，updateAt
    timestamps: false,
  });
  return followingsInfo;
};
