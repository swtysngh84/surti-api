var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
const jwt=require('jsonwebtoken');
var app = express();

  
app.use(bodyParser.json());

//var urlencodedParser = bodyParser.urlencoded({ extended: false });

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: 'root',
    database: 'shopp'
});

connection.connect(function (err) {
    if (!err) {
        console.log("Database is connected ...");
    } else {
        console.log("Error connecting database ... ", err);
    }
});
app.post('/login',(req,res)=>{

    var name=req.body.name;
    var pass=req.body.pass;
 // console.log(pass);
  //console.log(name);
  
    connection.query('SELECT * FROM user WHERE name = ?',[name], function (error, results, fields) {
        if (error) {
          // console.log("error ocurred",error);
          res.send({
            "code":400,
            "failed":"error ocurred"
          })
        }else{
          
          if(results.length >0){
            if(results[0].pass == pass){
               var token=jwt.sign(name,'8469')
                res.send({"code":200,"token":token});
            }
            else{
              res.send({
                "code":204,
                "data":"Email and password does not match"
                  });
            }
          }
          else{
            res.send({
              "code":204,
              "data":"Email does not exits"
                });
          }
         
        }
        });
    
      
});

app.get('/abc',(req,res)=>{
    var body=req.body;
    console.log(body);
    
})

app.listen(3000, () => {
    console.log('started at 3000');
});

