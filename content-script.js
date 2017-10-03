var browser = browser || chrome;

function copySelection() {
    var selectedText = getSelectionHtml();

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

function getSelectionHtml() {
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
    var sanitized = purify.sanitize(html, {
        ALLOWED_TAGS: ['em', 'a', 'strong', 'i', 'b', 'cite', 'abbr', 'acronym',
                       'address', 'br', 'dd', 'dl', 'dt', 'ul', 'li', 'p', 'pre',
                       'q', 's', 'small', 'sub', 'tt', 'u']
    });
    return sanitized;
}

browser.runtime.onMessage.addListener(function(msg) {
      console.log('received message', msg);
      if (msg.action == 'copy-selection') {
          copySelection();
      }
});
