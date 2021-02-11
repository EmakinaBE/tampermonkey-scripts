// ==UserScript==
// @name         Disable completed tasks
// @namespace    https://www.emakina.com/
// @version      1.1
// @description  Will poll the success notification after save and thrown an event. Will throw event when a new line is added
// @author       Wouter Versyck
// @homepage	 https://gitlab.emakina.net/jev/tampermonkey-scripts
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @icon64       https://emakina.my.workfront.com/static/img/favicon.ico
// @match        https://emakina.my.workfront.com/timesheet/*
// @match        https://emakina.my.workfront.com/timesheets/current*
// @grant        none
// @downloadURL	 https://gitlab.emakina.net/jev/tampermonkey-scripts/-/raw/master/src/workfront/include-scripts/disable-completed-task.js
// @updateURL	 https://gitlab.emakina.net/jev/tampermonkey-scripts/-/raw/master/src/workfront/include-scripts/disable-completed-task.js
// @supportURL	 https://bugtracking.emakina.net/projects/ENWORKFNAV/summary
// ==/UserScript==


(function() {
    'use strict';

    document.head.addEventListener('WF_RELOAD', init);
    init();

    async function init() {
        console.log('qsmldfkjqmlsdfjlsdkfj');
        const ids = [...new Set(getAllTasks().map(element => element.getAttribute('data-workitemobjid')))];

        const tasks = await Promise.all(ids.map((e) => fetchStatus(e)));
        const closedTasks = tasks.filter(e => e.closed);

        closedTasks.forEach(disableTasks);
    }

    function fetchStatus(id) {
        return fetch(`https://emakina.my.workfront.com/attask/api/v11.0/task/search?ID=${id}&fields=status`)
            .then(response => response.json())
            .then(json => {
                return {
                    id,
                    closed: json.data[0].status === 'CPL'
                };
            });
    }

    function disableTasks({ id }) {
        const tasks = document.getElements(`.TASK[data-workitemobjid=${id}]`);

        console.log(tasks);

        tasks.forEach(e => {
            e.innerHTML = 'heererlsdkjfqmsdfjmqsldfkjqmsldkfjlsmdfkjmlkjf';
        });
    }

    function getAllTasks() {
        return document.getElements('.TASK[data-workitemobjid]');
    }

})();
