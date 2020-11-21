const mysql = require('mysql');
const axios = require('axios');


var postService = {

    insertDescription: function (param,connection) {
       axios_post_description_methos(param,connection);
    },
    getDescription: function(param,connection,router,ctx) {
       sql_get_description(param,connection,router,ctx) ;
    },

}


var axios_post_description_methos = function (param,connection) {
    axios.post('http://42.121.253.143/public/getRecipeListByIds.shtml', param, {
        transformRequest: [
            function (param) {
                var params = 'ids=' + param;
                return params;
            }
        ]
    }).then(function (res) {
        // console.log('------------',res.data);
        addDescriptionlist(res.data.list[0],connection);
        addFoodMateriallist(param,res.data.list[0].materialList,connection);
        foodSteplist(param,res.data.list[0].stepList,connection);
        foodTiplist(param,res.data.list[0].tipList,connection);
    });
}

function addFoodMateriallist (id,data,connection) {
    // console.log(data)
    let values = [];
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        let objArr = [];
        objArr.push(element.id);
        objArr.push(element.dosage);
        objArr.push(element.name);
        objArr.push(element.ordernum.toString());
        objArr.push(id);
        values.push(objArr);
    }
    
    // console.log('=======',values);
    const sql = `INSERT INTO food_materiallist(id,dosage,name,ordernum,food_id)VALUES ?`;
    
    connection.query(sql, [values], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`insert ${result.affectedRows} data to user success!`);
        }
    })
}

function foodSteplist (id,data,connection) {

    // console.log(data)
    let values = [];
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        let objArr = [];
        objArr.push(element.id);
        objArr.push(element.details);
        objArr.push(element.ordernum);
        objArr.push(element.imageid);
        objArr.push(element.time);
        objArr.push(id);
        values.push(objArr);
    }
  
    const sql = `INSERT INTO food_steplist(id, details,ordernum,imageid,time,food_id)VALUES ?`;
    
    connection.query(sql, [values], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`insert ${result.affectedRows} data to user success!`);
        }
    })
}

function foodTiplist (id,data,connection) {
    // console.log(data)
    let values = [];
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        let objArr = [];
        objArr.push(element.id);
        objArr.push(element.details);
        objArr.push(element.ordernum);
        objArr.push(id);
        values.push(objArr);
    }
   
    const sql = `INSERT INTO food_tiplist(id, details,ordernum,food_id)VALUES ?`;
    
    connection.query(sql, [values], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`insert ${result.affectedRows} data to user success!`);
        }
    })
}

function addDescriptionlist (data,connection) {
    
    let values = [];
    values.push(data.id);
    values.push(data.description);
    values.push(data.gettime.toString());
    values.push(data.exclusive.toString());
    values.push(data.authorid);
    values.push(data.tags);
    values.push(data.url);
    values.push(data.imageid);
    values.push(data.isrec);
    values.push(data.authorimageid);
    values.push(data.hasVideo.toString());
    values.push(data.name);
    if(data.video){
        values.push(data.video.url);
    }else{
        values.push(data.video);
    }
    values.push(data.version);
    values.push(data.authorname);
    values = [values];
    console.log('=========',data.id);
   
    const sql = `INSERT INTO food_description(id,description,gettime,exclusive,authorid,tags,url,imageid,isrec,authorimageid,hasVideo,name,video,version,authorname)VALUES ?`;
    
    connection.query(sql, [values], (err, result) => {
        if (err) {
            // console.log(err);
        } else {
            console.log(`insert ${result.affectedRows} data to user success!`);
        }
    })
}


//查询数据
function sql_get_description (param,connection,router,ctx) {
router.get('/api/food_description', ctx => {
  
    return new Promise(resolve => {
      //let name = ctx.query.name;
      const sql_food_description = `select * from food_description where id =  '${param}'`;
      const sql_food_materiallist = `select * from food_materiallist where food_id = '${param}' ORDER BY CONVERT(ordernum,SIGNED)  ASC`;
      const sql_food_tiplist = `select * from food_tiplist where food_id = '${param}' ORDER BY CONVERT(ordernum,SIGNED)  ASC`;
      const sql_food_steplist = `select * from food_steplist where food_id = '${param}' ORDER BY CONVERT(ordernum,SIGNED)  ASC`;
     
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
            
            if(result){
             
              for (let index = 0; index < result.length; index++) {
                   postMethods.insertDescription(result[index]['id'],connection);  
                
              }
            }
        }
        resolve();
      })
    })
  })
}





module.exports = postService;