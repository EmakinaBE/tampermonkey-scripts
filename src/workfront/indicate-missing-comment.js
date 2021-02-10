// ==UserScript==
// @name         Indicate entries without comment
// @namespace    https://www.emakina.com/
// @version      1.1
// @description  Indicate entries without comment and hide submit button when entries without comment are found
// @author       Wouter Versyck
// @match        https://emakina.my.workfront.com/timesheet/*
// @match        https://emakina.my.workfront.com/timesheets/current*
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @supportURL   https://bugtracking.emakina.net/projects/ENWORKFNAV/summary
// @homepage     https://gitlab.emakina.net/jev/tampermonkey-scripts
// @downloadURL  https://gitlab.emakina.net/jev/tampermonkey-scripts/-/raw/master/src/workfront/indicate-missing-comment.js
// @updateURL    https://gitlab.emakina.net/jev/tampermonkey-scripts/-/raw/master/src/workfront/indicate-missing-comment.js
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

    init();

    function init() {
        const elements = getElements(inputFieldSelector);
        const submitButton = getElement(submitButtonSelector);

        const warningMessage = createWarningMessage();

        checkAll(elements, warningMessage, submitButton);
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
            e.addEventListener('change', () => checkAll(elements, warningMessage, submitButton));
        });
    }


    function getElements(selector) {
        return document.getElements(selector);
    }

    function getElement(selector) {
        return document.getElement(selector);
    }
})();
