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
// @match        https://emakina.my.workfront.com/*
// @match        https://emakina.preview.workfront.com/*
// @match        https://emakina.sb01.workfront.com/*
// @grant        none
// @downloadURL	  https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-2986-tm-mark-save-and-close-b/src/workfront/expand-project-header.js
// @updateURL	  https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-2986-tm-mark-save-and-close-b/src/workfront/expand-project-header.js
// @supportURL	 https://bugtracking.emakina.net/projects/ENWORKFNAV/summary
// ==/UserScript==

(function() {
    'use strict'
    
    let headers;
    let allHeaders = [];
    const store = new Store('expanded-header');
    store.value = store.value || [];

    callback(init);
    init();
    
    async function init(){
        await getHeaderElements();
        setExpandedHeader();
        getExpandedHeader();
    }

    async function getHeaderElements() {
        headers = await getElementsFromDocument('.thead.project-hours');
        if(!headers) return;
        
        allHeaders = [...headers];  
    }

    // create a listener for all headers and save it to the local storage if it gets closed
    function getExpandedHeader()  {
        allHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const headerId = header.getAttribute('data-projectid');
                if(!header.classList.contains('closed'))
                    store.value = [...store.value, headerId];   
                else
                    store.value = store.value.filter(item => item !== headerId);
            });	
        });
    }
    
    // set all headers + body that are in the local storage to closed
    function setExpandedHeader() {
        let closedHeaders = store.value || [];
        
        allHeaders.forEach(header => {
            if(closedHeaders.includes(header.getAttribute('data-projectid'))) {
                header.classList.add('closed');
                header.nextElementSibling.classList.add('closed');
            }
        });
    }   
    
})();