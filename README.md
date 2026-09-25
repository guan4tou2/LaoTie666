# LaoTie666 - 老鐵語法檢查器

一個有趣的 VS Code 擴展，幫你檢查程式碼語法，沒毛病！

## 功能特色

- 支援多種程式語言的語法檢查，每種語言有專屬的老鐵風格訊息：
  - JavaScript / TypeScript
  - Python
  - Java / Kotlin
  - C / C++
  - C#
  - Go
  - Rust
  - Ruby
  - PHP
  - Swift
  - Dart
  - Lua
  - R
  - SQL
  - Shell Script
  - HTML / CSS / SCSS
  - JSON / YAML
  - Vue / Svelte
  - 其他語言也支援（透過 VS Code 內建診斷）

- 有趣的反饋效果：
  - 語法正確時隨機顯示老鐵語錄和彈幕特效（666、牛逼、厲害、大佬...）
  - 語法錯誤時顯示老鐵錯誤語錄，並顯示錯誤數量
  - 警告和錯誤分級提示，不同嚴重程度不同訊息

- 狀態列即時顯示：
  - 底部狀態列顯示當前檔案的錯誤/警告數量
  - 顏色區分：紅色（錯誤）、黃色（警告）、綠色（沒毛病）

- 連續無錯計數：
  - 連續 3/5/10/20 次無錯，給出越來越誇張的誇獎

- 每日戰報：
  - 統計今天檢查次數、無錯次數、有錯次數

## 使用方法

1. 打開任意程式語言文件
2. 使用以下任一方式觸發檢查：
   - 點擊編輯器右上角的「老鐵我做得對嗎？」按鈕
   - 快捷鍵 `Ctrl+Shift+6`（Mac: `Cmd+Shift+6`）
   - 儲存檔案時自動檢查
3. 檢查結果：
   - 沒問題 → 老鐵語錄 + 彈幕特效
   - 有錯誤 → 錯誤提示 + 錯誤數量
4. 使用 `Ctrl+Shift+7`（Mac: `Cmd+Shift+7`）快速跳到下一個錯誤
5. 命令面板輸入「老鐵今日戰報」查看今日統計

## 工作原理

LaoTie666 **不負責編譯或語法分析**，它讀取 VS Code 和其他語言擴展提供的診斷結果，然後用老鐵風格呈現。所以你需要安裝對應語言的擴展才能獲得最佳效果。

如果偵測到缺少推薦的語言擴展，LaoTie666 會提示你安裝。

## 推薦搭配的擴展

| 語言 | 推薦擴展 |
|------|---------|
| JavaScript / TypeScript | [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) |
| Python | [Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python) |
| Java | [Language Support for Java](https://marketplace.visualstudio.com/items?itemName=redhat.java) |
| C / C++ | [C/C++](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools) |
| C# | [C# Dev Kit](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csdevkit) |
| Go | [Go](https://marketplace.visualstudio.com/items?itemName=golang.go) |
| Rust | [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer) |
| Ruby | [Ruby LSP](https://marketplace.visualstudio.com/items?itemName=shopify.ruby-lsp) |
| PHP | [Intelephense](https://marketplace.visualstudio.com/items?itemName=bmewburn.vscode-intelephense-client) |
| Swift | [Swift](https://marketplace.visualstudio.com/items?itemName=sswg.swift-lang) |
| Kotlin | [Kotlin](https://marketplace.visualstudio.com/items?itemName=fwcd.kotlin) |
| Dart | [Dart](https://marketplace.visualstudio.com/items?itemName=dart-code.dart-code) |
| Vue | [Vue - Official](https://marketplace.visualstudio.com/items?itemName=vue.volar) |
| Svelte | [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode) |
| Lua | [Lua](https://marketplace.visualstudio.com/items?itemName=sumneko.lua) |
| Shell | [ShellCheck](https://marketplace.visualstudio.com/items?itemName=timonwong.shellcheck) |

## 設定選項

| 設定 | 預設 | 說明 |
|------|------|------|
| `laotie666.autoCheckOnSave` | `true` | 儲存時自動檢查語法 |
| `laotie666.showDanmaku` | `true` | 顯示彈幕特效 |
| `laotie666.danmakuDuration` | `3000` | 彈幕顯示時間（毫秒，500-10000） |
| `laotie666.quietMode` | `false` | 靜音模式：只更新狀態列，不彈出通知 |

## 系統需求

- VS Code 1.93.0 或更高版本

## 問題回報

如果遇到任何問題，歡迎在 [GitHub Issues](https://github.com/guan4tou2/LaoTie666/issues) 回報。

## 授權協議

MIT License

---

**老鐵，沒毛病！** 👍
