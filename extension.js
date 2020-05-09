// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

  let disposable = vscode.commands.registerCommand(
    "deletehere.delete",
    function () {
      let selection = vscode.window.activeTextEditor.selection;
      const activeTextEditor = vscode.window.activeTextEditor;
      let activeDocument = activeTextEditor.document;

      let anchorLine = selection.anchor.line;
      let anchorcharacter = selection.anchor.character;

      const currentLineText = activeDocument.lineAt(anchorLine).text;
      const arr = currentLineText
        .split(/[\W+]/)
        .filter((item) => item.length > 0);
      let targetStart, targetLength;
			let matched = false;
			let start = 0;
      for (let index = 0; index < arr.length; index++) {
        const item = arr[index];
				let i = currentLineText.indexOf(item, start);
				start = i+item.length;
        if (i <= anchorcharacter && i + item.length >= anchorcharacter) {
          targetStart = i;
          targetLength = item.length;
          matched = true;
          break;
        }
      }

      if (matched) {
        // clean current word
        let replaceRange = new vscode.Range(
          anchorLine,
          targetStart,
          anchorLine,
          targetStart + targetLength
        );
        activeTextEditor.edit((TextEditorEdit) => {
          TextEditorEdit.replace(replaceRange, "");
        });
      }
    }
  );

  context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
