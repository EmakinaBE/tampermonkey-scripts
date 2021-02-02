// ==UserScript==
// @name         Indicate entries without comment
// @namespace    https://www.emakina.com/
// @version      1.0
// @description  Indicate entries without comment and hide submit button when entries without comment are found 
// @author       Wouter Versyck
// @match        https://emakina.my.workfront.com/timesheet/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const inputFieldSelector = '.fc > input';
    const noCommentClass = 'wf_no-comment';
    const submitButtonSelector = '.btn.submit.btn-secondary';
    const warningMessageStyle = 'color: tomato; padding: 15px 0; font-size: 1.2em; font-weight: bold;';
    const warningMessageText = 'Not all entries have a comment';

    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .${noCommentClass}{
                background: tomato
            }
        </style>`);

    const elements = getElements(inputFieldSelector);
    const submitButton = getElement(submitButtonSelector);

    const warningMessage = createWarningMessage();
    checkAllComments();
    initListeners();

    function initListeners() {
        elements.forEach(e => {
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.attributeName === 'data-description') {
                        checkAllComments();
                    }
                });
            });

            observer.observe(e, {
                attributes: true
            });
            e.addEventListener('change', checkAllComments);
        });
    }

    function checkAllComments() {
        let isSubmitAllowed = true;

        elements.forEach(e => {
            const comment = e.getAttribute('data-description');
            const value = e.value;

            if(value && !comment) {
                e.classList.add(noCommentClass);
                isSubmitAllowed = false;
            } else {
                e.classList.remove(noCommentClass);
            }
        });

        submitButton.disabled = !isSubmitAllowed;
        isSubmitAllowed ? warningMessage.classList.add('hidden') : warningMessage.classList.remove('hidden');
    }

    function getElements(selector) {
        return document.getElements(selector);
    }

    function getElement(selector) {
        return document.getElement(selector);
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
})();