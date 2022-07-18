// ==UserScript==
// @name         Disbale Button
// @namespace    https://www.emakina.com/
// @version      1.0.0.0
// @description  Disable Button direct after loading
// @author       Jan-Dennis Drenkhahn
// @homepage	 https://github.com/EmakinaBE/tampermonkey-scripts
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @icon64       https://emakina.my.workfront.com/static/img/favicon.ico
// @match        https://emakina.my.workfront.com/*
// @match        https://emakina.preview.workfront.com/*
// @match        https://emakina.sb01.workfront.com/*
// @grant        none
// @downloadURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/cleanup/src/workfront/include-scripts/disable-button.js
// @updateURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/cleanup/src/workfront/include-scripts/disable-button.js
// @supportURL	 https://emakina.my.workfront.com/requests/new?activeTab=tab-new-helpRequest&projectID=5d5a659a004ee38ffbb5acc9b3c23c4c&path=61685dd40006ed63ccba6a27b6e31226
// ==/UserScript==

(function () {
    init();

    async function init() {
        setTimeout(async() => {
            const closeButton = await getElementsFromDocument('css-14ce388', document);
            console.log('close my Button', closeButton);
            if (closeButton !== disabled) {
                closeButton.disabled;
            }
        }, 3000)
    }

})