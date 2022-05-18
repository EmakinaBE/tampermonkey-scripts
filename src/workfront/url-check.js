// ==UserScript==
// @name         url-check
// @namespace    https://www.emakina.com/
// @version      1.0
// @description  Check when url Change
// @author       Jan-Dennis Drenkhahn
// @homepage	 https://github.com/EmakinaBE/tampermonkey-scripts
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @icon64       https://emakina.my.workfront.com/static/img/favicon.ico
// @match        https://emakina.my.workfront.com/*
// @match        https://emakina.preview.workfront.com/*
// @match        https://emakina.sb01.workfront.com/*
// @grant        none
// @downloadURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3125/src/workfront/highlight-currentday.js
// @updateURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3125/src/workfront/highlight-currentday.js
// @supportURL	 https://emakina.my.workfront.com/requests/new?activeTab=tab-new-helpRequest&projectID=5d5a659a004ee38ffbb5acc9b3c23c4c&path=61685dd40006ed63ccba6a27b6e31226
// ==/UserScript==

(function(window) {
    'use strict';

    let urlCheck; 

    if (!urlCheck) {
        console.log('load');
        window.addEventListener('popstate', function (event) {
           console.log('%c url', 'background: orange; color:#fff', location.href);
           let string = location.href;
           if (string.includes('timesheet')) {
             console.log('%c is in', 'background: red; color: #fff');
           };
        });
        urlCheck = true;
        console.log('%c Variable', 'color: red', urlCheck);
    }

})(window);
