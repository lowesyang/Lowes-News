import multiprocessing
import sys,time
from netease import netease
from sohu import sohu
sys.path.append('sina')
from sina import sina
import pymongo

connect=pymongo.MongoClient('127.0.0.1',27017)
db=connect.news_collect

expireTime=3600*24*12

if __name__ == '__main__':
    p1=multiprocessing.Process(target=netease)
    p2=multiprocessing.Process(target=sohu)
    p3=multiprocessing.Process(target=sina)

    db.netease_news.ensure_index([("expire",-1)],expireAfterSeconds=expireTime)
    db.sina_news.ensure_index([("expire",-1)],expireAfterSeconds=expireTime)
    db.sohu_news.ensure_index([("expire",-1)],expireAfterSeconds=expireTime)
    p1.start()
    p2.start()
    p3.start()
    while True:
        time.sleep(3600)
        p1.run()
        p2.run()
        p3.run()
