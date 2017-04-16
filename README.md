# LianjiaAgent
用于搜集链家([http://bj.lianjia.com/]([http://bj.lianjia.com/))网站上的房源成交信息，要买房子的小伙伴看过来。


## 安装
1. 安装**Node.js**

2. 获取**LianjiaAgent**

		git clone https://github.com/yrjyrj123/LianjiaAgent.git

3. 安装依赖	
		
		cd LianjiaAgent
		npm install

## 如何使用
使用如下命令开始爬取：

	node ./Lianjia.js

如果一切正常，应该看到类似的输出

	Start running ...
	There are about 614196 records
	Done
	
爬虫会在**LianjiaAgent**目录下生成**Lianjia.csv**，包含带有表头的CSV数据

## 注意事项

* 链家的服务器使用了**AWS Elastic Load Balancing**的负载均衡，通过DNS来切换服务器，为了减少DNS请求数量，提高效率，代码中进行了DNS cache，但是这样会导致负载均衡不起作用，代码已经限制了请求速率，避免影响服务器。

* 虽然数据是链家公开，但还是属于链家的，搜集到的数据请仅自己参考，不要用于其他目的。
