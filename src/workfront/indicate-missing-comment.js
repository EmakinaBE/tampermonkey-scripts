// ==UserScript==
// @name         Indicate entries without comment + rounding to the nearest quarter
// @namespace    https://www.emakina.com/
// @version      1.13
// @description  Indicate entries without comment, hide submit button when entries without comment are found and round to nearest quarter
// round filled in numbers to the nearest quarter
// @author       Wouter Versyck
// @match        https://emakina.my.workfront.com/timesheet/*
// @match        https://emakina.preview.workfront.com/timesheet/*
// @match        https://emakina.sb01.workfront.com/timesheet/*
// @match        https://emakina.my.workfront.com/timesheets/current*
// @match        https://emakina.preview.workfront.com/timesheets/current*
// @match        https://emakina.sb01.workfront.com/timesheets/current*
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @supportURL   https://bugtracking.emakina.net/projects/ENWORKFNAV/summary
// @homepage     https://github.com/EmakinaBE/tampermonkey-scripts
// @downloadURL  https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/master/src/workfront/indicate-missing-comment.js
// @updateURL    https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/master/src/workfront/indicate-missing-comment.js
// @grant        none
// ==/UserScript==


(function() {
    'use strict';
    const inputFieldSelector = '.fc > input:not([readonly=true])';
    const noCommentStyle = 'background: tomato';
    const submitButtonSelector = '.btn.submit.btn-secondary';
    const warningMessageStyle = 'color: tomato; padding: 15px 0; font-size: 1.2em; font-weight: bold;';
    const warningMessageText = 'Not all entries have a comment';

    const del = getSystemDecimalSeparator();

    document.head.addEventListener('WF_RELOAD', init);
    document.head.addEventListener('WF_NEW-TASK',e => initNewTask(e));

    init();

    function init() {
        const elements = getElements(inputFieldSelector);
        const submitButton = getElement(submitButtonSelector);

        const warningMessage = createWarningMessage();

        checkAll(elements, warningMessage, submitButton);
        initListeners(elements, warningMessage, submitButton);
    }

    function initNewTask(e){
        const elements = e.detail.newLine.getElements(inputFieldSelector);
        const submitButton = getElement(submitButtonSelector);
        const warningMessage = getElement('#CommentPanel > menu > p');
        initListeners(elements, warningMessage, submitButton);
    }

    function createWarningMessage() {
        const element = document.createElement('p');
        const textNode = document.createTextNode(warningMessageText);
        element.appendChild(textNode);

        element.setAttribute('style', warningMessageStyle);
        element.classList.add('hidden');

        const container = getElement('#CommentPanel > menu');
        container.insertBefore(element, container.firstChild);

        return element;
    }

    function checkAll(elements, warningMessage, submitButton) {
        const emptyFieldFound = checkAllCommentsAndMarkFields(elements);

        // submit button is not always shown (on already commited ts)
        if(submitButton) {
            submitButton.disabled = emptyFieldFound;
        }
        
        emptyFieldFound ? warningMessage.classList.remove('hidden') : warningMessage.classList.add('hidden');
    }

    function checkAllCommentsAndMarkFields(elements) {
        let isEmptyCommentPresent = false;

        elements.forEach(e => {
            const comment = e.getAttribute('data-description');
            const value = e.value;

            if(value && !comment) {
                e.setAttribute('style', noCommentStyle);
                isEmptyCommentPresent = true;
            } else {
                e.removeAttribute('style');
            }
        });
        return isEmptyCommentPresent;
    }

    function initListeners(elements, warningMessage, submitButton) {
        elements.forEach(e => {
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.attributeName === 'data-description') {
                        checkAll(elements, warningMessage, submitButton);
                    }
                });
            });

            observer.observe(e, {
                attributes: true
            });
            e.addEventListener('keyup', () => {
                const val = e.value;
                checkAll(elements, warningMessage, submitButton);
                const operation = shouldRoundToNearestQuarter() ? roundStringToNearestQtr : toSystemDecimalDelimiter;
                if (val) {
                    e.value = operation(val);
                }
            }, false);
        });
    }

    function shouldRoundToNearestQuarter() {
        if (!window.wfGetOptions) {
            return true;
        }
        return window.wfGetOptions().roundToNearestQuarter;
    }

    function roundStringToNearestQtr(string) {
        const index = string.indexOf(del);
        if(index > 0 && index < string.length - 1) {
            const roundedNr = roundNearQtr(parseFloat(string));
            return toSystemDecimalDelimiter(roundedNr.toString());
        }
        return toSystemDecimalDelimiter(string);
    }

    function toSystemDecimalDelimiter(string) {
        const correctDel = del;
        const wrongDel = correctDel === '.' ? ',' : '.';

        return string.replace(wrongDel, correctDel);
    }

    function roundNearQtr(nr) {
        return Math.round(nr * 4) / 4;
    }

    function getElements(selector) {
        return document.getElements(selector);
    }

    function getElement(selector) {
        return document.getElement(selector);
    }

    function getSystemDecimalSeparator() {
        var n = 1.1;
        const lang = document.documentElement.lang.replace('_', '-');

        if (lang) {
            return n.toLocaleString(lang).substring(1, 2);
        }
        return n.toLocaleString().substring(1, 2);
    }
})();
