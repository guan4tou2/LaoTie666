const vscode = require('vscode');

let statusBarItem;
let consecutiveCleanCount = 0;
let extensionContext;
let checkDebounceTimer;
let danmakuClearTimer;

const DANMAKU_TEXTS = ['666', '牛逼', '厲害', '大佬', '秀', '穩', 'nb', '太強了'];

const SUCCESS_MESSAGES = [
    '沒毛病阿老鐵！',
    '老鐵，穩如老狗！',
    '老鐵，代碼寫得漂亮！',
    '六六六，老鐵沒毛病！',
    '老鐵，這波操作我給滿分！',
    '完美，老鐵你是最靚的仔！',
];

const ERROR_MESSAGES = [
    '老鐵錯啦！',
    '老鐵，翻車了！',
    '老鐵，這代碼有坑啊！',
    '老鐵，bug警告！',
    '老鐵，扎心了！',
];

const WARNING_MESSAGES = [
    '老鐵，小問題！',
    '老鐵，有點小毛病，不影響大局！',
    '老鐵，警告而已，問題不大！',
    '老鐵，注意一下這些小細節！',
];

const STREAK_MESSAGES = [
    { min: 3, msg: '老鐵，三連無錯，穩！' },
    { min: 5, msg: '老鐵，五連無錯，你是高手！' },
    { min: 10, msg: '老鐵，十連無錯，封你為代碼之王！' },
    { min: 20, msg: '老鐵，二十連無錯，你是神！跪了！' },
];

const LANGUAGE_MESSAGES = {
    javascript:  { name: '腳本',   success: '老鐵，你的 JS 腳本穩了！',        error: '老鐵，你的 JS 腳本翻車了！' },
    typescript:  { name: '型別腳本', success: '老鐵，你的 TS 型別穩穩的！',      error: '老鐵，你的 TS 型別出問題了！' },
    python:      { name: '蛇',     success: '老鐵，你的蛇沒毛病！',            error: '老鐵，你的蛇咬人了！' },
    java:        { name: '咖啡',   success: '老鐵，你的 Java 煮得不錯！',       error: '老鐵，你的 Java 燒焦了！' },
    c:           { name: 'C',      success: '老鐵，你的 C 語言硬核無錯！',      error: '老鐵，你的 C 語言段錯誤了！' },
    cpp:         { name: 'C++',    success: '老鐵，你的 C++ 編譯通過！',        error: '老鐵，你的 C++ 又 segfault 了！' },
    csharp:      { name: 'C#',     success: '老鐵，你的 C# 沒毛病！',          error: '老鐵，你的 C# 拋異常了！' },
    go:          { name: 'Go',     success: '老鐵，你的 Go 跑得飛快！',         error: '老鐵，你的 Go 跑不動了！' },
    rust:        { name: 'Rust',   success: '老鐵，你的 Rust 安全又穩！',       error: '老鐵，借用檢查器不讓你過！' },
    ruby:        { name: '寶石',   success: '老鐵，你的 Ruby 閃閃發光！',       error: '老鐵，你的 Ruby 碎了！' },
    php:         { name: 'PHP',    success: '老鐵，你的 PHP 是最好的語言！',     error: '老鐵，你的 PHP 500 了！' },
    swift:       { name: 'Swift',  success: '老鐵，你的 Swift 飛起來了！',      error: '老鐵，你的 Swift 墜機了！' },
    kotlin:      { name: 'Kotlin', success: '老鐵，你的 Kotlin 穩如泰山！',     error: '老鐵，你的 Kotlin 空指針了！' },
    html:        { name: '網頁',   success: '老鐵，你的網頁沒毛病！',           error: '老鐵，你的網頁標籤沒閉合！' },
    css:         { name: '樣式',   success: '老鐵，你的樣式美翻了！',           error: '老鐵，你的樣式亂了！' },
    scss:        { name: '樣式',   success: '老鐵，你的 SCSS 編譯過了！',       error: '老鐵，你的 SCSS 語法有坑！' },
    json:        { name: 'JSON',   success: '老鐵，你的 JSON 格式正確！',       error: '老鐵，你的 JSON 少了個逗號！' },
    yaml:        { name: 'YAML',   success: '老鐵，你的 YAML 縮排正確！',       error: '老鐵，你的 YAML 縮排歪了！' },
    sql:         { name: 'SQL',    success: '老鐵，你的 SQL 查詢穩了！',        error: '老鐵，你的 SQL 語法錯了！' },
    shellscript: { name: 'Shell',  success: '老鐵，你的 Shell 腳本能跑！',      error: '老鐵，你的 Shell 腳本炸了！' },
    lua:         { name: 'Lua',    success: '老鐵，你的 Lua 跑得順！',          error: '老鐵，你的 Lua 報錯了！' },
    r:           { name: 'R',      success: '老鐵，你的 R 統計沒毛病！',        error: '老鐵，你的 R 跑不出結果！' },
    dart:        { name: 'Dart',   success: '老鐵，你的 Dart 飛鏢命中！',       error: '老鐵，你的 Dart 飛偏了！' },
    vue:         { name: 'Vue',    success: '老鐵，你的 Vue 組件穩了！',        error: '老鐵，你的 Vue 組件崩了！' },
    svelte:      { name: 'Svelte', success: '老鐵，你的 Svelte 輕巧無錯！',    error: '老鐵，你的 Svelte 出問題了！' },
};

