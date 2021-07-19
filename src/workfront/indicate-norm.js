// ==UserScript==
// @name         Norm hours
// @namespace    https://www.emakina.com/
// @version      2.0
// @description  Add new table row to see the difference between norm time and filled in time
// @author       Wouter Versyck
// @connect      self
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @supportURL   https://bugtracking.emakina.net/projects/ENWORKFNAV/summary
// @homepage     https://github.com/EmakinaBE/tampermonkey-scripts
// @match        https://emakina.my.workfront.com/timesheet/*
// @match        https://emakina.my.workfront.com/timesheets/*
// @match        https://emakina.preview.workfront.com/timesheet/*
// @match        https://emakina.preview.workfront.com/timesheets/*
// @match        https://emakina.sb01.workfront.com/timesheet/*
// @match        https://emakina.sb01.workfront.com/timesheets/*
// @downloadURL  https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/New-UI/src/workfront/indicate-norm.js
// @updateURL    https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/New-UI/src/workfront/indicate-norm.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    callback(init);
    init();

    async function init() {
        const timesheetIdData = await getElementsFromDocument('[data-timesheetid]');
        if(!timesheetIdData) return; 
        const timesheetId = timesheetIdData[0].getAttribute('data-timesheetid');
        const data = await fetchProjectData(timesheetId);

        const col = createTableRows(data);
        if(!col) return;
        const coll = await getElementsFromDocument('#trId13 > tfoot');
        if(!coll) return;

        addListener(coll[0], parseToFloat(data.extRefID));
    }

    function createTableRows(data){
       
        const delta = data.totalHours - parseToFloat(data.extRefID);
        const col = insertRow(createText(delta, data.extRefID), findColorForDelta(delta));

        return col;
    }

    async function addListener(col, norm) {
        const tableFooter = await getElementsFromDocument('#timesheet-data tfoot .total');
        if(!tableFooter) return;

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                const newTotal = parseToFloat(mutation.target.innerHTML);
                const delta = newTotal - norm;
                col.innerHTML = createText(delta, norm);
                col.style = `color: ${ findColorForDelta(delta) }`;
            });
        });

        observer.observe(tableFooter[0], {
            attributes: true,
            childList: true,
            subTree: true,
            attributeOldValue: true,
            characterData: true
        });
    }

    async function insertRow(text, color) {
        const tableFooter = await getElementsFromDocument('#timesheet-data > tfoot');
        if(!tableFooter) return;

        // check if table row was created already
        const trId = 'trId13';
        const oldTr= await getElementsFromDocument(`#${trId}`);
        if(oldTr) return;

        const tr = tableFooter[0].insertRow(-1);
        tr.id = trId;

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

    function parseToFloat(text) {
        return parseFloat(text.replace(',', '.'));
    }

    function findColorForDelta(delta) {
        return delta >= 0 ? 'green' : 'red';
    }

    function createText(delta, norm) {
        delta = Math.round(delta * 100) / 100;
        const deltaText = delta < 0 ? '' + delta : `+${delta}`;

        return `${norm} (${deltaText})`;
    }

    function fetchProjectData(timesheetId) {
        return fetch(`${location.origin}/attask/api/v11.0/tshet/search?ID=${timesheetId}&fields=*`)
            .then(response => response.json())
            .then(json => json.data[0]);
    }

})();