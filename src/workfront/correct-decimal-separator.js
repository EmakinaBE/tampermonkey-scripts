// ==UserScript==
// @name         Correct decimal separator
// @namespace    https://www.emakina.com/
// @version      1.3
// @author       Wouter Versyck
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @supportURL   https://bugtracking.emakina.net/projects/ENWORKFNAV/summary
// @homepage     https://github.com/EmakinaBE/tampermonkey-scripts
// @match        https://emakina.my.workfront.com/timesheet/*
// @match        https://emakina.my.workfront.com/timesheets/current*
// @downloadURL  https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/master/src/workfront/correct-decimal-separator.js
// @updateURL    https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/master/src/workfront/correct-decimal-separator.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const inputFieldSelector = '.fc > input';

    document.head.addEventListener('WF_RELOAD', init);
    document.head.addEventListener('WF_NEW-TASK', init);


    init();

    function init() {
        const elements = document.getElements(inputFieldSelector);

        elements.forEach(el => {
            el.addEventListener('keydown', ev => {
                checkDecimal(ev);
            });
        });
    }

    function checkDecimal(ev) {
        const keyPressed = ev.key;
        const correctSeparator = getSystemDecimalSeparator();
        const wrongSeparator = correctSeparator === '.' ? ',' : '.';
        if (keyPressed === wrongSeparator) {
            setTimeout(() => { ev.target.value = ev.target.value.slice(0, -1) + correctSeparator; }, 0);
        }
    }

    function getSystemDecimalSeparator() {
        var n = 1.1;
        return n.toLocaleString().substring(1, 2);
    }
})();
