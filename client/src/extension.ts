// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient/node';

let client: LanguageClient;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "kitter" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposableGreetings = vscode.commands.registerCommand('kitter.greetings', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		let kittDocs = "Click Here";
		vscode.window.showInformationMessage('Get Started by Viewing kitt.yml Documentation', kittDocs)
			.then(selection => {
				if (selection === kittDocs) {
					vscode.env.openExternal(vscode.Uri.parse('https://bing.com'));
				}
			});
	});

	context.subscriptions.push(disposableGreetings);

	// The server is implemented in node
	let serverModule = context.asAbsolutePath(path.join('server', 'out', 'server.js'));
	// The debug options for the server
	// --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
	let debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	let serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
			options: debugOptions
		}
	};
	
	// Options to control the language client
	let clientOptions: LanguageClientOptions = {
		// Register the server for yaml documents
		documentSelector: [{ language: 'yaml' }],
		synchronize: {
			// Notify the server about file changes to kitt*.yml files contained in the workspace
			fileEvents: [vscode.workspace.createFileSystemWatcher('../kitt.*\.yml')],
		}
	};

	// Create language client
	client = new LanguageClient('yamlLanguageServer', 'Yaml Language Server', serverOptions, clientOptions);

	// Start the client. This will also launch the server
	client.start();
}

// this method is called when your extension is deactivated
export function deactivate() {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
