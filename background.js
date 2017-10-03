var browser = browser || chrome;
var gettingAllCommands = browser.commands.getAll();
gettingAllCommands.then((commands) => {
  for (let command of commands) {
    console.log(command);
  }
});

browser.commands.onCommand.addListener((command) => {
    browser.tabs.query({active: true}).then((tabs) => {
        browser.tabs.sendMessage(tabs[0].id, {'action': 'copy-selection'});
    }, (error) => { console.log(`error: ${error}`)});
});

function saveNote(note) {
    browser.storage.local.get(["kinto_url", "kinto_bucket", "kinto_collection", "kinto_secret"]).then((result) => {
        var authorization =  "Basic " + btoa(`notes:${result.kinto_secret}`);
        var bucket_url = `${result.kinto_url}/buckets/${result.kinto_bucket}`;
        var collection_url = `${bucket_url}/collections/${result.kinto_collection}`
        var records_url = `${collection_url}/records`;

        var headers = {
            "Accept":        "application/json",
            "Content-Type":  "application/json",
            "Authorization": authorization
        };

        fetch(records_url, {method: "POST", body: JSON.stringify({data: note}), headers: headers})
            .then((resp) => {
                if (resp.ok) {
                    browser.notifications.create({
                        "title": "Public notes",
                        "type": "basic",
                        "message": "Saved !"
                    });
                }
            });

    });
}


browser.runtime.onMessage.addListener(payload => {
    if (payload.type == "saveNote") {
        saveNote(payload.note);
    }
});
