// ==UserScript==
// @name         Warning current timesheet
// @namespace    https://www.emakina.com/
// @version      1.0
// @description  This script will show a warning if you are not looking at the current week.
// @author       Wouter Versyck
// @match        https://emakina.my.workfront.com/timesheet/*
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @supportURL   https://bugtracking.emakina.net/projects/ENWORKFNAV/summary
// @homepage     https://gitlab.emakina.net/jev/tampermonkey-scripts
// @downloadURL  https://gitlab.emakina.net/jev/tampermonkey-scripts/-/raw/master/workfront/warning-current-timesheet.js
// @updateURL    https://gitlab.emakina.net/jev/tampermonkey-scripts/-/raw/master/workfront/warning-current-timesheet.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const message = 'Be aware! You are not on this weeks timesheet.';
    const messageStyle = 'padding: 15px; background: tomato; color: white;';

    if (!getElement('.today')) {
        const messageBox = createElementWithText('p', message);
        messageBox.setAttribute('style', messageStyle);

        getElement('#timesheet-header').appendChild(messageBox);
    }

    function getElement(selector) {
        return document.querySelector(selector);
    }

    function createElementWithText(tagName, text) {
        const element = document.createElement(tagName);
        const textNode = document.createTextNode(text);
        element.appendChild(textNode);
        return element;
    }
})();