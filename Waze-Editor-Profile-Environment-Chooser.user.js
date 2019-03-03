// ==UserScript==
// @name         Editor Profile Environment Chooser
// @namespace    https://greasyfork.org/users/32336-joyriding
// @version      2019.03.03.00
// @description  Allows switching between editing environments when viewing a user profile
// @author       Joyriding
// @include      https://www.waze.com/*user/editor*
// @include      https://beta.waze.com/*user/editor*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    var settings = {};
    loadSettings();

    if (typeof settings.Environment != 'undefined' && settings.Environment != 'default') {
        window.gon.data.lastEditEnv=settings.Environment;
    }

    document.addEventListener ("DOMContentLoaded", DOM_ContentReady);

    document.addEventListener('DOMContentLoaded',function() {
        document.querySelector('select[name="environmentSelect"]').onchange=envChanged;
    },false);

    function DOM_ContentReady () {
        let headline = document.getElementsByClassName('user-headline')[0];
        let envDiv = document.createElement('div');
        envDiv.id = 'user-environment';
        headline.appendChild(envDiv);
        let label = document.createElement('span');
        label.innerHTML = 'Environment: ';

        let frag = document.createDocumentFragment(),
            select = document.createElement("select");
        select.id = 'environmentSelect';
        select.name = 'environmentSelect';

        select.options.add( new Option("default","default", true, true) );
        select.options.add( new Option("na","na") );
        select.options.add( new Option("row","row") );
        select.options.add( new Option("il","il") );

        for (var i = 0; i < select.options.length; i++) {
            if (select.options[i].text== settings.Environment) {
                select.options[i].selected = true;
            }
        }

        frag.appendChild(select);
        envDiv.appendChild(label);
        envDiv.appendChild(frag);
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

