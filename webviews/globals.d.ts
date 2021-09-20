import * as _vscode from "vscode";

type Callback = (response: string) => any;

declare global {
    const tsvscode: {
        postMessage: ({ type: string, callback: Callback }) => void;
    };
}