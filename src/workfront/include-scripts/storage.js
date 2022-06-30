// ==UserScript==
// @name         Local storage class
// @namespace    https://www.emakina.com/
// @version      2.0
// @description  Stores and Loades items from local storage
// @author       Sarah Roupec, Antonia Langer, Florian Schmidt
// @homepage	 https://github.com/EmakinaBE/tampermonkey-scripts
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @icon64       https://emakina.my.workfront.com/static/img/favicon.ico
// @match        https://emakina.my.workfront.com/*
// @match        https://emakina.preview.workfront.com/*
// @match        https://emakina.sb01.workfront.com/*
// @grant        none
// @downloadURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3174/src/workfront/include-scripts/storage.js
// @updateURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3174/src/workfront/include-scripts/storage.js
// @supportURL	 https://emakina.my.workfront.com/requests/new?activeTab=tab-new-helpRequest&projectID=5d5a659a004ee38ffbb5acc9b3c23c4c&path=61685dd40006ed63ccba6a27b6e31226
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