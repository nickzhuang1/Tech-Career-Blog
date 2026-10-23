# 摘要核對清單（P2-2）

`excerpt` 同時是**卡片摘要**、**meta description**、**og:description** 與 **RSS 描述**，會出現在搜尋結果與社群分享的第一眼位置。這份清單列出 79 篇的「原 → 新」對照，方便逐篇核對。

**改寫原則**

- 只摘要內文既有內容，不新增文章沒有的結論或數據
- 不重複標題
- 開頭放具體鉤子（數字、場景、痛點），結尾放讀者能得到什麼
- 保留原本的口語語氣
- 長度 80–110 字（中文 SERP 大約這個區間最不容易被截斷）

> 核對完可以直接刪掉這份檔案，它只是核對用。

---

## K8S & Docker（2019 鐵人賽）

共 30 篇

### 1. `devops` — 想想我們為何而來：一個完整 DevOps 開發流程的十二個要素

- **原**（25 字）：探討完整 DevOps 開發流程的十二個關鍵要素。
- **新**（109 字）：講完 Docker 與 k8s 架構後，回頭看整個 DevOps 流程長什麼樣子。這篇用十二個要素（Codebase、Dependencies、Config 等）拆解從寫程式到部署的完整流程，說明 k8s 站在哪一段。

### 2. `docker-review` — 一日碼頭工：快速 Docker 複習

- **原**（41 字）：快速複習 Docker 的核心概念，為後續的 Kubernetes 學習打下基礎。
- **新**（87 字）：要理解 k8s 好在哪，得先回到 Docker 把觀念補齊。這篇快速複習容器、映像與相依性管理，說明單機部署的限制在哪，也為後面三十天的 Kubernetes 內容先打好底。

### 3. `docker-vs-k8s-commands` — 碼頭工的日常與舵手的逆襲：Docker 與 k8s 常用指令集比較

- **原**（30 字）：Docker 與 Kubernetes 常用指令的完整比較。
- **新**（89 字）：用了 Docker 再看 k8s，最常見的困惑就是「那我原本那些指令怎麼辦」。這篇把兩邊的常用指令並排對照，說明哪些習慣可以沿用、哪些要換成 kubectl，最後附上指令速查表。

### 4. `k8s-abstraction` — 淺談 k8s 架構之二：什麼是 Object？什麼是 Abstraction？

- **原**（41 字）：理解 Kubernetes 中 Object 與 Abstraction 的差異。
- **新**（102 字）：k8s 裡的 Object 與 Abstraction 常被混著講，但兩者不在同一個層次。這篇先回顧節點架構，再說明每個 Pod 為何都要有自己的 YAML，以及抽象化讓 k8s 能管住這麼多資源的關鍵。

### 5. `k8s-affinity` — k8s 進階篇（四）：Affinity and Anti-Affinity、Taints and Tolerations

- **原**（29 字）：Kubernetes 調度器的進階配置：親和性與污點容忍。
- **新**（98 字）：調度器預設會自己挑節點，但真實場景常需要指定：哪些服務該靠近、哪些絕對不能放一起。這篇說明 Node 與 Pod 的親和／反親和性怎麼設定，以及 Taints 與 Tolerations 的搭配。

### 6. `k8s-app-ebs-efs` — k8s 應用篇（二）：EBS 和 EFS 的使用

- **原**（37 字）：在 Kubernetes 中使用 AWS EBS 和 EFS 持久化儲存。
- **新**（91 字）：一個整合案例：把 WordPress 與 MySQL 一起跑在 k8s 上，資料要能持久化與共享。這篇分別用 EBS 與 EFS 兩種方式實作，比較它們在儲存特性與適用情境上的差別。

### 7. `k8s-app-helm` — k8s 應用篇（一）：Helm 部署 apps、HPA 和 CA

- **原**（28 字）：使用 Helm 部署應用與 HPA/CA 自動擴縮配置。
- **新**（88 字）：應用篇上篇：用 Helm 把應用部署到叢集上，再設定 HPA（水平自動擴縮）與 Cluster Autoscaler 讓資源跟著流量調整，最後把 Istio 也部署進 k8s。

### 8. `k8s-aws-eoo` — k8s 上雲端之路：AWS 之蓄勢待發：EOO

- **原**（29 字）：將 Kubernetes 部署到 AWS 雲端的準備工作。
- **新**（110 字）：上雲端之前得先認識 CCM（Cloud Controller Manager）：它讓各家雲端的實作與 k8s 核心脫鉤。這篇介紹 AWS 上會用到的元件（EC2、EBS、ELB、EFS、EKS 等），並實際操作 EC2。

### 9. `k8s-cluster-ha` — k8s 集群篇：HA、Federation

