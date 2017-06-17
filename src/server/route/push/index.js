let router=require('express').Router();
const webpush=require('web-push-china');
const vapidKeys=webpush.generateVAPIDKeys();
const clients={};
const proxyPort=process.env.NODE_ENV === "dev"?1080:8118;

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
    proxyPort:proxyPort,
    headers:{
        Host:'fcm.googleapis.com'
    }
}

let lastPush=0;
// 触发推送
router.get('/trigger',(req,res)=>{
    let now=Date.now();
    let during=(now-lastPush)/1000;
    if(during<=600){
        return res.json({
            code:1,
            msg:Math.round((600-during)/60)+'分钟之后才能再次推送'
        })
    }
    new Promise((resolve,reject)=>{
        for(let key in clients) {
            if(!clients[key]) continue;
            console.log(clients[key].endpoint);
            webpush.sendNotification(clients[key],'',options).then(()=>{
                console.log("Notify successfully!");
                lastPush=now;
                resolve();
            }).catch(e => {
                console.log(e);
                reject(e);
            })
        }
    }).then(()=>{
        res.json({
            code:0,
            msg:'推送成功'
        })
    }).catch((e)=>{
        res.json({
            code:1,
            msg:e.toString()
        })
    })
})


module.exports=router;