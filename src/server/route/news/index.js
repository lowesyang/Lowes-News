let router=require("express").Router();
let getNews=require("./getNews").getNews;
let getNewsDetail=require("./getNews").getNewsDetail;
let views=require("../../views");
let lru=require("lru-cache");
let renderer=require("vue-server-renderer").createRenderer();
let components=require("./vue-components");
let newsList=components.newsList;
let newsDetail=components.newsDetail;
let cateToName=require("../../helpers/utils").cateToName;

// 首页
router.get("/",(req,res)=>{
    res.redirect("/news");
});

/** 服务端渲染版块主页
 * @param type      新闻类型
 */
router.get("/news/:type?",(req,res)=>{
    let type=req.params.type || "",
        page=1,
        pcount=10;
    let time=Date.now();
    getNews(type,page,pcount,false)
        .then((data)=>{
            console.log("获取完新闻用时:"+ (Date.now()-time)/1000);
            time=Date.now();
            renderer.renderToString(
                newsList(data),
                (err,html)=>{
                    console.log("vue渲染完成用时:"+ (Date.now()-time)/1000);
                    time=Date.now();
                    if(err) return res.status(500).send("Server Error");
                    let result=views.indexHtml
                        .replace("<div id=NEWSLIST></div>",html)
                        .replace("<title></title>",`<title>${cateToName(type)} | LowesNews</title>`);
                    console.log("响应用时:"+ (Date.now()-time)/1000);
                    res.send(result)
                }
            )
        })
});

/** ajax加载额外新闻
 * @param type      新闻类型
 * @query p         页码
 * @query pcount    每页的新闻条目数
 */
router.get("/extra/news/:type?",(req,res)=>{
    let type=req.params.type || "";
    let page=parseInt(req.query.p);
    let pcount=parseInt(req.query.pcount);
    getNews(type,page,pcount,false)
        .then((news)=>{
            res.json({
                code:0,
                msg:"success",
                body:{
                    news:news
                }
            })
        })
        .catch((err)=>{
            res.json({
                code:-1,
                msg:err.toString()
            })
        })
});

router.get("/p/:docId",(req,res)=>{
    let docId=req.params.docId;

    getNewsDetail(docId).then((data)=>{
            // 成功找到
            renderer.renderToString(
                newsDetail(data),
                (err, html) => {
                    if (err) return res.status(500).send("Server Error");
                    let article = views.articleHtml
                        .replace("<title></title>", `<title>${data.title}</title>`)
                        .replace("<div id=NEWS></div>", html)
                    res.send(article);
                }
            )
    }).catch(()=>{
        res.redirect('/news');
    })
});

module.exports=router;
