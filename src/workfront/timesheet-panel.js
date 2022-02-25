// ==UserScript==
// @name         Options
// @namespace    https://www.emakina.com/
// @version      1.0.0.0
// @description  Show/edit options
// @author       Jan Drenkhahn
// @match        https://emakina.my.workfront.com/*
// @match        https://emakina.preview.workfront.com/*
// @match        https://emakina.sb01.workfront.com/*
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @supportURL   https://emakina.my.workfront.com/requests/new?activeTab=tab-new-helpRequest&projectID=5d5a659a004ee38ffbb5acc9b3c23c4c&path=61685dd40006ed63ccba6a27b6e31226
// @homepage     https://github.com/EmakinaBE/tampermonkey-scripts
// @downloadURL  https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-2398/src/workfront/timesheet-panel.js
// @updateURL    https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-2398/src/workfront/timesheet-panel.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    init();

    function init() {
        selectTimePanel();
    }

    function selectTimePanel() {
        const panel = document.getElementsByClassName('timesheet-saving-panel');
        console.log('panel', panel);
    }

});