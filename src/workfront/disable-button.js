// ==UserScript==
// @name         Disbale Button
// @namespace    https://www.emakina.com/
// @version      1.0.0.2
// @description  Disable Button direct after loading
// @author       Jan-Dennis Drenkhahn
// @homepage	 https://github.com/EmakinaBE/tampermonkey-scripts
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @icon64       https://emakina.my.workfront.com/static/img/favicon.ico
// @match        https://emakina.my.workfront.com/*
// @match        https://emakina.preview.workfront.com/*
// @match        https://emakina.sb01.workfront.com/*
// @grant        none
// @downloadURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3292e/ENWORKFNAV-3292e/ENWORKFNAV-3292e/ENWORKFNAV-3292e/ENWORKFNAV-3292e/ENWORKFNAV-3292e/ENWORKFNAV-3292/disable-button.js
// @updateURL	 https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3292e/ENWORKFNAV-3292e/ENWORKFNAV-3292e/ENWORKFNAV-3292/src/workfront/disable-button.js
// @supportURL	 https://emakina.my.workfront.com/requests/new?activeTab=tab-new-helpRequest&projectID=5d5a659a004ee38ffbb5acc9b3c23c4c&path=61685dd40006ed63ccba6a27b6e31226
// ==/UserScript==

(function () {
    callback(init);
    addReInit(init);
    init();

    let checkBtnCountdown = 0;
    let closeButtonCreate;

    async function init() {
        setTimeout(async() => {
            const closeButton = await getElementsFromDocument('.css-14ce388', document);
            checkBtnCountdown ++
            if (!closeButton && checkBtnCountdown !== 3) return init();
            if (!closeButton[0].disabled) {
                closeButton[0].disabled = true;
                closeButton[0].classList.add('non-display');
            }

            if(!closeButtonCreate) closeButton[0].after(addNewButton());
            document.body.appendChild(addInfoverlay());
        }, 5000)
    }

    function addNewButton() {
        closeButtonCreate = true;
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


        const infoLayer = await getElementsFromDocument('.infolay', document);

        const createMessage = await getElementsFromDocument('.infolay .info-box', document);
        
        //remove text from DOM and make space for new text
        createMessage[0].querySelector('.missing-comments').innerHTML = "";
        createMessage[0].querySelector('.missing-time').innerHTML = "";
        createMessage[0].querySelector('.not-roundet').innerHTML = "";

        const value = await fetchOpenComments(timesheetIdData);

        const time = await fetchProjectTime(timesheetIdData);

        let missingTime = calcWeekTime(time);

        let roundetTime = roundStringToNearestQtr(time.totalHours);

        if (value >= 1 || missingTime !== time.extRefID || roundetTime !== time.totalHours) {
            addMessageComment(createMessage, value);
            if (missingTime !== time.extRefID) addTimeInformation(createMessage, missingTime, time);
            if (roundetTime !== time.totalHours) addRoundetMessage(createMessage, roundetTime, time);
            toggleInfoLayer();
            return
        }

        if (value === 0) {
            infoLayer[0].classList.add('green-layer');
            addFineMessage(createMessage);
            toggleBtnArea();
            toggleInfoLayer();
            setTimeout(() => {
                clickBtn();
                toggleInfoLayer();
                toggleBtnArea();
                infoLayer[0].classList.remove('green-layer');
            }, 10000);
            return
        }

    }

    function fetchOpenComments(timesheetIdData) {
        return fetch(`${location.origin}/attask/api/v14.0/hour/count?timesheetID=${timesheetIdData}&description_Mod=isblank&fields=*`)
            .then(response => response.json())
            .then(json => json.data.count);
    }

    function fetchProjectTime(timesheetIdData) {
        return fetch(`${location.origin}/attask/api/v14.0/tshet/search?ID=${timesheetIdData}&fields=*`)
            .then(response => response.json())
            .then(json => json.data[0]);
    }

    function addMessageComment(createMessage, value) {
        createMessage[0].querySelector('.missing-comments').innerHTML = '<img src="https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3292/src/icons/211649_clipboard_icon.svg" alt="clipboard" class="clipboard"><p>Number of missing comments: <span class="hours-red">' + value + '</span>.</p>';
        return;
    }

    function addTimeInformation(createMessage, missingTime, time) {
        createMessage[0].querySelector('.missing-time').innerHTML = "<img src='https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3292/src/icons/211606_clock_icon.svg' alt='clock Item' class='clock-item'><p>Your week normtime hasn't been reached.<br> Your Normtime: <span class='hours-green'>" + time.extRefID + ' hours</span>.<br> You booked: <span class="hours-red">' + time.totalHours + ' hours</span>.<br> You are missing <span class="hours-red">' + missingTime + ' hours</span>.</p>';
        return
    }

    function addRoundetMessage(createMessage, roundetTime, time) {
        createMessage[0].querySelector('.not-roundet').innerHTML = '<img src="https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3292/src/icons/211814_refresh_icon.svg" alt="Roundet Item" class="roundet-item"><p>Please check you Booking time. Your Booked Time is not Perfekt Roundet. <br> Your Booked Time: <span class="hours-red">' + time.totalHours + '</span><br> Perfekt book Time look like this <span class="hours-green">'+ roundetTime +  '</span></p>'
    }

    function addFineMessage(createMessage) {
        createMessage[0].querySelector('.all-fine').innerHTML = 'Your Timesheet is Correct.<br> Have a great Day.<br> Timesheet closes in 10 seconds';
    }

    function addInfoverlay() {
        const info = document.createElement('div');
        info.classList.add('infolay');
        info.appendChild(addCloseWrapper());
        info.appendChild(addTextelement());
        info.appendChild(addButtonWrapper());
        info.hidden = true;
        return info;
    }

    function addCloseWrapper() {
        const wrapper = document.createElement('div');
        wrapper.classList.add('wp-btn');
        // wrapper.appendChild(addNewsWrapper())
        wrapper.appendChild(addCloseButton());
        return wrapper;
    }

    function addCloseButton() {
        const closeMe = document.createElement('button');
        closeMe.classList.add('btn-close');
        closeMe.setAttribute('type', 'button');
        closeMe.appendChild(addButtonTitel('close'));
        closeMe.innerHTML = '<img src="https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3292/src/icons/211652_close_icon.svg" alt="close-button" class="svg-close">';
        closeMe.onclick = closeInfo;
        return closeMe
    }

    function addButtonTitel(text) {
        const titleClose = document.createElement('title')
        titleClose.innerHTML = text;
        return titleClose;
    }

    function addTextelement() {
        const textBlock = document.createElement('div');
        textBlock.classList.add('info-box');
        textBlock.appendChild(addTextOne());
        textBlock.appendChild(addTextTwo());
        textBlock.appendChild(addTextThree());
        textBlock.appendChild(addTextFinish());
        return textBlock;
    }

    function addTextOne() {
        const textOne = document.createElement('div');
        textOne.classList.add('missing-comments');
        return textOne;
    }

    function addTextTwo() {
        const textTwo = document.createElement('div');
        textTwo.classList.add('missing-time');
        return textTwo;
    }

    function addTextThree() {
        const textThree = document.createElement('div');
        textThree.classList.add('not-roundet');
        return textThree;
    }

    function addTextFinish() {
        const textFinish = document.createElement('div');
        textFinish.classList.add('all-fine');
        return textFinish;
    }

    function addButtonWrapper() {
        const buttonWp = document.createElement('div');
        buttonWp.classList.add('flex');
        buttonWp.classList.add('btn-wp');
        buttonWp.appendChild(addIgnoreButton());
        buttonWp.appendChild(addFixButton());
        return buttonWp;
    }

    function addIgnoreButton() {
        const ignorBtn = document.createElement('button');
        ignorBtn.classList.add('btn-ignore');
        ignorBtn.setAttribute('type', 'button');
        ignorBtn.appendChild(addButtonTitel('Ignore'));
        ignorBtn.textContent = 'Submit and Close';
        ignorBtn.onclick = ignoreInfo;
        return ignorBtn;
    }

    function addFixButton() {
        const fixBtn = document.createElement('button');
        fixBtn.classList.add('btn-fixed');
        fixBtn.setAttribute('type', 'button');
        fixBtn.appendChild(addButtonTitel('Fixed'));
        fixBtn.textContent = 'Fix';
        fixBtn.onclick = closeInfo;
        return fixBtn;
    }


    function closeInfo() {
        toggleInfoLayer();
    }

    function ignoreInfo() {
        toggleInfoLayer();
        clickBtn();
    }

    function clickBtn() {
        const closeBtn = document.querySelector('.css-14ce388');
        const checkBtn = document.querySelector('.css-14ce388.em-check');
        closeBtn.disabled = false;
        checkBtn.disabled = true;
        closeBtn.click();
        listenRecall();
    }

    function toggleInfoLayer() {
        const layerToggle = document.querySelector('.infolay');
        if (!layerToggle.hidden) {
            layerToggle.hidden = true;
            return;
        }

        if (layerToggle.hidden) {
            layerToggle.hidden = false;
            return;
        }
    }

    function toggleBtnArea() {
        const buttonArea = document.querySelector('.infolay .btn-wp')
        if (!buttonArea.hidden) {
            buttonArea.classList.add('non-display');
            return;
        }

        if (buttonArea.hidden) {
            buttonArea.classList.remove('non-display');
            return;
        }
    }

    async function listenRecall() {
        const recallBtn = await getElementsFromDocument('.css-jnz3aa', document);
        recallBtn[0].addEventListener("click", reloadPage)
    }

    function reloadPage() {
        setTimeout(() => {
            location.reload();
        }, 500);
    }

    function calcWeekTime(time) {
        let delta = time.totalHours - time.extRefID;
        delta = Math.round(delta * 100) / 100;
        let deltaText = delta < 0 ? '' + delta : `${delta}`;
        if(Math.sign(deltaText) !== -1) deltaText = time.extRefID;
        return deltaText;
    }

    function roundStringToNearestQtr(number) {
        return roundNearQtr(number);
    }

    function roundNearQtr(nr) {
        return Math.round(nr * 4) / 4;
    }

})();
