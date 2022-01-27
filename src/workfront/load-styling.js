// ==UserScript==
// @name         Warning current timesheet
// @namespace    https://www.emakina.com/
// @version      2.0
// @description  This script will show a warning if you are not looking at the current week.
// @author       Jan-Dennis Drenkhahn
// @match        https://emakina.my.workfront.com/*
// @match        https://emakina.preview.workfront.com/*
// @match        https://emakina.sb01.workfront.com/*
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @supportURL   https://bugtracking.emakina.net/projects/ENWORKFNAV/summary
// @homepage     https://github.com/EmakinaBE/tampermonkey-scripts
// @downloadURL  https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-2986-tm-mark-save-and-close-b/src/workfront/load-styling.js
// @updateURL    https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-2986-tm-mark-save-and-close-b/src/workfront/load-styling.js
// @grant        GM_getResourceText
// @grant        GM_addStyle
// ==/UserScript==


(function() {
    'use strict';
    const my_css = GM_getResourceText("customCSS");
    GM_addStyle(my_css);
    alert('hi');
})();