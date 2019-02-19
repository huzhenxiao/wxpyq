const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();

// 引入users.js
const users = require('./routers/api/users');
const profiles = require('./routers/api/profiles');

// 使用body-parser中间件
app.use(bodyParser.urlencoded({limit:'50mb',extend:true}));
app.use(bodyParser.json({limit:'50mb'}));


// DB config
const db = require('./config/keys').mongoURL;
// connect to mongodb
mongoose.connect(db,{ useNewUrlParser: true })
        .then(()=>console.log("MongoDB Connected!"))
        .catch((err)=>console.log(err))

// 后端实现跨域
// app.all("*",function(req,res,next){
//     //设置允许跨域的域名，*代表允许任意域名跨域
//     res.header("Access-Control-Allow-Origin","*");
//     //允许的header类型
//     res.header("Access-Control-Allow-Headers","content-type");
//     //跨域允许的请求方式 
//     res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
//     if (req.method.toLowerCase() == 'options')
//         res.send(200);  //让options尝试请求快速结束
//     else
//         next();
// })

// passport初始化
app.use(passport.initialize());
require('./config/passport')(passport);

// 设置路由
// app.get('/',(req,res)=>{
//     res.send('hello')
// })

// 中间件使用routers
app.use('/api/users',users);
app.use('/api/profiles',profiles);

const port = process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
})