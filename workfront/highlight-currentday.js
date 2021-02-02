// ==UserScript==
// @name        Workfront highlight Today
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Highlight current day
// @author       You
// @match        https://emakina.my.workfront.com/timesheet/*
// @match        https://emakina.my.workfront.com/timesheets/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var x = document.getElementsByClassName("today");
    var i;
    for (i = 0; i < x.length; i++) {
        x[i].style.backgroundColor = "lemonchiffon";
        x[i].style.backgroundImage="none";
    }
})();