// ==UserScript==
// @name         Create events
// @namespace    https://www.emakina.com/
// @version      1.7
// @description  Will poll the success notification after save and thrown an event. Will throw event when a new line is added
// @author       Wouter Versyck
// @homepage	 https://github.com/EmakinaBE/tampermonkey-scripts
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @icon64       https://emakina.my.workfront.com/static/img/favicon.ico
// @match        https://emakina.my.workfront.com/timesheet/*
// @match        https://emakina.preview.workfront.com/timesheet/*
// @match        https://emakina.sb01.workfront.com/timesheet/*
// @match        https://emakina.my.workfront.com/timesheets/current*
// @match        https://emakina.preview.workfront.com/timesheets/current*
// @match        https://emakina.sb01.workfront.com/timesheets/current*
// @grant        none
// @downloadURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/New-UI/src/workfront/include-scripts/convert-save-into-event.js
// @updateURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/New-UI/src/workfront/include-scripts/convert-save-into-event.js
// @supportURL	 https://bugtracking.emakina.net/projects/ENWORKFNAV/summary
// ==/UserScript==


(function(window, document) {
    'use strict';

    let doc;

    window.getElementFromDocument = async (selector) => { 
        if (!doc) {
            const iframes = await checkElement(document, '#main-frame');
            doc = iframes[0].contentWindow.document;
        }
        const elements = await checkElement(doc, selector);
        return elements;
    }

    const checkElement = (base, selector) => {
        const elements = base.querySelectorAll(selector);
        if (elements.length) {
            return elements;
        }
        
        setTimeout(() => checkElement(base, selector), 100);
    };

})(window, document);
