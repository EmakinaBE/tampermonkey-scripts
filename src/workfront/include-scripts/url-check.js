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
// @downloadURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3292e/ENWORKFNAV-3292e/ENWORKFNAV-3292/src/workfront/include-scripts/url-check.js
// @updateURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3292/src/workfront/include-scripts/url-check.js
// @supportURL	 https://emakina.my.workfront.com/requests/new?activeTab=tab-new-helpRequest&projectID=5d5a659a004ee38ffbb5acc9b3c23c4c&path=61685dd40006ed63ccba6a27b6e31226
// ==/UserScript==
(function(window) {

    let urlCountdown = 0;
    let comeFromTimesheets;

    addReUrl(init);
    init();

    async function init() {
        var url = window.location.href;

        if (url.includes('timesheets') === true) {
            timesheetCheck();
        }

        if (url.includes('timesheet') === true && url.includes('overview') === true) {
            returnToOverrview();
            // if (!comeFromTimesheets) {
            //     setTimeout(() => {
            //         findLoadingElement();
            //     },1000);
            // }
        }
    }

    async function timesheetCheck() {
        const timesheetLink = await getElementsFromDocument('#content-all-timesheet-list', document);
        urlCountdown ++
        if (!timesheetLink && urlCountdown !== 5) return timesheetCheck();

        timesheetLink[0].addEventListener('click', () => {
            let thisTarget = event.target.href
            if (thisTarget.includes('timesheet') ===  true) {
                comeFromTimesheets = true;
                // findLoadingElement();
                setTimeout(() => {
                    excecuteReInit();
                    reloadUrlCheck();
                }, 1000);
            }
        })
    }

    async function returnToOverrview() {
        const backOverview = await getElementsFromDocument('.css-5l9bhe', document);
        urlCountdown ++
        if (!backOverview && urlCountdown !== 5) return returnToOverrview();

        backOverview[0].addEventListener('click', () => {
            setTimeout(() => {
                reloadUrlCheck();
                removeMessage();
            }, 1000)
        });
    }

    function reloadUrlCheck() {
        ececuteReUrl()
    }

    window.onmousedown = (e) => {
        if (e.button === 3) {
            excecuteReInit();
            return;
        }
    }

})(window);