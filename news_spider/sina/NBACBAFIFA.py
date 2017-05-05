# NBA,CBA,国际足球
from lxml import etree
from datetime import datetime
import sys
import pymongo
import json
sys.path.append("..")
from getPage import get_page_decode
from wordSegment import wordSegment

connect=pymongo.MongoClient('127.0.0.1',27017)
db=connect.news_collect

SPORTEXTRA=[
    {
        "link":"http://interface.sina.cn/wap_api/layout_col.d.json?col=72340%2C185955&level=1%2C2&show_num=200&page=1",
        "scate":"NBA"
    },
    {
        "link":"http://interface.sina.cn/wap_api/layout_col.d.json?col=72602%2C192583&level=1%2C2%2C3&show_num=200&page=1",
        "scate":"CBA"
    },
    {
        "link":"http://interface.sina.cn/wap_api/layout_col.d.json?col=72264&level=1%2C2%2C3&show_num=200&page=1",
        "scate":"fifa"
    },
    {
        "link":"http://interface.sina.cn/wap_api/layout_col.d.json?col=72310&level=1%2C2%2C3&show_num=200&page=1",
        "scate":"fifa"
    }
]

def getNBACBAFIFA():
    print("Begin to get sina NBA,CBA,FIFA")
    for cate in SPORTEXTRA:
        data=get_page_decode(cate["link"])
        items=json.loads(data)["result"]["data"]["list"]
        for news in items:
            news.pop('_id')
            try:
                detail=get_page_decode(news["pc_url"])
                detail=etree.HTML(detail)
                news["content"]=""
                news["category"]="sports"
                news["scate"]=cate["scate"]
                article=detail.xpath("//section[@class='art_pic_card art_content']")
                if len(article)!=0:   # mobile page
                    news["content"]=etree.tounicode(article[0])
                else:  # PC page
                    # print(etree.tounicode(detail))
                    article=detail.xpath("//section[@class='art_main_card j_article_main']")[0]
                    article=article.xpath("//img[@class!=' hide']|//p[@class='art_t']")
                    for art in article:
                        if art is not None:
                            news["content"]+=etree.tounicode(art)
                # 新闻特征统计
                news['feature']=wordSegment(news['content'])
            except Exception as err:
                # print(str(err)+" skip "+str(cate["scate"])+" news")
                continue
            # 查询是否已存在该条新闻
            save_item=db.sina_news.find_one({"news_id":news["news_id"]})
            if save_item is None:
                news['expire']=datetime.utcnow()
                db.sina_news.insert(news)
        # print("已爬完"+str(cate["scate"]))
    print("Sina NBA,CBA,FIFA completed!")