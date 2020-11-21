
const mysql = require('mysql');

var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Cheng2012',
    database: 'web',
    charset: 'utf8mb4',  //sql编码
    port: '3306',
    multipleStatements: true,  //允许一次执行多条sql
});

var query=function(sql,values,callback){

    pool.getConnection(function(err,conn){
        
        if(err){
            callback(err,null,null);
        }else{
          
            conn.query(sql,values,function(err,results,fields){
                //事件驱动回调
                callback(err,results,fields);
                conn.release();
            });
        }
        
    });
};

module.exports=query;