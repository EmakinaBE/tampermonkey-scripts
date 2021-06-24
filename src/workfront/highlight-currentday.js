// ==UserScript==
// @name         Workfront highlight Today
// @namespace    https://www.emakina.com/
// @version      1.5
// @description  Highlight current day
// @author       Jeffrey Vandenbossche
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
// @downloadURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/New-UI/src/workfront/highlight-currentday.js
// @updateURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/New-UI/src/workfront/highlight-currentday.js
// @supportURL	 https://bugtracking.emakina.net/projects/ENWORKFNAV/summary
// ==/UserScript==

(function() {
    'use strict';

    callback(init);

    async function init() {
        const today = await getElementsFromDocument('.today');

        for (let i = 0; i < today.length; i++) {
            today[i].style.backgroundColor = 'lemonchiffon';
            today[i].style.backgroundImage = 'none';
        };

    }

})();
