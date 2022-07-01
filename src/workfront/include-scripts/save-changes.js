
// ==UserScript==
// @name         Save Changes
// @namespace    https://www.emakina.com/
// @version      2.5.0.0
// @description  Triggers the save button
// @author       Antonia Langer, Sarah Roupec, Jan Drenkhahn
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

    function isInThePast(date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return date < today;
      }

    var currentVersionCheck = GM_info.script.version;

    if(isInThePast(new Date('2022-07-05')) && currentVersionCheck <= "2.2.1.13") {
        console.log('mep');
        setTimeout(async() => {
            var newDiv = document.createElement("div");
            newDiv.innerHTML = "Your Tampermonkey script is out-dated, please update it. (Details <a href='https://share.emakina.net/display/ENWNI/Tampermonkey+Script#TampermonkeyScript-ManualUpdating' style='text-decoration:underline;padding-left: 5px' target='_blank'>see our documentation</a>)";
            newDiv.style = 'display:flex; justify-content: center; align-items: center;background:red; color: #ffffff; height: 50px'

            var currentDiv = document.getElementById("root");
            document.body.insertBefore(newDiv, currentDiv);
        }, 5000);
    };


    let idleTimer;
    let iframe_container;
    let currentTime;

    function setCountDownDate() {
        currentTime = (6 * 60 * 1000);
    }

    async function triggerSaveButton() {
        const saveButton = await getElementsFromDocument('.btn.primary.btn-primary');
        if(!(saveButton[0].getAttribute('data-action') === "O") && currentTime === -1 && !saveButton[0].disabled){
            currentTime = null;
            isIframeReload();
            findLoadingElement();
            saveButton[0].click();
        } else {
            timerCheck();
            setCountDownDate();
        }
    }



    window.autoSaveChanges = async () => {
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
            return;
        }
        idleTimer = setInterval(function() {
            currentTime -= 1000;
        
            var minutes = Math.floor((currentTime % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((currentTime % (1000 * 60)) / 1000);
 
            if (currentTime < (3000 * 60) && currentTime !== -1) {
                addTimer(minutes, seconds);
            };

            if (currentTime < (1000 * 60)) {
                addClass();
            }

            if (currentTime === 0) {
                currentTime = -1;
                addMessage()
                triggerSaveButton();
            }
        }, 1000);

        document.addEventListener('keypress', () => {
            timerCheck();
            setCountDownDate();
        });
        document.addEventListener('mousedown', () => {
            timerCheck();
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
        }

        if (currentTime < (1000 * 60)) {
            removeTimer();
            removeClass();
        }
    }

    async function isIframeReload() {
        setTimeout(async() => {
            const timerElement = (await getElementsFromDocument('.css-1m1vchs .css-1m1vchs-notice'))?.[0];
            if (timerElement) {
                isIframeReload();
            } else {
                executeCallback();
                timerCheck();
                setCountDownDate();
                setTimeout(() => {
                    findLoadingElement();
                }, 3000);
            }
        }, 100)
    }
})(window);