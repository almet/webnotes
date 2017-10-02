function copySelection() {
    var selectedText = window.getSelection().toString().trim() || "yeeeeeeepeeee";

    if (selectedText) {
        browser.runtime.sendMessage({
            type: "request",
            body: {
                data: {
                    text: selectedText,
                    url: window.location.href,
                    date: new Date()
                }
            }
        });
    }
}

browser.runtime.onMessage.addListener(function(msg) {
    console.log('received message', msg);
    if (msg.action == 'copy-selection') {
        copySelection();
    }
});
