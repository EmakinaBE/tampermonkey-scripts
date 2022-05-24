// ==UserScript==
// @name         WF combined ENWORKFNAV-3125
// @namespace    https://www.emakina.com/
// @version      2.2.1.06
// @description  Combines the individual wf scripts into one.
// @author       Wouter Versyck
// @match        https://emakina.my.workfront.com/*
// @match        https://emakina.preview.workfront.com/*
// @match        https://emakina.sb01.workfront.com/*
// @match        https://emakina.my.workfront.com/*
// @match        https://emakina.preview.workfront.com/*
// @match        https://emakina.sb01.workfront.com/*
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @supportURL   https://emakina.my.workfront.com/requests/new?activeTab=tab-new-helpRequest&projectID=5d5a659a004ee38ffbb5acc9b3c23c4c&path=61685dd40006ed63ccba6a27b6e31226
// @homepage     https://github.com/EmakinaBE/tampermonkey-scripts
// @downloadURL  https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3125/src/workfront/wf-combined.js
// @updateURL    https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3125/src/workfront/wf-combined.js
// @require      https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3125/src/workfront/url-check.js
// @require      https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3125/src/workfront/include-scripts/save-changes.js
// @require      https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3125/src/workfront/include-scripts/storage.js
// @require      https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3125/src/workfront/include-scripts/manage-options.js
// @require      https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3125/src/workfront/include-scripts/check-if-new-or-old-UI.js
// @require      https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3125/src/workfront/include-scripts/event-handler.js
// @require      https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3125/src/workfront/include-scripts/access-document-object.js
// @require      https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3125/src/workfront/include-scripts/convert-save-into-event.js
// @require      https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3125/src/workfront/expand-project-header.js
// @require      https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3125/src/workfront/highlight-currentday.js
// @require      https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3125/src/workfront/warning-current-timesheet.js
// @require      https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3125/src/workfront/add-company-name-project-header.js
// @require      https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3125/src/workfront/indicate-missing-comment.js
// @require      https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3125/src/workfront/indicate-norm.js
// @require      https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3125/src/workfront/select-next-task-line.js
// @require      https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3125/src/workfront/disable-completed-task.js
// @require      https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3125/src/workfront/options.js
// @require      https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3125/src/workfront/load-css.js
// @require      https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3125/src/workfront/version-warning.js
// @require      https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3125/src/workfront/timesheet-panel.js
// @require      https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/ENWORKFNAV-3125/src/workfront/save-spinner.js
// @grant        none
// ==/UserScript==
