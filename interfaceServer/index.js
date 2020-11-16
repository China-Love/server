
const Koa = require('koa');
const Router = require('koa-router');
const mysql = require('mysql');
const bodyParser = require('koa-bodyparser')
// const fs = require('fs');
const path = require('path')
const static = require('koa-static')

const app = new Koa();
const router = new Router();
const staticPath = './static'

// 使用ctx.body解析中间件
app.use(bodyParser())


const connection = mysql.createConnection({
  host: 'localhost', // 填写你的mysql host
  user: 'root', // 填写你的mysql用户名
  password: 'Cheng2012' ,// 填写你的mysql密码
  database: 'web', // 
  charset: 'utf8mb4'
})

connection.connect(err => {
  if(err) throw err;
  console.log('mysql connncted success!');
})



//接收post提交的数据
router.post('/doAdd',async (ctx)=>{
    // console.log(ctx.request.body,ctx.request.header);
    let arr = Object.values(ctx.request.body);
    let mysqlarr = [];
    for (let index = 0; index < arr.length; index++) {
      
      let m = Object.values(ctx.request.body[index]);
      m[3] = m[3].toString();
      m[5] = m[5].toString();
      m[13] = m[13].toString();
      
      mysqlarr.push(Object.values(m));
      
    }
    setmysql(mysqlarr,ctx);

    ctx.body = ctx.request.body
})

function setmysql (values,ctx){
  return new Promise(resolve => {
      const sql = `INSERT INTO foodlist(description,videourl,id,exclusive,authorid,tags,like_count,type,imageid,collect_count,view_count,comment_count,authorimageid,has_video,authorname,name)
      VALUES ?`;
      console.log('===========',values);
    
      connection.query(sql, [values], (err, result) => {
        if (err){
            ctx.body = {
                 code: 404,
                 data: err
            }
        }else{
            ctx.body = {
            code: 200,
            msg: `insert ${result.affectedRows} data to user success!`        
            }
        }
        resolve();
      })
    })
}


//插入单条数据
router.get('/insert', ctx => {
    return new Promise(resolve => {
      const sql = `INSERT INTO foodlist(id, name)
      VALUES('vue', 'Evan')`;
      connection.query(sql, (err) => {
        if (err){
            ctx.body = {
                 code: 404,
                 data: err
            }
        }else{
            ctx.body = {
            cde: 200,
            msg: `insert data to user success!`
            }
        }
        resolve();
      })
    })
})
//插入多条数据
router.get('/insertmulti', ctx => {
    return new Promise(resolve => {
      const sql = `INSERT INTO user(name, author)
      VALUES ?`;
      const values = [
        ['React', 'Facebook'],
        ['Angular', 'Google'],
        ['jQuery', 'John Resig']
      ];
      connection.query(sql, [values], (err, result) => {
        if (err){
            ctx.body = {
                 code: 404,
                 data: err
            }
        }else{
            ctx.body = {
            code: 200,
            msg: `insert ${result.affectedRows} data to user success!`        
            }
        }
        resolve();
      })
    })
})
//删除数据
router.get('/delete', ctx => {
    return new Promise(resolve => {
      const name = ctx.query.name;
      const sql = `DELETE FROM user WHERE name = '${name}'`;
      connection.query(sql, (err, result) => {
        if (err){
            ctx.body = {
                 code: 404,
                 data: err
            }
        }else{
            ctx.body = {
            code: 200,
            msg: `delete ${result.affectedRows} data from user success!`
            };
        }
        resolve();
      })
    })
})
//修改数据
router.get('/update', ctx => {
    return new Promise(resolve => {
      const sql =  `UPDATE user SET author = 'Evan You' WHERE NAME = 'vue'`;
      connection.query(sql, (err, result) => {
        if (err){
            ctx.body = {
                 code: 404,
                 data: err
             }
        }else{
            ctx.body = {
            code: 200,
            msg: `update ${result.affectedRows} data from user success!`
            };
        }
        resolve();
      })
    })
})
//查询数据
router.get('/foodlist', ctx => {
    return new Promise(resolve => {
      //let name = ctx.query.name;
      // const sql = `SELECT * FROM user WHERE name = '${name}'`;
      let page = ctx.query.page;
      console.log(page);
      const sql =`select * from foodlist limit ${page},10;`;
      connection.query(sql, (err, result) => {
        if (err){
           ctx.body = {
                code: 404,
                data: err
            }
        }else{
            ctx.body = {
                code: 200,
                data: result
            }
        }
        resolve();
      })
    })
  })


//静态资源加载 koa-static中间件使用

app.use(static(
  path.join( __dirname,  staticPath)
))

// app.use( async ( ctx ) => {
//   ctx.body = 'hello world'
// })

// router.get('/', ctx => {
//   ctx.body='hello!!!!';
// })

app.use(router.routes());

app.listen(8888);
