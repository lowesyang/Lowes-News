# 网易新闻

from lxml import etree
from getPage import get_page_decode
import pymongo
import json
import re

connect=pymongo.MongoClient('127.0.0.1',27017)
db=connect.news_collect

url_reg=re.compile(r'(http)|(https)')

URL=[
    {
        "url":"http://3g.163.com/touch/article/list/BBM54PGAwangning/0-200.html",
        "category":"news",
        "key":"BBM54PGAwangning"
    },
    {
        "url":"http://3g.163.com/touch/article/list/BA8E6OEOwangning/0-200.html",
        "category":"sports",
        "key":"BA8E6OEOwangning"
    },
    {
        "url":"http://3g.163.com/touch/article/list/BA10TA81wangning/0-200.html",
        "category":"entertainment",
        "key":"BA10TA81wangning"
    },
    {
        "url":"http://3g.163.com/touch/article/list/BA8EE5GMwangning/0-200.html",
        "category":"finance",
        "key":"BA8EE5GMwangning"
    },
    {
        "url":"http://3g.163.com/touch/article/list/BA8D4A3Rwangning/0-200.html",
        "category":"tech",
        "key":"BA8D4A3Rwangning"
    },
    {
        "url":"http://3g.163.com/touch/article/list/BAI6RHDKwangning/0-200.html",
        "category":"game",
        "key":"BAI6RHDKwangning"
    },
    {
        "url":"http://3g.163.com/touch/reconstruct/article/list/BAI67OGGwangning/0-200.html",
        "category":"army",
        "key":"BAI67OGGwangning"
    },
    {
        "url":"http://3g.163.com/touch/article/list/BAI6I0O5wangning/0-200.html",
        "category":"phone",
        "key":"BAI6I0O5wangning"
    }
]

def netease():
    print("开始爬取网易新闻")
    for k in range(0,len(URL)):
        try:
            data=get_page_decode(URL[k]['url'])
        except Exception as err:
            # print(err)
            continue
        json_str=data[9:-1]
        items=json.loads(json_str)[URL[k]['key']]
        for news in items:
            news['category']=URL[k]["category"]
            # 获取详情页
            try:
                if url_reg.search(news['url']):
                    detail=get_page_decode(news['url'])
                else:
                    continue
                content=etree.HTML(detail).xpath("//div[@class='content']")[0]
            except Exception as err:
                # print(err)
                continue
            # 此处不能用tostring，否则会有乱码，mongodb将当成binary来处理
            content=etree.tounicode(content)    
            news['content']=content
            # 查询是否已存在该条新闻
            save_item=db.netease_news.find_one({'docid':news['docid']})
            if save_item is None:
                db.netease_news.insert(news)
        # print("已爬完"+URL[k]['category'])
    print("netease completed!")

if __name__=='__main__':
    netease()
