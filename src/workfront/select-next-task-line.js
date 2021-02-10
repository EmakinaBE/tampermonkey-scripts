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

    document.head.addEventListener('WF_RELOAD', init);
    init();

    function init() {
        const buttons = getButtons();

        buttons.forEach(e => addClickHandler(e));
    }

    function handleEvent(e) {
        const parent = e.target.parentNode.parentNode.parentNode.parentNode;
        const attributeValue = parent.getAttribute('data-workitemobjid');

        // use setTimeout to execute this after workfront rendered the new dropdown
        setTimeout(() => {
            // get all the lines for this task
            const lines = document.getElements(`[data-workitemobjid=${attributeValue}].TASK`);

            // get the last (latest added) value and add a click handler for it for when other lines are added
            const newLine = lines.pop();
            addClickHandler(newLine.getElement('.hour-type-and-role-add'));

            // open dropdown
            const hoursDropDown = newLine.getElement('.hour-type-drop-down');
            hoursDropDown.click();

            // get option that is not yet picked and click it
            const usedValues = lines.getElements('.hour-type-drop-down').map(e => e.getElement('.dd-hidden-input')[0].value);
            const option = getFirstUnusedOptions(usedValues);
            option.click();

        }, 0);
    }

    function addClickHandler(element) {
        element.addEventListener('click', handleEvent);
    }

    function getButtons() {
        return document.getElements('.hour-type-and-role-add');
    }

    function getFirstUnusedOptions(values) {
        const options = [...document.getElement('.item-list').children];
        const leftOver = options.filter(e => !values.contains(e.getAttribute('data-value')));

        return leftOver.length > 0 ? leftOver[0] : options[0];
    }
})();
