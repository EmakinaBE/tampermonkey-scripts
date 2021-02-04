// ==UserScript==
// @name         Add CompanyName to project header
// @namespace    https://www.emakina.com/
// @version      0.1
// @description  TODO
// @author       Jeffrey Vandenbossche
// @match        https://emakina.my.workfront.com/timesheet/*
// @match        https://emakina.my.workfront.com/timesheets/current*
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @supportURL   https://bugtracking.emakina.net/projects/ENWORKFNAV/summary
// @homepage     https://gitlab.emakina.net/jev/tampermonkey-scripts
// @downloadURL  ...
// @updateURL    ...
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    const tableHeadersProjects = '.thead.project-hours';

    document.body.addEventListener('WF_RELOAD', init);

    init();

    function init() {
        console.log('init');
        const elements = getElements(tableHeadersProjects);
        elements.forEach(projectID => {
            fetch(`https://emakina.my.workfront.com/attask/api/v12.0/proj/search?ID=${projectID.getAttribute('data-projectid')}&fields=companyID`)
                .then(response => {
                    return response.json();
                })
                .then(fields => {
                    fetch(`https://emakina.my.workfront.com/attask/api/v12.0/cmpy/search?ID=${fields.data[0].companyID}&fields=name`).then(response => {
                        return response.json();
                    }).then(e => {
                        console.log(e.data[0].name);
                        console.log(projectID.querySelector('td.header').value);
                        projectID.querySelector('td.header').value.add("blablablab");
                    });
                });
        });
    }


    function getElements(selector) {
        return document.getElements(selector);
    }

})();