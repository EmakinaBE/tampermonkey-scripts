// ==UserScript==
// @name         Workfront highlight Today
// @namespace    https://www.emakina.com/
// @version      1.2
// @description  Highlight current day
// @author       Jeffrey Vandenbossche
// @homepage	 https://github.com/EmakinaBE/tampermonkey-scripts
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @icon64       https://emakina.my.workfront.com/static/img/favicon.ico
// @match        https://emakina.my.workfront.com/timesheet/*
// @match        https://emakina.my.workfront.com/timesheets/current*
// @grant        none
// @downloadURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/master/src/workfront/highlight-currentday.js
// @updateURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/master/src/workfront/highlight-currentday.js
// @supportURL	 https://bugtracking.emakina.net/projects/ENWORKFNAV/summary
// ==/UserScript==

(function() {
    'use strict';

    document.head.addEventListener('WF_RELOAD', init);
    init();

    function init() {
        const x = document.getElementsByClassName('today');

        for (let i = 0; i < x.length; i++) {
            x[i].style.backgroundColor = 'lemonchiffon';
            x[i].style.backgroundImage = 'none';
        }
    }

})();