- **原**（35 字）：Kubernetes 高可用架構與 Federation 多集群管理。
- **新**（99 字）：叢集層級的兩個題目：HA 講的是主節點備援，讓叢集不會因為單點故障倒下；Federation 則是跨叢集溝通與部署。這篇拿 minikube 與 AWS 對照說明，並實作一次 Federation。

### 10. `k8s-deploy-svc` — k8s 基礎篇（二）：Deployment、ReplicaSet、Service、Secrets

- **原**（45 字）：深入了解 Deployment、ReplicaSet、Service 與 Secrets。
- **新**（104 字）：基礎篇第二課：Deployment 與 ReplicaSet 怎麼管理副本數量、版本更新的滾動過程、出問題時怎麼 rollback，以及 Service 如何把流量導到正確的 Pod，還補上 Secrets。

### 11. `k8s-eks-setup-1` — k8s 實務篇（一）：EKS 架設 k8s（上）

- **原**（30 字）：使用 AWS EKS 架設 Kubernetes 集群上篇。
- **新**（84 字）：實務篇上篇，把 k8s 叢集真的架到 AWS 上。內容包含 AWS 的基礎設置（IAM、網路與權限），以及建立 EKS 的控制介面；因為步驟偏多，整個流程拆成上下兩篇。

### 12. `k8s-eks-setup-2` — k8s 實務篇（二）：EKS 架設 k8s（下）

- **原**（30 字）：使用 AWS EKS 架設 Kubernetes 集群下篇。
- **新**（83 字）：實務篇下篇，接續把叢集收尾：安裝與設定 kubectl、確認 Ubuntu 工作節點的 IP，並登入 EC2 的工作節點做驗證，讓上篇建好的控制介面真的能指揮到節點。

### 13. `k8s-harbor-helm` — k8s 之管理篇延伸：Harbor 與 Helm

- **原**（27 字）：Harbor 私有容器倉庫與 Helm 套件管理工具。
- **新**（99 字）：k8s 是架在 Docker 之上的，所以不少 Docker 時代的管理工具也能沿用或改造。這篇介紹兩個關鍵套件：Harbor 當私有容器倉庫、Helm 當套件管理器，都以 Ubuntu 為例示範。

### 14. `k8s-ingress-elb` — k8s 進階篇延伸與 EKS（一）：Ingress、ELB、Service

- **原**（32 字）：在 EKS 上配置 Ingress、ELB 與 Service。
- **新**（105 字）：進階篇延伸到 AWS，先看 minikube 與 EKS 差在哪。這篇在既有叢集上實作 traefik Ingress，目標是透過 Ingress 拿到 AWS 的 ALB，順帶把 Service 一起串起來。

### 15. `k8s-ingress-vol` — k8s 進階篇（二）：Ingress、Volume、PodPreset

- **原**（43 字）：Kubernetes Ingress 路由、Volume 儲存與 PodPreset。
- **新**（90 字）：這篇講兩件影響整個叢集規劃的事：Ingress 負責把外部流量導進叢集，Volume 則決定資料要放在哪裡。文中示範降低負載與完美分流兩種情境，也補上 PodPreset 的用法。

### 16. `k8s-intro` — k8s 初探＋簡介

- **原**（39 字）：Kubernetes 入門簡介，了解容器編排的基本概念與 K8S 的核心架構。
- **新**（94 字）：從公司的轉型需求講起：為什麼會從虛擬機走到 Docker，又為什麼需要 Kubernetes 來管這些容器。這篇介紹 K8S 是什麼、它解決什麼問題、整體架構長什麼樣，以及有哪些核心元件。

### 17. `k8s-mgmt-discovery` — k8s 管理篇延伸與 EKS（一）：Service Discovery、Dashboard、Monitoring

- **原**（36 字）：在 EKS 上的服務發現、Dashboard 與 Monitoring。
- **新**（96 字）：管理篇延伸到 EKS，比較同樣的操作在 AWS 與 minikube 上的差異。這篇處理服務發現、把 k8s Dashboard 架起來，以及安裝 Weave Scope 來看叢集的即時狀態。

### 18. `k8s-mgmt-rbac` — k8s 管理篇延伸與 EKS（二）：Resource Quota、Namespace、RBAC

- **原**（24 字）：在 EKS 上的資源配額、命名空間與 RBAC。
- **新**（98 字）：延續管理篇上卷，這篇把鏡頭拉到 EKS：資源配額怎麼設、命名空間怎麼切、使用者與 Service Account 怎麼管，以及 RBAC 的角色與綁定規則，補齊多人共用同一個叢集時最常缺的那一塊。

### 19. `k8s-minikube` — k8s 的小型測試環境：minikube 安裝與使用

- **原**（33 字）：使用 minikube 建立本地 Kubernetes 測試環境。
- **新**（96 字）：在正式上線之前，先在自己電腦上架一個小型的 k8s 來驗證服務，用的就是 minikube。這篇從 macOS 的虛擬化檢查、kubectl 安裝到啟動虛擬機一步步來，也說明其他系統該怎麼做。

