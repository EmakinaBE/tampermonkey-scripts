// ==UserScript==
// @name         Norm hours
// @namespace    https://www.emakina.com/
// @version      2.2.1.0
// @description  Add new table row to see the difference between norm time and filled in time
// @author       Jan-Dennis Drenkhahn
// @connect      self
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @supportURL   https://emakina.my.workfront.com/requests/new?activeTab=tab-new-helpRequest&projectID=5d5a659a004ee38ffbb5acc9b3c23c4c&path=61685dd40006ed63ccba6a27b6e31226
// @homepage     https://github.com/EmakinaBE/tampermonkey-scripts
// @match        https://emakina.my.workfront.com/*
// @match        https://emakina.preview.workfront.com/*
// @match        https://emakina.sb01.workfront.com/*
// @downloadURL  https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/cleanup/src/workfront/indicate-norm.js
// @updateURL    https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/cleanup/src/workfront/indicate-norm.js
// @grant        none
// ==/UserScript==

(function(window) {
    'use strict';

    callback(init);
    addReTime(init);
    init();

    async function init() {
        const timesheetIdData = await window.location.href.split('/')[4];
        if(!timesheetIdData) return;

        const data = await fetchProjectData(timesheetIdData);

        setTimeout(async() => {
            const addHours = await getElementsFromDocument('.css-ub2476', document);
            const timeWrapper = await getElementsFromDocument('.flex.time-wrapper', document);
            if(!addHours) return;
            if (!timeWrapper) addHours[0].appendChild(createTimeWrapper());
            createHoursOutput(data);
        }, 7000)
    }

    function createTimeWrapper() {
        const div = document.createElement('div');
        div.classList.add('flex');
        div.classList.add('time-wrapper');
        div.appendChild(createRestHours());
        div.appendChild(createWeeklyHours());
        return div;
    }

    function createRestHours() {
        const restHours = document.createElement('div');
        restHours.classList.add('rest-hour');
        restHours.classList.add('flex-1');
        return restHours;
    }

    function createWeeklyHours() {
        const weeklyHours = document.createElement('div');
        weeklyHours.classList.add('weekly-hours');
        weeklyHours.classList.add('flex-1');
        return weeklyHours;
    }

    function createHoursOutput(data) {
        let delta = data.totalHours - parseToFloat(data.extRefID);
        delta = Math.round(delta * 100) / 100;
        const deltaText = delta < 0 ? '' + delta : `+${delta}`;
        const rest = document.querySelector('.rest-hour');
        const week = document.querySelector('.weekly-hours');
        if (rest.innerHTML.length !== 0) rest.innterHTML = "";
        if (week.innerHTML.length !== 0) week.innerHTML = "";
        rest.innerHTML = 'Total <br>' + deltaText;
        week.innerHTML = 'Norm(delta) <br>' + data.extRefID;
        rest.classList.add(findColorForDelta(delta))
    }

    function parseToFloat(text) {
        return parseFloat(text.replace(',', '.'));
    }

    function findColorForDelta(delta) {
        return delta >= 0 ? 'hours-green' : 'hours-red';
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

})(window);