import * as vscode from 'vscode';
import { SidebarProvider } from './SidebarProvider';

export function activate(context: vscode.ExtensionContext) {


	const sidebarProvider = new SidebarProvider(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			"asktostackoverflow-sidebar",
			sidebarProvider
		)
	);

	context.subscriptions.push(vscode.commands.registerCommand('asktostackoverflow.insertCode', () => {
		let editor = vscode.window.activeTextEditor;

		if (editor === undefined) {
			vscode.window.showErrorMessage('No active text editor');
			return;
		}
		let text = editor.document.getText(editor.selection);
		if (text === "") {
			vscode.window.showInformationMessage('Selection is empty');
			return;
		}
		sidebarProvider._view?.webview.postMessage({ type: "selectedCode", value: text });
	}));

	context.subscriptions.push(vscode.commands.registerCommand('asktostackoverflow.refresh', async () => {
		await vscode.commands.executeCommand("workbench.action.closeSidebar");
		await vscode.commands.executeCommand("workbench.view.extension.asktostackoverflow-sidebar-view");
		setTimeout(() => { vscode.commands.executeCommand("workbench.action.webview.openDeveloperTools"); }, 100);

	}));


}

// this method is called when your extension is deactivated
export function deactivate() { }
