import * as vscode from "vscode";

export class TokenManager {
    private static globalState: vscode.Memento;

    static initAsync(context: vscode.ExtensionContext): void {
        this.globalState = context.globalState;
    }

    static setToken(token: string) {
        return this.globalState.update('askoverflowtoken', token);
    }
    static getToken(): string | undefined {
        return this.globalState.get('askoverflowtoken');
    }
}