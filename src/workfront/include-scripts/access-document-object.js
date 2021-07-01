// ==UserScript==
// @name         Get Elements from Document
// @namespace    https://www.emakina.com/
// @version      1.3
// @description  Searches for the iframe element if the new Ui ist used and returns an element for the specified selector
// @author       Sarah Roupec, Antonia Langer
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

    window.getElementsFromDocument = async (finalSelector, overwrite) => { 
        let maxTries = 200;
        let base;
        let selector;
        const checkElement = async (resolve, reject) => {
            const elements = (overwrite || base).querySelectorAll(selector);
            if (elements.length) {
                return resolve(elements);
            }
            if (!maxTries) return resolve(false);
 
            maxTries--;
            await pause(100);
            checkElement(resolve, reject);
        };
        if (!doc && !overwrite) {
            base = document;
            selector = '#main-frame';
            let iframeLoaded = false;
            const iframes = await (new Promise(checkElement));
            while(!iframeLoaded){
                doc = iframes[0].contentWindow?.document;
                iframeLoaded = doc?.children?.[0]?.children?.[1]?.children?.length;
                await pause(100);
            }
            console.log('tries needed to fetch iframe + doc: ' + maxTries);
        }
        maxTries = 200;
        base = doc;
        selector = finalSelector;
        const elements = await (new Promise(checkElement));
        console.log('tries needed to fetch element: ' + maxTries);
        return elements;
    }

    const pause = (time)  => {
        return new Promise((resolve) => setTimeout(resolve, time))
    }

    window.resetDocument = () => {
        doc = null;
    }

})(window, document);
