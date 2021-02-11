// ==UserScript==
// @name         Indicate entries without comment + rounding to the nearest quarter
// @namespace    https://www.emakina.com/
// @version      1.5
// @description  Indicate entries without comment, hide submit button when entries without comment are found and
// round filled in numbers to the nearest quarter
// @author       Wouter Versyck
// @match        https://emakina.my.workfront.com/timesheet/*
// @match        https://emakina.my.workfront.com/timesheets/current*
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @supportURL   https://bugtracking.emakina.net/projects/ENWORKFNAV/summary
// @homepage     https://github.com/EMAKINA-EGBA/WF-Timesheet-Helpers
// @downloadURL  https://raw.githubusercontent.com/EMAKINA-EGBA/WF-Timesheet-Helpers/master/src/workfront/indicate-missing-comment.js
// @updateURL    https://raw.githubusercontent.com/EMAKINA-EGBA/WF-Timesheet-Helpers/master/src/workfront/indicate-missing-comment.js
// @grant        none
// ==/UserScript==


(function() {
    'use strict';
    const inputFieldSelector = '.fc > input';
    const noCommentStyle = 'background: tomato';
    const submitButtonSelector = '.btn.submit.btn-secondary';
    const warningMessageStyle = 'color: tomato; padding: 15px 0; font-size: 1.2em; font-weight: bold;';
    const warningMessageText = 'Not all entries have a comment';

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

        submitButton.disabled = emptyFieldFound;
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
            e.addEventListener('change', () => {
                checkAll(elements, warningMessage, submitButton);
                roundNearQtr(e);
            });
        });
    }

    function roundNearQtr(htmlElement) {
        htmlElement.value = (Math.round(htmlElement.value * 4) / 4);
    }

    function getElements(selector) {
        return document.getElements(selector);
    }

    function getElement(selector) {
        return document.getElement(selector);
    }
})();
