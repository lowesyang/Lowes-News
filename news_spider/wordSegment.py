import jieba.posseg as pseg

escapeWords=['cimg','img','align','center','http','s','net','jpg',
'src','https','p','h1','h2','h3','h4','h5','href','a','b','c','d',
'e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u',
'v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N',
'O','P','Q','R','S','T','U','V','W','X','Y','Z''pic','html','xhtml','jsp',
'php','picurl','div','em','br','com','cn','edu','css','png',
'gif','jpeg','class','content','art']

def wordSegment(str):
    feature={}
    words = pseg.cut(str)
    for word,flag in words:
        # 是否为名词素
        if 'n' in flag and word not in escapeWords and len(word)<10:
            if word in feature:
                feature[word] += 1
            else:
                feature[word] = 1
    return feature