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
// @downloadURL  https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/New-UI/src/workfront/version-warning.js
// @updateURL    https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/New-UI/src/workfront/version-warning.js
// @grant        none
/// ==/UserScript==

(function() {
    'use strict';
    if(!isNewUI()) {
        setTimeout(async() => {
            var newDiv = document.createElement("div");
            newDiv.innerHTML = "Your Tampermonkey script is out-dated, please update it. (Details <a href='https://share.emakina.net/display/ENWNI/Tampermonkey+Script#TampermonkeyScript-ManualUpdating' style='text-decoration:underline;padding-left: 5px' target='_blank'>see our documentation</a>)";
            newDiv.style = 'display:flex; justify-content: center; align-items: center;background:red; color: #ffffff; height: 50px'
        
            var currentDiv = document.getElementById("root");
            document.body.insertBefore(newDiv, currentDiv);
        }, 5000);
    }
})();