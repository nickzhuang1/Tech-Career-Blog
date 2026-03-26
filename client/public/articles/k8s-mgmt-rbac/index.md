![](./images/img_001.png)

## \[Day26\] k8s管理篇延伸與EKS（二）：Resource Quota、Namespace、RBAC

Author: Nick Zhuang
Type: kubernetes

## 前言

昨天我們看完了管理篇的上卷，今天我們要接續昨天的進度，繼續朝下卷邁進。

管理篇（上）：服務、監控（昨天）

管理篇（下）：資源控制、虛擬集群、使用者管理、RBAC（今天）

複習傳送門：

[\[Day14\] k8s管理篇（一）：Monitoring、Job、CronJob](https://nick-zhuang.notion.site/1f0d2b68726680d0995bfe1b9a6008a0?pvs=25)

[\[Day15\] k8s管理篇（二）：Resource Quota、Namespaces](https://nick-zhuang.notion.site/1f0d2b687266804a9236faaaaeefe4cb?pvs=25)

[\[Day17\] k8s管理篇（三）：User Management、RBAC、Node Ｍaintenance](https://nick-zhuang.notion.site/1f0d2b687266803096d7f86170e1ca3c?pvs=25)

## 管理篇（下）

我們要先探討關於Resource Quota和NameSpace的整合範例

### 示例一：Resource Quota 和 Namespace

值得一提的是，EKS預設Resource Quota是開啟的，不用另外啟動，與minikube不同

我們先新增一個YAML

​

接著apply它

​

#### 沒有Resource Quota的Deployment

新增一個沒有設置Resource Quota的Deployment

​

接著apply它

​

檢查Pod狀態

​

檢查Deployment狀態

​

這是因為沒有設置，所以不能調度

先把Deployment關掉

​

#### 有Resource Quota的Deployment

我們修改下Deployment的內容

​

接著我們apply它

​

檢查Pod狀態

​

有了，要設置Resource Quota的Deployment才能用！

如果Namespace沒有要用的話，可以

​

這樣就會把myspace底下所有相關的資源一併刪除。

OK，測試成功！

### 示例二：User management、RBAC

我們前面有講過EKS預設就已經將RBAC啟動

新增兩個檔案

Private Key

​

Certificate

​

檢查既有的設定

​

接著新增nick這個使用者

​

檢查更新的設定

​

顯示當前使用者

​

切換到nick

​

顯示當前使用者

​

使用者nick操作集群

​

這是還沒有設定權限造成的

接著我們幫nick新增權限

新增一個Role

​

新增一個RoleBinding

​

先切回AWS的EKS管理員

​

接著啟動Role和RoleBinding

​

檢查Role和RoleBinding的狀態

​

詳細看Role和RoleBinding的狀態

​

有看到nick這個使用者註冊上去了！

接著我們切換使用者，換成nick試試

​

唷！沒有授權，這應該是AWS的關係

我們修改下~/.kube/config，增加exec的Block內容

​

這個是讓能使用aws-iam-authenticator去認證

接著我們在操作一次

​

可以用了，我們把它恢復原狀

​

測試結束。

## 小結

今天我們已經將AWS上的管理篇內容做個結束，相信讀者有不少體會，隨著30天邁入尾聲，我們會開始介紹AWS上的k8s應用篇，以及一些相關群集整體的內容，有些整合性的內容會開始放上來，敬請期待，我們明天見囉～

## 參考資料

[Resource Quota簡介](https://kubernetes.io/zh/docs/concepts/policy/resource-quotas/)

[Namespace簡介](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/)

[k8s基於RBAC的用戶管理](https://medium.com/@HoussemDellai/rbac-with-kubernetes-in-minikube-4deed658ea7b)

[k8s的RBAC授權](https://nicksors.cc/2019/07/09/kubernetes%E7%B3%BB%E5%88%97%E4%B9%8B%E3%80%8Ak8s%E5%9F%BA%E4%BA%8ERBAC%E7%9A%84%E6%8E%88%E6%9D%83%E3%80%8B.html)

[k8s的授權](https://kubernetes.io/zh/docs/reference/access-authn-authz/authorization/)

[Unauthorized排錯](https://github.com/kubernetes-sigs/aws-iam-authenticator/issues/105)

[AWS新增RBAC的User詳細步驟](https://eksworkshop.com/intro_to_rbac/)

