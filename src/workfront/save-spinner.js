
// ==UserScript==
// @name         Save Spinner
// @namespace    https://www.emakina.com/
// @version      1.0.0.0
// @description  Include Save Spinner
// @author       Jan Drenkhahn
// @homepage	 https://github.com/EmakinaBE/tampermonkey-scripts
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @icon64       https://emakina.my.workfront.com/static/img/favicon.ico
// @match        https://emakina.my.workfront.com/timesheet/*
// @match        https://emakina.preview.workfront.com/timesheet/*
// @match        https://emakina.sb01.workfront.com/timesheet/*
// @grant        none
// @downloadURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3125/src/workfront/save-spinner.js
// @updateURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3125/src/workfront/save-spinner.js
// @supportURL	 https://emakina.my.workfront.com/requests/new?activeTab=tab-new-helpRequest&projectID=5d5a659a004ee38ffbb5acc9b3c23c4c&path=61685dd40006ed63ccba6a27b6e31226
// ==/UserScript==


(function(window) {
    'use strict';

    let loadSpinner;

    callback(init);
    init();

    function init() {
        setTimeout(async() => {
            if (!loadSpinner) document.body.appendChild(createSaveOverlay());

        }, 1000)
    }

    function createSaveOverlay() {
        loadSpinner = true;
        const div = document.createElement('div');
        div.classList.add('wf-save-overlay');
        div.classList.add('hidden');
        div.appendChild(createSaveSpinner());
        div.id = 'WF-Save-overlay';
        return div;
    }

    function createSaveSpinner() {
        const spinner = document.createElement('div');
        spinner.classList.add('wf-save-spinner');
        return spinner;
    }

    window.findLoadingElement = async() => {
        setTimeout(async() => {
            const spinnerOverlay = await getElementsFromDocument('.wf-save-overlay', document);
            spinnerOverlay[0].classList.toggle('hidden');
        }, 100);
    }
})(window);