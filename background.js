/**
 * Returns all of the registered extension commands for this extension
 * and their shortcut (if active).
 *
 * Since there is only one registered command in this sample extension,
 * the returned `commandsArray` will look like the following:
 *    [{
 *       name: "toggle-feature",
 *       description: "Send a 'toggle-feature' event to the extension"
 *       shortcut: "Ctrl+Shift+U"
 *    }]
 */
var gettingAllCommands = browser.commands.getAll();
gettingAllCommands.then((commands) => {
  for (let command of commands) {
    console.log(command);
  }
});

/**
 * Fired when a registered command is activated using a keyboard shortcut.
 *
 * In this sample extension, there is only one registered command: "Ctrl+Shift+U".
 * On Mac, this command will automatically be converted to "Command+Shift+U".
 */
browser.commands.onCommand.addListener((command) => {
    browser.tabs.query({active: true}).then((tabs) => {
        browser.tabs.sendMessage(tabs[0].id, {'action': 'copy-selection'});
    }, (error) => { console.log(`error: ${error}`)});
});

browser.runtime.onMessage.addListener(message => {
  browser.notifications.create({
    "title": "Public notes",
    "type": "basic",
    "message": message
  });
});
