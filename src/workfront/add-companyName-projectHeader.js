// ==UserScript==
// @name         Add CompanyName to project header
// @namespace    https://www.emakina.com/
// @version      1.0
// @description  Add company name in the workfront table header, to see to which company which project is linked
// @author       Jeffrey Vandenbossche
// @match        https://emakina.my.workfront.com/timesheet/*
// @match        https://emakina.my.workfront.com/timesheets/current*
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @supportURL   https://bugtracking.emakina.net/projects/ENWORKFNAV/summary
// @homepage     https://gitlab.emakina.net/jev/tampermonkey-scripts
// @downloadURL  https://gitlab.emakina.net/jev/tampermonkey-scripts/-/raw/master/src/workfront/add-companyName-projectHeader.js
// @updateURL    https://gitlab.emakina.net/jev/tampermonkey-scripts/-/raw/master/src/workfront/add-companyName-projectHeader.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    const tableHeadersProjects = '.thead.project-hours';
    document.body.addEventListener('WF_RELOAD', init);

    init();

    function init() {
        const elements = getElements(tableHeadersProjects);
        elements.forEach(projectHTMLElement => {
            getProjectFromWorkFront(projectHTMLElement);
        });
    }

    function getProjectFromWorkFront(projectHTMLElement) {
        return fetch(`https://emakina.my.workfront.com/attask/api/v12.0/proj/search?ID=${projectHTMLElement.getAttribute('data-projectid')}&fields=companyID`)
            .then(response => {
                return response.json();
            }).then(fields => {
                getCompanyFromProject(projectHTMLElement, fields.data[0].companyID);
            });
    }

    function getCompanyFromProject(projectHTMLElement, companyID) {
        fetch(`https://emakina.my.workfront.com/attask/api/v12.0/cmpy/search?ID=${companyID}&fields=name`)
            .then(response => {
                return response.json();
            }).then(e => {
                addProjectNameToHeader(projectHTMLElement, e.data[0].name);
            });
    }

    function addProjectNameToHeader(projectHTMLElement, projectName) {
        const textNode = document.createTextNode(` - ${projectName}`);
        projectHTMLElement.querySelector('td.header').appendChild(textNode);
    }

    function getElements(selector) {
        return document.getElements(selector);
    }
})();
