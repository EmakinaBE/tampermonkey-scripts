// ==UserScript==
// @name         Disable completed tasks
// @namespace    https://www.emakina.com/
// @version      2.0
// @description  Will poll the success notification after save and thrown an event. Will throw event when a new line is added
// @author       Wouter Versyck
// @homepage	 https://github.com/EmakinaBE/tampermonkey-scripts
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @icon64       https://emakina.my.workfront.com/static/img/favicon.ico
// @match        https://emakina.my.workfront.com/*
// @match        https://emakina.preview.workfront.com/*
// @match        https://emakina.sb01.workfront.com/*
// @grant        none
// @downloadURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/master/src/workfront/disable-completed-task.js
// @updateURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/master/src/workfront/disable-completed-task.js
// @supportURL	 https://emakina.my.workfront.com/requests/new?activeTab=tab-new-helpRequest&projectID=5d5a659a004ee38ffbb5acc9b3c23c4c&path=61685dd40006ed63ccba6a27b6e31226
// ==/UserScript==


(function() {
    'use strict';

    callback(init);
    init();

    async function init() {
        const allTasks = await getElementsFromDocument('.TASK[data-workitemobjid]');
        if(!allTasks) return;
        const ids = [...new Set([...allTasks].map(element => element.getAttribute('data-workitemobjid')))];

        const tasks = await Promise.all(ids.map((e) => fetchStatus(e)));
        const closedTasks = tasks.filter(e => e.closed);

        closedTasks.forEach(disableTasks);
    }

    async function fetchStatus(id) {
        return fetch(`${location.origin}/attask/api/v11.0/task/search?ID=${id}&fields=status`)
            .then(response => response.json())
            .then(json => {
                return {
                    id,
                    closed: json.data[0].status === 'CPL'
                };
            });
    }

    async function disableTasks({ id }) {
        const tasks = await getElementsFromDocument(`.TASK[data-workitemobjid='${id}'] .fc > input`);
        if(!tasks) return;
        tasks.forEach(e => {
            e.setAttribute('disabled', 'disabled');
            e.style = 'background: rgb(211, 211, 211, 0.35)';
        });
    }
})();
