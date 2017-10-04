var browser = browser || chrome;

function copySelection(sanitizerOptions) {
    var selectedText = getSelectionHtml(sanitizerOptions);

    if (selectedText) {
        var tag = window.prompt("Saving the selected content. Which tag should be set?", "default");
        browser.runtime.sendMessage({
             type: "saveNote",
             note: {
                 text: selectedText,
                 url: window.location.href,
                 date: new Date(),
                 tag: tag
             }
         });
    }
}

function getSelectionHtml(sanitizerOptions) {
    var html = "";
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var container = document.createElement("div");
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                var child = sel.getRangeAt(i).cloneContents();
                container.appendChild(child);
            }
            html = container.innerHTML;
        }
    } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
            html = document.selection.createRange().htmlText;
        }
    }
    var purify = getPurify();
    var sanitized = purify.sanitize(html, sanitizerOptions);
    return sanitized;
}

browser.runtime.onMessage.addListener(function(msg) {
      if (msg.action == 'copy-selection') {
          copySelection(JSON.parse(msg.options));
      }
});
