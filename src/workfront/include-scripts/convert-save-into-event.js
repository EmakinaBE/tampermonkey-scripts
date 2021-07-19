// ==UserScript==
// @name         Create events
// @namespace    https://www.emakina.com/
// @version      2.0
// @description  Will poll the success notification after save and thrown an event. Will throw event when a new line is added
// @author       Wouter Versyck, Antonia Langer, Sarah Roupec
// @homepage	 https://github.com/EmakinaBE/tampermonkey-scripts
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @icon64       https://emakina.my.workfront.com/static/img/favicon.ico
// @match        https://emakina.my.workfront.com/*
// @match        https://emakina.preview.workfront.com/*
// @match        https://emakina.sb01.workfront.com/*
// @grant        none
// @downloadURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/New-UI/src/workfront/include-scripts/convert-save-into-event.js
// @updateURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/New-UI/src/workfront/include-scripts/convert-save-into-event.js
// @supportURL	 https://bugtracking.emakina.net/projects/ENWORKFNAV/summary
// ==/UserScript==


(function(window) {
    'use strict';
    let storageKey = 'eventListenerCheck'; 
    let storage;

    window.addEventListener("popstate", () => loadDoc());
    loadDoc();
    
    window.setupHandlers = async () => {

        const saveButton = await getElementsFromDocument('.btn.primary.btn-primary');

        storage = JSON.parse(localStorage.getItem(storageKey));
        if(!storage)
        {
            resetStorageObj()
        }

        // if saveButton exists and eventListener isn't attatched yet
        if (saveButton && !(Object.values(storage)[0])) {
            storage.addedSaveButtonEventListener = true;
            localStorage.setItem(storageKey, JSON.stringify(storage));
            saveButton[0].onclick = () => {
                pollNetworkRequestSuccess();
            }
        }
         
        if (window.wfGetOptions().autoSave && !(Object.values(storage)[2])){
            storage.addedSaveCommentSaveButtonEventListener = true;
            localStorage.setItem(storageKey, JSON.stringify(storage));
            const inputFields = await getElementsFromDocument('.fc > input:not([readonly=true])');
            if (!inputFields) return;
            inputFields.forEach(field => field.nextElementSibling.onclick = () => {
                autoSaveChanges();
            })
        }

        // setup listeners for new task
        // if autoSelectNewTaskLine option is active and eventListener isn't attached yet
        if (window.wfGetOptions().autoSelect && !(Object.values(storage)[1])) {
            storage.addedSelectNewTaskLineEventListener = true;
            localStorage.setItem(storageKey, JSON.stringify(storage));
            const taskButtons = await getElementsFromDocument('.hour-type-and-role-add');
            if(!taskButtons) return;
            taskButtons.forEach(button => button.onclick = (event) => {
                newTaskClickHandler(event);
            })
        }

        setTimeout(resetStorageObj, 2000);
    }

    async function loadDoc() {
        resetDoc();
        executeCallback();
        
        setTimeout(window.setupHandlers, 3000);
    }

    async function pollNetworkRequestSuccess() {
        const view = await getElementsFromDocument('#content-timesheet-view');
        if(!view) return;
        
        setTimeout(loadDoc, 1000);
    }

    function resetStorageObj() {
        storage = {
            'addedSaveButtonEventListener': false,
            'addedSelectNewTaskLineEventListener': false,
            'addedSaveCommentSaveButtonEventListener': false
        };
        
        localStorage.setItem(storageKey, JSON.stringify(storage));
    }

    function newTaskClickHandler(event) {
        const parent = event.target.parentNode.parentNode.parentNode.parentNode;
        const workitemobjid = parent.getAttribute('data-workitemobjid');

        // use setTimeout to execute this after workfront rendered the new task line
        setTimeout( async () => {
            // get all the lines for this task
            const lines = await getElementsFromDocument(`[data-workitemobjid='${workitemobjid}'].TASK`);
            if(!lines) return;

            // get the last (latest added) value and add a click handler for it for when other lines are added
            const newLine = lines[lines.length-1];
            newLine.getElement('.hour-type-and-role-add').addEventListener('click', newTaskClickHandler);

            // dispatch event containing the original event and the newly added line
            const newTaskEvent = new CustomEvent('WF_NEW-TASK', {'detail': { event, newLine, workitemobjid } });
            dispatchEvent(newTaskEvent);
        });
    }

    function dispatchEvent(event) {
        document.head.dispatchEvent(event);
    }

})(window);