### 20. `k8s-monitoring-job` — k8s 管理篇（一）：Monitoring、Job、CronJob

- **原**（33 字）：Kubernetes 監控、Job 與 CronJob 排程管理。
- **新**（99 字）：管理篇第一篇，從怎麼「用」叢集轉到怎麼「管」叢集。這篇介紹監控的做法（從舊版 heapster 到 Weave Scope 的安裝），以及 Job 與 CronJob 這種跑完就結束的工作怎麼定義。

### 21. `k8s-node-master` — 淺談 k8s 架構之一：Node 是什麼？Master 與 Slave 有何不同？

- **原**（38 字）：深入了解 K8S 的 Node 架構與 Master/Slave 角色分工。
- **新**（96 字）：從節點角度看 k8s 架構：Node 是實際跑 Pod 的工作機器，Master 負責調度與管理，兩者分工決定叢集能不能撐住。這篇說明 Node 的角色、它有哪些狀態，並實際操作一次節點管理。

### 22. `k8s-pod-basics` — k8s 基礎篇延伸與 EKS：Pod、Label、Probe、Scaling

- **原**（28 字）：在 EKS 上實作 Pod 管理、標籤、探針與自動擴縮。
- **新**（93 字）：叢集架好之後，把基礎篇的內容搬到 EKS 上重做一次：先看多了三個計算節點後差別在哪，再實作有標籤與狀態的 Pod、探針設定、Scaling 與版本更新，對照 minikube 的差異。

### 23. `k8s-pod-label` — k8s 基礎篇（一）：Pod、Label、Health check、Scaling

- **原**（34 字）：Kubernetes 基礎概念：Pod 管理、標籤、健康檢查與擴縮。
- **新**（83 字）：基礎篇第一課，從最小的部署單位開始：Pod 是什麼、為什麼要有 Label 來分類與選取、Health check 怎麼判斷容器還活著，以及流量進來時怎麼做水平擴縮。

### 24. `k8s-pv-pod` — k8s 之 PV 小整合：Pod、Deployment、Service、Job 與 PersistentVolume

- **原**（25 字）：Kubernetes PV 與常用資源的整合應用。
- **新**（99 字）：把前面學過的元件串起來：Pod、Deployment、Service、Job 搭配新的 PersistentVolume 與 PVC 做一次整合演練。這篇也談臨時儲存與驅逐策略在資源不足時怎麼運作。

### 25. `k8s-quota-ns` — k8s 管理篇（二）：Resource Quota、Namespaces

- **原**（23 字）：Kubernetes 資源配額與命名空間管理。
- **新**（108 字）：Resource Quota 限制的是一個叢集能分配多少 CPU、記憶體、GPU 與磁碟空間；Namespace 則是把同一個實體叢集切成多個虛擬叢集。這篇說明兩者的設定方式，以及怎麼把配額綁在命名空間上做資源分群。

### 26. `k8s-scheduling` — k8s 進階篇延伸與 EKS（二）：Scheduling

- **原**（27 字）：Kubernetes 調度器進階配置與 EKS 整合。
- **新**（101 字）：排程看起來只是「丟給調度器決定」，實際上 Affinity、Taints 與 Tolerations、Cordon 等設定都會左右結果。這篇用日常維運會遇到的例子，模擬 Pod 該怎麼被安排到正確節點。

### 27. `k8s-statefulset` — k8s 進階篇（三）：StatefulSet、DaemonSet

- **原**（33 字）：了解 StatefulSet 與 DaemonSet 的使用場景。
- **新**（103 字）：有狀態的服務不能隨便重啟，這就是 StatefulSet 存在的理由：每個 Pod 都有固定編號與身分。這篇說明它跟 Deployment 的差別、怎麼擴縮與更新，也介紹跑在每台節點的 DaemonSet。

### 28. `k8s-summary` — k8s 總結：架構整合、圖表整理

- **原**（30 字）：Kubernetes 系列總結，整合架構圖表與實務操作要點。
- **新**（81 字）：三十天系列的最終回，把整個系列收成一張總圖：四大面向、k8s 的架構、k8s 元件之間怎麼協作、以及延伸到雲端之後的差異，另外補上幾個實務上的小技巧與參賽的心得。

### 29. `k8s-svc-discovery` — k8s 進階篇（一）：Service Discovery、ConfigMap

- **原**（32 字）：Kubernetes 服務發現與 ConfigMap 配置管理。
- **新**（105 字）：進入進階篇：同一個 Pod 內的容器用 localhost 就能互通，但跨 Pod 就得靠 Service Discovery。這篇說明這機制怎麼運作、ConfigMap 怎麼把設定抽出來，並附上兩個實際範例。

### 30. `k8s-user-mgmt` — k8s 管理篇（三）：User Management、RBAC、Node Maintenance