function getConfig(key) {
    return vscode.workspace.getConfiguration('laotie666').get(key);
}

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getLanguageMessage(languageId, type) {
    const lang = LANGUAGE_MESSAGES[languageId];
    if (lang) {
        return lang[type];
    }
    return null;
}

function loadDailyStats() {
    if (!extensionContext) return { checks: 0, errors: 0, cleans: 0, date: new Date().toDateString() };
    const saved = extensionContext.globalState.get('dailyStats');
    if (saved && saved.date === new Date().toDateString()) {
        return saved;
    }
    return { checks: 0, errors: 0, cleans: 0, date: new Date().toDateString() };
}

function saveDailyStats(stats) {
    if (extensionContext) {
        extensionContext.globalState.update('dailyStats', stats);
    }
}

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
    extensionContext = context;

    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    statusBarItem.command = 'vscext.LaoTie';
    context.subscriptions.push(statusBarItem);
    updateStatusBar();

    context.subscriptions.push(vscode.commands.registerCommand('vscext.LaoTie', async function () {
        try {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showWarningMessage('請先打開一個文件！');
                return;
            }

            const document = editor.document;

            const disposable = vscode.languages.onDidChangeDiagnostics(async (e) => {
                const affected = e.uris.some(uri => uri.toString() === document.uri.toString());
                if (affected) {
                    disposable.dispose();
                    await checkDocument(document);
                }
            });

            await vscode.commands.executeCommand('editor.action.triggerParameterHints');

            setTimeout(() => {
                disposable.dispose();
                checkDocument(document);
            }, 2000);

        } catch (error) {
            vscode.window.showErrorMessage('老鐵錯啦！');
            console.error(error);
        }
    }));

    context.subscriptions.push(vscode.commands.registerCommand('vscext.LaoTieNextError', async function () {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('請先打開一個文件！');
            return;
        }

        const diagnostics = vscode.languages.getDiagnostics(editor.document.uri);
        const errors = diagnostics
            .filter(d => d.severity === vscode.DiagnosticSeverity.Error)
            .sort((a, b) => a.range.start.line - b.range.start.line);

        if (errors.length === 0) {
            vscode.window.showInformationMessage('老鐵，沒有 bug 可以帶你去看！');
            return;
        }

        const currentLine = editor.selection.active.line;
        const nextError = errors.find(e => e.range.start.line > currentLine) || errors[0];

        const pos = nextError.range.start;
        editor.selection = new vscode.Selection(pos, pos);
        editor.revealRange(nextError.range, vscode.TextEditorRevealType.InCenter);
        vscode.window.showWarningMessage(`老鐵，bug 在第 ${pos.line + 1} 行：${nextError.message}`);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('vscext.LaoTieDailyStats', function () {
        const stats = loadDailyStats();
        const msg = `老鐵今日戰報：檢查 ${stats.checks} 次，無錯 ${stats.cleans} 次，有錯 ${stats.errors} 次`;
        vscode.window.showInformationMessage(msg);
    }));

    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(async (document) => {
        if (!getConfig('autoCheckOnSave')) return;

        if (checkDebounceTimer) {
            clearTimeout(checkDebounceTimer);
        }
        checkDebounceTimer = setTimeout(async () => {
            checkDebounceTimer = null;
            await checkDocument(document);
        }, 300);
    }));

    context.subscriptions.push(vscode.languages.onDidChangeDiagnostics(() => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            updateStatusBar(editor.document);
        }
    }));

    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor) {
            updateStatusBar(editor.document);
        } else {
            updateStatusBar();
        }
    }));
}

function updateStatusBar(document) {
    if (!document) {
        statusBarItem.text = '$(check) 老鐵';
        statusBarItem.tooltip = '點擊檢查語法';
        statusBarItem.backgroundColor = undefined;
        statusBarItem.show();
        return;
    }

    const diagnostics = vscode.languages.getDiagnostics(document.uri);
    const errorCount = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Error).length;
    const warningCount = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Warning).length;

    if (errorCount > 0) {
        statusBarItem.text = `$(error) 老鐵 ${errorCount} 個錯誤`;
        statusBarItem.tooltip = `${errorCount} 個錯誤，${warningCount} 個警告`;
        statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
    } else if (warningCount > 0) {
        statusBarItem.text = `$(warning) 老鐵 ${warningCount} 個警告`;
        statusBarItem.tooltip = `${warningCount} 個警告`;
        statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
    } else {
        statusBarItem.text = '$(check) 老鐵 沒毛病';
        statusBarItem.tooltip = '沒毛病！';
        statusBarItem.backgroundColor = undefined;
    }
    statusBarItem.show();
}

