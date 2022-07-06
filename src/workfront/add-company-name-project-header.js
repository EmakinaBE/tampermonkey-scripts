// ==UserScript==
// @name         Add CompanyName to project header
// @namespace    https://www.emakina.com/
// @version      2.0.1.0
// @description  Add company name in the workfront table header, to see to which company which project is linked
// @author       Jeffrey Vandenbossche, Jan Drenkhahn
// @connect      self
// @match        https://emakina.my.workfront.com/*
// @match        https://emakina.preview.workfront.com/*
// @match        https://emakina.sb01.workfront.com/*
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @supportURL   https://emakina.my.workfront.com/requests/new?activeTab=tab-new-helpRequest&projectID=5d5a659a004ee38ffbb5acc9b3c23c4c&path=61685dd40006ed63ccba6a27b6e31226
// @homepage     https://github.com/EmakinaBE/tampermonkey-scripts
// @downloadURL  https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3174/src/workfront/add-company-name-project-header.js
// @updateURL    https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3174/src/workfront/add-company-name-project-header.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    callback(init);
    addReInit(init)
    init();

    var loadedScript;

    var initRun = false;

    async function init() {

        console.log(loadedScript);

        if (!loadedScript)
        {
           loadedScript = true;
            console.log("Inside Script")
        setTimeout(async() => {
            const timesheetGrid = document.getElementsByClassName("timesheet-grid")[0];

            if (timesheetGrid != null)
            {
                timesheetGrid.addEventListener("scroll", init);
                timesheetGrid.addEventListener("keydown", init);
            }

            if (window.wfGetOptions().showCompanyName) {
                const headers = (await document.getElementsByClassName('grid-row group-row'));

                if (headers.length != 0)
                {
                    Array.from(headers).forEach(element => {
                        const row = element.getElementsByClassName('grid-cell grid-sticky-cell name-cell');
                        const spanObject = row[0].getElementsByTagName("span")[3];

                        if (!spanObject.classList.contains("header-added")) {
                            getProjectFromWorkFront(spanObject.innerText, spanObject);
                        }
                    });
                }
            }
        }, 2000)
        }


    }

    async function getProjectFromWorkFront(name, spanObject) {
        return fetch(`${location.origin}/attask/api/v12.0/proj/search?name=${name}&fields=company:name`)
            .then(response => {
                return response.json();
            }).then(e => {

            if (e.data[0] && (name.search(` - ${e.data[0].company.name}`) === -1))
            {
                addCompanyNameToHeader(e.data[0].company.name, spanObject);
            }


            });
    }

    async function addCompanyNameToHeader(companyName, spanObject) {
        initRun = +1;
        console.log(initRun);
        spanObject.insertAdjacentText('beforeend', ` - ${companyName}`);
        spanObject.classList.add("header-added");
    }

})();

