var express = require('express');
var router = express.Router();
var mysql = require("mysql");
var ueditor = require("ueditor");
var bianxing = require("./bianxing");
var async = require("async");
var md5 = require("md5");



// // 没有挂载路径的中间件，通过该路由的每个请求都会执行该中间件
router.use(function (req, res, next) {
    //console.log('Time:', Date.now());
    console.log(req.session.user);
    bianxing("select * from cate",function(err,data){
        if(!err){
            req.app.locals.cate = data;
            if(req.session.user){
                req.app.locals.isLogin = 1;
                req.app.locals.user = req.session.user;
            }else{
                req.app.locals.isLogin = 0;
            }
            next();
        }
    })
});

router.use(function (req, res, next) {
    //console.log('Time:', Date.now());
    bianxing("select * from cate",function(err,data){
        if(!err){
            req.app.locals.cate = data;
            req.app.locals.foot = data;
            next();
        }
    })
});



/* GET home page. */

//router.post('/zhuce', function (req, res) {
//    var d=req.body;
//    console.log(d);
//    res.redirect('/')
//});
//页面
//router.get('/', function(req, res, next) {
//    res.render('index');
//});
//列表路由
router.get("/list",function(req,res){
    var d= req.query;
    bianxing('select * from article where cid=?',d.cid,function(err,data){
        if(!err){
            res.render("list_1",{arts:data})
        }
    })

})
//文章路由
router.get("/detail",function(req,res){
    var d= req.query;
    bianxing('select * from article where id=?',d.id,function(err,data){
        console.log(err);
        console.log(data);
        if(!err){
            res.render("detail",{arts:data})
        }
    })
    //res.render("")
})
//登录
router.get('/login',function(req,res){
    res.render('login')
})
router.post("/check",function(req,res){
    var d= req.body;
    console.log(d);
    bianxing('select * from users where username=?',d.username,function(err,data){
        console.log(err);
        if(!err){
            console.log(data.length);
            if(data.length>0&&data[0].pass==md5(d.pass)){
                req.session.user=data[0];
                res.redirect('/')
            }else{
                res.redirect('/zhuce1')
            }
        }
    })
})
//注册
router.get('/zhuce1',function(req,res){
    res.render('singup')
})
router.post('/zhuce', function (req, res) {
    var d = req.body;
    console.log(d);
    console.log(1212121212);
    bianxing('insert into users(username,pass,pass1,email) values(?,?,?,?)',[d.username, md5(d.pass),md5(d.pass1), d.email],
        (err,data)=>{
            if(!err){
                res.redirect("/login")
            }else{
                console.log(err);
                res.send('注册失败')
            }
        });
});
//退出登录
router.get('/logout',function(req,res){
    req.session.destroy(function(err){
        if(!err){
            res.redirect('/')
        }
    })
})

//分类列表
router.get('/', function(req, res, next) {
    var  tasks = {
        news:function(cb){
            bianxing("select * from article where cid = 14  order by id desc limit 0,3;",function(err,data){
                cb(err,data)
            })
        },
        dsj:function(cb){
            bianxing("select * from article where cid = 2  order by id desc limit 0,3;",function(err,data){
                cb(err,data)
            })
        },
        lx:function(cb){
            bianxing("select * from article where cid = 3  order by id desc limit 0,3;",function(err,data){
                cb(err,data)

            })
        },
        hlw:function(cb){
            bianxing("select * from article where cid = 8  order by id desc limit 0,3;",function(err,data){
                cb(err,data)
                console.log(err);
            })
        },
        zjq:function(cb){
            bianxing("select * from article where cid = 9  order by id desc limit 0,3;",function(err,data){
                cb(err,data)
                console.log(err);
            })
        },
        wd:function(cb){
            bianxing("select * from article where cid = 10  order by id desc limit 0,1;",function(err,data){
                cb(err,data)
                console.log(err);
            })
        }
    }

    async.series(tasks,function(err,results){
        console.log(results)
        console.log(err)
        if(!err){
            res.render("index",{data:results})
            res.render("list_1",{data:results})
        }
    })
});

router.get("/list_1",function(req,res){
    var cid = req.query.cid;
    bianxing("select * from article where cid = ?",cid,function(err,data){
        if(!err){
            res.render("list_1",{arts:data})
        }
    })
})



//分类列表-分页
router.get("/list2",function(req,res){
    res.render("list_1")
})
router.get("/page",function(req,res){
    var d=req.query.p;
    var d1=req.query.cid;
    console.log(d);
    console.log(d1);
    console.log(344334);
    bianxing('select * from article where cid=? limit ?,?',[d1,d-1,1],function(err,data){
        console.log(data);
        console.log(err);
        if(!err){
            res.json({list:data})
        }
    })
})


module.exports = router;
