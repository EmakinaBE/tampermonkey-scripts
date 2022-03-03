
// ==UserScript==
// @name         Save Spinner
// @namespace    https://www.emakina.com/
// @version      1.0.0.0
// @description  Triggers the save button
// @author       Jan Drenkhahn
// @homepage	 https://github.com/EmakinaBE/tampermonkey-scripts
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @icon64       https://emakina.my.workfront.com/static/img/favicon.ico
// @match        https://emakina.my.workfront.com/*
// @match        https://emakina.preview.workfront.com/*
// @match        https://emakina.sb01.workfront.com/*
// @grant        none
// @downloadURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-2398/src/workfront/save-spinner.js
// @updateURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-2398/src/workfront/save-spinner.js
// @supportURL	 https://emakina.my.workfront.com/requests/new?activeTab=tab-new-helpRequest&projectID=5d5a659a004ee38ffbb5acc9b3c23c4c&path=61685dd40006ed63ccba6a27b6e31226
// ==/UserScript==


(function() {
    'use strict';

    callback(init);
    init();

    function init() {
        document.body.appendChild(createSaveOverlay)
    }

    function createSaveOverlay() {
        const div = document.createElement('div');
        div.classList.add('wf-save-overlay');
        div.appendChild(createSaveSpinner);
        div.id = 'WF-Save-overlay';
        // div.style = 'display:none';
        return div;
    }

    function createSaveSpinner() {
        const spinner = document.createElement('div');
        spinner.classList.add('wf-save-spinner');
        return spinner;
    }
});