- **原**（30 字）：Kubernetes 使用者管理、RBAC 權限與節點維護。
- **新**（102 字）：管理篇最後一篇，處理的是「誰可以做什麼」：怎麼新增一個使用者、用 Role 與 RoleBinding 給對應權限、綁定 RBAC 的實際操作，最後補上節點維護（Node Maintenance）的做法。

## Gen AI（2023 鐵人賽）

共 31 篇

### 1. `gen-ai-future` — 生成式 AI 驅動未來變革：開源工具與技術架構的雙向探索

- **原**（42 字）：探索生成式 AI 如何驅動未來的技術變革，從開源工具到企業級技術架構，雙向深入剖析。
- **新**（94 字）：受邀到台灣人工智慧協會短講，談生成式 AI 的開源工具與技術架構。這篇把當天內容整理成清單：圖像、文字、影音三類開源工具包，模型從 SD 到 Flux 的演進脈絡，以及這幾年的發展時間軸。

### 2. `aigc-evolution` — AIGC 的演進

- **原**（46 字）：從 GAN 到 Diffusion Model，回顧 AIGC 技術的演進歷程與關鍵里程碑。
- **新**（82 字）：延續前一篇的應用場景，這篇回頭補上脈絡：AI 模型是怎麼一路演進的、生成式 AI 的歷史上有哪些關鍵轉折，以及從 GAN 到 Diffusion 的演算法演進路線。

### 3. `aigc-features` — AIGC 的特色與應用

- **原**（30 字）：探討 AIGC 技術的獨特特色以及在各領域中的實際應用案例。
- **新**（87 字）：承襲 LLM 的架構，AIGC 有哪些其他技術沒有的特色？這篇從定義往外延伸，談 AIGC 在文字、圖像、影音各領域的實際應用，以及背後形成的生態系，幫你先建立一張學習地圖。

### 4. `aigc-origin` — 緣起

- **原**（37 字）：2023 鐵人賽系列的起點，分享為什麼選擇以圖像生成式 AI 為主題參賽。
- **新**（98 字）：2023 鐵人賽三十天系列的第一篇：說明為什麼選圖像生成式 AI 當主題、這三十篇要涵蓋哪些內容（從 AIGC 基礎、五大生成模型到 Stable Diffusion 實作），以及這系列適合誰讀。

### 5. `aigc-overview` — AIGC 的前世今生

- **原**（39 字）：全面回顧 AIGC 的發展歷程，從早期生成模型到現代的大型語言模型與擴散模型。
- **新**（89 字）：三十天系列的最終篇，把整趟路重看一遍：從 AIGC 的定義出發，回顧理論篇的五大生成模型與 Stable Diffusion，再整理應用篇玩過的工具與技巧，收成一張完整學習地圖。

### 6. `aigc-what` — 哎呀!? AIGC 是什麼東東

- **原**（48 字）：用淺顯易懂的方式介紹 AIGC（AI Generated Content）的基本概念與應用場景。
- **新**（104 字）：從 ChatGPT 與 Stable Diffusion 的爆紅說起，回頭把 AIGC 講清楚：它跟 LLM 是什麼關係、由哪些技術組成、GAI 的運作模式長什麼樣，以及構成一個 AIGC 應用需要哪些要件。

### 7. `civitai` — 歡樂下載站：Civitai 及 HuggingFace

- **原**（37 字）：介紹 Civitai 和 HuggingFace 模型資源平台的使用方法。
- **新**（95 字）：玩 SD 一定會用到的兩個模型站：Civitai 與 HuggingFace。這篇說明兩邊各自擅長什麼、怎麼挑選與下載模型，以及一個容易踩的坑：SD XL 要搭配對應的 LoRA 才會生效。

### 8. `clip` — CLIP，文字圖像你都會？

- **原**（29 字）：了解 CLIP 如何連結文字與圖像，實現跨模態理解的突破。
- **新**（91 字）：CLIP 是把文字與圖像接在一起的關鍵：它會自動分類影像、用 prompt 標記，而且具備 zero-shot 能力。這篇講它的概念從何而來、演算法怎麼做到跨模態，以及能拿來做什麼。

### 9. `controlnet` — ControlNet，控制狂人？

- **原**（28 字）：探索 ControlNet 如何實現精確的圖像生成控制。
- **新**（87 字）：ControlNet 讓圖像生成從「抽卡」變成「指定」：只要給一張骨架圖、深度圖或線稿，就能控制畫面構圖。這篇說明它的原理、演算法與實際特色，最後再補幾個同場加映的應用場合。

### 10. `diffusion` — Diffusion，終於見到你

