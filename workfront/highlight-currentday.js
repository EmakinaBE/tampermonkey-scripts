// ==UserScript==
// @name         Workfront highlight Today
// @namespace    https://www.emakina.com/
// @version      0.3
// @description  Highlight current day
// @author       Jeffrey Vandenbossche
// @match        https://emakina.my.workfront.com/timesheet/*
// @match        https://emakina.my.workfront.com/timesheets/current*
// @grant        none
// @updateURL	 https://gitlab.emakina.net/jev/tampermonkey-scripts/-/raw/master/workfront/highlight-currentday.js
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
