var browser = browser || chrome;

function copySelection(command){
    browser.tabs.query({active: true}).then((tabs) => {
        var tab = tabs[0];
        browser.tabs.executeScript(tab.id, {
            file: "libs/purify.js",
        }).then(() => {
            browser.storage.local.get("sanitizer_options").then((results) => {
                browser.tabs.sendMessage(tabs[0].id, {
                    'action': 'copy-selection',
                    'options': JSON.stringify(results.sanitizer_options)
                });
            });
        });
    }, (error) => { console.log(`error: ${error}`)});
}

function saveNote(note) {
    var keys = ["kinto_url", "kinto_bucket", "kinto_collection", "kinto_secret"];

    browser.storage.local.get(keys).then((result) => {
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


browser.contextMenus.create({
  id: "save-note",
  title: "Save as webnote",
  contexts: ["selection"]
});
browser.contextMenus.onClicked.addListener(function(info, tab) {
  switch (info.menuItemId) {
    case "save-note":
      copySelection();
      break;
  }
})
browser.commands.onCommand.addListener(copySelection);
