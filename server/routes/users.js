const express = require('express');
const router = express.Router();
const User = require('../models/user');
require('../utils/util');

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/**
 * 登录
 */
router.post('/login', (req, res, next) => {
  const params = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  };
  User.findOne(params, (err, userDoc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      });
    } else {
      if (userDoc) {
        res.cookie('userId', userDoc.userId, { // 设置cookie
          path: '/',
          maxAge: 1000 * 60 * 60
        });
        res.cookie('userName', userDoc.userName, { // 设置cookie
          path: '/',
          maxAge: 1000 * 60 * 60
        });
        res.json({
          status: '0',
          msg: 'success',
          result: {
            userName: userDoc.userName
          }
        });
      } else {
        res.json({
          status: '1',
          msg: 'userName or userPwd is error',
          result: ''
        });
      }
    }
  });
});

/**
 * 退出登录
 */
router.post('/logout', (req, res, next) => {
  res.cookie('userId', '', { // 清除cookie
    path: '/',
    maxAge: -1
  });
  res.json({
    status: '0',
    msg: 'success',
    result: 'logout success'
  });
});

/**
 * 登录校验
 */
router.get('/checkLogin', (req, res, next) => {
  if (req.cookies.userId) {
    res.json({
      status: '0',
      msg: '',
      result: req.cookies.userName || ''
    });
  } else {
    res.json({
      status: '1',
      msg: 'you are not login',
      result: ''
    });
  }
});

/**
 * 查询当前用户下的购物车数据
 */
router.get('/cartList', (req, res, next) => {
  const userId = req.cookies.userId;
  User.findOne({userId: userId}, (err, userDoc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      if (userDoc) {
        res.json({
          status: '0',
          msg: 'success',
          result: userDoc.cartList
        });
      }
    }
  });
});

/**
 * 删除用户下的商品
 */
router.post('/delCart', (req, res, next) => {
  const userId = req.cookies.userId;
  const productId = req.body.productId;
  User.update({userId: userId}, {
    $pull: {
      'cartList': {
        'productId': productId
      }
    }
  }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      if (doc) {
        res.json({
          status: '0',
          msg: 'success',
          result: 'delere success'
        });
      }
    }
  });
});

// 编辑商品数量
router.post('/cartEdit', (req, res, next) => {
  const userId = req.cookies.userId;
  const productId = req.body.productId;
  const productNum = req.body.productNum;
  const checked = req.body.checked;
  User.update({userId: userId, 'cartList.productId': productId}, {
    'cartList.$.productNum': productNum,
    'cartList.$.checked': checked
  }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      res.json({
        status: '0',
        msg: 'success',
        result: 'update success'
      });
    }
  });
});

// 全选商品
router.post('/editCheckAll', (req, res, next) => {
  const userId = req.cookies.userId;
  const checkAll = req.body.checkAll ? '1' : '0';
  User.findOne({userId: userId}, (err, userDoc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      if (userDoc) {
        userDoc.cartList.forEach(item => {
          item.checked = checkAll;
        });
        userDoc.save((err, doc) => {
          if (err) {
            res.json({
              status: '1',
              msg: err.message,
              result: ''
            });
          } else {
            res.json({
              status: '0',
              message: 'success',
              result: 'checkAll success'
            });
          }
        });
      }
    }
  });
});

// 查询用户地址
router.get('/addressList', (req, res, next) => {
  const userId = req.cookies.userId;
  User.findOne({userId: userId}, (err, userDoc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      if (userDoc) {
        res.json({
          status: '0',
          msg: 'success',
          result: userDoc.addressList
        });
      }
    }
  });
});

// 设置默认收货地址
router.post('/setDefaultAddress', (req, res, next) => {
  const userId = req.cookies.userId;
  const addressId = req.body.addressId;
  if (!addressId) {
    res.json({
      status: '100003',
      msg: 'addressId is null',
      result: ''
    });
  } else {
    User.findOne({userId: userId}, (err, userDoc) => {
      if (err) {
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        });
      } else {
        if (userDoc) {
          const addressList = userDoc.addressList;
          addressList.forEach(item => {
            if (item.addressId == addressId) {
              item.isDefault = true;
            } else {
              item.isDefault = false;
            }
          });
          userDoc.save((err, doc) => {
            if (err) {
              res.json({
                status: '1',
                msg: err.message,
                result: ''
              });
            } else {
              if (doc) {
                res.json({
                  status: '0',
                  msg: 'success',
                  result: 'set deafultAddress success'
                });
              }
            }
          });
        }
      }
    });
  }
});

// 删除地址
router.post('/deleteAddress', (req, res, next) => {
  const userId = req.cookies.userId;
  const addressId = req.body.addressId;
  if (!addressId) {
    res.json({
      status: '100003',
      msg: 'addressId is null',
      result: ''
    });
  } else {
    User.update({
      userId: userId
    }, {
      $pull: {
        'addressList': {
          'addressId': addressId
        }
      }
    }, (err, userDoc) => {
      if (err) {
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        });
      } else {
        if (userDoc) {
          res.json({
            status: '0',
            msg: 'success',
            result: 'delete address success'
          });
        }
      }
    });
  }
});

// 创建用户订单
router.post('/payment', (req, res, next) => {
  const userId = req.cookies.userId;
  const addressId = req.body.addressId;
  const orderTotal = req.body.orderTotal;
  User.findOne({userId: userId}, (err, userDoc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      if (userDoc) {
        // 获取用户的订单收货地址
        let address = '';
        userDoc.addressList.forEach(item => {
          if (item.addressId == addressId) {
            address = item;
          }
        });
        const goodsList = [];
        //  获取用户订单的商品
        userDoc.cartList.filter(item => {
          if (item.checked == '1') {
            goodsList.push(item);
          }
        });
        const platform = '168';
        const randomNumOne = Math.floor(Math.random() * 10);
        const randomNumTwo = Math.floor(Math.random() * 10);
        const systemDate = new Date().Format('yyyyMMddhhmmss');
        const currentDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
        const orderId = platform + randomNumOne + systemDate + randomNumTwo;
        // 创建订单
        const order = {
          orderId: orderId,
          orderTotal: orderTotal,
          addressInfo: address,
          goodsList: goodsList,
          orderStatus: '1',
          createDate: currentDate
        };
        userDoc.orderList.push(order);
        userDoc.save((err, doc) => {
          if (err) {
            res.json({
              status: '1',
              msg: err.message,
              result: ''
            });
          } else {
            res.json({
              status: '0',
              msg: 'success',
              result: {
                orderId: order.orderId,
                orderTotal: order.orderTotal
              }
            });
          }
        });
      }
    }
  });
});

// 根据订单ID查询订单详情
router.get('/orderDetail', (req, res, next) => {
  const userId = req.cookies.userId;
  const orderId = req.query.orderId;
  User.findOne({userId: userId}, (err, userDoc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      if (userDoc) {
        const orderList = userDoc.orderList;
        if (orderList.length > 0) {
          let orderTotal = 0;
          orderList.forEach(item => {
            if (item.orderId == orderId) {
              orderTotal = item.orderTotal;
            }
          });
          if (orderTotal > 0) {
            res.json({
              status: '0',
              msg: 'success',
              result: {
                orderId: orderId,
                orderTotal: orderTotal
              }
            });
          } else {
            res.json({
              status: '12002',
              msg: 'No Order',
              result: ''
            });
          }
        } else {
          res.json({
            status: '12001',
            msg: 'The current user did not create the order',
            result: ''
          });
        }
      }
    }
  });
});

module.exports = router;