- **原**（45 字）：深入探討 Diffusion Model 的原理，了解為何它成為生成式 AI 的主流架構。
- **新**（80 字）：系列走到核心：DDPM 到底是什麼。這篇講清楚前向的擴散過程怎麼把高斯雜訊一層層加進圖片，反向過程又怎麼從純雜訊一步步還原出一張圖，以及背後的演算法與近期發展。

### 11. `dreambooth` — Dreambooth，夢幻般的驚嘆調

- **原**（30 字）：了解 DreamBooth 微調技術如何讓模型學習特定主題。
- **新**（106 字）：DreamBooth 是 Google 2022 年提出的訓練方式，少量圖片就能讓模型記住特定主體。這篇說明它跟 LoRA、Embedding、HyperNetwork 的差別、訓練流程，以及實際使用的注意事項。

### 12. `embedding` — 來看看文本倒置是要倒轉什麼: Embedding

- **原**（57 字）：探索 Textual Inversion（Embedding）技術在 Stable Diffusion 中的應用。
- **新**（96 字）：Embedding 又叫 Textual Inversion，做法是不動模型本身的參數，只找出一個新詞的向量表示，就讓 SD 學會新概念。這篇談它的原理、跟 LoRA 等方法的差異與實際用法。

### 13. `flow` — Flow，神秘的流派

- **原**（38 字）：介紹 Normalizing Flow 模型的原理與生成式 AI 中的應用。
- **新**（93 字）：Normalizing Flow 是生成模型裡相對小眾的一支。這篇談它的架構怎麼做到可逆轉換、有哪些常見的 Flow 種類，以及在什麼情況下會選它而不是 GAN 或 Diffusion。

### 14. `gai-tools` — 常見的圖像生成工具

- **原**（22 字）：介紹各種圖像生成式 AI 工具及其特色比較。
- **新**（102 字）：市面上常見的 AI 生圖工具一次攤開：Midjourney、Stable Diffusion、DALL·E 2、Leonardo AI 等八款，逐一介紹特色，再依用途與上手難度比較，幫你判斷該從哪個開始。

### 15. `gan` — GAN，聽說你最強，參數很難調

- **原**（23 字）：深入了解 GAN 的原理、訓練挑戰與各種變體。
- **新**（90 字）：生成對抗網路（GAN）由生成器與判別器互相對抗來訓練，效果驚人但參數極難調。這篇從 GAN 的基本原理講起，梳理它一路演進出的幾個關鍵變體，也會說明訓練時常見的失敗模式與調整方向。

### 16. `hypernetwork` — HyperNetwork，感覺很高級

- **原**（44 字）：探索 HyperNetwork 在 Stable Diffusion 中的風格控制應用。
- **新**（110 字）：HyperNetwork 是用神經網路去生成模型參數的微調方法，由早期參與 Stable Diffusion 開發的 Novel AI 提出。這篇說明它怎麼從模型內部找出相似參數生成同風格圖片，以及跟 LoRA 的差別。

### 17. `lora-theory` — LoRA，微調方法的新突破

- **原**（30 字）：深入了解 LoRA 低秩適應技術的原理與在模型微調中的應用。
- **新**（83 字）：LoRA 是微軟 2021 年提出的微調方法：凍結原本訓練好的權重，只訓練額外加入的低秩矩陣，就能用很低成本把模型導向特定風格。這篇講它的演算法、為何有效與實際限制。

### 18. `nerf` — NeRF，聽說你是建模達人

- **原**（48 字）：探索 NeRF（Neural Radiance Fields）在 3D 場景重建中的突破性應用。
- **新**（80 字）：NeRF 是一種用神經網路記住一個場景的建模方法：把場景表示成神經輻射場，就能從沒拍過的角度合成畫面。這篇說明它的演算法怎麼運作，以及它跟傳統建模比起來的特色。

### 19. `pixel-rnn` — Pixel RNN，簡單，卻不失優雅

- **原**（30 字）：探索 Pixel RNN 的架構原理與圖像生成的像素級方法。
- **新**（95 字）：Pixel RNN 的做法很直白：把圖像當成一串像素，用已知的像素去預測下一個相鄰像素。這篇從 RNN 的基本結構講起，說明 Pixel RNN 的架構與生成方式，再和其他生成模型比較優劣。

### 20. `sd-advanced` — SD 的進階使用技巧

- **原**（39 字）：進階的 Stable Diffusion 使用技巧，包含提示詞工程與參數調校。
- **新**（80 字）：會用基本功能之後，這篇把進階操作需要的套件整理成一張清單：每個套件在做什麼、怎麼安裝、實際怎麼用，最後串成一套能重複使用的工作流程，省掉每次重新摸索的時間成本。

### 21. `sd-basic` — Stable Diffusion 的基礎使用

- **原**（29 字）：Stable Diffusion 基礎功能介紹與使用方法。
- **新**（86 字）：Stable Diffusion 入門的第一篇：從 WebUI 介面怎麼看、文生圖與圖生圖的參數各自在做什麼，到第一次產出可用的圖該怎麼設定，把最基礎的操作流程完整走一遍。

