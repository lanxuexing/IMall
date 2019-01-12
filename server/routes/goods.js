const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Goods = require('../models/goods');
const User = require('../models/user');

// 连接MongoDb数据库
mongoose.connect('mongodb://127.0.0.1:27017/imall');

mongoose.connection.on('connected', () => {
    console.log('Mongodb connected success.');
});

mongoose.connection.on('error', () => {
    console.log('Mongodb connected error.');
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongodb connected disconnected.');
});

/**
 * 查询商品信息
 */
router.get('/', (req, res, next) => {
    const page = parseInt(req.query.page); // 分页
    const pageSize = parseInt(req.query.pageSize);
    const skip = (page - 1) * pageSize;
    const sort = req.query.sort; // 排序
    const priceLevel = req.query.priceLevel; // 条件查询
    let startPrice = 0;
    let endPrice = 5000;
    if (priceLevel != 'all') {
        switch (priceLevel) {
            case '0': startPrice = 0; endPrice = 100; break;
            case '1': startPrice = 100; endPrice = 500; break;
            case '2': startPrice = 500; endPrice = 1000; break;
            case '3': startPrice = 1000; endPrice = 5000; break;
        }
    }
    const params = {
        salePrice: {
            $gt: startPrice,
            $lte: endPrice
        }
    };
    const goodsModel = Goods.find(params).skip(skip).limit(pageSize); // 排序并分页
    goodsModel.sort({
        'salePrice': sort
    });
    goodsModel.exec((err, doc) => {
        if (err) {
            res.json({
                status: '1',
                msg: err.message
            });
        } else {
            res.json({
                status: '0',
                msg: '',
                result: {
                    count: doc.length,
                    list: doc
                }
            });
        }
    });
});

/**
 * 加入购物车
 */
router.post('/addCart', (req, res, next) => {
    const userId = '100000077'; // 这里先写死用户ID，之后再调整成动态的
    const productId = res.body.productId;
    User.findOne({
        userId: userId
    }, (err, userDoc) => {
        if (err) {
            res.json({
                status: '1',
                msg: err.message
            });
        } else {
            if (userDoc) {
                const goodsItem = '';
                userDoc.cartList.forEach(item => { // 如果商品已经存在，则更新商品数量+1
                    if (item.productId == productId) {
                        goodsItem = item;
                        item.productNum++;
                    }
                });
                if (goodsItem) { // 如果商品已经存在，则更新商品信息
                    userDoc.save((error, info) => {
                        if (error) {
                            res.json({
                                status: '1',
                                msg: error.message
                            });
                        } else {
                            res.json({
                                status: '0',
                                msg: '添加成功',
                                result: 'success'
                            });
                        }
                    });
                } else { // 如果商品不存在，则添加新的商品
                    Goods.findOne({
                        productId: productId
                    }, (err, goodDoc) => {
                        if (err) {
                            res.json({
                                status: '1',
                                msg: err.message
                            });
                        } else {
                            if (goodDoc) {
                                goodDoc.productNum = 1;
                                goodDoc.checked = 1;
                                userDoc.cartList.push(goodDoc);
                                userDoc.save((error, info) => {
                                    if (error) {
                                        res.json({
                                            status: '1',
                                            msg: error.message
                                        });
                                    } else {
                                        res.json({
                                            status: '0',
                                            msg: '添加成功',
                                            result: 'success'
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }
    });
});

module.exports = router;