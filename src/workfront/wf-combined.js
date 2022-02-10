// ==UserScript==
// @name         WF combined
// @namespace    https://www.emakina.com/
// @version      1.44
// @description  Combines the individual wf scripts into one.
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
// @downloadURL  https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/master/src/workfront/wf-combined.js
// @updateURL    https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/master/src/workfront/wf-combined.js
// @require      https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/master/src/workfront/include-scripts/convert-save-into-event.js
// @require      https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/master/src/workfront/highlight-currentday.js
// @require      https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/master/src/workfront/warning-current-timesheet.js
// @require      https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/master/src/workfront/indicate-missing-comment.js
// @require      https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/master/src/workfront/add-companyName-projectHeader.js
// @require      https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/master/src/workfront/indicate-norm.js
// @require      https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/master/src/workfront/select-next-task-line.js
// @require      https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/master/src/workfront/disable-completed-task.js
// @require      https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/master/src/workfront/options.js

// ==/UserScript==

setTimeout(async() => {
    var newDiv = document.createElement("div");
    newDiv.innerHTML = "Your Tampermonkey script is out-dated, please update it. (Details <a href='https://share.emakina.net/display/ENWNI/Tampermonkey+Script#TampermonkeyScript-ManualUpdating' style='text-decoration:underline;padding-left: 5px' target='_blank'>see our documentation</a>)";
    newDiv.style = 'display:flex; justify-content: center; align-items: center;background:red; color: #ffffff; height: 50px'

    var currentDiv = document.getElementById("root");
    document.body.insertBefore(newDiv, currentDiv);
}, 5000);