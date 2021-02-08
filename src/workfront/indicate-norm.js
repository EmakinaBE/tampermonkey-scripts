// ==UserScript==
// @name         Norm hours
// @namespace    https://www.emakina.com/
// @version      1.0
// @description  try to take over the world!
// @author       Wouter Versyck
// @connect      self
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @supportURL   https://bugtracking.emakina.net/projects/ENWORKFNAV/summary
// @homepage     https://gitlab.emakina.net/jev/tampermonkey-scripts
// @match        https://emakina.my.workfront.com/timesheet/*
// @match        https://emakina.my.workfront.com/timesheets/current*
// @downloadURL  https://gitlab.emakina.net/jev/tampermonkey-scripts/-/raw/master/src/workfront/indicate-norm.js
// @updateURL    https://gitlab.emakina.net/jev/tampermonkey-scripts/-/raw/master/src/workfront/indicate-norm.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    document.body.addEventListener('WF_RELOAD', init);
    init();

    async function init() {
        const timesheetId = getQueryStringValue('ID');
        const data = await fetchProjectData(timesheetId);

        const col = createTableRows(data);

        addListener(col, parseInt(data.extRefID));
    }

    function createTableRows(data){
        const delta = data.totalHours - parseInt(data.extRefID);
        const col = insertRow(createText(delta, data.extRefID), findColorForDelta(delta));

        return col;
    }

    function addListener(col, norm) {
        const tableFooter = document.getElement('#timesheet-data tfoot .total');

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                const newTotal = parseInt(mutation.target.innerHTML);
                const delta = newTotal - norm;
                col.innerHTML = createText(delta, norm);
                col.style = `color: ${ findColorForDelta(delta) }`;
            });
        });

        observer.observe(tableFooter, {
            attributes: true,
            childList: true,
            subTree: true,
            attributeOldValue: true,
            characterData: true
        });
    }

    function insertRow(text, color) {
        const tableFooter = document.getElement('#timesheet-data > tfoot');
        const tr = tableFooter.insertRow(-1);

        const firstCell = tr.insertCell(0);
        firstCell.innerHTML = 'Norm(delta):';
        firstCell.style = 'text-align: right';

        for (let i = 0; i < 7; i++) {
            tr.insertCell(-1);
        }

        const tdSpacer = tr.insertCell(-1);
        tdSpacer.className = 'spacer';

        const tdVal = tr.insertCell(-1);
        tdVal.className = 'total';
        if (color) {
            tdVal.style = `color: ${color}`;
        }
        tdVal.innerHTML = text;

        return tdVal;
    }

    function findColorForDelta(delta) {
        return delta === 0 ? 'green' : 'red';
    }

    function createText(delta, norm) {
        const deltaText = delta < 0 ? '' + delta : `+${delta}`;

        return `${norm} (${deltaText})`;
    }

    function fetchProjectData(timesheetId) {
        return fetch(`https://emakina.my.workfront.com/attask/api/v11.0/tshet/search?ID=${timesheetId}&fields=*`)
            .then(response => response.json())
            .then(json => json.data[0]);
    }

    function getQueryStringValue (key) {
        // eslint-disable-next-line no-useless-escape
        return decodeURIComponent(window.location.search.replace(new RegExp('^(?:.*[&\\?]' + encodeURIComponent(key).replace(/[\.\+\*]/g, '\\$&') + '(?:\\=([^&]*))?)?.*$', 'i'), '$1'));
    }
})();