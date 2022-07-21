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
            document.body.appendChild(addInfoverlay());
        }, 5000)
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
        
        const createMessage = await getElementsFromDocument('.infolay .info-box', document);

        const value = await fetchOpenComments(timesheetIdData);

        const time = await fetchProjectTime(timesheetIdData);

        let missingTime = calcWeekTime(time);

        let roundetTime = roundStringToNearestQtr(time.totalHours);

        console.log(roundetTime);
        if (value >= 1) {
            addMessageComment(createMessage, value);
            if (missingTime < time.extRefID) addTimeInformation(createMessage, missingTime, time);
            if (roundetTime !== time.totalHours) addRoundetMessage(createMessage, roundetTime, time);
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
        createMessage[0].querySelector('.missing-comments').innerHTML = 'We Missinng: ' + value + ' comment.';
        return;
    }

    function addTimeInformation(createMessage, missingTime, time) {
        createMessage[0].querySelector('.missing-time').innerHTML = 'Please check you Booking Time.<br> We miss some Hours for you full Week Time.<br> You Bookes ' + time.totalHours + '.<br> We missed ' + missingTime + ' Hours.<br> Your full Week Time is ' + time.extRefID + '.';
        return
    }

    function addRoundetMessage(createMessage, roundetTime, time) {
        createMessage[0].querySelector('.not-roundet').innerHTML = 'Please check you Booking time. Your Booked Time is not Perfekt Roundet. <br> Your Booked Time: ' + time.totalHours + ' <br> Perfekt book Time look like this <span class="weekly-hours">'+ roundetTime +  '</span>'
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
        wrapper.classList.add('wp-btn');
        // wrapper.appendChild(addNewsWrapper())
        wrapper.appendChild(addCloseButton());
        return wrapper;
    }

    // function addNewsWrapper() {
    //     const newsWrapper = document.createElement('div');
    //     newsWrapper.classList.add('news-wrapper');
    //     newsWrapper.appendChild(addticker());
    //     newsWrapper.appendChild(addGifDino());
    //     return newsWrapper;
    // }

    // function addticker() {
    //     const ticker = document.createElement('marquee');
    //     ticker.classList.add('news-ticker');
    //     ticker.innerHTML = '+++ Info to fix +++';
    //     return ticker;
    // }

    // function addGifDino() {
    //     const dino = document.createElement('span');
    //     dino.classList.add('news-gif');
    //     dino.innerHTML = '<img class="news-gif" src="https://c.tenor.com/4lKsJQHA5_AAAAAC/walking-with.gif">';
    //     return dino;
    // }

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
        const textBlock = document.createElement('div');
        textBlock.classList.add('info-box');
        textBlock.appendChild(addTextOne());
        textBlock.appendChild(addTextTwo());
        textBlock.appendChild(addTextThree());
        return textBlock;
    }

    function addTextOne() {
        const textOne = document.createElement('p');
        textOne.classList.add('missing-comments');
        return textOne;
    }

    function addTextTwo() {
        const textTwo = document.createElement('p');
        textTwo.classList.add('missing-time');
        return textTwo;
    }

    function addTextThree() {
        const textThree = document.createElement('p');
        textThree.classList.add('not-roundet');
        return textThree;
    }

    function closeInfo() {
        console.log('THIS IS MUSIC');
    }

    function calcWeekTime(time) {
        let delta = time.extRefID - time.totalHours;
        delta = Math.round(delta * 100) / 100;
        const deltaText = delta < 0 ? '' + delta : `${delta}`;
        return deltaText;
    }

    function roundStringToNearestQtr(number) {
        return roundNearQtr(number);
    }

    function roundNearQtr(nr) {
        return Math.round(nr * 4) / 4;
    }

})();
