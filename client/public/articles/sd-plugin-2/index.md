![](./images/img_001.jpg)

# [Day23] Stable Diffusion 進階插件

## 提要

- [前言](#前言)
- [ControlNet](#ControlNet)
- [After Detailer](#After Detailer)
- [Civitai Browser Plus](#Civitai Browser Plus)

## 前言

今天我們介紹 SD 進階插件相關的內容，本日內容包含：ControlNet、After Detailer、及 Civitai Browser Plus。

## ControlNet

這個插件是控制邊緣、手勢、姿勢用的插件，我們可以透過其中的設定去調整生成人物的姿態。這個插件可以從 Extension 直接裝，不過其中用到的 model 要另外下載，主插件 URL 如下：

```bash
https://github.com/Mikubill/sd-webui-controlnet.git
```

至於 model 要到 HuggingFace 下載：

```bash
https://huggingface.co/lllyasviel/ControlNet-v1-1
```

只要pth的檔案就夠了，不過因為檔案很多，這裡提供一個比較方便的方法，一次下載全部。
首先要安裝git lfs套件，然後在clone。

```bash
sudo apt-get install git-lfs
git lfs clone https://huggingface.co/lllyasviel/ControlNet-v1-1
```

這樣就全部下載下來了，然後要放到/Stable Diffusion/novelai-webui-aki-v3/extensions/sd-webui-controlnet/models的資料夾底下。
完成後重啟 UI 就能看到操作介面，如下圖。

![ControlNet v1.1.410 面板展開後的介面，上方有三個 Unit 頁籤，中間是拖曳上傳圖片區，下方是控制類型與模型的下拉選單。](./images/img_002.png)

## After Detailer

這是一款增加繪圖細節的插件，也可以透過 URL 去安裝，安裝好後可以在生圖的介面上操作。

![ADetailer 面板勾選「啟用 AfterDetailer」，含單元1、單元2 與模型 mediapipe_face_full，下方是提示詞與反向提示詞欄位。](./images/img_003.png)

它也可以輸入自己想加入的 prompt，其他參數先用預設就可以，有需要再自行調整。

## Civitai Browser Plus

這個插件可以在 Extension 分頁中的 Download 的下載列表中找到，可以透過介面直接安裝，然後重新載入 UI 即可，非常方便，要看 civitai 的內容就不用刻意切換到網頁上，可以專注在 SD 的操作介面上。

![SD WebUI 的 CivitAI 分頁，頂端是模型列與 Search CivitAI 搜尋框，下方顯示 Page: 1/4870 及 Prev page、Next page 按鈕。](./images/img_004.png)

最後我們結合這三個插件來一次操作：

先從civitai下載二次元的模型：anythingV5Inpainting_v10-inpainting。

切換至圖生圖，到 ControlNet 那操作。

![圖生圖頁面的 ControlNet Unit 展開狀態，上傳控制圖並啟用預覽後，跳出「預處理結果預覽」視窗與开始绘制、关闭按鈕。](./images/img_005.png)

按照上圖操作，即可描繪邊緣，這邊筆者要測試邊緣重繪的功能。

所有設定完成，就按生圖。

![生成結果對照圖，左邊是原圖、右邊是重繪後的新圖，兩張並排呈現。](./images/img_006.png)

原圖在左，新圖在右，多了一股朦朧美，可能模糊條太多了囧。

## 小結

今天我們介紹了關於 SD 進階插件的內容；例如，ControlNet、After Detailer、及Civitai Browser Plus，明天會介紹 ControlNet 的原理，明天見！

## 參考連結

- [ControlNet手把手教學](https://www.uisdc.com/controlnet-v1-1)
- [SD實用進階插件](https://www.uisdc.com/stable-diffusion-webui-3)
