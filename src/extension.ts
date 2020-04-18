// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "copyluapath" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('copyluapath.copyPath', () => {

		var fileUrl = vscode.window.activeTextEditor?.document.uri;
		if (!fileUrl) {
			vscode.window.showWarningMessage("can't get file path");
			return;
		}

		var fileExtName = '.lua';
		if (!fileUrl.fsPath.endsWith(fileExtName)) {
			vscode.window.showWarningMessage("only apply to lua files");
			return;
		}

		var filePath = vscode.workspace.asRelativePath(fileUrl);
		filePath = filePath.replace(/\\/g, '/');

		var workspaceFolder = vscode.workspace.getWorkspaceFolder(fileUrl);
		if (workspaceFolder && workspaceFolder.name) {
			filePath = filePath.replace(workspaceFolder.name + '/', '');
		}

		filePath = filePath.substring(0, filePath.length - 4);
		var fileName = path.basename(filePath);

		var pattern = (String)(vscode.workspace.getConfiguration().get('copyluapath.luaPathPrefix'));
		filePath = filePath.replace(pattern, '');

		var message = 'local ' + fileName + ' = require "' + filePath + '"'
		vscode.env.clipboard.writeText(message);
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
