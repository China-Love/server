
const Koa = require('koa');
const Router = require('koa-router');
const mysql = require('mysql');
const bodyParser = require('koa-bodyparser')
const path = require('path')
const static = require('koa-static')

const app = new Koa();
const router = new Router();
const staticPath = './static'


const getRequires = require("./api/getRequires");
const axios = require('axios');

// 使用ctx.body解析中间件
app.use(bodyParser())


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Cheng2012',
  database: 'web',
  charset: 'utf8mb4',  //sql编码
  port: '3306',
  multipleStatements: true,  //允许一次执行多条sql
})

connection.connect(err => {
  if (err) throw err;
  console.log('mysql connncted success!');
})


/*
 *根据id查询美食详情
 *参数 id
 *方式 Get
 */
router.get('/api/food_description', ctx => {
  return new Promise(resolve => {
    getRequires.getFoodDescriptionWithName(ctx, connection, resolve);
  })
})

/*
 *根据name模糊查询美食 分页返回列表 
 *参数 name page
 *方式 Get
 */
router.get('/api/search_food', ctx => {
  return new Promise(resolve => {
    getRequires.searchFoodWithName(ctx, connection, resolve);
  })
})

/*
 *查询美食数据 分页返回列表 
 *参数 page
 *方式 Get
 */
router.get('/api/foodlist', ctx => {
  return new Promise(resolve => {
    getRequires.getFoodListWithPage(ctx, connection, resolve);
  })
})

//静态资源加载 koa-static中间件使用
app.use(static(
  path.join(__dirname, staticPath)
))

// app.use( async ( ctx ) => {
//   ctx.body = 'hello world'
// })

// router.get('/', ctx => {
//   ctx.body='hello!!!!';
// })






var axios_post_list_methods = function (param, ctx) {
  axios.post('http://42.121.253.143/public/getContentsBySubClassid.shtml', param, {
    transformRequest: [
      function (param) {
        var params = 'id=7136496&type=0&page=' + param;
        return params;
      }
    ]
  }).then(function (res) {
    let arr = res.data.list;
    let values = [];
    for (let index = 0; index < arr.length; index++) {
      const element = arr[index];
      let objArr = [];
      objArr.push(element.description);
      objArr.push(element.videourl);
      objArr.push(element.id);
      if (element.exclusive) {
        objArr.push(element.exclusive.toString());
      } else {
        objArr.push(element.exclusive);
      }
      objArr.push(element.authorid);
      if (element.tags) {
        objArr.push(element.tags.toString());
      } else {
        objArr.push(element.tags);
      }
      objArr.push(element.likeCount);
      objArr.push(element.type);
      objArr.push(element.imageid);
      objArr.push(element.collectCount);
      objArr.push(element.view_count);
      objArr.push(element.commentCount);
      objArr.push(element.authorimageid);
      if (element.has_video) {
        objArr.push(element.hasVideo.toString());
      } else {
        objArr.push(element.hasVideo);
      }

      objArr.push(element.authorname);
      objArr.push(element.name);
      values.push(objArr);
    }
    setmysql(values, ctx);
  });
}

//接收post提交的数据
router.get('/automaticAdd', async (ctx) => {
  var n = -1;
  var m = setInterval(() => {

    if (n <= 100) {
      n = n + 1;
      axios_post_list_methods(n, ctx);
    } else {
      clearInterval(m); /*清除定时器*/
    }

  }, 1000/2);
 
})

function insertFoodlist(values, ctx) {
  return new Promise(resolve => {
    const sql = `INSERT INTO foodlist(description,videourl,id,exclusive,authorid,tags,like_count,type,imageid,collect_count,view_count,comment_count,authorimageid,has_video,authorname,name)
      VALUES ?`;
    connection.query(sql, [values], (err, result) => {
      if (err) {
        ctx.body = {
          code: 404,
          data: err
        }
        console.log(err);
      } else {
        ctx.body = {
          code: 200,
          msg: `insert ${result.affectedRows} data to user success!`
        }
        console.log(`insert ${result.affectedRows} data to user success!`);
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
      if (err) {
        ctx.body = {
          code: 404,
          data: err
        }
      } else {
        ctx.body = {
          cde: 200,
          msg: `insert data to user success!`
        }
      }
      resolve();
    })
  })
})





app.use(router.routes());

app.listen(8888);


