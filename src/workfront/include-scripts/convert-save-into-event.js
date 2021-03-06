// ==UserScript==
// @name         Create events
// @namespace    https://www.emakina.com/
// @version      1.7
// @description  Will poll the success notification after save and thrown an event. Will throw event when a new line is added
// @author       Wouter Versyck
// @homepage	 https://github.com/EmakinaBE/tampermonkey-scripts
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @icon64       https://emakina.my.workfront.com/static/img/favicon.ico
// @match        https://emakina.my.workfront.com/timesheet/*
// @match        https://emakina.preview.workfront.com/timesheet/*
// @match        https://emakina.sb01.workfront.com/timesheet/*
// @match        https://emakina.my.workfront.com/timesheets/current*
// @match        https://emakina.preview.workfront.com/timesheets/current*
// @match        https://emakina.sb01.workfront.com/timesheets/current*
// @grant        none
// @downloadURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/master/src/workfront/include-scripts/convert-save-into-event.js
// @updateURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/master/src/workfront/include-scripts/convert-save-into-event.js
// @supportURL	 https://bugtracking.emakina.net/projects/ENWORKFNAV/summary
// ==/UserScript==


(function() {
    'use strict';

    setupListeners();

    function pollNetworkRequestSuccess() {
        if (document.getElement('#content-timesheet-view').getAttribute('data-tampermonkey-id') ) {
            setTimeout(pollNetworkRequestSuccess, 500);
            return;
        }

        setupListeners();
        const event = new Event('WF_RELOAD');
        dispatchEvent(event);
    }

    function setupListeners() {
        // setup attribute (to check page refresh) and listeners for on save button
        document.getElement('#content-timesheet-view').setAttribute('data-tampermonkey-id', true);

        const saveButton = document.getElement('.btn.primary.btn-primary');

        if (saveButton) {
            saveButton.addEventListener('click', pollNetworkRequestSuccess);
        }

        // setup listeners for new task
        getNewTaskButtons().forEach(button => button.addEventListener('click', newTaskClickHandler));
    }

    function newTaskClickHandler(event) {
        const parent = event.target.parentNode.parentNode.parentNode.parentNode;
        const workitemobjid = parent.getAttribute('data-workitemobjid');

        // use setTimeout to execute this after workfront rendered the new task line
        setTimeout(() => {
            // get all the lines for this task
            const lines = document.getElements(`[data-workitemobjid=${workitemobjid}].TASK`);

            // get the last (latest added) value and add a click handler for it for when other lines are added
            const newLine = lines.pop();
            newLine.getElement('.hour-type-and-role-add').addEventListener('click', newTaskClickHandler);

            // dispatch event containing the original event and the newly added line
            const newTaskEvent = new CustomEvent('WF_NEW-TASK', {'detail': { event, newLine, workitemobjid } });
            dispatchEvent(newTaskEvent);
        });
    }

    function dispatchEvent(event) {
        document.head.dispatchEvent(event);
    }

    function getNewTaskButtons() {
        return document.getElements('.hour-type-and-role-add');
    }

})();
