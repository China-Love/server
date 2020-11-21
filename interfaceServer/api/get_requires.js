const mysql = require('mysql');
var query = require("./mysql/connection_ pool.js");

var GetRequire = {

  searchFoodWithName: function  (ctx,resolve) {
    let name = ctx.query.name;
    let page = ctx.query.page;
    //判断参数为空
    if ((name == "" || name == null || name == undefined) && page == "" || page == null || page == undefined || Number.isNaN(Number(page)) === true) {
      ctx.body = {
        code: 400,
        data: 'Parameter Error'
      }
      resolve();
    }
   
   
    page = page * 10;
    const sql = `SELECT * FROM food_description WHERE description LIKE '%${name}%' OR name LIKE '%${name}%' OR tags LIKE '%${name}%' OR  authorname LIKE '%${name}%' LIMIT ${page}, 10;`;
    query(sql, null, function (err, results) {
      if (err) {
        ctx.body = {
          code: 404,
          data: err
        }
        console.log('/api/search_food', err);
      } else {
        ctx.body = {
          code: 200,
          data: results
        }
      }
      resolve();
    })
  },
  foodlist: function (ctx, connection) {
    return new Promise(resolve => {
      this.getFoodListWithPage(ctx, resolve);
    })
  },
  getFoodListWithPage: function (ctx,resolve) {

    let page = ctx.query.page;
    //判断参数为空
    if (page == "" || page == null || page == undefined) {
      ctx.body = {
        code: 400,
        data: 'Parameter Error'
      }
      resolve();
    }
   
    page = page * 10;
    const sql = `select * from foodlist limit ${page},10;`;

    query(sql, null, function (err, results) {
     
      if (err) {
        ctx.body = {
          code: 404,
          data: err
        }
        console.log('/api/foodlist', err);
      } else {
        ctx.body = {
          code: 200,
          data: results
        }
      }
      resolve();
    });
  },
  getFoodDescriptionWithName: function  (ctx,resolve) {
    let id = ctx.query.id;
    //判断参数为空
    if (id == "" || id == null || id == undefined) {
      ctx.body = {
        code: 400,
        data: 'Parameter Error'
      }
      resolve();
    }
    
    //查询多条sql 切记用 ; 隔开
    const sql_food_description = `select * from food_description where id = ? ;`;
    const sql_food_materiallist = `select * from food_materiallist where food_id = ? ORDER BY CONVERT(ordernum,SIGNED)  ASC;`;
    const sql_food_tiplist = `select * from food_tiplist where food_id = ? ORDER BY CONVERT(ordernum,SIGNED)  ASC;`;
    const sql_food_steplist = `select * from food_steplist where food_id = ? ORDER BY CONVERT(ordernum,SIGNED)  ASC;`;

    let sql = sql_food_description + sql_food_materiallist + sql_food_tiplist + sql_food_steplist;
    let queryParams = [id, id, id, id];

    query(sql, queryParams, function (err, results) {
    if (err) {
        ctx.body = {
          code: 404,
          data: err
        }
        console.log('api/food_description', err);
    } else {
        //查询结果是否为空
        if (results[0].length == 0) {
          ctx.body = {
            code: 200,
            data: []
          }
        } else {
          let obj = results[0][0];
          obj['food_materiallist'] = results[1];
          obj['food_tiplist'] = results[2];
          obj['food_steplist'] = results[3];
          ctx.body = {
            code: 200,
            data: obj
          }
        }
      }
      resolve();
    });
  }
}


module.exports = GetRequire;