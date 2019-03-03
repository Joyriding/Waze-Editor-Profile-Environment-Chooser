// ==UserScript==
// @name         Waze Editor Profile Environment Chooser
// @namespace    https://greasyfork.org/users/32336-joyriding
// @version      2019.03.03.00
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
        request.open('GET', apiUrl, false); // 'false' makes the request synchronous
        request.send(null);

        if (request.status === 200) {
            console.log(request.responseText);
            window.gon.data = JSON.parse(request.responseText);
        }
        window.gon.data.lastEditEnv=settings.Environment;
    }

    document.addEventListener ("DOMContentLoaded", DOM_ContentReady);
    document.addEventListener('DOMContentLoaded',function() {
        document.querySelector('select[name="environmentSelect"]').onchange=envChanged;
    },false);

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
        highlightTitleIcon.className="highlight-title-icon posts";
        let highlightTitleText = document.createElement('div');
        highlightTitleText.className="highlight-title-text";
        let userStatsValue = document.createElement('div');
        userStatsValue.className="user-stats-value";

        highlightTitle.appendChild(highlightTitleIcon);
        highlightTitle.appendChild(highlightTitleText);
        highlight.appendChild(highlightTitle);
        highlight.appendChild(userStatsValue);

        highlightTitleText.innerHTML = 'Environments';
        userStatsValue.setAttribute('style','margin-top:7px;font-size:20px');



        let frag = document.createDocumentFragment(),
            select = document.createElement("select");
        select.id = 'environmentSelect';
        select.name = 'environmentSelect';

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


    }

    function DOM_ContentReady () {
        bootstrap();
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

