// ==UserScript==
// @name         Load Script on Timesheet
// @namespace    https://www.emakina.com/
// @version      1.0.0.0
// @description  URL Check - Check Timesheet adress
// @author       Jan-Dennis Drenkhahn
// @homepage	 https://github.com/EmakinaBE/tampermonkey-scripts
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @icon64       https://emakina.my.workfront.com/static/img/favicon.ico
// @match        https://emakina.my.workfront.com/*
// @match        https://emakina.preview.workfront.com/*
// @match        https://emakina.sb01.workfront.com/*
// @grant        none
// @downloadURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/cleanup/src/workfront/include-scripts/url-check.js
// @updateURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/cleanup/src/workfront/include-scripts/url-check.js
// @supportURL	 https://emakina.my.workfront.com/requests/new?activeTab=tab-new-helpRequest&projectID=5d5a659a004ee38ffbb5acc9b3c23c4c&path=61685dd40006ed63ccba6a27b6e31226
// ==/UserScript==
(function(window) {

    let urlCountdown = 0;

    addReUrl(init);
    init();

    async function init() {
        timesheetCheck();

        var url = window.location.href;
        console.log('is url', url)
        console.log('include', url.includes('timesheets'));

    }

    async function timesheetCheck() {
        const timesheetLink = await getElementsFromDocument('#content-all-timesheet-list', document);
        urlCountdown ++
        if (!timesheetLink && urlCountdown !== 5) return timesheetCheck();

        timesheetLink[0].addEventListener('click', () => {
            console.log('if click', event.target);
            setTimeout(() => {
                excecuteReInit();
            }, 3000);
        })
    }

})(window);