### 22. `sd-checkpoint` — SD 訓練 Checkpoint

- **原**（42 字）：深入了解如何訓練 Stable Diffusion 的 Checkpoint 模型。
- **新**（97 字）：想讓 SD 徹底學會一種風格，就得訓練自己的 Checkpoint。這篇整理目前常見的訓練方法、HuggingFace 上可用的資源與指令，以及實際訓練 Checkpoint 的步驟與注意事項。

### 23. `sd-install` — Stable Diffusion 的安裝

- **原**（35 字）：Stable Diffusion 的安裝教學，包含環境設置與介面總覽。
- **新**（93 字）：從安裝開始手把手把 Stable Diffusion 跑起來：先確認自己的電腦配置夠不夠、該選本機還是雲端環境，再到 AUTOMATIC1111 WebUI 的安裝步驟，第一次裝就上手。

### 24. `sd-lora` — SD 訓練 LoRA

- **原**（36 字）：實戰教學如何訓練 Stable Diffusion 的 LoRA 模型。
- **新**（83 字）：LoRA 是微調 SD 最實用的方式，但 WebUI 本身沒有提供訓練功能，所以得另外準備。這篇比較目前兩種常見的訓練途徑，再走一遍實際的訓練流程與每一步的設定項目。

### 25. `sd-plugin-1` — Stable Diffusion 基礎插件

- **原**（32 字）：Stable Diffusion 常用基礎插件的介紹與使用教學。
- **新**（105 字）：SD 本體功能有限，外掛才是生產力來源。這篇先介紹三個基礎插件：Image Browsing 把生成結果整理成可搜尋圖庫、Prompt all in one 統一管理提示詞、Translation 負責中翻英。

### 26. `sd-plugin-2` — Stable Diffusion 進階插件

- **原**（29 字）：Stable Diffusion 進階插件推薦與使用技巧。
- **新**（97 字）：接著介紹三個進階插件：ControlNet 用邊緣與姿勢控制人物姿態、After Detailer 自動補修臉部與手部細節、Civitai Browser Plus 直接在介面裡瀏覽與下載模型。

### 27. `sd-principle` — Stable Diffusion，來吧

- **原**（33 字）：深入剖析 Stable Diffusion 的架構原理與核心技術。
- **新**（85 字）：鋪陳了十三天，終於講到系列主角：Stable Diffusion 到底怎麼運作。這篇拆解它的架構與演算法，說明它相對前面介紹過的幾種生成模型，到底強在哪裡、又犧牲了什麼。

### 28. `sd-xl` — SD XL：SD 的限界突破

- **原**（34 字）：探索 Stable Diffusion XL 的架構升級與效果提升。
- **新**（80 字）：SD XL 並不是單純換模型：更大的網路架構帶來畫質與細節的提升，同時也改變了幾件事。這篇說明它改良的三個方向、演算法上的差異，以及實際使用時真正要留意的地方。

### 29. `swinir` — SwinIR，圖像重建的突破

- **原**（26 字）：了解 SwinIR 在圖像超解析度重建中的技術突破。
- **新**（93 字）：SwinIR 是把模糊圖放大的重建演算法，它把卷積神經網路與 Swin Transformer 的長處結合在一起。這篇說明它的架構怎麼運作、為何效果比傳統超解析度好，以及實際使用的限制。

### 30. `transformer` — Transformer，就決定是你了

- **原**（37 字）：解析 Transformer 架構的自注意力機制與其在各領域的革命性應用。
- **新**（93 字）：Transformer 是這幾年深度學習最大的分水嶺。這篇從它是 seq2seq 模型講起，說明 Attention 與自編碼器架構怎麼結合，再回顧近年模型演進，理解它為何成了通用骨幹。

### 31. `vae` — VAE，好久不見

- **原**（36 字）：重新探索變分自編碼器（VAE）的數學原理與在生成式 AI 中的核心地位。
- **新**（80 字）：要講 VAE 之前，得先講 AE。這篇先回顧自編碼器的原理與稀疏、去噪等幾種常見變體，再帶到變分自編碼器的數學原理，說明它如何用潛在變數的機率分佈生成新的樣本。

## AI 實務與認證

共 12 篇

### 1. `ai-father-interview` — 從「AI 之父辛頓訪談 & AI 四巨頭」看待自學 AI 這件事

- **原**（58 字）：從 Geoffrey Hinton 的訪談與 AI 領域四大巨頭的觀點出發，探討自學 AI 的方法論與未來發展方向。
- **新**（88 字）：從辛頓的訪談與 AI 四巨頭的觀點出發，回答一個很多人想問的問題：現在開始自學 AI 還來得及嗎？這篇整理新手該從哪裡切入、論文該怎麼讀與實作，以及這些大神思考方式帶來的啟發。

