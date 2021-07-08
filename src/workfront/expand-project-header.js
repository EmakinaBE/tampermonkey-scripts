// ==UserScript==
// @name         Store and Load expanded project header
// @namespace    https://www.emakina.com/
// @version      2.0
// @description  If headers where closed or expanded in the past, they will be stored in a local storage. When the user enters the
//               timesheet again they will automatically set as closed or expanded.
// @author       Antonia Langer, Florian Schmidt, Sarah Roupec
// @homepage	 https://github.com/EmakinaBE/tampermonkey-scripts
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @icon64       https://emakina.my.workfront.com/static/img/favicon.ico
// @match        https://emakina.my.workfront.com/timesheet/*
// @match        https://emakina.preview.workfront.com/timesheet/*
// @match        https://emakina.sb01.workfront.com/timesheet/*
// @match        https://emakina.my.workfront.com/timesheets/current*
// @match        https://emakina.preview.workfront.com/timesheets/current*
// @match        https://emakina.sb01.workfront.com/timesheets/current*
// @grant        none
// @downloadURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/New-UI/src/workfront/expand-project-header.js
// @updateURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/New-UI/src/workfront/expand-project-header.js
// @supportURL	 https://bugtracking.emakina.net/projects/ENWORKFNAV/summary
// ==/UserScript==


(function() {
    'use strict';

    let storageKey = 'expanded-header';

    callback(init);
    init();
    
    async function init(){
        await setExpandedHeader();
        getExpandedHeader();
    }

    // create a listener for all headers and save it to the local storage if it gets closed
    async function getExpandedHeader()  {
        const headers = await getElementsFromDocument('.thead.project-hours');
        if(!headers) return;
        
        const allHeaders = [...headers];      
        
        allHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const headerId = header.getAttribute('data-projectid');
                let closedHeaders = JSON.parse(localStorage.getItem(storageKey)) || [];
                
                if(!header.classList.contains('closed'))
                    closedHeaders.push(headerId);   
                else
                    closedHeaders.splice(closedHeaders.indexOf(headerId), 1);
                    
                localStorage.setItem(storageKey, JSON.stringify(closedHeaders));
            });	
        });
    }
    
    // set all headers + body that are in the local storage to closed
    async function setExpandedHeader() {
        const headers = await getElementsFromDocument('.thead.project-hours');
        if(!headers) return;

        const allHeaders = [...headers];

        let closedHeaders = JSON.parse(localStorage.getItem(storageKey)) || [];
        
        allHeaders.forEach( header => {
            if(closedHeaders.includes(header.getAttribute('data-projectid'))) {
                header.classList.add('closed');
                header.nextElementSibling.classList.add('closed');
            }
        });

    }
    
})();