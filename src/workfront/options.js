// ==UserScript==
// @name         Options
// @namespace    https://www.emakina.com/
// @version      2.0.1.0
// @description  Show/edit options
// @author       Wouter Versyck, Jan Drenkhahn, Domenik Reitzner
// @match        https://emakina.my.workfront.com/*
// @match        https://emakina.preview.workfront.com/*
// @match        https://emakina.sb01.workfront.com/*
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @supportURL   https://emakina.my.workfront.com/requests/new?activeTab=tab-new-helpRequest&projectID=5d5a659a004ee38ffbb5acc9b3c23c4c&path=61685dd40006ed63ccba6a27b6e31226
// @homepage     https://github.com/EmakinaBE/tampermonkey-scripts
// @downloadURL  https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-2398/src/workfront/options.js
// @updateURL    https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-2398/src/workfront/options.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let popUp = null;
    let popupCreate;
    let isPopUpVisible = false;

    callback(init);
    init();

    const optionsLabel = {
        autoRedirect: 'Auto redirect to oldest open timesheet',
        showCompanyName: 'Show company name next to project',
        autoSave: 'Auto-save',
        autoSelect: 'Auto-select next task time line',
        correctComma: 'Correct wrong comma seperator',
        roundToNearestQuarter: 'Round entries to nearest quarter', 
    };


    function init() {
        setTimeout(async() => {
            if (!popupCreate) popUp = createPopupElement();
        },1000);
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
        popUp.style = 'display: block';
    }

    function reloadOptions() {
      if (isPopUpVisible) {
        const newOptions = [...document.querySelectorAll('.wf-popup [type="checkbox"]')]
            .map((newOption) => {
                return [
                    newOption.id, 
                    newOption.checked
                ];
            });
        
        saveOptions(Object.fromEntries(newOptions));
        excecuteReInit();
        hidePopup();
      } 
    }

    async function createMenuElement() {
        const listId = 'tp-icon-container';
        const oldListElement = await getElementsFromDocument(`#${listId}`, document);
        if(oldListElement ) return;

        const button = document.createElement('button');
        button.classList.add('wf-button');
        button.onclick = togglePopUp;

        const li = document.createElement('li');
        li.appendChild(button);
        let navbarItemGroup;

        if(!isNewUI()) {
            li.classList.add('navbar-item');
            navbarItemGroup = await getElementsFromDocument('.navbar-item-group.right', document);
            if(!navbarItemGroup) return;
        } else {
            li.classList.add('flex', 'mr-4', 'items-center');
            navbarItemGroup = await getElementsFromDocument('ul.adobe-navbar', document);
            if(!navbarItemGroup) return;
        }

        li.id = listId;
        navbarItemGroup[0].appendChild(li);
    }

    function createPopupElement() {
        popupCreate = true;
        const overlay = createOverlay();
        overlay.appendChild(createOptionsView());

        document.body.appendChild(overlay);
        return overlay;
    }

    function createOverlay() {
        const div = document.createElement('div');
        div.classList.add('wf-overlay');
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
        container.classList.add('wf-popup');
        container.appendChild(createCloseButton());
        container.appendChild(createTitle('WF scripts options'));

        for (const [key, value] of Object.entries(wfGetOptions())) {
            const div = document.createElement('div');

            div.appendChild(createCheckbox(key, value));
            div.appendChild(createLabel(key, optionsLabel[key]));

            container.appendChild(div);
        }
        container.appendChild(createButtonArea());

        return container;
    }

    function createCloseButton() {
        const button = document.createElement('button');
        button.classList.add('wf-popup-closs');
        button.textContent = 'X';
        button.onclick = togglePopUp;
        return button;
    }

    function createTitle(text) {
        const title = document.createElement('h2');
        title.textContent = text;
        title.style = 'margin-bottom: 15px;';
        return title;
    }

    function createCheckbox(key, value) {
        const checkBox = document.createElement('input');
        checkBox.setAttribute('type', 'checkbox');
        checkBox.id = key;
        checkBox.name = key;
        checkBox.checked = value;
        checkBox.onchange = saveOptions;
        return checkBox;
    }

    function createLabel(key, text) {
        const label = document.createElement('label');
        label.classList.add('ml-4');
        label.setAttribute('for', key);
        label.textContent = text;
        return label;
    }

    function createButtonArea() {
        const btnContainer = document.createElement('div');
        btnContainer.classList.add('wf-popup-btn-ctn');
        btnContainer.appendChild(createInfoText('If you save, we reload the Options'))
        btnContainer.appendChild(createButtonInner());
        return btnContainer;
    }

    function createInfoText(text) {
        const infoText = document.createElement('span');
        infoText.classList.add('wf-info-text');
        infoText.textContent = text;
        return infoText;
    }

    function createButtonInner() {
        const innercontainer = document.createElement('div');
        innercontainer.classList.add('wf-popup-btn-ctn-inner');
        innercontainer.appendChild(createSaveButton());
        innercontainer.appendChild(createCancleButton());
        return innercontainer;
    }

    function createSaveButton() {
        const button = document.createElement('button');
        button.classList.add('wf-popup-save-btn');
        button.textContent= 'Save';
        button.onclick = reloadOptions;
        return button;
    }

    function createCancleButton() {
        const button = document.createElement('button');
        button.classList.add('wf-popup-cancle-btn');
        button.textContent = 'Close';
        button.onclick = togglePopUp;
        return button;
    }
})();