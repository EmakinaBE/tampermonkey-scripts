// ==UserScript==
// @name         Indicate entries without comment
// @namespace    https://www.emakina.com/
// @version      1.0
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
    const noCommentStyle = 'background: tomato;';
    const notificationsSelector = '.Notify.success';
    const submitButtonSelector = '.btn.submit.btn-secondary';
    const saveButtonSelector = '.btn.primary.btn-primary';
    const warningMessageStyle = 'color: tomato; padding: 15px 0; font-size: 1.2em; font-weight: bold;';
    const warningMessageText = 'Not all entries have a comment';

    init();

    function init() {
        const elements = getElements(inputFieldSelector);
        const submitButton = getElement(submitButtonSelector);

        const warningMessage = createWarningMessage();
        const emptyFieldFound = checkAllCommentsAndMarkFields(elements);

        submitButton.disabled = emptyFieldFound;
        emptyFieldFound ? warningMessage.classList.remove('hidden') : warningMessage.classList.add('hidden');

        initListeners(elements);
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

    function checkAllCommentsAndMarkFields(elements) {
        const submitButton = getElement(submitButtonSelector);
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

    function initListeners(elements) {
        elements.forEach(e => {
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.attributeName === 'data-description') {
                        checkAllCommentsAndMarkFields(elements);
                    }
                });
            });

            observer.observe(e, {
                attributes: true
            });
            e.addEventListener('change', () => checkAllCommentsAndMarkFields(elements));
        });
        getElement(saveButtonSelector).addEventListener('click', () => pollNetworkRequestSuccess(getNrOfNotifications()));
    }

    function pollNetworkRequestSuccess(nrOfPreviousNotifications) {
        console.log('polling notification');
        const nrOfNotifications = getNrOfNotifications();

        if (nrOfNotifications === nrOfPreviousNotifications) {
            setTimeout(pollNetworkRequestSuccess, 500, nrOfNotifications);
            return;
        }

        init();
    }

    function getNrOfNotifications() {
        return getElements(notificationsSelector).length;
    }

    function getElements(selector) {
        return document.getElements(selector);
    }

    function getElement(selector) {
        return document.getElement(selector);
    }
})();