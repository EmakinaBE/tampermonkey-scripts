// ==UserScript==
// @name         Create events
// @namespace    https://www.emakina.com/
// @version      1.9
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
// @downloadURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/New-UI/src/workfront/include-scripts/convert-save-into-event.js
// @updateURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/New-UI/src/workfront/include-scripts/convert-save-into-event.js
// @supportURL	 https://bugtracking.emakina.net/projects/ENWORKFNAV/summary
// ==/UserScript==


(function(window) {
    'use strict';

    let addedEventListener;

    window.addEventListener("popstate", () => loadDoc());
    loadDoc();
    
    // if Iframe changes call reset and init()

    async function loadDoc() {
        console.log('load doc');
        checkUI();
        resetDoc();
        executeCallback();
        setTimeout(setupListeners, 1000);
    }

    async function pollNetworkRequestSuccess() {
        console.log('pollNet');
        const view = await getElementsFromDocument('#content-timesheet-view');
        if(!view) return console.log('no-view');
        if (view[0].getAttribute('data-tampermonkey-id') ) {
            setTimeout(pollNetworkRequestSuccess, 500);
            return;
        }

        setTimeout(loadDoc, 1000);
    }

    async function setupListeners() {
        // setup attribute (to check page refresh) and listeners for on save button
        console.log('settinguplistner');
        const view = await getElementsFromDocument('#content-timesheet-view')
        if(!view) return; 
        view[0].setAttribute('data-tampermonkey-id', true);

        const saveButton = await getElementsFromDocument('.btn.primary.btn-primary');

        if (saveButton && !addedEventListener) {
            addedEventListener = true;
            console.log('setting up clickhandler');
            saveButton[0].addEventListener('click', pollNetworkRequestSuccess);
        }

        // setup listeners for new task
        if (window.wfGetOptions().autoSelect) { 
            const taskButtons = await getElementsFromDocument('.hour-type-and-role-add');
            if(!taskButtons) return;
            taskButtons.forEach(button => button.addEventListener('click', newTaskClickHandler));
        }
    }

    function newTaskClickHandler(event) {
        const parent = event.target.parentNode.parentNode.parentNode.parentNode;
        const workitemobjid = parent.getAttribute('data-workitemobjid');

        // use setTimeout to execute this after workfront rendered the new task line
        setTimeout( async () => {
            // get all the lines for this task
            const lines = await getElementsFromDocument(`[data-workitemobjid='${workitemobjid}'].TASK`);
            if(!lines) return;

            // get the last (latest added) value and add a click handler for it for when other lines are added
            const newLine = lines[lines.length-1];
            newLine.getElement('.hour-type-and-role-add').addEventListener('click', newTaskClickHandler);

            // dispatch event containing the original event and the newly added line
            const newTaskEvent = new CustomEvent('WF_NEW-TASK', {'detail': { event, newLine, workitemobjid } });
            dispatchEvent(newTaskEvent);
        });
    }

    function dispatchEvent(event) {
        document.head.dispatchEvent(event);
    }

})(window);