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
// @supportURL   https://bugtracking.emakina.net/projects/ENWORKFNAV/summary
// @homepage     https://github.com/EmakinaBE/tampermonkey-scripts
// @downloadURL  https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-2986-tm-mark-save-and-close-b/src/workfront/load-css.js
// @updateURL    https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-2986-tm-mark-save-and-close-b/src/workfront/load-css.js
// @grant        none
/// ==/UserScript==

(async function (document) {
    'use strict';
    let container;
    function styleTagToHead(options) {
        generateTag(
            'link',
            {
                type: 'text/css',
            },
            options,
        );
    }

    function generateTag(type, standardOptions, options) {
        const tag = document.createElement(type);

        Object.assign(standardOptions, options);
        Object.entries(standardOptions)
            .forEach(([key, value]) => {
                tag[key] = value;
            });
        container.appendChild(tag)
    }

    container = await getElementsFromDocument(`#tp-icon-container`, document, 4000);
    
    styleTagToHead({src: 'https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-2986-tm-mark-save-and-close-b/src/css/style.css'})
})(document);