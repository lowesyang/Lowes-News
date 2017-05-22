import {urlB64ToUint8Array,LS} from '../utils';
import axios from 'axios';

window.Notification = window.Notification || navigator.webkitNotifications || navigator.mozNotification;
let applicationServerPublicKey;
let swRegistration;

/**
 * 在主页面中调用,初始化service-worker
 */
function initSW(){
    if('serviceWorker' in navigator){
        navigator.serviceWorker.register('/sw').then((reg)=>{
            console.log('Successful with scope:',reg.scope)
            axios.get('/push/key').then((response)=>{
                let res=response.data;
                if(!res.code){
                    applicationServerPublicKey=res.body.publicKey;
                    let pk=LS.getItem('pk');
                    // 若公钥不同，则重新订阅
                    if(pk!==applicationServerPublicKey){
                        unsubscribe().then(()=>{
                            subscribe();
                        });
                        LS.setItem('pk',applicationServerPublicKey);
                    }
                }
            }).catch((e)=>{
                console.log('Error in get keys:',e.toString());
            })
        }).catch((err)=>{
            console.log('Failed:',err)
        });
    }
}
/**
 * 订阅推送
 */
function subscribe(){
    if(!'serviceWorker' in navigator) return;
    navigator.serviceWorker.ready.then((reg)=>{
        swRegistration=reg;
        // 获取当前订阅的推送
        return reg.pushManager.subscribe({
            userVisibleOnly:true,
            applicationServerKey:urlB64ToUint8Array(applicationServerPublicKey)
        })
    }).then(subscription=>{
        axios.post('/push/subscribe',{
            pointInfo:JSON.parse(JSON.stringify(subscription))
        }).then((response)=>{
            let res=response.data;
            if(!res.code){
                console.log('订阅成功!',subscription.endpoint);
            }
        }).catch((e)=>{
            console.log('订阅失败:',e.toString());
        })
    }).catch(e=>{
        console.log('订阅失败:',e.toString());
    })
}

/**
 * 取消订阅
 */
function unsubscribe(){
    if(!'serviceWorker' in navigator) return;
    return new Promise((resolve,reject)=>{
        navigator.serviceWorker.ready.then((reg)=>{
            return reg.pushManager.getSubscription();
        }).then(subscription=>{
            if(subscription) return subscription.unsubscribe();
        }).catch(err=>
            console.log('Error unsubscribing!',err.toString())
        ).then(()=>{
            axios.post('/push/unsubscribe').then((response)=>{
                let res=response.data;
                if(!res.code){
                    console.log('取消订阅成功!');
                    resolve();
                }
                else reject();
            }).catch((e)=>{
                reject(e);
            });
        })
    })
}
/**
 * 初始化推送系统
 */
if(window.Notification){
    if(Notification.permission!=='granted') {
        Notification.requestPermission((status) => {
            if (status === 'granted') {
                Notification.permission = status;
            }
        })
    }
    if(Notification.permission === 'granted'){
        initSW();
    }
    else{
        unsubscribe();
    }
}


