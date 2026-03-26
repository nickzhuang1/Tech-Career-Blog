![](https://nick-zhuang.notion.site/image/attachment%3Aeac526fb-186f-4885-8b61-c6408595c6d8%3AAIGC-Titles.022.jpeg?table=block&id=1e9d2b68-7266-80a2-b603-fed6181e6493&spaceId=1d7ab0b0-d83d-492c-9585-f3564a662215&width=2000&userId=&cache=v2)

## \[Day22\] Stable Diffusion 基礎插件

Author: Nick Zhuang
Type: AI & Data

### 提要

[前言](https://www.notion.so/Title-1e8d2b687266801ba8eacafcf287b2d9#%E5%89%8D%E8%A8%80)

[Image Browsing](https://www.notion.so/Title-1e8d2b687266801ba8eacafcf287b2d9#image-browsing)

[Prompt all in one](https://www.notion.so/Title-1e8d2b687266801ba8eacafcf287b2d9#promp-all-in-one)

[Translation](https://www.notion.so/Title-1e8d2b687266801ba8eacafcf287b2d9#translation)

### 前言

今天我們介紹 Stable Diffusion 插件相關的內容，本日會先介紹三個，內容包含：Image Browsing、Prompt all in one、及Translation。

### Image Browsing

Image Browsing是瀏覽圖片用的，它會幫忙把生成的圖片整理起來，可以縮圖預覽、快速查找、及以巡訪的方式檢視，會羅列一些圖片生成時用的prompt、及其他一些小細節，要批量下載圖片也是可以的，非常方便，以下介紹安裝及使用方式。

安裝

切換到Extension的分頁，然後在Install from URL貼上

https://github.com/zanllp/sd-webui-infinite-image-browsing

​

點擊Install，然後切換到 Installed 的分頁，按下 Apply and restart UI。

使用方式

![](https://nick-zhuang.notion.site/image/attachment%3Ad0ed7adc-ccdb-4642-89d6-b9ad4e60a10a%3Aimage.png?table=block&id=1e8d2b68-7266-8042-80d6-d3febfca4b65&spaceId=1d7ab0b0-d83d-492c-9585-f3564a662215&width=2000&userId=&cache=v2)

這是安裝好後的介面總覽，「Walk模式」是巡訪圖片用的、「快速移動」是會幫你顯示資料夾、「啟動」是 Global 的功能，像是：快速查找圖片、批量下載等等。

![](https://nick-zhuang.notion.site/image/attachment%3A62c4dbe3-769b-4425-9c0f-b1bfd9bce4af%3Aimage.png?table=block&id=1e8d2b68-7266-8048-bd7f-d741f8da8e63&spaceId=1d7ab0b0-d83d-492c-9585-f3564a662215&width=2000&userId=&cache=v2)

這是使用walk文生圖的功能顯示的畫面，可以看到有縮圖檢視，以及從單張圖去檢視該圖所使用的prompt、解析度、使用的Model、及其他細部設定。

### Prompt all in one

Prompt all in one這個插件是用在提示詞 ( prompt )使用的，它有各種維度的提示可以直接點選，選了後就自動幫你把對應字填到 prompt 的框內，無論是 Positive 或是 Negative 都可以。

安裝

![](https://nick-zhuang.notion.site/image/attachment%3Abdf9f375-3a22-4b90-87f7-9f66bc349c7d%3Aimage.png?table=block&id=1e8d2b68-7266-80c8-b32b-f2e21ac2edaa&spaceId=1d7ab0b0-d83d-492c-9585-f3564a662215&width=2000&userId=&cache=v2)

切換到Extension的分頁，然後在Install from URL貼上

https://github.com/Physton/sd-webui-prompt-all-in-one

​

![](https://nick-zhuang.notion.site/image/attachment%3A2bcbb8ac-5515-4f1b-a522-b2bed4efd95e%3Aimage.png?table=block&id=1e8d2b68-7266-80bd-99d1-d9f0f3a1c79a&spaceId=1d7ab0b0-d83d-492c-9585-f3564a662215&width=2000&userId=&cache=v2)

點擊Install，然後切換到 Installed 的分頁，按下 Apply and restart UI。

使用方式

![](https://nick-zhuang.notion.site/image/attachment%3A3e6955a0-a296-41c8-b7b0-e78a256a575a%3Aimage.png?table=block&id=1e8d2b68-7266-806c-813b-c8fe1712221b&spaceId=1d7ab0b0-d83d-492c-9585-f3564a662215&width=2000&userId=&cache=v2)

可以看到有大類別可以供選擇，像是：人物、服飾、表情動作、畫面、...，非常多XD，小類別在點選定大類別後會出現選項，點擊就能把這些標籤放到介面上，並同步幫你把提示詞放上去。

### Translation

最後一個就是翻譯的插件啦！一開始用的時候專有名詞非常多，很容易看到頭昏眼花，為了避免語言障礙影響到我們的使用，因此有好的翻譯插件非常重要。

安裝

切換到Extension的分頁，然後在Install from URL貼上

https://github.com/hanamizuki-ai/stable-diffusion-webui-localization-zh\_Hans

​

點擊Install，然後切換到 Installed 的分頁，按下 Apply and restart UI。

接下來這步驟要注意一下：

![](https://nick-zhuang.notion.site/image/attachment%3A7fbefd99-a997-47b2-a7b7-6febbf756322%3Aimage.png?table=block&id=1e8d2b68-7266-809f-8d4a-e1c3d6f64398&spaceId=1d7ab0b0-d83d-492c-9585-f3564a662215&width=2000&userId=&cache=v2)

這邊是要在 restart UI 後，切換到 Settings -> User interface -> Localization，將語系選擇 zh-Hans，它預設是簡體中文的，所以如果要用繁體版的話，可以將這個路徑底下的json檔修改即可：

/stable-diffusion-webui/extensions/stable-diffusion-webui-localization-zh\_Hans/localizations

​

### 小結

今天我們介紹了關於 Stable Diffusion 基礎插件的內容；例如，Image Browsing、Prompt all in one、及Translation，明天會介紹 Stable Diffusion 進階插件的內容，明天見！

### 參考連結

[Image Browsing](https://juejin.cn/post/7256651192986026044)

[Prompt all in one](https://www.uisdc.com/prompt-all-in-one)

[Stable Diffusion 基礎插件](https://www.uisdc.com/stable-diffusion-webui-2)

