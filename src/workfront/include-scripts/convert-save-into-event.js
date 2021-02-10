// ==UserScript==
// @name         Create events
// @namespace    https://www.emakina.com/
// @version      1.2
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

    document.head.addEventListener('WF_RELOAD', setUpNewTaskListeners);
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
        getNewTaskButtons().forEach(e => e.addEventListener('click', e => {
            const newTaskEvent = new CustomEvent('WF_NEW-TASK', {'detail': e });
            dispatchEvent(newTaskEvent);
        }));
    }

    function dispatchEvent(event) {
        document.head.dispatchEvent(event);
    }

    function getNewTaskButtons() {
        return document.getElements('.hour-type-and-role-add');
    }

})();
