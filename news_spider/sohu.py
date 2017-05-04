# 搜狐新闻

from lxml import etree
from getPage import get_page
from datetime import datetime
from wordSegment import wordSegment
import pymongo
import json
import uuid
import re
import time

connect=pymongo.MongoClient('127.0.0.1',27017)
db=connect.news_collect

time_reg=re.compile(r'\d+-\d+ \d+:\d+')
# 当前时间、年、月
time_now=time.localtime()
month_now=time_now.tm_mon
year_now=time_now.tm_year

CATEGORY=[
    {
        "cate":2,
        "name":"news"
    },
    {
        "cate":3,
        "name":"sports"
    },
    {
        "cate":4,
        "name":"entertainment"
    },
    {
        "cate":5,
        "name":"finance"
    },
    {
        "cate":7,
        "name":"tech"
    },
    {
        "cate":8,
        "name":"army"
    }
]

def sohu():
    print("Begin to get sohu news")
    for k in range(0,len(CATEGORY)):
        for page in range(1,20):
            data=get_page("http://m.sohu.com/cr/"+str(CATEGORY[k]['cate'])+"/?page="+str(page)+"&v=2")
            html=etree.HTML(data)
            news_link=html.xpath("//div[@class='ls']//a")
            for link in news_link:
                item={}
                item['category']=CATEGORY[k]['name']
                item['title']=link.text
                url="http://m.sohu.com"+link.attrib["href"]
                item['url']=url
                try:
                    detail=get_page(url)
                    if detail is None:
                        continue
                    article=etree.HTML(detail).xpath("//article")[0]
                    timeRes=article.xpath("div[@class='article-info clearfix']/span")
                    time=time_reg.search(timeRes[0].text)
                    if time:
                        item['time']=time.group()
                    else:
                        item['time']=timeRes[1].text
                    
                    # 新闻的月份
                    month=int(item['time'][0:2])
                    if month>month_now:
                        # 去年的新闻
                        item['time']=str(year_now-1)+"-"+item['time']
                    else:
                        item['time']=str(year_now)+"-"+item['time']

                    content=article.xpath("//p[@class='para']|//div[@class='media-wrapper']/div[@class='image']")
                except Exception as err:
                    # print(err)
                    continue
                item['content']=""
                for j in range(0,len(content)):
                    if content[j] is not None:
                        # 去除<i>标签
                        itag=content[j].xpath("i")
                        for tag in itag:
                            content[j].remove(tag)
                        item['content']+=etree.tounicode(content[j])
                item['docID']=uuid.uuid3(uuid.NAMESPACE_DNS,item['content'])
                item['source']="搜狐网"
                # 新闻特征统计
                item['feature']=wordSegment(item['content'])
                # 查询是否已存在该条记录
                save_item=db.sohu_news.find_one({'docID':item['docID']})
                if save_item is None:
                    item['expire']=datetime.utcnow()
                    db.sohu_news.insert(item)
                # print(item)
        # print("已爬完"+str(CATEGORY[k]['name']))
    print("sohu completed!")

if __name__ == '__main__':
    sohu()