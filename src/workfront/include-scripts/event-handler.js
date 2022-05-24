// ==UserScript==
// @name         Callback Handler for Events
// @namespace    https://www.emakina.com/
// @version      2.0.1.0
// @description  Adds all callbacks to an array and executes them
// @author       Sarah Roupec, Antonia Langer, Jan Drenkhahn
// @homepage	 https://github.com/EmakinaBE/tampermonkey-scripts
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @icon64       https://emakina.my.workfront.com/static/img/favicon.ico
// @match        https://emakina.my.workfront.com/*
// @match        https://emakina.preview.workfront.com/*
// @match        https://emakina.sb01.workfront.com/*
// @grant        none
// @downloadURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3125/src/workfront/include-scripts/event-handler.js
// @updateURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3125/src/workfront/include-scripts/event-handler.js
// @supportURL	 https://emakina.my.workfront.com/requests/new?activeTab=tab-new-helpRequest&projectID=5d5a659a004ee38ffbb5acc9b3c23c4c&path=61685dd40006ed63ccba6a27b6e31226
// ==/UserScript==

(function(window) {
    'use strict';

    let callbacks = [];
    let reInits = [];

    window.executeCallback = ()  => {
        callbacks.forEach((callback) => callback());
    }

    window.callback = (callback) => {
        callbacks.push(callback);
    }

    window.excecuteReInit = ()  => {
        reInits.forEach((reInit) => reInit());
    }

    window.addReInit = (reInit) => {
        reInits.push(reInit);
    }


})(window);
