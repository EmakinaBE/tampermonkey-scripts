// ==UserScript==
// @name         Convert save into event
// @namespace    https://www.emakina.com/
// @version      1.0
// @description  Will poll the success notification after save and thrown an event
// @author       Wouter Versyck
// @homepage	 https://gitlab.emakina.net/jev/tampermonkey-scripts
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @icon64       https://emakina.my.workfront.com/static/img/favicon.ico
// @match        https://emakina.my.workfront.com/timesheet/*
// @match        https://emakina.my.workfront.com/timesheets/current*
// @grant        none
// @downloadURL	 https://gitlab.emakina.net/jev/tampermonkey-scripts/-/raw/master/src/include-scripts/convert-save-into-event.js
// @updateURL	 https://gitlab.emakina.net/jev/tampermonkey-scripts/-/raw/master/src/include-scripts/convert-save-into-event.js
// @supportURL	 https://bugtracking.emakina.net/projects/ENWORKFNAV/summary
// ==/UserScript==


(function() {
    'use strict';

    document.getElement('.btn.primary.btn-primary').addEventListener('click', () => pollNetworkRequestSuccess(getNrOfNotifications()));

    function pollNetworkRequestSuccess(nrOfPreviousNotifications) {
        console.log('polling notification', nrOfPreviousNotifications);
        const nrOfNotifications = getNrOfNotifications();

        if (nrOfNotifications === nrOfPreviousNotifications) {
            setTimeout(pollNetworkRequestSuccess, 500, nrOfNotifications);
            return;
        }

        const event = new Event('WF_RELOAD');

        document.body.dispatchEvent(event);
    }

    function getNrOfNotifications() {
        return document.getElements('.Notify.success').length;
    }
})();