var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());

app.get('/abc',(req,res)=>{
    var body=req.body;
    console.log(body);
    
})
app.listen(3000, () => {
    console.log('started at 3000');
});
