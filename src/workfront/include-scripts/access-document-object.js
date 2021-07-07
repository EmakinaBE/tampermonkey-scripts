// ==UserScript==
// @name         Get Elements from Document
// @namespace    https://www.emakina.com/
// @version      1.3
// @description  Searches for the iframe element if the new UI ist used and returns an element for the specified selector
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
    let callbacks = [];

    // ensures that the popstate event only gets called once when history changes
    window.addEventListener("popstate", () => {
        callbacks.forEach(callback => callback());
        callbacks = [];
    });

    window.getElementsFromDocument = async (finalSelector, overwrite) => { 
        overwrite = getUsesQuicksilver() ? overwrite : document;
        let maxTries = 200;
        let base;
        let selector;

        // get element(s) with specific selector
        const checkElement = async (resolve, reject) => {
            const elements = (overwrite || base)?.querySelectorAll(selector);
            if (elements?.length) {
                return resolve(elements);
            }
            if (maxTries <= 0) return resolve(false);
 
            maxTries--;
            await pause(100);
            checkElement(resolve, reject);
        };

        // if the document was not found yet and its the new UI search for the iframe
        if (!doc && !overwrite) {
            callbacks.push(() => {
                maxTries = 0;
            });

            base = document;
            selector = '#main-frame';
            let iframeLoaded = false;
            const iframes = await (new Promise(checkElement));

            // ensures that the iframe element is fully loaded
            if(iframes) {
                doc = new Promise(async(resolve) => {
                    while(!iframeLoaded){
                        const iframeContainer  = iframes?.[0]?.contentWindow?.document;
                        iframeLoaded = iframeContainer?.children?.[0]?.children?.[1]?.children?.length;
                        if(iframeLoaded) return resolve(iframeContainer);
                        await pause(100);
                    }
                });
            }
        }
        maxTries = 200;
        callbacks.push(() => {
            maxTries = 0;
        });

        base = doc ? await doc : null;
        selector = finalSelector;
        const elements = await (new Promise(checkElement));

        return elements;
    }

    window.pause = (time)  => {
        return new Promise((resolve) => requestIdleCallback(resolve, {timeout : time}))
    }

    // if a popstate event gets triggered the iframe element needs to be reset
    window.resetDoc = () => {
        doc = null;
    }

})(window, document);
