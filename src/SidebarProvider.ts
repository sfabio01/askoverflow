import { join } from "path";
import polka = require("polka");
import * as vscode from "vscode";
import { TokenManager } from './TokenManager';

const apiBaseUrl = "https://xeyuug.deta.dev";

export class SidebarProvider implements vscode.WebviewViewProvider {
    _view?: vscode.WebviewView;
    _doc?: vscode.TextDocument;



    constructor(private readonly _extensionUri: vscode.Uri) { }

    public resolveWebviewView(webviewView: vscode.WebviewView) {
        this._view = webviewView;
        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,

            localResourceRoots: [this._extensionUri],
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        const app = polka();

        app.get("/auth/:token", (req, res) => {
            app.server?.close();
            const token = req.params.token;
            if (!token) {
                res.end("auth fail");
                return;
            }
            this._view?.webview.postMessage({ type: "token", value: token });
            TokenManager.setToken(token);
            console.log("Token: " + token);
            res.end("auth success, you can close this window now");

        });

        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case "onAuth": {
                    // data.value is True for cached results, False otherwise
                    if (data.value) {
                        const cachedToken = TokenManager.getToken();
                        if (cachedToken) {
                            this._view?.webview.postMessage({ type: "token", value: cachedToken });
                            return;
                        }
                    }
                    app.listen(56789, () => {
                        console.log("running polka on localhost:56789");
                        vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(apiBaseUrl + "/auth"));
                    });
                    break;
                }
                case "onInfo": {
                    if (!data.value) {
                        return;
                    }
                    vscode.window.showInformationMessage(data.value);
                    break;
                }
                case "onError": {
                    if (!data.value) {
                        return;
                    }
                    vscode.window.showErrorMessage(data.value);
                    break;
                }
            }
        });



    }

    public revive(panel: vscode.WebviewView) {
        this._view = panel;
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        console.log(this._extensionUri.path);
        const styleResetUri = webview.asWebviewUri(
            vscode.Uri.file(join(this._extensionUri.path, "media", "reset.css"))
        );
        const styleVSCodeUri = webview.asWebviewUri(
            vscode.Uri.file(join(this._extensionUri.path, "media", "vscode.css"))
        );

        const scriptUri = webview.asWebviewUri(
            vscode.Uri.file(join(this._extensionUri.path, "out", "compiled/sidebar.js"))
        );
        const styleMainUri = webview.asWebviewUri(
            vscode.Uri.file(join(this._extensionUri.path, "out", "compiled/sidebar.css"))
        );

        // Use a nonce to only allow a specific script to be run.
        const nonce = getNonce();

        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
        -->
        <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource
            }; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
                <link href="${styleMainUri}" rel="stylesheet">
                <script nonce="${nonce}">
                    const tsvscode = acquireVsCodeApi();
                </script>

			</head>
            <body>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
    }
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}