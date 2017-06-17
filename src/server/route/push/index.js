let router=require('express').Router();
const webpush=require('web-push-china');
const vapidKeys=webpush.generateVAPIDKeys();
const clients={};

webpush.setGCMAPIKey('AIzaSyAbr5V-JmZ8tMShtT_KNtWcn6f8oOEqAUo');
webpush.setVapidDetails(
    'mailto:yyh951102@163.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

/**
 * 获取公钥
 */
router.get('/key',(req,res)=>{
    res.json({
        code:0,
        body:{
            publicKey:vapidKeys.publicKey
        }
    });
});

/**
 * 接收客户端的订阅信息
 */
router.post('/subscribe',(req,res)=>{
    let ip=req.connection.remoteAddress;
    let pointInfo=req.body.pointInfo;
    clients[ip]=pointInfo;
    res.json({
        code:0
    })
});

router.post('/unsubscribe',(req,res)=>{
    let ip=req.connection.remoteAddress;
    clients[ip]=null;
    res.json({
        code:0
    })
});

const options={
    proxyUrl:'127.0.0.1',
    proxyPort:8118,
    headers:{
        Host:'fcm.googleapis.com'
    }
}

setInterval(()=>{
    for(let key in clients) {
        if(!clients[key]) continue;
        console.log(clients[key].endpoint);
        webpush.sendNotification(clients[key],'',options).then(()=>{
            console.log("Notify successfully!");
        }).catch(e => {
            console.log(e);
        })
    }
},3600*1000);

module.exports=router;