# 新浪游戏
from lxml import etree
from datetime import datetime
import pymongo
import json
import re
import uuid
import sys
sys.path.append("..")
from getPage import get_page_decode
from wordSegment import wordSegment

connect=pymongo.MongoClient('mongodb://lowesyang:19951102@115.159.147.165:27017')
db=connect.news_collect

time_reg=re.compile(r'\d+-\d+-\d+ \d+:\d+')
GAMES=[
    {
        "link":"http://games.sina.cn/interface/2016_game_wap_home_mid_list_in.shtml?fid=1&page=1&pageSize=100",
        "scate":"online"
    },
    {
        "link":"http://games.sina.cn/interface/2016_game_wap_home_mid_list_in.shtml?fid=3&page=1&pageSize=100",
        "scate":"mobile"
    },
    {
        "link":"http://games.sina.cn/interface/2016_game_wap_home_mid_list_in.shtml?fid=2&page=1&pageSize=100",
        "scate":"PC"
    }
]

def getGameNews():
    print("Begin to get sina games")
    for game in GAMES:
        data=get_page_decode(game["link"])
        data=etree.HTML(json.loads(data[9:-1])["result"]["data"])

        links=data.xpath("//a")
        title_img=data.xpath("//img")
        for i in range(0,len(links)):
            news={}
            news["link"]=links[i].attrib["href"]
            news["img"]=title_img[i].attrib["src"]
            news["source"]="新浪游戏"
            news["category"]="game"
            news["scate"]=game["scate"]
            try:
                detail=etree.HTML(get_page_decode(news["link"]))
                # 新闻标题
                news["title"]=detail.xpath("//div[@class='articleTitle']/h1")[0].text
                # 发布时间
                time=time_reg.search(detail.xpath("//p[@class='prot']/span")[0].text)
                if time:
                    news["cdateTime"]=time.group()
                else:
                    news["cdateTime"]=""
                # 新闻内容
                content=detail.xpath("//div[@id='j_articleContent']")[0]
                content=content.xpath("p|div")
                news["content"]=""
                for cont in content:
                    if cont is not None:
                        news["content"]+=etree.tounicode(cont)
                # 新闻特征统计
                news['feature']=wordSegment(news['content'])
            except Exception as err:
                # print(str(err)+" skip game news")
                continue
            # 生成uuid
            news["docID"]=uuid.uuid3(uuid.NAMESPACE_DNS,news["content"])
            # 查询是否已存在该记录
            save_item=db.sina_news.find_one({"docID":news["docID"]})
            if save_item is None:
                news['expire']=datetime.utcnow()
                db.sina_news.insert(news)
        # print("已爬完"+str(game["scate"]))
    print("Sina game completed!")