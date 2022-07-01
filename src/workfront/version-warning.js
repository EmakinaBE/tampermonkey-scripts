// ==UserScript==
// @name         File to Load a Version Warning
// @namespace    https://www.emakina.com/
// @version      1.1.1
// @description  This File Load the Emakina version Warning
// @author       Jan-Dennis Drenkhahn
// @match        https://emakina.my.workfront.com/*
// @match        https://emakina.preview.workfront.com/*
// @match        https://emakina.sb01.workfront.com/*
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @supportURL   https://emakina.my.workfront.com/requests/new?activeTab=tab-new-helpRequest&projectID=5d5a659a004ee38ffbb5acc9b3c23c4c&path=61685dd40006ed63ccba6a27b6e31226
// @homepage     https://github.com/EmakinaBE/tampermonkey-scripts
// @downloadURL  https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/master/src/workfront/version-warning.js
// @updateURL    https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/master/src/workfront/version-warning.js
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

    function isInThePast(date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
      
        return date < today;
      }

    var currentVersionCheck = GM_info.script.version;

    if(isInThePast(new Date('2022-07-11')) && currentVersionCheck <= "2.2.2.0") {
        setTimeout(async() => {
            var newDiv = document.createElement("div");
            newDiv.innerHTML = "Your Tampermonkey script is out-dated, please update it. (Details <a href='https://share.emakina.net/display/ENWNI/Tampermonkey+Script#TampermonkeyScript-ManualUpdating' style='text-decoration:underline;padding-left: 5px' target='_blank'>see our documentation</a>)";
            newDiv.style = 'display:flex; justify-content: center; align-items: center;background:red; color: #ffffff; height: 50px'
        
            var currentDiv = document.getElementById("root");
            document.body.insertBefore(newDiv, currentDiv);
        }, 5000);
    };
})();