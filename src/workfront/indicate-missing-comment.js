// ==UserScript==
// @name         Indicate entries without comment + rounding to the nearest quarter
// @namespace    https://www.emakina.com/
// @version      2.3.0.0
// @description  Indicate entries without comment, hide submit button when entries without comment are found and round to nearest quarter
// round filled in numbers to the nearest quarter
// @author       Wouter Versyck, Jan-Dennis Drenkhahn
// @match        https://emakina.my.workfront.com/*
// @match        https://emakina.preview.workfront.com/*
// @match        https://emakina.sb01.workfront.com/*
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @supportURL   https://emakina.my.workfront.com/requests/new?activeTab=tab-new-helpRequest&projectID=5d5a659a004ee38ffbb5acc9b3c23c4c&path=61685dd40006ed63ccba6a27b6e31226
// @homepage     https://github.com/EmakinaBE/tampermonkey-scripts
// @downloadURL  https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/master/src/workfront/indicate-missing-comment.js
// @updateURL    https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/master/src/workfront/indicate-missing-comment.js
// @grant        none
// ==/UserScript==


(function(window) {
    'use strict';
    const commentId = 'commentId13';
    const noCommentStyle = 'background: tomato';
    const warningMessageText = 'Not all entries have a comment';
    const numberFormater = new Intl.NumberFormat(navigator.language);
    let timer = null;


    document.head.addEventListener('WF_NEW-TASK', e => initNewTask(e));

    callback(init);
    init();

    async function init() {
        setTimeout(async() => {
            const timesheetGrid = await getElementsFromDocument("#timesheet-grid", document);
            const elements = await getElementsFromDocument('input.css-54z73u:not([disabled])', document);
            const submitButton = await getElementsFromDocument('.css-14ce388', document);
            const container = await getElementsFromDocument('.css-ub2476', document);
            if(!elements || !submitButton || !container) return;
            const warningMessage = await createWarningMessage(container[0]);
            timesheetGrid[0].addEventListener("scroll", afterEventCheck);
            timesheetGrid[0].addEventListener("keydown", afterEventCheck);
            checkAll(elements, warningMessage, submitButton[0]);
            initListeners(elements, warningMessage, submitButton[0]);
        }, 3000)
    }

    async function initNewTask(e){
        const newLine = e.detail.newLine;
        const elements = await getElementsFromDocument('input.css-54z73u:not([disabled])', document, newLine);
        const submitButton = await getElementsFromDocument('.css-14ce388', document);
        const warningMessage = await getElementsFromDocument('.css-ub2476', document);
        if(!submitButton || !warningMessage) return;
        initListeners(elements, warningMessage[0], submitButton[0]);
    }

    async function createWarningMessage(container) {

        // check if comment was created already
        const oldComment = await getElementsFromDocument(`#${commentId}`);
        if(oldComment) return;

        const element = document.createElement('p');
        const textNode = document.createTextNode(warningMessageText);
        element.id = commentId;

        element.appendChild(textNode);
        element.classList.add('warning-message');
        element.classList.add('hidden');

        container.insertBefore(element, container.firstChild);

        return element;
    }

    async function checkAll(elements,warningMessage, submitButton) {
        const emptyFieldFound = checkAllCommentsAndMarkFields(elements);
        // submit button is not always shown (on already commited ts)
        if(submitButton) {
            submitButton.disabled = emptyFieldFound;
        }
        const oldWarningMessage = await getElementsFromDocument(`#${commentId}`);
        emptyFieldFound
                       ? (oldWarningMessage[0] || warningMessage)?.classList?.remove('hidden')
                       : (oldWarningMessage[0] || warningMessage)?.classList?.add('hidden');
    }

    function checkAllCommentsAndMarkFields(elements) {
        let isEmptyCommentPresent = false;
        elements.forEach(e => {
            //const comment = e.nextElementSibling.classList.contains('show-comment');
            const value = e.value;

            if(value && !e.nextElementSibling.classList.contains('show-comment')) {
                e.setAttribute('style', noCommentStyle);
                isEmptyCommentPresent = true;
            } else {
                e.removeAttribute('style');
            }
        });
        return isEmptyCommentPresent;
    }

    function cleanParseFloat(string) {
        string = string.replace(",", ".");
        return parseFloat(string);
    }

    function initListeners(elements, warningMessage, submitButton) {
        elements.forEach(e => {
            e.addEventListener('keyup', (keyValue) => {
                // starting with fix for , problem
                //     if (keyValue.keyCode === 110) {
                //    }
                // should only be executed, when key is not backspace
                if(keyValue.keyCode != 8)
                {
                    const val = e.value;
                    if (val && val.match(/\d+[,.]\d+/g)) {
                        e.value = toSystemDecimalDelimiter(cleanParseFloat(val));
                    }
                }
            }, false);

            e.addEventListener('blur', (keyValue) => {
                const val = e.value;
                checkAll(elements,warningMessage, submitButton);
                checkSafeMessage(elements,warningMessage, submitButton);
                if (window.wfGetOptions().correctComma) {
                    const operation = shouldRoundToNearestQuarter() ? roundStringToNearestQtr : toSystemDecimalDelimiter;
                    if (val) {
                        e.value = operation(cleanParseFloat(val));
                    }
                }
            }, false);
        });
    }

      async function checkSafeMessage(elements,warningMessage, submitButton) {
          setTimeout(async() => {
              const safeMessage = await getElementsFromDocument('.css-1omcej9', document);

              if (safeMessage[0].getAttribute('data-testID') === null && submitButton.getAttribute('disabled') === true) return checkSafeMessage();
              excecuteReTime();
              return checkAll(elements,warningMessage, submitButton);
          }, 3000)
      }

    function shouldRoundToNearestQuarter() {
        if (!window.wfGetOptions) {
            return true;
        }
        return window.wfGetOptions().roundToNearestQuarter;
    }

    function afterEventCheck() {

        if(timer !== null) {
            clearTimeout(timer);
         }
        timer = setTimeout(async function() {
            const elementsEv = await getElementsFromDocument('input.css-54z73u:not([disabled])', document);
            const submitButtonEv = await getElementsFromDocument('.css-14ce388', document);
            const containerEv = await getElementsFromDocument('.css-ub2476', document);
            const warningMessageEv = await createWarningMessage(containerEv[0]);
            checkAll(elementsEv, warningMessageEv, submitButtonEv[0]);
        }, 150);
    }

    function roundStringToNearestQtr(number) {
        return toSystemDecimalDelimiter(roundNearQtr(number));
    }

    function toSystemDecimalDelimiter(number) {
        return numberFormater.format(number);
    }

    function roundNearQtr(nr) {
        return Math.round(nr * 4) / 4;
    }
})(window);
