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
// @downloadURL  https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3125/src/workfront/timesheet-panel.js
// @updateURL    https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3125/src/workfront/timesheet-panel.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    callback(init);
    init();

    function init() {
        selectTimePanel();
    }

    async function selectTimePanel() {
        setTimeout(async() => {
            const panel = (await getElementsFromDocument(`#main-frame`, document))?.[0];
            if (!panel) return selectTimePanel();
            const panelinner = (await getElementsFromDocument(`#timesheet-saving-panel div`, panel.contentWindow.document))?.[0];
            if (!panelinner) return selectTimePanel();
            if (panelinner && !panelinner.classList.contains('timer-panel-btn')) {
                panelinner.classList.add('timer-panel-btn');
                panelinner.appendChild(autoSaveTiming());
            }
        }, 3000);
    }

    function autoSaveTiming() {
        const timerElement = document.createElement('div');
        timerElement.classList.add('timer-area');
        return timerElement;
    }
})();