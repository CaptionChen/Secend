var mysql=require('mysql');
function query(){
    //创建数据库连接
    var connection = mysql.createConnection({
        host: "127.0.0.1",
        user: 'root',
        password: '12',
        database: 'web1'
    });
    //链接数据库
    connection.connect(err=> {
        if (err) {
            console.log(err);
        }
    });
    //判断传参数量
    if(arguments.length==2){
        let sql = arguments[0];
        let fn = arguments[1];
        connection.query(sql,function(err,data){
            fn(err,data)
        })
        connection.end()
    }
    if(arguments.length==3){
        let sql = arguments[0];
        let arr = arguments[1];
        let fn = arguments[2];
        connection.query(sql,arr,function(err,data){
            fn(err,data)
        });
        connection.end();
}
}
module.exports = query;
