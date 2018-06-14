var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var ueditor = require("ueditor");
var multer = require("multer");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret:"keyboard cat",
  resave:true,
  saveUninitialized:false,
  cookie:{maxAge:60000}
}));
// use this middleware to reset cookie expiration time
// when user hit page every time
//ˢ��ҳ��������������
app.use(function(req, res, next){
  req.session._garbage = Date();
  req.session.touch();
  next();
});
app.use("/ueditor/ue", ueditor(path.join(__dirname, 'public'), function(req, res, next) {

  // ueditor �ͻ������ϴ�ͼƬ����

  if(req.query.action === 'uploadimage'){

    // ��������Ի���ϴ�ͼƬ����Ϣ
    var foo = req.ueditor;
    console.log(foo.filename); // exp.png
    console.log(foo.encoding); // 7bit
    console.log(foo.mimetype); // image/png

    // ������д��Ҫ��ͼƬ���浽��·�� �� �� path.join(__dirname, 'public') ��Ϊ��·����
    var img_url = '/yourpath';
    res.ue_up(img_url); //��ֻҪ����Ҫ����ĵ�ַ �������������ueditor����
  }
  //  �ͻ��˷���ͼƬ�б�����
  else if (req.query.action === 'listimage'){
    var dir_url = '/your img_dir'; // Ҫչʾ���ͻ��˵��ļ���·��
    res.ue_list(dir_url) // �ͻ��˻��г� dir_url Ŀ¼�µ�����ͼƬ
  }
  // �ͻ��˷�����������
  else {

    res.setHeader('Content-Type', 'application/json');
    // ������д ueditor.config.json ����ļ���·��
    res.redirect('/ueditor/ueditor.config.json')
  }}));

var  upload = multer({dest: './public/uploads/'}).fields([{ name: 'pic', maxCount: 1 }])

app.use(upload);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
