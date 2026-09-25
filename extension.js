// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
    console.log('Congratulations, your extension "vscext" is now active!');

    context.subscriptions.push(vscode.commands.registerCommand('vscext.LaoTie', async function () {
        try {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showWarningMessage('請先打開一個文件！');
                return;
            }

            const document = editor.document;
            
            // 先觸發一次語言服務的驗證
            await vscode.commands.executeCommand('editor.action.triggerParameterHints');
            
            // 等待一下讓語言服務有時間進行驗證
            setTimeout(async () => {
                await checkDocument(document);
            }, 500);

        } catch (error) {
            vscode.window.showErrorMessage('老鐵錯啦！');
            console.error(error);
        }
    }));
}

// 添加裝飾器類型定義
let decorationType = vscode.window.createTextEditorDecorationType({
    after: {
        margin: '0 0 0 3em',
        textDecoration: 'none'
    },
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedOpen,
});

// 顯示浮動文字的函數
function show666Effect(editor) {
    // 獲取當前可見範圍
    const visibleRanges = editor.visibleRanges;
    if (visibleRanges.length === 0) return;
    
    const startLine = visibleRanges[0].start.line;
    const endLine = visibleRanges[0].end.line;
    
    // 顯示 3-6 個彈幕
    const count = Math.floor(Math.random() * 4) + 3;
    const decorations = [];
    
    for (let i = 0; i < count; i++) {
        // 在可見範圍內隨機選擇一行
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

// 生成隨機顏色
function getRandomColor() {
    const colors = ['#FF4444', '#44FF44', '#4444FF', '#FFFF44', '#FF44FF', '#44FFFF'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// 修改語法檢查函數
async function checkDocument(document) {
    const editor = vscode.window.activeTextEditor;
    
    // 獲取診斷信息
    const diagnostics = await vscode.languages.getDiagnostics(document.uri);
    
    // 檢查是否有錯誤
    const hasErrors = diagnostics.some(diagnostic => 
        diagnostic.severity === vscode.DiagnosticSeverity.Error
    );

    if (hasErrors) {
        vscode.window.showErrorMessage('老鐵錯啦！');
    } else {
        vscode.window.showInformationMessage('沒毛病阿老鐵！');
        show666Effect(editor);
    }
}

// This method is called when your extension is deactivated
function deactivate() {
	try {
		// 清理代碼...
	} catch (error) {
		vscode.window.showErrorMessage(`插件停用時發生錯誤: ${error.message}`);
		console.error(error);
	}
}

module.exports = {
	activate,
	deactivate,
	getRandomColor,
	checkDocument,
	show666Effect
}