let decorationType = vscode.window.createTextEditorDecorationType({
    after: {
        margin: '0 0 0 3em',
        textDecoration: 'none'
    },
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedOpen,
});

function show666Effect(editor) {
    if (!getConfig('showDanmaku')) return;

    if (danmakuClearTimer) {
        clearTimeout(danmakuClearTimer);
        editor.setDecorations(decorationType, []);
    }

    const visibleRanges = editor.visibleRanges;
    if (visibleRanges.length === 0) return;

    const startLine = visibleRanges[0].start.line;
    const endLine = visibleRanges[0].end.line;

    const count = Math.floor(Math.random() * 4) + 3;
    const decorations = [];

    for (let i = 0; i < count; i++) {
        const line = Math.floor(Math.random() * (endLine - startLine)) + startLine;
        const fontSize = Math.floor(Math.random() * 20) + 14;
        const offset = Math.floor(Math.random() * 50);

        const range = new vscode.Range(
            new vscode.Position(line, 0),
            new vscode.Position(line, 0)
        );

        decorations.push({
            range,
            renderOptions: {
                after: {
                    contentText: pickRandom(DANMAKU_TEXTS),
                    color: getRandomColor(),
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                    fontSize: `${fontSize}px`,
                    margin: `0 0 0 ${offset + 3}em`
                }
            }
        });
    }

    editor.setDecorations(decorationType, decorations);

    const duration = getConfig('danmakuDuration') || 3000;
    danmakuClearTimer = setTimeout(() => {
        editor.setDecorations(decorationType, []);
        danmakuClearTimer = null;
    }, duration);
}

function getRandomColor() {
    const colors = ['#FF4444', '#44FF44', '#4444FF', '#FFFF44', '#FF44FF', '#44FFFF'];
    return colors[Math.floor(Math.random() * colors.length)];
}

async function checkDocument(document) {
    const editor = vscode.window.activeTextEditor;

    const stats = loadDailyStats();
    stats.checks++;

    const diagnostics = vscode.languages.getDiagnostics(document.uri);

    const errors = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Error);
    const warnings = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Warning);
    const langId = document.languageId;
    const quiet = getConfig('quietMode');

    updateStatusBar(document);

    if (errors.length > 0) {
        consecutiveCleanCount = 0;
        stats.errors++;
        if (!quiet) {
            const langMsg = getLanguageMessage(langId, 'error');
            const msg = langMsg || pickRandom(ERROR_MESSAGES);
            vscode.window.showErrorMessage(`${msg}（${errors.length} 個錯誤）`);
        }
    } else if (warnings.length > 0) {
        consecutiveCleanCount++;
        stats.cleans++;
        if (!quiet) {
            vscode.window.showWarningMessage(`${pickRandom(WARNING_MESSAGES)}（${warnings.length} 個警告）`);
        }
        if (editor) {
            show666Effect(editor);
        }
    } else {
        consecutiveCleanCount++;
        stats.cleans++;
        if (!quiet) {
            const langMsg = getLanguageMessage(langId, 'success');
            const msg = langMsg || pickRandom(SUCCESS_MESSAGES);
            vscode.window.showInformationMessage(msg);
        }
        if (editor) {
            show666Effect(editor);
        }
        if (!quiet) {
            showStreakMessage();
        }
    }

    saveDailyStats(stats);
}

function showStreakMessage() {
    for (let i = STREAK_MESSAGES.length - 1; i >= 0; i--) {
        if (consecutiveCleanCount === STREAK_MESSAGES[i].min) {
            vscode.window.showInformationMessage(STREAK_MESSAGES[i].msg);
            break;
        }
    }
}

function deactivate() {
    if (checkDebounceTimer) {
        clearTimeout(checkDebounceTimer);
    }
    if (danmakuClearTimer) {
        clearTimeout(danmakuClearTimer);
    }
    if (statusBarItem) {
        statusBarItem.dispose();
    }
}

module.exports = {
    activate,
    deactivate,
    getRandomColor,
    getLanguageMessage,
    pickRandom,
    checkDocument,
    show666Effect,
    updateStatusBar,
    showStreakMessage,
    SUCCESS_MESSAGES,
    ERROR_MESSAGES,
    WARNING_MESSAGES,
    STREAK_MESSAGES,
    LANGUAGE_MESSAGES,
    DANMAKU_TEXTS
}
