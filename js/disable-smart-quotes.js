"use strict";

(function(){

var keyPress = null;

function disableQuoteReplacement(element) {

    // This function disables curly quote replacement on `element`. The goals
    // of this are:
    //
    // - If a straight quote is entered by the user, and the browser tries to
    //   replace it with a curly quote, that should be prevented.
    // - If the user explicitly enters a curly quote, whether by typing it,
    //   pasting it, or any other method, that should not be prevented.
    // - Ideally we do not want to disable other features the user may have
    //   enabled, such as spell check or autocorrect.
    // - This should all be done as safely as possible (avoiding unexpected
    //   behavior in untested browsers) and as transparently as possible (so
    //   the user can always see what text has been entered).

    // This user agent detection is not ideal, but I couldn't find a proper
    // way to check whether a browser uses the `insertReplacementText` input
    // type. Checking `maxTouchPoints` is necessary because iPads use the Mac
    // user agent despite behaving very differently.

    const agent = navigator.userAgent;

    if (agent.includes('Safari/') &&
        agent.includes('Macintosh;') &&
        agent.includes('Chrome/') == false &&
        navigator.maxTouchPoints == 0) {

        // Safari for Mac uses a unique input type for replacements, it's easy
        // to prevent them with a low risk of anything unexpected happening.
        // It's important to note that in Safari for Mac, the replacement does
        // not always happen immediately after typing the character, so the
        // default approach below will not work.

        //console.debug('Using Safari for Mac curly quote prevention.');

        element.addEventListener('beforeinput', function(e) {
            if (e.inputType == 'insertReplacementText') {
                if (straightenQuote(e.data)) {
                    console.debug('Ignoring replacement: '+e.data);
                    e.preventDefault();
                }
            }
        }, false);

    } else if (agent.includes('Macintosh;')) {

        // In other browsers, we need to use a different approach. Some
        // browsers (like Chromium) send a `beforeinput` event as they're
        // about to replace a straight quote with a curly quote. Other
        // browsers (like Safari on iOS) insert the curly quote directly.
        //
        // We can handle both of these by keeping track of the last key press,
        // and comparing it with the text that's about to be inserted. If they
        // don't match, and the text to be inserted is a curly quote, we
        // prevent the action, insert a straight quote instead, and move the
        // insertion point to the end of the selection range.

        //console.debug('Using default curly quote prevention.');

        element.addEventListener('keypress', function(e) {
            keyPress = e.key;
        }, false);

        element.addEventListener('beforeinput', function(e) {
            if (e.inputType == 'insertText') {
                const input = e.data;
                if (keyPress && input != keyPress) {
                    const straight = straightenQuote(input);
                    if (straight) {
                        console.debug('Straightening replacement: '+e.data);
                        e.preventDefault();
                        const element = e.target;
                        const start = element.selectionStart;
                        const end = element.selectionEnd;
                        element.setRangeText(straight, start, end, 'end');
                    }
                }
            }
        }, false);
    }
}

function straightenQuote(text) {
    switch (text) {
        case '‘':
        case '’':
            return "'";
        case '“':
        case '”':
            return '"';
        default:
            return null;
    }
}

window.addEventListener("DOMContentLoaded", function() {
    const element = document.getElementById('txtIn');
    disableQuoteReplacement(element);
}, false);

})();
