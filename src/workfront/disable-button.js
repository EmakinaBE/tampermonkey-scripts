// ==UserScript==
// @name         Disbale Button
// @namespace    https://www.emakina.com/
// @version      1.0.0.0
// @description  Disable Button direct after loading
// @author       Jan-Dennis Drenkhahn
// @homepage	 https://github.com/EmakinaBE/tampermonkey-scripts
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @icon64       https://emakina.my.workfront.com/static/img/favicon.ico
// @match        https://emakina.my.workfront.com/*
// @match        https://emakina.preview.workfront.com/*
// @match        https://emakina.sb01.workfront.com/*
// @grant        none
// @downloadURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/cleanup/src/workfront/disable-button.js
// @updateURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/cleanup/src/workfront/disable-button.js
// @supportURL	 https://emakina.my.workfront.com/requests/new?activeTab=tab-new-helpRequest&projectID=5d5a659a004ee38ffbb5acc9b3c23c4c&path=61685dd40006ed63ccba6a27b6e31226
// ==/UserScript==

(function () {
    init();

    async function init() {
        setTimeout(async() => {
                      
            const closeButton = await getElementsFromDocument('.css-14ce388', document);
            if (!closeButton[0].disabled) {
                closeButton[0].disabled = true;
            }

                        
            closeButton[0].after(addNewButton());
            document.body.createElement(addInfoverlay());

            //const checkButton = await getElementsFromDocument('.em-check', document);
            //checkButton[0].addEventListener('click', allCommentsIncluded);
        }, 3000)
    }

    function addNewButton() {
        const createButton = document.createElement('button');
        createButton.classList.add('css-14ce388');
        createButton.classList.add('em-check');
        createButton.setAttribute('type', 'button');
        createButton.setAttribute('data-check', 'check-1');
        createButton.innerHTML= 'Check your Timesheet';
        createButton.onclick = allCommentsIncluded;
        return createButton
    }

    async function allCommentsIncluded() {
        const timesheetIdData = await window.location.href.split('/')[4];
        if(!timesheetIdData) return;

        const data = await fetchOpenComments(timesheetIdData);
        if (data >= 1) {
            addMessageComment(data);
            return
        }
        
    }

    function fetchOpenComments(timesheetIdData) {
        return fetch(`${location.origin}/attask/api/v14.0/hour/count?timesheetID=${timesheetIdData}&description_Mod=isblank&fields=*`)
            .then(response => response.json())
            .then(json => json.data.count);
    }

    async function addMessageComment(value) {
        const createMessage = await getElementsFromDocument('.infolay .info-box', document);
        createMessage[0].innerHTML = 'We Missinng: ' + value + ' comment';
        return;
    }

    function addInfoverlay() {
        const info = document.createElement('div');
        info.classList.add('infolay');
        info.appendChild(addCloseWrapper());
        info.appendChild(addTextelement());
        return info;
    }

    function addCloseWrapper() {
        const wrapper = document.createElement('div');
        wrapper.classList.add('flex');
        wrapper.classList.add('wp-btn');
        wrapper.appendChild(addCloseButton());
        return wrapper;
    }

    function addCloseButton() {
        const closeMe = document.createElement('button');
        closeMe.classList.add('btn-close');
        closeMe.setAttribute('type', 'button');
        closeMe.appendChild(addCloseTitle());
        closeMe.textContent = 'X';
        closeMe.onclick = closeInfo;
        return closeMe
    }

    function addCloseTitle() {
        const titleClose = document.createElement('title')
        titleClose.innerHTML = 'close';
        return titleClose;
    }

    function addTextelement() {
        const textBlock = document.createElement('p')
        textBlock.classList.add('info-box');
        return textBlock;
    }

    function closeInfo() {
        console.log('THIS IS MUSIC');
    }

})();