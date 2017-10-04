console.log("yepee");

browser.commands.getAll().then((commands) => {
    console.log("yepee 6");
  for (let command of commands) {
    console.log(command);
  }
});

console.log("yepee 2");
browser.commands.onCommand.addListener((command) => {
    console.log("command received");

    browser.tabs.query({active: true}).then((tabs) => {
        console.log("found active tab");
        var tab = tabs[0];
        browser.tabs.executeScript(tab.id, {
            file: "/libs/purify.js",
        }).then(() => {
            console.log("injected script");
            browser.storage.local.get("sanitizer_options").then((results) => {
                console.log("got options script");
                browser.tabs.sendMessage(tabs[0].id, {
                    'action': 'copy-selection',
                    'options': JSON.stringify(results.sanitizer_options)
                });
            });
        });
    }, (error) => { console.log(`error: ${error}`)});
});
console.log("yepee 3");
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

console.log("yepee 4");
browser.runtime.onMessage.addListener(payload => {
    console.log("message received in background.");

    if (payload.type == "saveNote") {
        saveNote(payload.note);
    }
});
console.log("yepee 5");
