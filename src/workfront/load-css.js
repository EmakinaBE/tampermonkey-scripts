// ==UserScript==
// @name         File to Load Emakina CSS
// @namespace    https://www.emakina.com/
// @version      1.0
// @description  This File Load the Emakina CSS to change desing
// @author       Jan-Dennis Drenkhahn
// @match        https://emakina.my.workfront.com/*
// @match        https://emakina.preview.workfront.com/*
// @match        https://emakina.sb01.workfront.com/*
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @supportURL   https://emakina.my.workfront.com/requests/new?activeTab=tab-new-helpRequest&projectID=5d5a659a004ee38ffbb5acc9b3c23c4c&path=61685dd40006ed63ccba6a27b6e31226
// @homepage     https://github.com/EmakinaBE/tampermonkey-scripts
// @downloadURL  https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/master/src/workfront/load-css.js
// @updateURL    https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/master/src/workfront/load-css.js
// @grant        none
/// ==/UserScript==

(async function (document) {
    'use strict';
    let container;

    async function generateTag(url) {
        const tag = document.createElement('style');
        const res = await fetch(url);
        const css = await res.text();
        tag.type="text/css";
        tag.innerHTML = css
        container[0].contentDocument.head.appendChild(tag)
    }
    setTimeout(async() => {
        container = await getElementsFromDocument(`#main-frame`, document, 1000);
        if (!container) return;
        generateTag('https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-2398/src/css/style.css')
    }, 7000);
    
    setTimeout(async() => {
        container = await getElementsFromDocument(`body`, document, 1000);
        if (!container) return;
        generateTag('https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-2398/src/css/main-style.css')
    }, 7000);
})(document);
