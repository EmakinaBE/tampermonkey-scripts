// ==UserScript==
// @name         Options
// @namespace    https://www.emakina.com/
// @version      1.0
// @description  Show/edit options
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
// @downloadURL  https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/master/src/workfront/options.js
// @updateURL    https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/master/src/workfront/options.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    let storageKey = 'wf-options';
    const defaultOptions = {
        autoRedirect: {
            label: 'Auto redirect to oldest open ts',
            isChecked: false
        },
    };

    window.wfGetOptions = getOptions;

    const options = loadOptions();

    let popUp = null;
    let isPopUpVisible = false;

    init();

    function init() {
        popUp = createPopupElement();
        createMenuElement();
    }

    function togglePopUp() {
        isPopUpVisible ? hidePopup() : showPopUp();
        isPopUpVisible = !isPopUpVisible;
    }

    function hidePopup() {
        popUp.style = 'display:none';
    }

    function showPopUp() {
        popUp.style = 'position:absolute;background:rgba(0,0,0,50%);left:0;top:0;width:100%;height:100%';
    }

    function createMenuElement() {
        const button = document.createElement('button');
        button.textContent = 'test';
        button.onclick = togglePopUp;

        const li = document.createElement('li');
        li.appendChild(button);
        li.classList.add('navbar-item');
        document.getElement('.navbar-item-group.right').appendChild(li);
    }

    function createPopupElement() {
        const overlay = createOverlay();
        overlay.appendChild(createOptionsView());

        document.body.appendChild(overlay);
        return overlay;
    }

    function createOverlay() {
        const div = document.createElement('div');
        div.id = 'WF-overlay';
        div.style = 'display:none';
        div.onclick = e => {
            if (e.target.id === 'WF-overlay') {
                togglePopUp();
            }
        };
        return div;
    }

    function createOptionsView() {
        const container = document.createElement('div');
        container.style = 'transform: translate(-50%, -50%); position: fixed; left: 50%; top: 50%; padding:20px; background: white; border: 1px solid black; box-shadow: 1px 3px 15px 5px rgba(0,0,0,0.32);';
        container.appendChild(createCloseButton());
        container.appendChild(createTitle('Options for WorkFront scripts'));

        for (const [key, value] of Object.entries(options)) {
            const div = document.createElement('div');

            div.appendChild(createCheckbox(key, value));
            div.appendChild(createLabel(key, value.label));

            container.appendChild(div);
        }

        return container;
    }

    function createCloseButton() {
        const button = document.createElement('button');
        button.textContent = 'X';
        button.onclick = togglePopUp;
        button.style = 'float:right;border-radius:50%;width:20px;height:20px;line-height:0.1';
        return button;
    }

    function createTitle(text) {
        const title = document.createElement('h1');
        title.textContent = text;
        return title;
    }

    function createCheckbox(key, value) {
        const checkBox = document.createElement('input');
        checkBox.setAttribute('type', 'checkbox');
        checkBox.id = key;
        checkBox.name = key;
        checkBox.checked = value.isChecked;
        checkBox.onchange = saveOptions;
        return checkBox;
    }

    function createLabel(key, text) {
        const label = document.createElement('label');
        label.setAttribute('for', key);
        label.textContent = text;
        return label;
    }

    function saveOptions(e) {
        const target = e.target;

        options[target.name].isChecked = target.checked;
        localStorage.setItem(storageKey, JSON.stringify(options));
    }

    function getOptions() {
        const result = {};
        for (const [key, value] of Object.entries(options)) {
            result[key] = value.isChecked;
        }
        return result;
    }

    function loadOptions() {
        return JSON.parse(localStorage.getItem(storageKey)) || defaultOptions;
    }
})();