### 2. `aia-forum-2025` — 2025 AIA 春季論壇: 開源模型的衝擊與對應

- **原**（46 字）：參與 AIA 春季論壇，深度分析開源模型對產業的衝擊，以及企業該如何佈局與應對這波技術變革。
- **新**（95 字）：第一次參加台灣人工智慧學校的春季論壇，主題是開源模型的衝擊與對應。這篇整理現場重點：AI 的演進路徑、aiDaptiv+ 這類降低門檻的方案、LLM 的使用規則，以及中國開源模型的發展現況。

### 3. `cursor-ai-award` — 我透過 Cursor，拿到了 AI 比賽的最佳獎項

- **原**（62 字）：利用 AI 輔助開發工具 Cursor 參加 AI 競賽並獲得最佳獎項的經驗分享，展示 AI 工具如何改變開發者的工作方式。
- **新**（97 字）：為期半年的 AIGO 潛力新星盃結束，第一次參賽就拿下最佳獎項。這篇回顧參賽歷程與題目怎麼拆解，以及 Cursor 這個 AI 輔助開發工具在其中扮演的角色，還有頒獎與 Demo 發表會的心得。

### 4. `dli-notes` — DLI 講師筆記：深度學習基礎

- **原**（57 字）：身為 NVIDIA DLI 認證講師，分享深度學習基礎課程的教學筆記與心得，涵蓋神經網路架構、訓練技巧與實務應用。
- **新**（103 字）：身為 NVIDIA DLI 認證講師，把深度學習基礎課的講義整理成筆記：從 Von Neumann 架構的限制、專家系統為何失靈講起，說明資料量與算力怎麼把深度學習推上台面，適合第一次接觸的人建立整體骨架。

### 5. `glm-5.2-rd-leader-reflections` — 研發主管的真情告白：開源最強大語言模型的能力與反思（未更動）

- **原**（106 字）：在公司地端架設 GLM-5.2 後，研發團隊的樣貌徹底改變：寫程式從2小時縮短到10分鐘、Junior 與 Senior 的需求位移、規劃工作交給 AI 出方案。一位研發主管記下這波算力無限時代的真實體感與反思。
- **新**（106 字）：在公司地端架設 GLM-5.2 後，研發團隊的樣貌徹底改變：寫程式從2小時縮短到10分鐘、Junior 與 Senior 的需求位移、規劃工作交給 AI 出方案。一位研發主管記下這波算力無限時代的真實體感與反思。

### 6. `mediatek-lecture` — 聯發創新基地開源模型與百工百業應用講座

- **原**（41 字）：受邀於聯發創新基地分享開源模型的應用場景，探討如何將 AI 技術落地到各行各業中。
- **新**（85 字）：受邀到聯發創新基地談開源模型與百工百業的應用，整理當天四個重點：Reasoning 成為標配、多模態與超長上下文視窗的趨勢、小模型其實不是一無是處，以及開源模型的起手式。

### 7. `nvidia-cert-experience` — NVIDIA 證照準備心得

- **原**（63 字）：Nick Zhuang 分享三張 NVIDIA 證照考取經驗、準備策略與考場實錄，給有志於挑戰 NVIDIA 證照的朋友參考。
- **新**（80 字）：從一張半價考照優惠開始，一路考到多張 NVIDIA 認證。這篇記錄第一張入門證照的準備方式、後續進階證照的難度差異、考場實錄，以及回頭看這段馬拉松的取捨與心得。

### 8. `nvidia-cert-fathers-day` — 父親節快樂：NVIDIA證書+1的故事（未更動）

- **原**（93 字）：父親節這天拿到第 5 張 NVIDIA 認證。回顧一年來每 2~3 個月不間斷的考試旅程，從基礎設施到應用層的 GPU 生態系全貌，以及 NCA-ADS 拿下 91 分歷屆最高分的實錄。
- **新**（93 字）：父親節這天拿到第 5 張 NVIDIA 認證。回顧一年來每 2~3 個月不間斷的考試旅程，從基礎設施到應用層的 GPU 生態系全貌，以及 NCA-ADS 拿下 91 分歷屆最高分的實錄。

### 9. `nvidia-cert-pro` — 企業 AI 基礎建設全攻略：從網路底層到 AI 應用的完整藍圖

- **原**（124 字）：深入拆解 NVIDIA Certified Professional | AI Infrastructure 的技術核心，從底層高速網路、GPU 虛擬化，到 Enterprise K8S 與上層 AI 軟體平台，帶你走過企業 AI 工廠的五層架構。
- **新**（110 字）：這張 NVIDIA Certified Professional 考的不是某個房間，而是整棟大樓。文章由下而上拆解企業 AI 工廠的五層架構：高速網路與 NUMA 拓撲、GPU 虛擬化到軟體平台，說明每層少一塊都是短板。

