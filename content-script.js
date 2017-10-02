function copySelection() {
    var selectedText = window.getSelection().toString().trim() || "yeeeeeeepeeee";

    if (selectedText) {
        // Send the selected text to kinto somewhere.
        // Mozilla demo server (flushed every day)
        var server = "https://kinto.notmyidea.org/v1";
        // Simplest credentials ever.
        var authorization =  "Basic " + btoa("alexis:notsecret");

        // Kinto bucket/collection.
        var bucket = "alexis";
        var collection = "notes";
        var url = `${server}/buckets/${bucket}/collections/${collection}/records`;

        // Reusable HTTP headers.
        var headers = {
            "Accept":        "application/json",
            "Content-Type":  "application/json",
            "Authorization": authorization
        };
        var body = JSON.stringify({
            data: {
                text: selectedText,
                url: window.location.href,
                date: new Date()
            }});
        console.log('Sending this', body)
        fetch(url, {method: "POST", body: body, headers: headers})
            .then(function (response) {
              browser.runtime.sendMessage("Saved!")
        })
    }
}

browser.runtime.onMessage.addListener(function(msg) {
    console.log('received message', msg);
    if (msg.action == 'copy-selection') {
        copySelection();
    }
});
