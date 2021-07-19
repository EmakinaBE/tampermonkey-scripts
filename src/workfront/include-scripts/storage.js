// ==UserScript==
// @name         Local storage class
// @namespace    https://www.emakina.com/
// @version      2.0
// @description  Stores and Loades items from local storage
// @author       Sarah Roupec, Antonia Langer, Florian Schmidt
// @homepage	 https://github.com/EmakinaBE/tampermonkey-scripts
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @icon64       https://emakina.my.workfront.com/static/img/favicon.ico
// @match        https://emakina.my.workfront.com/timesheet/*
// @match        https://emakina.my.workfront.com/timesheets/*
// @match        https://emakina.preview.workfront.com/timesheet/*
// @match        https://emakina.preview.workfront.com/timesheets/*
// @match        https://emakina.sb01.workfront.com/timesheet/*
// @match        https://emakina.sb01.workfront.com/timesheets/*
// @grant        none
// @downloadURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/New-UI/src/workfront/include-scripts/storage.js
// @updateURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/New-UI/src/workfront/include-scripts/storage.js
// @supportURL	 https://bugtracking.emakina.net/projects/ENWORKFNAV/summary
// ==/UserScript==

class Store {

    constructor(storageKey) {
        this.storageKey = storageKey;
        this.entries = JSON.parse(localStorage.getItem(this.storageKey));
    }

    get value () {
        return this.entries;
    }
    
    set value (value) {
        this.entries = value;
        localStorage.setItem(this.storageKey, JSON.stringify(this.entries));
    }
}    