const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Goods = require('../models/goods');

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


router.get('/', (req, res, next) => {
    const page = parseInt(req.query.page); // 分页
    const pageSize = parseInt(req.query.pageSize);
    const skip = (page - 1) * pageSize;
    const sort = req.query.sort; // 排序
    const priceLevel = req.query.priceLevel; // 条件查询
    let startPrice = '';
    let endPrice = '';
    if (priceLevel != 'all') {
        switch (priceLevel) {
            case '0': startPrice = 0; endPrice = 100; break;
            case '1': startPrice = 100; endPrice = 500; break;
            case '2': startPrice = 500; endPrice = 1000; break;
            case '3': startPrice = 1000; endPrice = 2000; break;
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

module.exports = router;