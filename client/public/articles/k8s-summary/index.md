![](./images/img_001.png)

# [Day30] k8s總結：架構整合、圖表整理

## 前言

今天我們來詳細回顧一下之前的內容，整理一些圖表及架構方便記憶。

## 正片開始

這30天我們看過了許多k8s的相關結構，有以下四個方面：四大面向、k8s架構、k8s與k8s之間、k8s延伸

### 1. 四大面向

從最早的介紹，我們從4個不同的面向去理解k8s：

![以 k8s 為中心、周圍標出 Docker、Node、Object、12-factor 四大面向的概念示意圖](./images/img_002.png)

Docker：這個部分是指k8s是基於Docker的容器管理框架，並且在一些指令的操作上面與Docker本身重疊。

[\[Day1\]挑戰開始：k8s初探＋簡介](https://nickzhuang.com/posts/k8s-intro)

[\[Day2\]一日碼頭工：快速Docker複習](https://nickzhuang.com/posts/docker-review)

[\[Day4\]碼頭工的日常與舵手的逆襲：Docker與k8s常用指令集比較](https://nickzhuang.com/posts/docker-vs-k8s-commands)

Node：這個部分是從節點的觀點去觀察k8s，Node分為Master和Slave，並可以在細化下去區分，因為Node的種類不同，所以會有不同的結構。

[\[Day5\]淺談k8s架構之一：Node是什麼？Master與Slave有何不同？](https://nickzhuang.com/posts/k8s-node-master)

Object：這個部分是從k8s的細部架構去看，這跟基礎篇、進階篇、管理篇的內容都有關。

[\[Day6\]淺談k8s架構之二：什麼是Object？什麼是Abstraction？有何不同？](https://nickzhuang.com/posts/k8s-abstraction)

12-factor：這個部分是以DevOps的角度去切入，嘗試觀察k8s在其中所扮演的角色，其中的12-factor還可以分為幾個不同的面向去看

[\[Day7\]想想我們為何而來：一個完整DevOps開發流程的十二個要素](https://nickzhuang.com/posts/devops)

再來的部分，就是k8s詳細的結構了

### 2. k8s架構

這個部分，分為上下兩卷，上卷是minikube的相關操作，下卷是EKS的相關操作

卷（上）

基礎篇：

[\[Day3\]k8s的小型測試環境：minikube安裝與使用，簡易驗證yaml的正確性](https://nickzhuang.com/posts/k8s-minikube)

[\[Day8\]k8s基礎篇（一）：Pod、Label、Health check、Scaling](https://nickzhuang.com/posts/k8s-pod-label)

[\[Day9\]k8s基礎篇（二）：Deployment、ReplicaSet、Service、Secrets](https://nickzhuang.com/posts/k8s-deploy-svc)

進階篇：

[\[Day10\]k8s進階篇（一）：Service Discovery、ConfigMap](https://nickzhuang.com/posts/k8s-svc-discovery)

[\[Day11\]k8s進階篇（二）：Ingress、Volume、PodPreset](https://nickzhuang.com/posts/k8s-ingress-vol)

[\[Day12\]k8s進階篇（三）：StatefulSet、DaemonSet](https://nickzhuang.com/posts/k8s-statefulset)

[\[Day13\]k8s進階篇（四）：Affinity and Anti-Affinity、Taints and Tolerations](https://nickzhuang.com/posts/k8s-affinity)

管理篇：

[\[Day14\]k8s管理篇（一）：Monitoring、Job、CronJob](https://nickzhuang.com/posts/k8s-monitoring-job)

[\[Day15\]k8s管理篇（二）：Resource Quota、Namespaces](https://nickzhuang.com/posts/k8s-quota-ns)

[\[Day17\]k8s管理篇（三）：User Management、RBAC、Node Ｍaintenance](https://nickzhuang.com/posts/k8s-user-mgmt)

應用篇：

[\[Day16\]k8s之PV小整合：Pod、Deployment、Service、Job與PersistentVolume](https://nickzhuang.com/posts/k8s-pv-pod)

[\[Day18\]k8s之管理篇延伸：兩個H的小故事：Harbor與Helm](https://nickzhuang.com/posts/k8s-harbor-helm)

卷（下）

基礎篇：

[\[Day19\]k8s上雲端之路：AWS之蓄勢待發：EOO](https://nickzhuang.com/posts/k8s-aws-eoo)

[\[Day20\]k8s實務篇（一）：EKS架設k8s（上）](https://nickzhuang.com/posts/k8s-eks-setup-1)

[\[Day21\]k8s實務篇（二）：EKS架設k8s（下）](https://nickzhuang.com/posts/k8s-eks-setup-2)

[\[Day22\]k8s基礎篇延伸與EKS：Pod、Label、Probe、Scaling](https://nickzhuang.com/posts/k8s-pod-basics)

進階篇：

[\[Day23\]k8s進階篇延伸與EKS（一）：Ingress、ELB、Service](https://nickzhuang.com/posts/k8s-ingress-elb)

[\[Day24\]k8s進階篇延伸與EKS（二）：Affinity、Taint、Cordon](https://nickzhuang.com/posts/k8s-scheduling)

管理篇：

[\[Day25\]k8s管理篇延伸與EKS（一）：Service Discovery、Dashboard、Monitoring](https://nickzhuang.com/posts/k8s-mgmt-discovery)

[\[Day26\]k8s管理篇延伸與EKS（二）：Resource Quota、Namespace、RBAC](https://nickzhuang.com/posts/k8s-mgmt-rbac)

應用篇：

[\[Day27\]k8s應用篇（一）：Helm部署apps、HPA和CA](https://nickzhuang.com/posts/k8s-app-helm)

[\[Day28\]k8s應用篇（二）：EBS和EFS的使用](https://nickzhuang.com/posts/k8s-app-ebs-efs)

### 3. k8s與k8s之間

這個部分是群集與集群之間溝通的內容，我們有提到集群的備援：HA、Federation

[\[Day29\]k8s集群篇：HA、Federation](https://nickzhuang.com/posts/k8s-cluster-ha)

### 4. k8s之延伸

雖然我們從剛開始到現在有介紹過很多與k8s相關的套件，避免疏漏，補個生態圖，鑑往知來。

![Kubernetes 生態圖，依 Public cloud、Management、Monitoring 等面向列出對應廠商與工具](./images/img_003.png)

圖片來源： [https://spotinst.com/blog/kubernetes-ecosystem/](https://spotinst.com/blog/kubernetes-ecosystem/)

可以看到主要有七大面向：

Public cloud：公有雲，可以看到對應的廠商，像是我們有用到EKS所屬的AWS

Open source frameworks：開源框架，像是我們提過的Docker

Management：管理工具，像是我們有安裝過的WeaveScope就是屬於weaveworks的範疇

Monitoring & Logging：監控與日誌，像是一般常見的搭配Prometheus使用的Grafana

Load Balancing：負載平衡器，像是我們有用過的nginx

Security：安全防護，像是BLACKDUCK，可以協助檢查開放原始碼的漏洞

Tools：小工具，像是GitLab，這是Local端的git管理工具

這個部分會跟後續k8s的發展有關聯，後續這些相關面向的更新，都值得我們密切關注。

## 總結

所以從整體來看，k8s可以有多個Federation，而單個Federation可以分有多個Cluster，每個Cluster可以分為四大方面去觀察：Docker、Node、Object、12-factor，再依照這四大方面下去細分對應的項目去看，一致性的邏輯是這樣。

Docker：k8s是基於Docker的管理框架

![Docker 與 k8s 的架構示意圖，圖中標出 Google Cloud、AWS、AliCloud 等雲端環境與 app、web service 等元件](./images/img_004.png)

圖片來源： [https://medium.com/@dpaunin/the-best-architecture-with-docker-and-kubernetes-myth-or-reality-77b4f8f3804d](https://medium.com/@dpaunin/the-best-architecture-with-docker-and-kubernetes-myth-or-reality-77b4f8f3804d)

Node：分為Master和Slave

![k8s 架構圖：Master 端 kube-apiserver、kube-scheduler，Slave 端 kubelet、kube-proxy](./images/img_005.png)

Object：分為basic和Abstraction

![k8s Object 分類圖，分 basic 與 Abstraction 兩層，列出 Pod、Service、Deployment 等物件](./images/img_006.png)

12-factor：五大Aspect：Unify、Specify、Conform、Auto、Sync

![12-factor 對照圖，以 Unify、Specify、Conform、Auto 等 Aspect 分欄列出對應項目](./images/img_007.png)

## 小技巧

這邊歸納了一些Docker與k8s使用的小技巧

首先，安裝完後，為了方便，你可以增加些設置加速你下指令的速度

設置Auto Complete

參考Cheat Sheet

使用一些圖像介面監控和管理

### 設置Auto Complete

可以參考： [Mac設置Docker的AutoComplete](https://blog.alexellis.io/docker-mac-bash-completion/)

或是自行Google，找這個關鍵字

### 參考Cheat Sheet

可以參考： [Docker的一些筆記](https://github.com/miendinh/docker-notes)、 [k8s的Cheat Sheet與Auto Complete](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)

### 圖像介面監控與管理

可以參考：Docker的Harbor（管理Private registry）、k8s的Dashboard（監控元件好用）、k8s的Helm（管理YAML）

## 心得感想

剛開始寫幾天基本上沒什麼感覺，因為有先寫了大概10篇左右，不過到後面發現根本不夠用XD，上班忙起來整個就翻掉，中途差點翻船，不外乎Debug到半夜三四點，隔天還是要上班（肝到爆，後面總算是有些多餘的時間挺過來了，還有一次忘記把EKS集群關掉，多噴了三天的摳摳，比較有挑戰的部分應是你必須要在有限的時間把Bug修掉，不然就不用發文啦哈哈，直接Say Goodbye，有想挑戰的朋友，建議先寫個20篇再來會比較穩，有機會的話，可能會再寫些別的主題看看。整體來說，這整個30篇大概歸類在入門到進階之間，如下圖：

![以入門、進階、精通、專家四個等級標示的技能程度示意圖，用來指出這 30 篇內容的落點](./images/img_008.png)

第一次發系列文，希望這一系列的文章有幫助到需要的朋友，筆者盡量呈現整體的完整性，若有誤請見諒，程式碼可以在Github下載，謝謝大家的收看囉！

文末的參考連結已將所有架構性或是實作相關內容，筆者覺得寫得不錯的部分一併分享，感謝提供靈感，謝謝你們。

另外特別感謝同事揪團，沒有你們我也不會去寫這個XD，雖然我們團賽出了點小狀況，有機會再一起挑戰！

## 參考連結

- [k8s的設計與架構](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/architecture/architecture.md)
- [k8s的發展藍圖](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/architecture/architectural-roadmap.md)
- [k8s相關的生態網架構圖](https://spotinst.com/blog/kubernetes-ecosystem/)
- [EKS的workshop](https://eksworkshop.com/introduction/)
- [k8s中文指南](https://jimmysong.io/kubernetes-handbook/)
- [k8s的DIY](https://k2r2bai.com/tags/Kubernetes/)
- [k8s官方文檔](https://kubernetes.io/docs/home/)
- [k8s的30天筆記](https://nickzhuang.com/posts)

最後一天了，很開心有寫滿完整的30天，我想分享一句話：

生命的痕跡，來自於靈魂的永恆淬煉。

The trace of life is from the eternal quenching of soul.

各位看官，我是尼克，我們有緣再見。
