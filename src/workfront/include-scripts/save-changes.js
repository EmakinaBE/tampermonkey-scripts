
// ==UserScript==
// @name         Save Changes
// @namespace    https://www.emakina.com/
// @version      2.0
// @description  Triggers the save button
// @author       Antonia Langer, Sarah Roupec
// @homepage	 https://github.com/EmakinaBE/tampermonkey-scripts
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @icon64       https://emakina.my.workfront.com/static/img/favicon.ico
// @match        https://emakina.my.workfront.com/*
// @match        https://emakina.preview.workfront.com/*
// @match        https://emakina.sb01.workfront.com/*
// @grant        none
// @downloadURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/New-UI/src/workfront/include-scripts/save-changes.js
// @updateURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/New-UI/src/workfront/include-scripts/save-changes.js
// @supportURL	 https://bugtracking.emakina.net/projects/ENWORKFNAV/summary
// ==/UserScript==


(function(window) {
    'use strict';

    let idleTime = 0;
    let idleTimer;

    async function triggerSaveButton() {
        const saveButton = await getElementsFromDocument('.btn.primary.btn-primary');
        saveButton[0].click();
    } 
    
    window.autoSaveChanges = async () => {
        const textArea = await getElementsFromDocument('#comment-container textarea');
        if(!textArea) return;
        e.addEventListener('keyup', (keyValue) => {
            if(keyValue.keyCode == 13)
            {
                setTimeout(triggerSaveButton, 100);
            }
        }, false);

        const commentSaveButton = await getElementsFromDocument('#comment-container .primary.btn.btn-primary');
        if(!commentSaveButton) return;
        commentSaveButton[0].onclick = () => {
            setTimeout(triggerSaveButton, 100);
        }
    }

    window.autoSaveAfterBeingIdle = () => {
        if(idleTimer){
            clearInterval(idleTimer);
        }
        idleTimer = setInterval(timerIncrement, 60000);

        document.body.addEventListener('keypress', () => {
            idleTime = 0;
        });
        document.body.addEventListener('mousedown', () => {
            idleTime = 0;
        });
    }

    function timerIncrement() {
        idleTime++;
        if (idleTime > 1) {
            triggerSaveButton();
        }
    }

})(window);