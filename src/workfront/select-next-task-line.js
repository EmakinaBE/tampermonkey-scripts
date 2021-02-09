// ==UserScript==
// @name         Select next task line
// @namespace    https://www.emakina.com/
// @version      1.0
// @author       Wouter Versyck
// @connect      self
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @supportURL   https://bugtracking.emakina.net/projects/ENWORKFNAV/summary
// @homepage     https://gitlab.emakina.net/jev/tampermonkey-scripts
// @match        https://emakina.my.workfront.com/timesheet/*
// @match        https://emakina.my.workfront.com/timesheets/current*
// @downloadURL  https://gitlab.emakina.net/jev/tampermonkey-scripts/-/raw/master/src/workfront/select-next-task-line.js
// @updateURL    https://gitlab.emakina.net/jev/tampermonkey-scripts/-/raw/master/src/workfront/select-next-task-line.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    init();

    function init() {
        const elements = getElements();

        elements.forEach(e => e.addEventListener('DOMNodeInserted', handleEvent, false));
    }

    function handleEvent(e) {
        if (!isElement(e.target)) {
            return;
        }
        const dropdowns = e.target.parentNode.getElements('.hour-type-drop-down');
        const newDropDown = dropdowns.pop();

        const values = dropdowns.map(e => e.getElement('.dd-hidden-input').value);

        // Put function on event loop to immediately executes after other rendering is done
        setTimeout(() => {
            newDropDown.click();
            const option = getFirstUnusedOptions(values);
            console.log(option);
            option.click();
        }, 0);
    }

    function getElements() {
        return document.getElements('.project-hours.hour-collection');
    }

    function getFirstUnusedOptions(values) {
        const options = [...document.getElement('.item-list').children];
        const leftOver = options.filter(e => !values.contains(e.getAttribute('data-value')));

        return leftOver.length > 0 ? leftOver[0] : options[0];
    }

    function isElement(o){
        return (
            typeof HTMLElement === 'object' ? o instanceof HTMLElement : //DOM2
                o && typeof o === 'object' && o !== null && o.nodeType === 1 && typeof o.nodeName === 'string'
        );
    }
})();
