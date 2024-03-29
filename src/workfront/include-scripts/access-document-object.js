// ==UserScript==
// @name         Get Elements from Document
// @namespace    https://www.emakina.com/
// @version      2.0
// @description  Searches for elements if the new UI ist used and returns an element for the specified selector
// @author       Sarah Roupec, Antonia Langer
// @homepage	 https://github.com/EmakinaBE/tampermonkey-scripts
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @icon64       https://emakina.my.workfront.com/static/img/favicon.ico
// @match        https://emakina.my.workfront.com/*
// @match        https://emakina.preview.workfront.com/*
// @match        https://emakina.sb01.workfront.com/*
// @grant        none
// @downloadURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/master/src/workfront/include-scripts/access-document-object.js
// @updateURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/master/src/workfront/include-scripts/access-document-object.js
// @supportURL	 https://emakina.my.workfront.com/requests/new?activeTab=tab-new-helpRequest&projectID=5d5a659a004ee38ffbb5acc9b3c23c4c&path=61685dd40006ed63ccba6a27b6e31226
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

    window.getElementsFromDocument = async (finalSelector, overwrite, maxTriesInput = 500) => {
        overwrite = isNewUI() ? overwrite : document;
        let maxTries = maxTriesInput;
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

        maxTries = maxTriesInput;
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
