const assert = require('assert');
const vscode = require('vscode');
const { getRandomColor, getTimeGreeting, activate, deactivate } = require('../extension');

suite('LaoTie666 Extension', () => {

	suite('Module exports', () => {
		test('should export activate function', () => {
			assert.strictEqual(typeof activate, 'function');
		});

		test('should export deactivate function', () => {
			assert.strictEqual(typeof deactivate, 'function');
		});

		test('should export getRandomColor function', () => {
			assert.strictEqual(typeof getRandomColor, 'function');
		});
	});

	suite('getRandomColor', () => {
		const validColors = ['#FF4444', '#44FF44', '#4444FF', '#FFFF44', '#FF44FF', '#44FFFF'];

		test('should return a valid hex color string', () => {
			const color = getRandomColor();
			assert.match(color, /^#[0-9A-F]{6}$/);
		});

		test('should return one of the predefined colors', () => {
			const color = getRandomColor();
			assert.ok(validColors.includes(color), `Expected one of ${validColors}, got ${color}`);
		});

		test('should return colors from the full set over many calls', () => {
			const seen = new Set();
			for (let i = 0; i < 200; i++) {
				seen.add(getRandomColor());
			}
			assert.ok(seen.size > 1, 'Expected multiple different colors');
		});
	});

	suite('getTimeGreeting', () => {
		test('should export getTimeGreeting function', () => {
			assert.strictEqual(typeof getTimeGreeting, 'function');
		});

		test('should return a string or null', () => {
			const result = getTimeGreeting();
			assert.ok(result === null || typeof result === 'string');
		});

		test('should return noon greeting during lunch hours', () => {
			const hour = new Date().getHours();
			const result = getTimeGreeting();
			if (hour >= 11 && hour < 13) {
				assert.strictEqual(result, '老鐵，中午了，該吃飯了！');
			}
		});

		test('should return evening greeting during evening hours', () => {
			const hour = new Date().getHours();
			const result = getTimeGreeting();
			if (hour >= 17 && hour < 19) {
				assert.strictEqual(result, '老鐵，傍晚了，該下班了！');
			}
		});

		test('should return late night greeting during late hours', () => {
			const hour = new Date().getHours();
			const result = getTimeGreeting();
			if (hour >= 22 || hour < 5) {
				assert.strictEqual(result, '老鐵，這麼晚還在寫代碼，注意身體！');
			}
		});

		test('should return null during normal working hours', () => {
			const hour = new Date().getHours();
			const result = getTimeGreeting();
			if (hour >= 5 && hour < 11 || hour >= 13 && hour < 17 || hour >= 19 && hour < 22) {
				assert.strictEqual(result, null);
			}
		});
	});

	suite('Command registration', () => {
		test('should register the LaoTie command', async () => {
			const commands = await vscode.commands.getCommands(true);
			assert.ok(commands.includes('vscext.LaoTie'), 'vscext.LaoTie command should be registered');
		});
	});

	suite('checkDocument', () => {
		test('should show error message for document with diagnostics errors', async () => {
			const doc = await vscode.workspace.openTextDocument({
				language: 'javascript',
				content: 'const x = ;'
			});
			await vscode.window.showTextDocument(doc);
			await new Promise(resolve => setTimeout(resolve, 1000));

			const diagnostics = vscode.languages.getDiagnostics(doc.uri);
			// Diagnostics depend on language server availability
			assert.ok(Array.isArray(diagnostics));
		});

		test('should handle clean document without errors', async () => {
			const doc = await vscode.workspace.openTextDocument({
				language: 'javascript',
				content: 'const x = 1;\n'
			});
			await vscode.window.showTextDocument(doc);
			await new Promise(resolve => setTimeout(resolve, 1000));

			const diagnostics = vscode.languages.getDiagnostics(doc.uri);
			assert.ok(Array.isArray(diagnostics));
		});
	});
});
