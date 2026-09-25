const vscode = require('vscode');

let statusBarItem;
let consecutiveCleanCount = 0;

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

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
    console.log('Congratulations, your extension "vscext" is now active!');

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
            await vscode.commands.executeCommand('editor.action.triggerParameterHints');

            setTimeout(async () => {
                await checkDocument(document);
            }, 500);

        } catch (error) {
            vscode.window.showErrorMessage('老鐵錯啦！');
            console.error(error);
        }
    }));

    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(async (document) => {
        await checkDocument(document);
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
                    contentText: '666',
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

    setTimeout(() => {
        editor.setDecorations(decorationType, []);
    }, 3000);
}

function getRandomColor() {
    const colors = ['#FF4444', '#44FF44', '#4444FF', '#FFFF44', '#FF44FF', '#44FFFF'];
    return colors[Math.floor(Math.random() * colors.length)];
}

async function checkDocument(document) {
    const editor = vscode.window.activeTextEditor;

    const diagnostics = vscode.languages.getDiagnostics(document.uri);

    const errors = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Error);
    const warnings = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Warning);

    updateStatusBar(document);

    if (errors.length > 0) {
        consecutiveCleanCount = 0;
        vscode.window.showErrorMessage(`${pickRandom(ERROR_MESSAGES)}（${errors.length} 個錯誤）`);
    } else if (warnings.length > 0) {
        consecutiveCleanCount++;
        vscode.window.showWarningMessage(`${pickRandom(WARNING_MESSAGES)}（${warnings.length} 個警告）`);
        if (editor) {
            show666Effect(editor);
        }
    } else {
        consecutiveCleanCount++;
        vscode.window.showInformationMessage(pickRandom(SUCCESS_MESSAGES));
        if (editor) {
            show666Effect(editor);
        }
        showStreakMessage();
    }
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
    if (statusBarItem) {
        statusBarItem.dispose();
    }
}

module.exports = {
    activate,
    deactivate,
    getRandomColor,
    pickRandom,
    checkDocument,
    show666Effect,
    updateStatusBar,
    showStreakMessage,
    SUCCESS_MESSAGES,
    ERROR_MESSAGES,
    WARNING_MESSAGES,
    STREAK_MESSAGES
}
