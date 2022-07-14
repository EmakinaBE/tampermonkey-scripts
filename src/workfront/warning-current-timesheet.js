// ==UserScript==
// @name         Warning current timesheet
// @namespace    https://www.emakina.com/
// @version      2.0
// @description  This script will show a warning if you are not looking at the current week.
// @author       Wouter Versyck
// @match        https://emakina.my.workfront.com/*
// @match        https://emakina.preview.workfront.com/*
// @match        https://emakina.sb01.workfront.com/*
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @supportURL   https://emakina.my.workfront.com/requests/new?activeTab=tab-new-helpRequest&projectID=5d5a659a004ee38ffbb5acc9b3c23c4c&path=61685dd40006ed63ccba6a27b6e31226
// @homepage     https://github.com/EmakinaBE/tampermonkey-scripts
// @downloadURL  https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/cleanup/src/workfront/warning-current-timesheet.js
// @updateURL    https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/cleanup/src/workfront/warning-current-timesheet.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const messageStyle = 'padding: 15px; background: tomato; color: white;';

    callback(init);
    init();

    async function init() {
        const openTsInPast = await getOldestOpenTsBeforeToday();
        const getTimesheetId = await window.location.href.split('/')[4];
        if(!getTimesheetId) return;
        const currentTsId = getTimesheetId;
        console.log('getTime', getTimesheetId);
        console.log('current', currentTsId);

        const currentTs = await getCurrentTs(currentTsId);
        const noOlderTs = noOlderTsExist(openTsInPast, currentTsId, currentTs);

        redirectIfNeeded(openTsInPast, noOlderTs);

        const isCurrentTs = await getElementsFromDocument('.grid-cell.hour-cell.current-day', document);

        if (!isCurrentTs || openTsInPast) {

            const header = await getElementsFromDocument('.wf-mfe_timesheets', document);
            if(!header) return;

            // check if warning message was created already
            const messageBoxId = 'messageBoxId13';
            const oldMessageBox = await getElementsFromDocument(`#${messageBoxId}`);
            if(oldMessageBox) return;

            const message = createMessage(isCurrentTs, openTsInPast, noOlderTs);
            const messageBox = createElementWithText('p', message);
            messageBox.classList.add('wrong-timesheet');
            messageBox.id = messageBoxId;

            header[0].appendChild(messageBox);
        }
    }

    function createElementWithText(tagName, text) {
        const element = document.createElement(tagName);
        element.innerHTML = text;
        return element;
    }

    function createMessage(isCurrentTs, olderTs, noOlderTs) {
        let message = '';

        if (!noOlderTs) {
            const link = constructLink(olderTs);
            message += `Be aware! You are not on the oldest open timesheet follow ${link} to go directly to it.`;
        }

        if (!isCurrentTs && !noOlderTs) {
            message += '<br><br>';
        }

        if (!isCurrentTs) {
            message += 'Be aware! You are not on this week\'s timesheet.';
        }
        return message;
    }

    function constructLink(olderTs){
        return `<a href="${constructUrl(olderTs)}">this link</a>`;
    }

    function constructUrl(olderTs) {
        return `/timesheet/view?ID=${olderTs.ID}`;
    }

    function redirectIfNeeded(olderTs, noOlderTs) {

        if (noOlderTs) {
            return;
        }

        if (window.wfGetOptions().autoRedirect) {
            window.location = constructUrl(olderTs);
        }
    }

    function getCurrentTs(currentTsId) {
        return fetch(`${location.origin}/attask/api/v11.0/tshet/search?ID=${currentTsId}&fields=status`)
            .then(e => e.json())
            .then(e => e.data[0]);
    }


    function getOldestOpenTsBeforeToday() {
        return fetch(`${location.origin}/attask/api/v11.0/tshet/search?endDate=$$TODAYb-1m&endDate_Mod=between&endDate_Range=$$TODAYe-1m&userID=$$USER.ID&userID_Mod=in&status=O&status_Mod=in&OR:1:endDate=$$TODAYbw&OR:1:endDate_Mod=lte&OR:1:userID=$$USER.ID&OR:1:userID_Mod=in&OR:1:status=O&OR:1:status_Mod=in&endDate_Sort=asc&$$LIMIT=1`)
            .then(e => e.json())
            .then(e => e.data[0]);
    }

    function noOlderTsExist (olderTs, currentTsId, currentTs) {
        return (!window.wfGetOptions || !olderTs || olderTs.ID === currentTsId || currentTs.status === 'C');
    }

})();
