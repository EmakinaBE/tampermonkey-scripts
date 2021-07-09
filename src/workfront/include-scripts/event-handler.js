// ==UserScript==
// @name         Callback Handler for Events
// @namespace    https://www.emakina.com/
// @version      2.0
// @description  Adds all callbacks to an array and executes them
// @author       Sarah Roupec, Antonia Langer
// @homepage	 https://github.com/EmakinaBE/tampermonkey-scripts
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @icon64       https://emakina.my.workfront.com/static/img/favicon.ico
// @match        https://emakina.my.workfront.com/*
// @match        https://emakina.preview.workfront.com/*
// @match        https://emakina.sb01.workfront.com/*
// @grant        none
// @downloadURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/New-UI/src/workfront/include-scripts/event-handler.js
// @updateURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/New-UI/src/workfront/include-scripts/event-handler.js
// @supportURL	 https://bugtracking.emakina.net/projects/ENWORKFNAV/summary
// ==/UserScript==

(function(window) {
    'use strict';

    let callbacks = [];

    window.executeCallback = ()  => {
        callbacks.forEach((callback) => callback());
    }

    window.callback = (callback) => {
        callbacks.push(callback);
    }

})(window);
