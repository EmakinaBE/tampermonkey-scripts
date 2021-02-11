// ==UserScript==
// @name         Select next task line
// @namespace    https://www.emakina.com/
// @version      1.1
// @author       Wouter Versyck
// @connect      self
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @supportURL   https://bugtracking.emakina.net/projects/ENWORKFNAV/summary
// @homepage     https://gitlab.emakina.net/jev/tampermonkey-scripts
// @match        https://emakina.my.workfront.com/timesheet/*
// @match        https://emakina.my.workfront.com/timesheets/current*
// @downloadURL  https://gitlab.emakina.net/jev/tampermonkey-scripts/-/raw/master/src/workfront/select-next-task-line.js
// @updateURL    https://gitlab.emakina.net/jev/tampermonkey-scripts/-/raw/master/src/workfront/select-next-task-line.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    document.head.addEventListener('WF_NEW-TASK', handleEvent);

    function handleEvent(e) {
        const { newLine, workitemobjid } = e.detail;

        // Open drop down on lew line
        const hoursDropDown = newLine.getElement('.hour-type-drop-down');
        hoursDropDown.click();

        // get option that is not yet picked and click it
        const option = getFirstUnusedOption(workitemobjid);
        option.click();
    }

    function getFirstUnusedOption(workitemobjid) {
        const lines = document.getElements(`[data-workitemobjid=${workitemobjid}].TASK`);
        const usedValues = lines.getElements('.hour-type-drop-down').map(e => e.getElement('.dd-hidden-input')[0].value);

        const options = [...document.getElement('.item-list').children];
        const leftOver = options.filter(e => !usedValues.contains(e.getAttribute('data-value')));

        return leftOver.length > 0 ? leftOver[0] : options[0];
    }

    function addClickHandler(element) {
        element.addEventListener('click', handleEvent);
    }
})();
