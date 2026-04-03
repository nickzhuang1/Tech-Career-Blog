【差點被zsh坑死】
​
說來有趣，某一天晚上，我用自己的mac，開啟命令行突然發現，啟動要等很久才能操作，至少15秒以上，其實這個問題也已經有一段時間了，但我都不以為意，剛好這晚有點時間，想說來仔細看一下到底是什麼問題。
​
我先打開ChatGPT，描述我碰到的狀況，按照以往的經驗，就是會把情況描述清楚，避免他又自行腦補幻覺給我。我是這麼說的：
```bash
我發現我用iterm2打開的時候花了蠻多時間初始化，有辦法排查問題嗎？（其實講的蠻簡略的哈）
```
​
然後ChatGPT就開始表演了：
```bash
建議用lazy load...
```
​
他列了許多種可能，但其實都不對，無法解決我的問題，頂多只有效能評測能用。
​
結果奮戰了一個多小時後，我偶然發現一個神秘的檔案：.zprofile
```bash
echo 'eval $(/opt/homebrew/bin/brew shellenv)' >> /Users/xiangningzhuang/.zprofile 
eval $(/opt/homebrew/bin/brew shellenv) 
eval $(/opt/homebrew/bin/brew shellenv) 
eval $(/opt/homebrew/bin/brew shellenv) 
eval $(/opt/homebrew/bin/brew shellenv) 
eval $(/opt/homebrew/bin/brew shellenv) 
eval $(/opt/homebrew/bin/brew shellenv) 
eval $(/opt/homebrew/bin/brew shellenv) 
eval $(/opt/homebrew/bin/brew shellenv) 
eval $(/opt/homebrew/bin/brew shellenv) 
eval $(/opt/homebrew/bin/brew shellenv) 
eval $(/opt/homebrew/bin/brew shellenv)
...
```
傻眼，這是某一版更新留下來的，每開一次zsh，就會觸發iterm2中的oh-my-zsh設定，多寫入一筆。
仔細一看，可是有800多筆啊，難怪這麼慢，我後來直接改成：
```bash
eval $(/opt/homebrew/bin/brew shellenv)
```
​
改完之後，一切就正常了，記錄讓大家知道，避免跟我踩到一樣蝦的坑。
​
另外，這是我的.zshrc設定，供參考，AI有提到說比oh-my-zsh更快的方法（zinit），但是設定比較麻煩，就先跳過了。
```bash
export BASH_ENV=""       # 避免 Zsh 模擬 Bash 調用 /etc/bashrc
export ZDOTDIR="$HOME"   # 確保找不到其他系統 dotfiles
# ============================
# 基本設定
# ============================

# 關掉 oh-my-zsh 自動更新
DISABLE_AUTO_UPDATE="true"
ZSH_AUTO_UPDATE="false"

# zsh profiler（可選）
#zmodload zsh/zprof

# 避免每次啟動都檢查 compinit 權限
ZSH_DISABLE_COMPFIX="true"

# ============================
# PATH 設定（保證基本系統命令可用）
# ============================
export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"  # 系統指令最優先
export PATH="$HOME/bin:$HOME/.local/bin:$HOME/.pyenv/bin:$PATH"
export PATH="/Library/TeX/texbin:$PATH"
export PATH="/opt/homebrew/bin:/opt/homebrew/sbin:$PATH"

# ============================
# oh-my-zsh 安裝路徑
# ============================
export ZSH="$HOME/.oh-my-zsh"

# 主題
ZSH_THEME="robbyrussell"

# plugins
plugins=(
  git
  zsh-autosuggestions
  zsh-syntax-highlighting
)

# 載入 oh-my-zsh
source $ZSH/oh-my-zsh.sh

# ============================
# compinit 使用 cache
# ============================
autoload -Uz compinit
compinit -C

# ============================
# pyenv lazy init
# ============================
pyenv_lazy_init() {
  command -v pyenv >/dev/null || return
  eval "$(pyenv init --path)"
  eval "$(pyenv init -)"
  eval "$(pyenv virtualenv-init -)"
}
alias python="pyenv_lazy_init && python"
alias pip="pyenv_lazy_init && pip"

# ============================
# nvm lazy load
# ============================
export NVM_DIR="$HOME/.nvm"

load_nvm() {
  unset -f nvm node npm npx
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
}

nvm() { load_nvm && nvm "$@" }
node() { load_nvm && node "$@" }
npm() { load_nvm && npm "$@" }
npx() { load_nvm && npx "$@" }

# ============================
# 其他設定（可選）
# ============================
# export EDITOR='vim'
# export LANG=en_US.UTF-8

# ============================
# 啟動 profiler
# ============================
#zprof
export NVS_HOME="$HOME/.nvs"
[ -s "$NVS_HOME/nvs.sh" ] && . "$NVS_HOME/nvs.sh"
```