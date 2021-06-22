// ==UserScript==
// @name         Add CompanyName to project header
// @namespace    https://www.emakina.com/
// @version      1.6
// @description  Add company name in the workfront table header, to see to which company which project is linked
// @author       Jeffrey Vandenbossche
// @match        https://emakina.my.workfront.com/timesheet/*
// @match        https://emakina.preview.workfront.com/timesheet/*
// @match        https://emakina.sb01.workfront.com/timesheet/*
// @match        https://emakina.my.workfront.com/timesheets/current*
// @match        https://emakina.preview.workfront.com/timesheets/current*
// @match        https://emakina.sb01.workfront.com/timesheets/current*
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @supportURL   https://bugtracking.emakina.net/projects/ENWORKFNAV/summary
// @homepage     https://github.com/EmakinaBE/tampermonkey-scripts
// @downloadURL  https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/New-UI/src/workfront/add-companyName-projectHeader.js
// @updateURL    https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/New-UI/src/workfront/add-companyName-projectHeader.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    document.head.addEventListener('WF_RELOAD', init);

    init();

    async function init() {
        const elements = await getElementFromDocument('.thead.project-hours');
        console.log(elements);
        elements.forEach(projectHTMLElement => {
            getProjectFromWorkFront(projectHTMLElement);
        });
    }

    function getProjectFromWorkFront(projectHTMLElement) {
        return fetch(`https://emakina.my.workfront.com/attask/api/v12.0/proj/search?ID=${projectHTMLElement.getAttribute('data-projectid')}&fields=company:name`)
            .then(response => {
                return response.json();
            }).then(e => {
                e.data[0] && addCompanyNameToHeader(projectHTMLElement, e.data[0].company.name);
            });
    }

    function addCompanyNameToHeader(projectHTMLElement, companyName) {
        const textNode = document.createTextNode(` - ${companyName}`);
        projectHTMLElement.querySelector('td.header').appendChild(textNode);
    }

    function getElements(selector) {
        return document.getElements(selector);
    }
})();
