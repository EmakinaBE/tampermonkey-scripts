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
// @downloadURL  https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/cleanup/src/workfront/load-css.js
// @updateURL    https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/cleanup/src/workfront/load-css.js
// @grant        none
/// ==/UserScript==

(async function (document) {
    'use strict';
    let main_container;
    let second_main;

    async function generateTag(container ,url) {
        const tag = document.createElement('style');
        const res = await fetch(url);
        const css = await res.text();
        tag.type="text/css";
        tag.innerHTML = css
        if (container === second_main) {
            container[0].appendChild(tag);
        }
        if (container === main_container) {
            main_container[0].appendChild(tag);
        }
    }
    setTimeout(async() => {
        second_main = await getElementsFromDocument('head', document, 1000);
        if (!second_main) return;
        generateTag(second_main ,'https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/cleanup/src/css/style.css')
    }, 7000);

    setTimeout(async() => {
        main_container = await getElementsFromDocument('head', document, 1000);
        if (!main_container) return;
        generateTag(main_container ,'https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/cleanup/src/css/main-style.css')
    }, 7000);
})(document);
