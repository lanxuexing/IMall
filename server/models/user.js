const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    'userId': String,
    'userName': String,
    'userPwd': String,
    'orderList': [
        {
            'orderId': String,
            'orderTotal': String,
            'orderStatus': String,
            'createDate': String,
            'addressInfo': {
                'addressId': String,
                'userName': String,
                'streetName': String,
                'tel': Number,
                'isDefault': Boolean
            },
            'goodsList': [
                {
                    'productId': String,
                    'productName': String,
                    'salePrice': Number,
                    'checked': String,
                    'productImage': String,
                    'productNum': String
                }
            ]
        }
    ],
    'cartList': [
        {
            'productId': String,
            'productName': String,
            'salePrice': String,
            'productImage': String,
            'checked': String,
            'productNum': String
        }
    ],
    'addressList': [
        {
            'addressId': String,
            'userName': String,
            'streetName': String,
            'tel': Number,
            'isDefault': Boolean
        }
    ]
}, {
    usePushEach: true
});

module.exports = mongoose.model('User', userSchema);