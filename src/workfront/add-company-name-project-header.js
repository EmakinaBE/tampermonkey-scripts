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
// @downloadURL  https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3125/src/workfront/add-company-name-project-header.js
// @updateURL    https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3125/src/workfront/add-company-name-project-header.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    callback(init);
    addReInit(init)
    init();

    async function init() {
        if (window.wfGetOptions().showCompanyName) {                     
            const elements = (await getElementsFromDocument('.thead.project-hours')) || [];
            elements.forEach(getProjectFromWorkFront);
        }
    }

    async function getProjectFromWorkFront(projectHTMLElement) {
        return fetch(`${location.origin}/attask/api/v12.0/proj/search?ID=${projectHTMLElement.getAttribute('data-projectid')}&fields=company:name`)
            .then(response => {
                return response.json();
            }).then(e => {
                e.data[0] && addCompanyNameToHeader(projectHTMLElement, e.data[0].company.name);
            });
    }

    async function addCompanyNameToHeader(projectHTMLElement, companyName) {
        const textNode = document.createTextNode(` - ${companyName}`);
        const header = projectHTMLElement.querySelector('td.header');

        header.appendChild(textNode);
    }
    
})();
