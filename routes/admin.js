var express = require('express');
var bianxing = require('./bianxing');
var router = express.Router();
var fs = require("fs");
var path = require("path");

router.get('/log',function(req,res){
    res.render("./admin/index")
})
router.get('/cate', function(req, res, next) {
    bianxing("select * from cate",function(err,data){
        if(!err){
            res.render('./admin/cate',{cate:data});
        }
    })
});
router.get('/addcate', function(req, res, next) {
    res.render('./admin/addcate');
});
router.post("/insertcate",function(req,res){
    var d =  req.body;
    bianxing("insert into cate(catename)values(?)",d.cname,function(err,data){
        if(!err){
            res.redirect("/admin/cate")
        }
    })
})
router.get('/read',function(req,res){
    var d=req.query;
    console.log(d);
    bianxing('select * from cate where id=?',d.id,function(err,data){
        //console.log(data);
        console.log(err);
        if(!err){
            res.render('./admin/update',{cate1:data[0]})
        }
    })
})
router.post('/update',function(req,res){
    var s=req.body;
    console.log(s);
    bianxing('update cate set catename=? where id=? ',[s.cname,s.id],function(err,data){
        //console.log(data);
        console.log(err);
        if(!err){
            //res.render('./admin/cate')
            res.redirect('/admin/cate')
        }
    })
})

router.get("/del",function(req,res){
    var d =  req.query;
    console.log(d);
    bianxing("delete from cate where id=?",d.id,function(err,data){
        if(!err){
            res.redirect("/admin/cate")
        }
    })
})



//router.post("/insertcate",function(req,res){
//    var d =  req.body;
//    bianxing("insert into cate(catename)values(?)",d.cname,function(err,data){
//        if(!err){
//            res.redirect("/admin/cate")
//        }
//    })
//})
//文章列表模板
router.get("/news",function(req,res){
    bianxing("select * from article",function(err,data){
        if(!err){
            res.render("./admin/news",{news:data})
        }
    })
})
//添加文章模板
router.get("/addnews",function(req,res){
    bianxing("select * from cate",function(err,data){
        if(!err){
            res.render("./admin/addnews",{cate:data})
        }
    })
})
//添加文章列表（传输数据到模板页）
router.post("/insertnews",function(req,res){
    var file =   req.files;
    var d =   req.body;
    console.log(file,d)
    var ext =  path.extname(file.pic[0].originalname);
    fs.rename(file.pic[0].path,file.pic[0].path+ext,function(err){
        if(!err){
            var  arr = [
                d.title,
                d.shijian,
                d.author,
                d.zhaiyao,
                d.cid,
                file.pic[0].filename+ext,
                d.content
            ]
            bianxing("insert into article(title,shijian,author,zhaiyao,cid,pic,content)values(?,?,?,?,?,?,?)",arr,function(err,data){
                console.log(err);
                if(!err){
                    res.redirect("/admin/news")
                }
            })
        }
    })
})
//编辑
router.get('/upda',function(req,res){
    var d= req.query;
    console.log(d);
    bianxing('select * from article where id=?',d.id,function(err,data){
        if(!err){
            console.log(data);
            res.render('./admin/update_',{ggg:data[0]})
        }
    })
})
router.post('/update_1',function(req,res){
    var d=req.body;
    console.log(d);
    bianxing('update article set title=?,shijian=?,author=?,zhaiyao=?,cid=?,pic=?,content=? where id=?',[d.title,d.shijian,d.author,d.zhaiyao,d.cid,d.pic,d.content,d.id],function(err,data){
        console.log(err);
        if(!err){
            res.redirect('/admin/news')
        }
    })
})
//删除
router.get("/dell",function(req,res){
    var d =  req.query;
    console.log(d);
    bianxing("delete from article where id=?",d.id,function(err,data){
        if(!err){
            res.redirect("/admin/news")
        }
    })
})

//分页
router.get("/list2",function(req,res){
    res.render("./admin/list3")
})
router.get("/page",function(req,res){
    var d=req.query.p;
    console.log(d);
    console.log(344334);
    bianxing('select * from article limit ?,?',[(d-1)*3,3],function(err,data){
        if(!err){
            res.json({list:data})
        }
    })
})









module.exports=router;
