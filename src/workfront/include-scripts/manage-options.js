// ==UserScript==
// @name         Option Management
// @namespace    https://www.emakina.com/
// @version      2.0.1.0
// @description  Handles all option operations
// @author       Sarah Roupec, Antonia Langer, Jan Drenkhahn, Domenik Reitzner
// @homepage	 https://github.com/EmakinaBE/tampermonkey-scripts
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @icon64       https://emakina.my.workfront.com/static/img/favicon.ico
// @match        https://emakina.my.workfront.com/*
// @match        https://emakina.preview.workfront.com/*
// @match        https://emakina.sb01.workfront.com/*
// @grant        none
// @downloadURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/cleanup/src/workfront/include-scripts/manage-options.js
// @updateURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/cleanup/src/workfront/include-scripts/manage-options.js
// @supportURL	 https://emakina.my.workfront.com/requests/new?activeTab=tab-new-helpRequest&projectID=5d5a659a004ee38ffbb5acc9b3c23c4c&path=61685dd40006ed63ccba6a27b6e31226
// ==/UserScript==

(function(window) {
    'use strict';

    const store = new Store('wfOptions');
    const oldStore = localStorage.getItem('wf-options');

    if (oldStore) {
        const result = {};
        for (const [key, value] of Object.entries(oldStore)) {
            result[key] = value.isChecked;
        }
        store.value = result;
        localStorage.removeItem('wf-options');
    }
    
    const defaultOptions = {
        autoRedirect: false,
        showCompanyName: true,
        autoSave: true,
        autoSelect: true,
        correctComma: true,
        roundToNearestQuarter: true,

        };

    window.saveOptions = (newOptions) => {
        store.value = newOptions;
    }

    window.checkOptionsUpdate = () => {
        store.value = Object.assign(defaultOptions, store.value);
    } 

    window.wfGetOptions = () => {
        return store.value || defaultOptions;
    };

    checkOptionsUpdate();
})(window);