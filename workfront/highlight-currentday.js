// ==UserScript==
// @name         Workfront highlight Today
// @namespace    https://www.emakina.com/
<<<<<<< HEAD
// @version      1.0
=======
// @version      0.3
>>>>>>> 4a7707807454230c9e1ae3fb9676ce493ab2677a
// @description  Highlight current day
// @author       Jeffrey Vandenbossche
// @homepage	 https://gitlab.emakina.net/jev/tampermonkey-scripts
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @icon64       https://emakina.my.workfront.com/static/img/favicon.ico
// @match        https://emakina.my.workfront.com/timesheet/*
// @match        https://emakina.my.workfront.com/timesheets/current*
// @grant        none
// @downloadURL	 https://gitlab.emakina.net/jev/tampermonkey-scripts/-/raw/master/workfront/highlight-currentday.js
// @updateURL	 https://gitlab.emakina.net/jev/tampermonkey-scripts/-/raw/master/workfront/highlight-currentday.js
// @supportURL	 https://bugtracking.emakina.net/projects/ENWORKFNAV/summary
// ==/UserScript==

(function() {
    'use strict';

    var x = document.getElementsByClassName("today");
    var i;
    for (i = 0; i < x.length; i++) {
        x[i].style.backgroundColor = "blue";
        x[i].style.backgroundImage="none";
    }
})();
