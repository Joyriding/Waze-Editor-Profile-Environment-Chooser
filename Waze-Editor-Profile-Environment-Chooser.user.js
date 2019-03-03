// ==UserScript==
// @name         Waze Editor Profile Environment Chooser
// @namespace    https://greasyfork.org/users/32336-joyriding
// @version      2019.03.03.01
// @description  Allows switching between editing environments when viewing a user profile
// @author       Joyriding
// @include      https://www.waze.com/*user/editor*
// @include      https://beta.waze.com/*user/editor*
// @grant        none
// @run-at       document-start
// ==/UserScript==

/* global W */

(function() {
    'use strict';

    var settings = {};
    loadSettings();
    let lastEditEnv = window.gon.data.lastEditEnv;

    if (typeof settings.Environment != 'undefined'
        && settings.Environment != 'default'
        && settings.Environment != window.gon.data.lastEditEnv) {
        let apiUrl = getApiUrlUserProfile(window.gon.data.username, settings.Environment);

        var request = new XMLHttpRequest();
        request.open('GET', apiUrl, true); // 'false' makes the request synchronous
        request.send(null);

        if (request.status === 200) {
            console.log(request.responseText);
            window.gon.data = JSON.parse(request.responseText);
        }
        window.gon.data.lastEditEnv=settings.Environment;
    }

    document.addEventListener ("DOMContentLoaded", DOM_ContentReady);

    function init() {
        //   let headline = document.getElementsByClassName('user-headline')[0];
        //   let envDiv = document.createElement('div');
        //   envDiv.id = 'user-environment';
        //   headline.appendChild(envDiv);
        //   let label = document.createElement('span');
        //   label.innerHTML = 'Environment: ';

        let highlight = document.createElement('div');
        highlight.className="highlight";
        let highlightTitle = document.createElement('div');
        highlightTitle.className="highlight-title";
        let highlightTitleIcon = document.createElement('div');
        //highlightTitleIcon.className="highlight-title-icon posts";
        highlightTitleIcon.setAttribute('style',getIconStyle());
        let highlightTitleText = document.createElement('div');
        highlightTitleText.className="highlight-title-text";
        let userStatsValue = document.createElement('div');
        userStatsValue.className="user-stats-value";

        highlightTitle.appendChild(highlightTitleIcon);
        highlightTitle.appendChild(highlightTitleText);
        highlight.appendChild(highlightTitle);
        highlight.appendChild(userStatsValue);

        highlightTitleText.innerHTML = 'Environments';
        userStatsValue.setAttribute('style','margin-top: -10px;font-size: 17px;');



        let frag = document.createDocumentFragment(),
            select = document.createElement("select");
        select.id = 'environmentSelect';
        select.name = 'environmentSelect';
        select.setAttribute('style','position:relative;box-shadow: 0 0 2px #57889C;background: white;font-family: sans-serif;display: inherit;top: -11px;border: 0px;outline: 0px;color: #59899e;');

        select.options.add( new Option("Last Edit (" + lastEditEnv.toUpperCase() + ")","default", true, true) );
        select.options.add( new Option("NA","na") );
        select.options.add( new Option("ROW","row") );
        select.options.add( new Option("IL","il") );

        for (var i = 0; i < select.options.length; i++) {
            if (select.options[i].value == settings.Environment) {
                select.options[i].selected = true;
            }
        }

        frag.appendChild(select);
        //envDiv.appendChild(label);
        //envDiv.appendChild(frag);
        document.getElementsByClassName('user-stats')[0].prepend(highlight);
        userStatsValue.appendChild(frag);



        document.querySelector('select[name="environmentSelect"]').onchange=envChanged;


    }

    function DOM_ContentReady () {
        setTimeout(function() {
            if (document.getElementById('ruler') == null) {
                console.log('la');
                bootstrap();
            } else {
                console.log('lala');
                setTimeout(function() {bootstrap();},1800);
            }
            ;},200);
    }

    function bootstrap(tries) {
        tries = tries || 1;

        if (W && W.EditorProfile ) {
            init();
        } else if (tries < 1000)
            setTimeout(function () {bootstrap(tries++);}, 200);
    }

    function getApiUrlUserProfile(username, env) {
        let apiEnv = '';
        if (env != 'na')
        {
            apiEnv = env + '-';
        }
        return `https://${window.location.host}/${apiEnv}Descartes/app/UserProfile/Profile?username=${username}`;
    }

    function getIconStyle() {
        let $tempDiv = null;
        let tempQuerySelector = null;
        let tempComputedStyle = null;

        tempQuerySelector = document.querySelector('#edits-by-type .venue-icon');
        tempComputedStyle = window.getComputedStyle(tempQuerySelector);
        let iconStyle =
            `background-image:${tempComputedStyle.getPropertyValue('background-image')};`
        + `background-size:${tempComputedStyle.getPropertyValue('background-size')};`
        + `background-position:${tempComputedStyle.getPropertyValue('background-position')};`
        + `width:${tempComputedStyle.getPropertyValue('width')};`
        + `height:${tempComputedStyle.getPropertyValue('height')};`
        + `transform: scale(0.5);`
        + `display: inline-block;`
        + `float: left;`
        + `position: relative;`
        + `top: -10px;`
        + `left: -9px;`
        + `margin-right: -18px;`
        + `filter: invert(10%) sepia(39%) saturate(405%) hue-rotate(152deg) brightness(99%) contrast(86%);`;
        return iconStyle;
    }

    function envChanged(e) {
        settings.Environment = e.target.value;
        saveSettings();
        location.reload();
    }

    function saveSettings() {
        if (localStorage) {
            var localsettings = {
                Environment: settings.Environment
            };

            localStorage.setItem("wmeProfileEnvironmentChooser", JSON.stringify(localsettings));
        }
    }

    function loadSettings() {
        var loadedSettings = JSON.parse(localStorage.getItem("wmeProfileEnvironmentChooser"));
        var defaultSettings = {
            Environment: 'default'
        };
        settings = loadedSettings ? loadedSettings : defaultSettings;
        for (var prop in defaultSettings) {
            if (!settings.hasOwnProperty(prop))
                settings[prop] = defaultSettings[prop];
        }
    }


})();

