// ==UserScript==
// @name         get Elements from Document
// @namespace    https://www.emakina.com/
// @version      1.2
// @description  Will poll the success notification after save and thrown an event. Will throw event when a new line is added
// @author       Sarah Roupec
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
// @downloadURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/New-UI/src/workfront/include-scripts/access-document-object.js
// @updateURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/New-UI/src/workfront/include-scripts/access-document-object.js
// @supportURL	 https://bugtracking.emakina.net/projects/ENWORKFNAV/summary
// ==/UserScript==


(function(window, document) {
    'use strict';

    let doc;

    window.getElementsFromDocument = async (finalSelector) => { 
        let maxTries = 30;
        let base;
        let selector;
        const checkElement = async (resolve, reject) => {
            const elements = base.querySelectorAll(selector);
            if (elements.length) {
                return resolve(elements);
            }
            if (!maxTries) return resolve(false);
 
            maxTries--;
            await pause(100);
            checkElement(resolve, reject);
        };
        if (!doc) {
            base = document;
            selector = '#main-frame';
            let iframeLoaded = false;
            while(!iframeLoaded){
                const iframes = await (new Promise(checkElement));
                doc = iframes[0].contentWindow.document;
                iframeLoaded = doc?.children?.[0]?.children?.[1]?.children?.length;
                await pause(1000);
            }
        }
        maxTries = 30;
        base = doc;
        selector = finalSelector;
        const elements = await (new Promise(checkElement));
        return elements;
    }

    const pause = (time)  => {
        return new Promise((resolve) => setTimeout(resolve, time))
    }

})(window, document);
