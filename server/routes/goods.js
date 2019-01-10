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
    const page = parseInt(req.param('page'));
    const pageSize = parseInt(req.param('pageSize'));
    const skip = (page - 1) * pageSize;
    const sort = req.param('sort');
    const params = {};
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