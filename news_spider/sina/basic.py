from lxml import etree
from datetime import datetime
import sys
import pymongo
import json
import re
sys.path.append("..")
from getPage import get_page_decode
from wordSegment import wordSegment

connect=pymongo.MongoClient('127.0.0.1',27017)
db=connect.news_collect

time_reg=re.compile(r'\d+-\d+-\d+ \d+:\d+')

MAINTHEME=[
    {
        "ch":"tech",
        "category":"tech"
    },
    {
        "ch":"news",
        "category":"news"
    },
    {
        "ch":"finance",
        "category":"finance"
    },
    {
        "ch":"sports",
        "category":"sports"
    },
    {
        "ch":"ent",
        "category":"entertainment"
    },
    {
        "ch":"mil",
        "category":"army"
    }
]

def getBasicNews():
    print("Begin to get sina basic")
    for cate in MAINTHEME:
        for page in range(1,10):
            data=get_page_decode("https://interface.sina.cn/ent/feed.d.json?ch="+cate["ch"]+"&page="+str(page))
            items=json.loads(data)['data']
            for news in items:
                if news['docID']=="":
                    continue
                news['category']=cate["category"]
                news['cTime']=news['date']
                # 获取详情页
                try:
                    detail=get_page_decode(news['link'])
                    article=etree.HTML(detail).xpath("//section[@data-sudaclick='articleContent']")[0]
                    # 带有绝对时间的标签
                    timeExtra=article.xpath("//article[@class='art_title_op']/time")[0].text
                    time=time_reg.search(timeExtra)
                    if time:
                        time=time.group()
                    else:
                        time=timeExtra
                    news['cdateTime']=time
                    news['content']=""
                    content=article.xpath('''//section[@class='art_pic_card']|//p[@class='art_t']
                    |//section[@class='video_module']|//div[@class='img_wrapper']''')
                    # 新闻主体内容
                    for cont in content:
                        if cont is not None:
                            news['content']+=etree.tounicode(cont)
                    # 新闻特征统计
                    news['feature']=wordSegment(news['content'])
                except Exception as err:
                    # print(str(err)+" and skip "+str(cate)+" news")
                    continue
                # 查询是否已存在该条新闻
                save_item=db.sina_news.find_one({'docID':news['docID']})
                if save_item is None:
                    news['expire']=datetime.utcnow()
                    db.sina_news.insert(news)
        # print("已爬完"+str(cate["category"]))
    print("Sina basic completed")