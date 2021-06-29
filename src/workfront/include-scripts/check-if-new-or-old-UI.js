// ==UserScript==
// @name         Check if new or old UI
// @namespace    https://www.emakina.com/
// @version      1.0
// @description  Will check if the old UI (quicksilver) or new UI (phoenix) is used
// @author       Sarah Roupec, Antonia Langer
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
// @downloadURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/New-UI/src/workfront/include-scripts/check-if-new-or-old-UI.js
// @updateURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/New-UI/src/workfront/include-scripts/check-if-new-or-old-UI.js
// @supportURL	 https://bugtracking.emakina.net/projects/ENWORKFNAV/summary
// ==/UserScript==


(function(window, document) {
    'use strict';

    window.checkUI = async () => { 
        const usesQuicksilver = await getUI();
        if(usesQuicksilver) {
            console.log('old UI');
        } else {
            console.log('new UI');
        }
    }

    async function getUI () {
        return fetch(`https://emakina.sb01.workfront.com/attask/api/unsupported/user/search?ID=$$USER.ID&fields=hasQuicksilver`)
            .then(response => {
                return response.json();
            }).then(e => {
                return e.data[0].hasQuicksilver;
            });
    }

}(window, document));