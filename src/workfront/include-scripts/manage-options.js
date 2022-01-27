// ==UserScript==
// @name         Option Management
// @namespace    https://www.emakina.com/
// @version      2.0
// @description  Handles all option operations
// @author       Sarah Roupec, Antonia Langer
// @homepage	 https://github.com/EmakinaBE/tampermonkey-scripts
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @icon64       https://emakina.my.workfront.com/static/img/favicon.ico
// @match        https://emakina.my.workfront.com/*
// @match        https://emakina.preview.workfront.com/*
// @match        https://emakina.sb01.workfront.com/*
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-2986-tm-mark-save-and-close-b/src/workfront/include-scripts/manage-options.js
// @updateURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-2986-tm-mark-save-and-close-b/src/workfront/include-scripts/manage-options.js
// @supportURL	 https://bugtracking.emakina.net/projects/ENWORKFNAV/summary
// ==/UserScript==

(function(window) {
    'use strict';

    let options;
    const store = new Store('wf-options');
    const defaultOptions = {
        autoRedirect: {
            label: 'Auto redirect to oldest open timesheet',
            isChecked: false,
        },
        showCompanyName: {
            label: 'Show company name next to project',
            isChecked: true,
        },
        autoSave: {
            label: 'Auto-save',
            isChecked: true,
        },
        autoSelect: {
            label: 'Auto-select next task time line',
            isChecked: true,
        },
        correctComma: {
            label: 'Correct wrong comma seperator',
            isChecked: true,
        },
        roundToNearestQuarter: {
            label: 'Round entries to nearest quarter',
            isChecked: true,
        }
    };

    window.saveOptions = (e) => {
        const target = e.target;
        options[target.name].isChecked = target.checked;
        store.value = options;
    }

    window.getOptions = () => {
        const result = {};
        for (const [key, value] of Object.entries(options)) {
            result[key] = value.isChecked;
        }
        return result;
    }

    window.loadOptions = () => {
        return store.value || defaultOptions;
    }

    window.checkOptionsUpdate = () => {
        store.value = Object.assign(defaultOptions, store.value);
    } 

    window.wfGetOptions = getOptions;
    checkOptionsUpdate();
    options = loadOptions();

})(window);