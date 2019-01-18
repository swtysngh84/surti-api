var express = require('express');
var bodyParser = require('body-parser');
const jwt=require('jsonwebtoken');
const {User}=require('./model/user');
const {Category} =require('./model/category');
const {SubCategory}=require('./model/subcategory');
const{MyProduct}=require('./model/product');
var multer = require('multer');

var app = express();

var path=require('path');
app.use('/img',express.static(path.join(__dirname, 'public/images')));


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  },bodyParser.json());


  var storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'public/thumbs/')
    },
    filename: (req, file, callback) => {
      callback(null, file.fieldname + '-' + Date.now()+".jpeg")
    },
   
  });
  var upload = multer({storage: storage}).array('image');
/*app.post('/addCategory',(req,res,next)=>{
var category_name=req.body.category_name;
var created_by=req.body.created_by;
    Category.create({category_name,created_by}).then((u)=>{
        res.send(u)
    }).catch((e)=>{
        res.status(400).send("sorry");
    })
  });  
*/
app.post('/login',(req,res,next)=>{
    var email=req.body.email;
    var password=req.body.password;
    var token=jwt.sign(email,'8469');
    User.findOne({
        where: {
            email:email,
            password: password
          }
    }).then((u)=>{
       res.send({"code":200,"token":token,"id":u.user_id});
        //res.send(u);
    }).catch( (e)=>{
        res.status(400).send("data not found");
    })
})

app.get('/fetchCategory',(req,res,next)=>{
    Category.findAll().then((results)=>{
        res.send(results);
    })
    
  });
  app.get('/fetchSubCategory',(req,res,next)=>{
    SubCategory.findAll().then((results)=>{
        res.send(results);
    })
  });
  app.post('/fetchSubCategoryId',(req,res,next)=>{
    var category_id=req.body.category_id;
    SubCategory.findAll({where:{category_id:category_id}}).then((results)=>{
        res.send(results);
    })
  });
  app.post('/addProduct', (req, res, next) => {
   
    upload(req, res, function (err) {
         if (err) {
          
          res.status(400).send("Invalid Data");
        }
        
        var image=[];
        
        /*for(var i=0;i<req.files.length;i++){
            image+=req.files[i].filename+","
        }*/

       
       var data={
       
         "category_id":req.body.category_id,
        "subcategory_id":req.body.subcategory_id,
        "product_name":req.body.product_name,
        "description":req.body.description,
        "price":req.body.price,
        "image":["data",req.files.map(x=>x.filename)],
        "created_by":req.body.id,
        "updated_by":req.body.id,

       }
      console.log(data);
      /* MyProduct.create(data).then((u)=>{
            res.send(u)
        }).catch((e)=>{
            res.status(400).send("sorry");
        })*/	
      })
   });
   app.get('/getProduct',(req,res,next)=>{
  
    MyProduct.findAll().then((results)=>{
        res.send(results);
    })
  });

  app.listen(3000, () => {
    console.log('started at 3000');
});




  
  