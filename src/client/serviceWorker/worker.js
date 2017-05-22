self.addEventListener('install',event=>{
    console.log('Service-worker installed successfully');
});

self.addEventListener('activate',event=>{
    console.log('activate')
});

self.addEventListener('push',event=>{
    console.log('Push received!');
    fetch('/extra/news?p=1&pcount=10').then((response)=>{
        return response.json();
    }).then((res)=>{
        if(!res.code){
            let news=res.body.news[Math.floor(Math.random()*10)];
            // show notification
            return self.registration.showNotification(news.title,{
                body:news.intro || news.title,
                icon:news.img,
                tag:news._id,
                renotify:true
            })
        }
    }).catch((e)=>{
        console.log(e.toString());
    })
});

// notification click event
self.addEventListener('notificationclick',event=>{
    let url='/p/'+event.notification.tag;
    event.notification.close();
    event.waitUntil(clients.matchAll({
        type:'window'
    }).then((clientList)=>{
        for(let i=0;i<clientList.length;i++){
            let client=clientList[i];
            if(client.url === url && client.focus){
                return client.focus()
            }
        }
        if(clients.openWindow) return clients.openWindow(url);
    }))
});