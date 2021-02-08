// ==UserScript==
// @name         Correct decimal separator
// @namespace    https://www.emakina.com/
// @version      1.0
// @author       Wouter Versyck
// @connect      self
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @supportURL   https://bugtracking.emakina.net/projects/ENWORKFNAV/summary
// @homepage     https://gitlab.emakina.net/jev/tampermonkey-scripts
// @match        https://emakina.my.workfront.com/timesheet/*
// @match        https://emakina.my.workfront.com/timesheets/current*
// @downloadURL  https://gitlab.emakina.net/jev/tampermonkey-scripts/-/raw/master/src/workfront/correct-decimal-separator.js
// @updateURL    https://gitlab.emakina.net/jev/tampermonkey-scripts/-/raw/master/src/workfront/correct-decimal-separator.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    const inputFieldSelector = '.fc > input';

    document.body.addEventListener('WF_RELOAD', init);

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
        console.log(ev.target.value);
        if (keyPressed === wrongSeparator) {
            setTimeout(() => { ev.target.value = ev.target.value.slice(0, -1) + correctSeparator; }, 0);
        }
    }


    function getSystemDecimalSeparator() {
        var n = 1.1;
        return n.toLocaleString().substring(1, 2);
    }
})();