### 10. `nvidia-diffusion` — NVIDIA 課程：Generative AI with Diffusion Models 筆記分享

- **原**（51 字）：NVIDIA DLI 擴散模型課程的完整學習筆記，從數學原理到實作，深入理解生成式 AI 的核心技術。
- **新**（95 字）：NVIDIA DLI 擴散模型課程的完整筆記：從 U-Net 與轉置卷積的發展講起，拆解 DDPM 的擴散與反向擴散、模型架構的幾種優化方式、無分類器引導，以及 CLIP 在其中扮演的角色。

### 11. `nvidia-rag` — 完課取證！史上體感難度最高的 NVIDIA DLI 課程：Building RAG Agents with LLMs

- **原**（65 字）：挑戰 NVIDIA DLI 最高難度課程，深入學習 RAG Agent 的建構方式，結合 LLM 實現更精準的知識檢索與回答系統。
- **新**（107 字）：這門 Building RAG Agents with LLMs 是體感難度最高的 DLI 課程：講授時間不長，練習卻相當花時間。這篇記錄 LangChain 的基礎概念、幾個關鍵知識點，以及完課取證的過程與建議。

### 12. `zsh-debug` — zsh debug 紀錄：zprofile、zshrc、腳本的 debug 技巧

- **原**（41 字）：分享 zsh shell 的 debug 技巧，協助追蹤與排查 zsh 腳本問題。
- **新**（108 字）：某天晚上發現自己的 Mac 開終端機要等 15 秒以上，於是回頭查 zprofile 與 zshrc 到底在做什麼。這篇記錄用 zprof 找出拖慢啟動元凶的過程，以及 debug zsh 腳本時真正有用的幾個技巧。

## 職涯

共 2 篇

### 1. `about-ai-cloud` — 關於我：AI 與雲端的技術探索之路

- **原**（50 字）：從軟體工程師到 CTO，超過十年的技術職涯歷程。分享在 AI 軟體開發與系統架構設計中的成長與蛻變。
- **新**（84 字）：從純數與機械背景出發，畢業先當兵、再進入軟體業，一路走到 CTO，累計 12 年的完整職涯介紹。寫給每次見面都要重講一次經歷的新朋友，也寫給正在考慮轉進軟體與雲端的人。

### 2. `manager-path` — 經理人之道-技術領袖航向成長與改變的參考指南

- **原**（36 字）：從技術工程師到技術領導者的成長之路，分享管理心得與領導力養成的參考指南。
- **新**（109 字）：《經理人之道》給技術背景的人一條清楚的成長路徑：資深工程師之後分純技術（Tech Lead → Staff → Principal）與管理（Manager → Director → CTO）兩條線，這篇談它對我的幫助。

## 人生探索

共 3 篇

### 1. `leave-notion-cloudflare` — 一年後，我離開了 Notion：自架站方法分享 Cloudflare 篇

- **原**（69 字）：從 Notion 轉移到自架站，並用 Cloudflare Pages 部署的完整經驗分享，包含流量、SEO、維護、AI 工具應用等心得。
- **新**（110 字）：把網站從 WordPress 搬到 Notion 是為了省錢與備援，但一年下來問題不少：前端跳轉讓只有首頁進得了 Google 索引，GSC 上慘不忍睹。這篇說明為何離開 Notion，改用 Cloudflare 自架。

### 2. `leave-wordpress` — 一年之後，我離開了 Wordpress

- **原**（57 字）：從 WordPress 遷移到 Notion 的心路歷程，探討為什麼選擇離開傳統部落格平台，以及新平台帶來的改變。
- **新**（103 字）：出書之後發現網路上的文章太少，於是興起自建部落格的想法，也決定離開 WordPress。這篇記錄搬到 Notion 的取捨、發文流程怎麼簡化，以及用 Cloudflare Worker 補上平台不足的地方。

### 3. `why-blog` — 為什麼你會看到這篇部落格？

- **原**（35 字）：分享創建這個部落格的初衷，以及為什麼選擇用文字記錄技術旅程與人生探索。
- **新**（82 字）：從 2013 年入行至今，從工程師、技術主管到合夥創業，這個部落格是這些年技術與職涯軌跡的沉澱。這篇說明我為什麼開始寫、想寫哪些主題，以及你可以在這裡期待看到什麼。

## 深度學習

共 1 篇

### 1. `capsule-network` — Technical White Paper: Capsule Network

- **原**（51 字）：深入探討 Capsule Network 的技術白皮書，分析其架構設計、訓練方法與在影像辨識中的應用。
- **新**（104 字）：一份關於 Capsule Network 的技術白皮書：從 PCB 光學檢測的極限談起，說明傳統 CNN 在瑕疵檢測上為何卡關，再一路講到膠囊網路的架構、多階段改良（CapsNet+ 到後續變體）與實測成效。
