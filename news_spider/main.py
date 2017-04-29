import multiprocessing
import sys
from netease import netease
from sohu import sohu
sys.path.append('sina')
from sina import sina

if __name__ == '__main__':
    p1=multiprocessing.Process(target=netease)
    p2=multiprocessing.Process(target=sohu)
    p3=multiprocessing.Process(target=sina)

    p1.start()
    p2.start()
    p3.start()
