self.addEventListener('install',event=>{
    console.log('Service-worker installed successfully');
    setInterval(()=>{
        fetch('/extra/news?p=1&pcount=10').then((response)=>{
            return response.json();
        }).then((res)=>{
            if(!res.code){
                let news=res.body.news[Math.floor(Math.random()*10)];
                // show notification
                self.registration.showNotification(news.title,{
                    body:news.intro || news.title,
                    icon:news.img,
                    tag:news._id,
                    renotify:true
                })
            }
        })
    },3600000);
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