
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
// @downloadURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/master/src/workfront/include-scripts/save-changes.js
// @updateURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/master/src/workfront/include-scripts/save-changes.js
// @supportURL	 https://emakina.my.workfront.com/requests/new?activeTab=tab-new-helpRequest&projectID=5d5a659a004ee38ffbb5acc9b3c23c4c&path=61685dd40006ed63ccba6a27b6e31226
// ==/UserScript==


(function(window) {
    'use strict';

    let idleTime = 0;
    let idleTimer;
    let countDownDate;
    let iframe_container;
    let currentTime;

    function setCountDownDate() {
        countDownDate = new Date().getTime()+ (2000 * 60);
    }

    async function triggerSaveButton() {
        const saveButton = await getElementsFromDocument('.btn.primary.btn-primary');

        if(!(saveButton[0].getAttribute('data-action') === "O")){
            saveButton[0].click();
        }
    }



    window.autoSaveChanges = async () => {
        // const commentSaveButton = await getElementsFromDocument('#comment-container .primary.btn.btn-primary');
        // if(!commentSaveButton) return;
        // commentSaveButton[0].onclick = () => {
        //     setTimeout(triggerSaveButton, 100);
        // }

        const textArea = await getElementsFromDocument('#comment-container textarea');
        if(!textArea) return;
        textArea[0].addEventListener('keydown', (keyValue) => {
            if(keyValue.key === 'Enter')
            {
                setTimeout(triggerSaveButton, 100);
            }
        })
    }

    window.autoSaveAfterBeingIdle = () => {
        setCountDownDate();
        if(idleTimer){
            clearInterval(idleTimer);
        }
        idleTimer = setInterval(function() {
            var now = new Date().getTime();
            var distance = countDownDate - now;
            currentTime = distance;
            console.log('currentTime', currentTime)
        
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
 
            if (distance < (3000 * 60)) {
                addTimer(minutes, seconds);
            };

            if (distance < (1000 * 60)) {
                addClass();
            }

            // If the count down is over, write some text
            if (distance < 0) {
                addMessage()
                currentTime;
                triggerSaveButton();
            }
        }, 1000);



        document.addEventListener('keypress', () => {
            timerCheck()
            setCountDownDate();
        });
        document.addEventListener('mousedown', () => {
            timerCheck()
            setCountDownDate();
        });

        eventListnerIframe();
    }

    async function addTimer(minutes, seconds) {
        setTimeout(async() => {
            const timerElement = (await getElementsFromDocument('.timer-panel-btn .timer-area'))?.[0];
            if (!timerElement) return;
            timerElement.innerHTML = "Auto Save in: " + minutes + "m " + seconds + "s ";
        }, 100)
    }

    async function addMessage() {
      setTimeout(async() => {
            const timerElement = (await getElementsFromDocument('.timer-panel-btn .timer-area'))?.[0];
            if (!timerElement) return;
            timerElement.innerHTML = "Auto Save";
        }, 100)
    }

    async function removeTimer() {
        setTimeout(async() => {
            const timerElement = (await getElementsFromDocument('.timer-panel-btn .timer-area'))?.[0];
            if (!timerElement) return;
            timerElement.innerHTML = "";
        }, 100)
    }

    async function addClass() {
        setTimeout(async() => {
            const elementToAdd = (await getElementsFromDocument('.timer-panel-btn .timer-area'))?.[0];
            if (!elementToAdd) return;
            elementToAdd.classList.add('blink');
            return elementToAdd;
        }, 100)
    }

    async function removeClass() {
        setTimeout(async() => {
            const elementToRemove = (await getElementsFromDocument('.timer-panel-btn .timer-area'))?.[0];
            if (!elementToRemove) return;
            elementToRemove.classList.remove('blink');
            return elementToRemove;
        }, 100)
    }

    async function eventListnerIframe() {
        setTimeout(async() => {
            iframe_container = (await getElementsFromDocument(`#main-frame`, document, 1000))?.[0];
            if (!iframe_container) return;
            iframe_container.contentDocument.body.addEventListener('mousedown', () => {
                timerCheck();
                setCountDownDate();
            })

            iframe_container.contentDocument.body.addEventListener('keypress', () => {
                timerCheck();
                setCountDownDate();
            })
        }, 7000);
    }

    function timerCheck() {
        if (currentTime < (3000 * 60)) {
            removeTimer();
        };

        if (currentTime < (1000 * 60)) {
            removeTimer()
            removeClass();
        }
    }

    window.checkSaveButton = async () => {
        console.log('check check');
        const buttonToSave = await getElementsFromDocument('#save-btn.btn.primary.btn-primary');
        console.log('to save button',buttonToSave)
    }

})(window);