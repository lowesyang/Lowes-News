# 新浪新闻
from basic import getBasicNews
from NBACBAFIFA import getNBACBAFIFA
from game import getGameNews
import multiprocessing

def sina():
    p1=multiprocessing.Process(target=getBasicNews)
    p2=multiprocessing.Process(target=getNBACBAFIFA)
    p3=multiprocessing.Process(target=getGameNews)

    p1.start()
    p2.start()
    p3.start()


if __name__ == '__main__':
    sina()