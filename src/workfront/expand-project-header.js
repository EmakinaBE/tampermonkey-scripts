// ==UserScript==
// @name         Store and Load expanded headers
// @namespace    https://www.emakina.com/
// @version      1.1
// @description  Will check if header is expanded, store and load
// @author       Antonia Langer, Florian Schmidt
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
// @downloadURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/New-UI/src/workfront/expand-project-header.js
// @updateURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/New-UI/src/workfront/expand-project-header.js
// @supportURL	 https://bugtracking.emakina.net/projects/ENWORKFNAV/summary
// ==/UserScript==


(function() {
    'use strict';

    let storageKey = 'expanded-header';
    
    callback(init);
    init();

    async function init(){
        const returnHeaders = await getExpandedHeader();
    }

    window.getExpandedHeader = async () => {
        const headers = await getElementsFromDocument('.thead.project-hours');
        return headers;
    }
    
    window.setExpandedHeader = () => {}

    window.storeExpandedHeader = () => {}
    
})(window);