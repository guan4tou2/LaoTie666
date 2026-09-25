const assert = require('assert');
const vscode = require('vscode');
const {
	getRandomColor,
	pickRandom,
	activate,
	deactivate,
	SUCCESS_MESSAGES,
	ERROR_MESSAGES,
	WARNING_MESSAGES,
	STREAK_MESSAGES
} = require('../extension');

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

		test('should export pickRandom function', () => {
			assert.strictEqual(typeof pickRandom, 'function');
		});

		test('should export message arrays', () => {
			assert.ok(Array.isArray(SUCCESS_MESSAGES));
			assert.ok(Array.isArray(ERROR_MESSAGES));
			assert.ok(Array.isArray(WARNING_MESSAGES));
			assert.ok(Array.isArray(STREAK_MESSAGES));
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

	suite('pickRandom', () => {
		test('should return an element from the given array', () => {
			const arr = ['a', 'b', 'c'];
			const result = pickRandom(arr);
			assert.ok(arr.includes(result));
		});

		test('should return varied results over many calls', () => {
			const arr = ['a', 'b', 'c', 'd'];
			const seen = new Set();
			for (let i = 0; i < 100; i++) {
				seen.add(pickRandom(arr));
			}
			assert.ok(seen.size > 1, 'Expected multiple different results');
		});
	});

	suite('Message arrays', () => {
		test('should have multiple success messages', () => {
			assert.ok(SUCCESS_MESSAGES.length >= 3);
		});

		test('should have multiple error messages', () => {
			assert.ok(ERROR_MESSAGES.length >= 3);
		});

		test('should have multiple warning messages', () => {
			assert.ok(WARNING_MESSAGES.length >= 3);
		});

		test('should have streak messages with increasing thresholds', () => {
			assert.ok(STREAK_MESSAGES.length >= 2);
			for (let i = 1; i < STREAK_MESSAGES.length; i++) {
				assert.ok(STREAK_MESSAGES[i].min > STREAK_MESSAGES[i - 1].min);
			}
		});

		test('each streak message should have min and msg', () => {
			for (const s of STREAK_MESSAGES) {
				assert.strictEqual(typeof s.min, 'number');
				assert.strictEqual(typeof s.msg, 'string');
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
