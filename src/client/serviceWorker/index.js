window.Notification = window.Notification || navigator.webkitNotifications || navigator.mozNotification;

/**
 * 在主页面中调用,初始化service-worker
 */
function initSW(){
    if('serviceWorker' in navigator){
        navigator.serviceWorker.register('/sw').then((registration)=>{
            console.log('Successful with scope:',registration.scope)
        }).catch((err)=>{
            console.log('Failed:',err)
        })
    }
}
/**
 * 初始化推送系统
 */
if(window.Notification && Notification.permission!=='granted'){
    Notification.requestPermission((status)=>{
        if(status==='granted') {
            Notification.permission = status;
        }
    })
}

if(window.Notification && Notification.permission === 'granted'){
    initSW();
}



