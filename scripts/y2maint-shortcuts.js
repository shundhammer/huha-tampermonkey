// ==UserScript==
// @name         y2maint-shortcuts: Request y2logs, hwinfo, good bug report
// @namespace    https://github.com/shundhammer/huha-tampermonkey
// @version      1.0
// @description  Shortcuts for the YaST Bugzilla maintainer
// @author       Stefan Hundhammer <shundhammer@suse.com>
// @match        https://bugzilla.suse.com/show_bug.cgi?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=suse.com
// @grant        none
// @downloadURL  https://github.com/shundhammer/huha-tampermonkey/raw/master/scripts/y2maint-shortcuts.js
// @updateURL    https://github.com/shundhammer/huha-tampermonkey/raw/master/scripts/y2maint-shortcuts.js
// ==/UserScript==

(function() {
    'use strict';

    // The ID of the text area for writing comments in Bugzilla
    const comment_textarea_id = 'comment';

    // Generic wiki page about 'how' and 'why' to report good bugreports
    const bug_howto = 'https://en.opensuse.org/openSUSE:How_to_Write_a_Good_Bugreport';

    // More specific FAQ-like wiki page containing details about getting YaST/other logs, enabling verbose mode and more
    const logs_howto = 'https://en.opensuse.org/openSUSE:Report_a_YaST_bug';

    const need_y2logs = "Please attach y2logs generated with the supplied 'save_y2logs' script. " +
          "\nSee \n\n  " + logs_howto + "\n\n";

    const need_hwinfo = "Please attach the output of the 'hwinfo' command.\n\n";

    const need_good_bug = 'Please read\n\n' + bug_howto + '\n\n';

    // Mapping from text to replace to the new text
    // Use either ['old text', 'new text'] or [regex, 'new text']
    // See, e.g., https://www.freecodecamp.org/news/regular-expressions-for-beginners/ for reference
    const translations = [
        [/!y2logs/gi, need_y2logs],
        [/!hwinfo/gi, need_hwinfo],
        [/!good-bug/gi, need_good_bug],
        [/!good_bug/gi, need_good_bug],
    ];

    function adaptComment(comment_area) {
        var old_text = comment_area.value;
        var new_text = comment_area.value;

        translations.forEach((texts) => {
            var find_text = texts[0];
            var replace_with = texts[1];

            if (new_text.match(find_text)) {
                console.log('Replacing ' + find_text + ' with ' + replace_with);
                new_text = new_text.replaceAll(find_text, replace_with);
            }
        });

        if (new_text != old_text) {
            console.log('New comment: ' + new_text);
            comment_area.value = new_text;
        }
    }

    var comment_area = document.getElementById(comment_textarea_id);

    if (comment_area != undefined) {
        comment_area.addEventListener("input", function(){
            adaptComment(comment_area);
        });
    }
})();
