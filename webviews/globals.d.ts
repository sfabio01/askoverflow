import * as _vscode from "vscode";

declare global {
    const tsvscode: {
        postMessage: ({ type: string, value: any }) => void;
    };
    const request: {
        get: (url: string, options: any, callback: (error: any, response: Response, body: any) => void) => void;
    };
}