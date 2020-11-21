
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser')
const path = require('path')
const static = require('koa-static')

const app = new Koa();
const router = new Router();
const staticPath = './static'

const GetRequires = require("./api/get_requires");

const Koa_Logger = require("koa-logger");                 // 日志中间件
const Moment = require("moment");                           
const logger = Koa_Logger((str) => {       // 使用日志中间件
    console.log(Moment().format('YYYY-MM-DD HH:mm:ss')+str);
});     




/*
 *根据id查询美食详情
 *参数 id
 *方式 Get
 */
router.get('/api/food_description', ctx => {
  return new Promise(resolve => {
    GetRequires.getFoodDescriptionWithName(ctx, resolve);
  })
})

/*
 *根据name模糊查询美食 分页返回列表 
 *参数 name page
 *方式 Get
 */
router.get('/api/search_food', ctx => {
  return new Promise(resolve => {
    GetRequires.searchFoodWithName(ctx,resolve);
  })
})

/*
 *查询美食数据 分页返回列表 
 *参数 page
 *方式 Get
 */
router.get('/api/foodlist', ctx => {
  return new Promise(resolve => {
    GetRequires.getFoodListWithPage(ctx,resolve);
  })
})

//静态资源加载 koa-static中间件使用
app.use(static(
  path.join(__dirname, staticPath)
))


app.use(bodyParser())   // 使用ctx.body解析中间件
 
app.use(logger);        // 日志输出中间件

app.use(router.routes());

app.listen(80);

// 启动标识
console.log("Koa运行在80端口");  