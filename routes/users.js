var express = require('express');
var bianxing = require('./bianxing');
var router = express.Router();
var pagination = require('pagination-api');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
//服务端列表分页
router.get("/list2", function (req, res) {
    res.render("./admin/list3")
})
router.get("/page", function (req, res) {
    var d = req.query.p;
    console.log(d);
    bianxing('select * from article limit ?,?', [(d - 1) * 3, 3], function (err, data) {
        if (!err) {
            res.json({list: data})
        }
    })
})

router.get('/users_list', function (req, res) {
    //var d=req.query;
    //console.log(d);
    bianxing("select * from users ", function (err, data) {
        console.log(err);
        if (!err) {
            res.render('users_list', {users: data})
        }
    })
});

module.exports = router;
