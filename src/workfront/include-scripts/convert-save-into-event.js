// ==UserScript==
// @name         Convert save into event
// @namespace    https://www.emakina.com/
// @version      1.1
// @description  Will poll the success notification after save and thrown an event
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

    function pollNetworkRequestSuccess() {

        if (document.getElement('#content-timesheet-view').getAttribute('data-tampermonkey-id') ) {
            setTimeout(pollNetworkRequestSuccess, 500);
            return;
        }

        setupListenerAndAttribute();
        const event = new Event('WF_RELOAD');
        document.head.dispatchEvent(event);
    }

    function setupListenerAndAttribute() {
        document.getElement('#content-timesheet-view').setAttribute('data-tampermonkey-id', true);
        document.getElement('.btn.primary.btn-primary').addEventListener('click',pollNetworkRequestSuccess);
    }

})();
