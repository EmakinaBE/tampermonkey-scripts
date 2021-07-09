// ==UserScript==
// @name         Add CompanyName to project header
// @namespace    https://www.emakina.com/
// @version      2.0
// @description  Add company name in the workfront table header, to see to which company which project is linked
// @author       Jeffrey Vandenbossche
// @connect      self
// @match        https://emakina.my.workfront.com/*
// @match        https://emakina.preview.workfront.com/*
// @match        https://emakina.sb01.workfront.com/*
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @supportURL   https://bugtracking.emakina.net/projects/ENWORKFNAV/summary
// @homepage     https://github.com/EmakinaBE/tampermonkey-scripts
// @downloadURL  https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/New-UI/src/workfront/add-company-name-project-header.js
// @updateURL    https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/New-UI/src/workfront/add-company-name-project-header.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    callback(init);
    init();

    async function init() {
        if (window.wfGetOptions().showCompanyName) {                     
            const elements = (await getElementsFromDocument('.thead.project-hours')) || [];
            elements.forEach(getProjectFromWorkFront);
        }
    }

    async function getProjectFromWorkFront(projectHTMLElement) {
        return fetch(`https://emakina.sb01.workfront.com/attask/api/v12.0/proj/search?ID=${projectHTMLElement.getAttribute('data-projectid')}&fields=company:name`)
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
