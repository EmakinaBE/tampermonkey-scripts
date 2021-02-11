// ==UserScript==
// @name         Create events
// @namespace    https://www.emakina.com/
// @version      1.1
// @description  Will poll the success notification after save and thrown an event. Will throw event when a new line is added
// @author       Wouter Versyck
// @homepage	 https://gitlab.emakina.net/jev/tampermonkey-scripts
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @icon64       https://emakina.my.workfront.com/static/img/favicon.ico
// @match        https://emakina.my.workfront.com/timesheet/*
// @match        https://emakina.my.workfront.com/timesheets/current*
// @grant        none
// @downloadURL	 https://gitlab.emakina.net/jev/tampermonkey-scripts/-/raw/master/src/workfront/include-scripts/convert-save-into-event.js
// @updateURL	 https://gitlab.emakina.net/jev/tampermonkey-scripts/-/raw/master/src/workfront/include-scripts/convert-save-into-event.js
// @supportURL	 https://bugtracking.emakina.net/projects/ENWORKFNAV/summary
// ==/UserScript==


(function() {
    'use strict';

    setupListenerAndAttribute();
    setUpNewTaskListeners();

    function pollNetworkRequestSuccess() {
        if (document.getElement('#content-timesheet-view').getAttribute('data-tampermonkey-id') ) {
            setTimeout(pollNetworkRequestSuccess, 500);
            return;
        }

        setupListenerAndAttribute();
        const event = new Event('WF_RELOAD');
        dispatchEvent(event);
    }

    function setupListenerAndAttribute() {
        document.getElement('#content-timesheet-view').setAttribute('data-tampermonkey-id', true);
        document.getElement('.btn.primary.btn-primary').addEventListener('click', pollNetworkRequestSuccess);
    }

    function setUpNewTaskListeners() {
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
