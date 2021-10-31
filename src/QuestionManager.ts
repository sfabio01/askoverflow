import * as vscode from "vscode";

export class QuestionManager {
    private static globalState: vscode.Memento;

    static initAsync(context: vscode.ExtensionContext): void {
        this.globalState = context.globalState;
    }

    static addQuestion(id: string) {
        let a = this.getQuestions();
        a.push(id);
        this.globalState.update('questions', a);
    }
    static getQuestions(): string[] {
        let a = this.globalState.get('questions');
        if (a === undefined) {
            return [];
        }
        return a as string[];
    }
}