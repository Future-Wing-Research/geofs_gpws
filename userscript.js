// ==UserScript==
// @name         GeoFS GPWS callouts
// @namespace    https://github.com/tylerbmusic/GeoFS-GPWS-Callouts
// @version      1.2.1
// @description  Adds some GPWS callouts
// @author       GGamerGGuy and Future-Wing-Research
// @match        https://www.geo-fs.com/geofs.php?v=*
// @match        https://*.geo-fs.com/geofs.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geo-fs.com
// @grant        none
// @downloadURL  https://github.com/tylerbmusic/GeoFS-GPWS-Callouts/raw/refs/heads/main/userscript.js
// @updateURL    https://github.com/tylerbmusic/GeoFS-GPWS-Callouts/raw/refs/heads/main/userscript.j
// @run-at      document-start
// ==/UserScript==

setTimeout((function() {
    'use strict';

    const audioCtx = new AudioContext();

    function makeLouder(url, gainValue = 4.0) {
        const audio = new Audio(url);
        const source = audioCtx.createMediaElementSource(audio);
        const gainNode = audioCtx.createGain();

        gainNode.gain.value = gainValue; // >1.0 = louder

        source.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        return audio;
    }

    window.soundsToggleKey = "none"; //CHANGE THIS LETTER TO CHANGE THE KEYBOARD SHORTCUT TO TOGGLE THE SOUNDS.
    window.soundsOn = true; //This decides whether callouts are on by default or off by default.
    window.a2500 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/2500.wav');
    window.a2000 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/2000.wav');
    window.a1000 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/1000.wav');
    window.a500 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/500.wav');
    window.a400 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/400.wav');
    window.a300 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/300.wav');
    window.a200 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/200.wav');
    window.a100 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/100.wav');
    window.a50 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/50.wav');
    window.a40 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/40.wav');
    window.a30 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/30.wav');
    window.a20 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/20.wav');
    window.a10 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/10.wav');
    window.aRetard = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/retard.wav');
    window.a5 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/5.wav');
    window.stall = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/stall.wav');
    window.glideSlope = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/glideslope.wav');
    window.tooLowFlaps = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/too-low_flaps.wav');
    window.tooLowGear = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/too-low_gear.wav');
    window.apDisconnect = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/ap-disconnect.wav');
    window.minimumBaro = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/minimum.wav');
    window.dontSink = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/dont-sink.wav');
    window.masterA = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/masterAlarm.wav');
    window.bankAngle = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/bank-angle.wav');
    window.overspeed = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/overspeed.wav');
    window.justPaused = false;
    window.masterA.loop = true;
    window.bankAngle.loop = true;
    window.overspeed.loop = true;
    window.iminimums = false;
    window.i2500 = false;
    window.i2000 = false;
    window.i1000 = false;
    window.i500 = false;
    window.i400 = false;
    window.i300 = false;
    window.i200 = false;
    window.i100 = false;
    window.i50 = false;
    window.i40 = false;
    window.i30 = false;
    window.i20 = false;
    window.i10 = false;
    window.i7 = false;
    window.i5 = false;
    window.gpwsRefreshRate = 100;
    window.willTheDoorFallOff = false;
    window.didAWheelFall = false;
    window.DEGREES_TO_RAD = window.DEGREES_TO_RAD || 0.017453292519943295769236907684886127134428718885417254560971914401710091146034494436822415696345094822123044925073790592483854692275281012398474218934047117319168245015010769561697553581238605305168789;
    window.RAD_TO_DEGREES = window.RAD_TO_DEGREES || 57.295779513082320876798154814105170332405472466564321549160243861202847148321552632440968995851110944186223381632864893281448264601248315036068267863411942122526388097467267926307988702893110767938261;
    window.METERS_TO_FEET = window.METERS_TO_FEET || 3.280839895;
    function isInRange(i, a, vs) {
        if (i >= 100) {
            if ((i <= a+10) && (i >= a-10)) {
                return true;
            }
        } else if (i >= 10) {
            if ((i < a+4) && (i > a-4)) {
                return true;
            }
        } else {
            if (i <= a+1 && i >= a-1) {
                return true;
            }
        }
        return false;
    }
    window.wasAPOn = false;
    //window.isRadioPanelOpen = false;
    var flightDataElement = document.getElementById('flightDataDisplay1');
    if (!flightDataElement) {
        var bottomDiv = document.getElementsByClassName('geofs-ui-bottom')[0];
        flightDataElement = document.createElement('div');
        flightDataElement.id = 'flightDataDisplay1';
        flightDataElement.classList = 'mdl-button';
        bottomDiv.appendChild(flightDataElement);
    }

    // flightDataElement.innerHTML = `
    //             <input style="background: 0 0; border: none; border-radius: 2px; color: #000; display: inline-block; padding: 0 8px;" placeholder="Minimums (Baro)" id="minimums">
    //         `;
    function updateGPWS() {
        // Check if geofs.animation.values is available
        if (typeof window.geofs.animation.values != 'undefined' && !window.geofs.isPaused()) {
            if (window.justPaused) {
                window.justPaused = false;
            }
            window.willTheDoorFallOff = window.geofs.aircraft.instance.aircraftRecord.name.includes("Boeing");
            window.isAsOldAsYourMom = window.geofs.aircraft.instance.aircraftRecord.name.includes("757") || window.geofs.aircraft.instance.aircraftRecord.name.includes("767") || window.geofs.aircraft.instance.aircraftRecord.name.includes("737-200") || window.geofs.aircraft.instance.aircraftRecord.name.includes("747-100");
            window.russia = window.geofs.aircraft.instance.aircraftRecord.name.includes("Ilyushin") || window.geofs.aircraft.instance.aircraftRecord.name.includes("Antonov") || window.geofs.aircraft.instance.aircraftRecord.name.includes("Sukhoi") || window.geofs.aircraft.instance.aircraftRecord.name.includes("Tupolev") || window.geofs.aircraft.instance.aircraftRecord.name.includes("MiG");
            if (window.russia && !window.russians){
                window.a2500 = new Audio('https://anonmimi630-design.github.io/russian_gpws/2500.mp3', 4.0);
                window.a2000 = new Audio('https://anonmimi630-design.github.io/russian_gpws/2000.mp3', 4.0);
                window.a1000 = new Audio('https://anonmimi630-design.github.io/russian_gpws/1000.mp3', 4.0);
                window.a500 = new Audio('https://anonmimi630-design.github.io/russian_gpws/500.mp3', 4.0);
                window.a400 = new Audio('https://anonmimi630-design.github.io/russian_gpws/400.mp3', 4.0);
                window.a300 = new Audio('https://anonmimi630-design.github.io/russian_gpws/300.mp3', 4.0);
                window.a200 = new Audio('https://anonmimi630-design.github.io/russian_gpws/200.mp3', 4.0);
                window.a100 = new Audio('https://anonmimi630-design.github.io/russian_gpws/100.mp3', 4.0);
                window.a50 = new Audio('https://anonmimi630-design.github.io/russian_gpws/50.mp3', 4.0);
                window.a40 = new Audio('https://anonmimi630-design.github.io/russian_gpws/40.mp3', 4.0);
                window.a30 = new Audio('https://anonmimi630-design.github.io/russian_gpws/30.mp3', 4.0);
                window.a20 = new Audio('https://anonmimi630-design.github.io/russian_gpws/20.mp3', 4.0);
                window.a10 = new Audio('https://anonmimi630-design.github.io/russian_gpws/10.mp3', 4.0);
                window.a5 = new Audio('https://anonmimi630-design.github.io/russian_gpws/5.mp3', 4.0);
                window.aRetard = new Audio('https://anonmimi630-design.github.io/russian_gpws/retard.mp3', 4.0);
                window.stall = new Audio('https://anonmimi630-design.github.io/russian_gpws/stall.mp3', 4.0);
                window.glideSlope = new Audio('https://anonmimi630-design.github.io/russian_gpws/glide.mp3', 4.0);
                window.tooLowFlaps = new Audio('https://anonmimi630-design.github.io/russian_gpws/flaps.mp3', 4.0);
                window.tooLowGear = new Audio('https://anonmimi630-design.github.io/russian_gpws/gear.mp3', 4.0);
                window.apDisconnect = new Audio('https://anonmimi630-design.github.io/russian_gpws/ap.mp3', 4.0);
                window.minimumBaro = new Audio('https://anonmimi630-design.github.io/russian_gpws/minimums.mp3', 4.0);
                window.dontSink = new Audio('https://anonmimi630-design.github.io/russian_gpws/pull.mp3', 4.0);
                window.masterA = new Audio('https://anonmimi630-design.github.io/russian_gpws/master.mp3', 4.0);
                window.bankAngle = new Audio('https://anonmimi630-design.github.io/russian_gpws/bank.mp3', 4.0);
                window.overspeed = new Audio('https://anonmimi630-design.github.io/russian_gpws/overspeed.mp3', 4.0);
                window.masterA.loop = true;
                window.bankAngle.loop = true;
                window.overspeed.loop = true;
            } else if (window.russia && ! !window.vodka) {
                window.a2500 = new Audio('https://anonmimi630-design.github.io/russian_gpws/2500.mp3', 4.0);
                window.a2000 = new Audio('https://anonmimi630-design.github.io/russian_gpws/2000.mp3', 4.0);
                window.a1000 = new Audio('https://anonmimi630-design.github.io/russian_gpws/1000.mp3', 4.0);
                window.a500 = new Audio('https://anonmimi630-design.github.io/russian_gpws/500.mp3', 4.0);
                window.a400 = new Audio('https://anonmimi630-design.github.io/russian_gpws/400.mp3', 4.0);
                window.a300 = new Audio('https://anonmimi630-design.github.io/russian_gpws/300.mp3', 4.0);
                window.a200 = new Audio('https://anonmimi630-design.github.io/russian_gpws/200.mp3', 4.0);
                window.a100 = new Audio('https://anonmimi630-design.github.io/russian_gpws/100.mp3', 4.0);
                window.a50 = new Audio('https://anonmimi630-design.github.io/russian_gpws/50.mp3', 4.0);
                window.a40 = new Audio('https://anonmimi630-design.github.io/russian_gpws/40.mp3', 4.0);
                window.a30 = new Audio('https://anonmimi630-design.github.io/russian_gpws/30.mp3', 4.0);
                window.a20 = new Audio('https://anonmimi630-design.github.io/russian_gpws/20.mp3', 4.0);
                window.a10 = new Audio('https://anonmimi630-design.github.io/russian_gpws/10.mp3', 4.0);
                window.a5 = new Audio('https://anonmimi630-design.github.io/russian_gpws/5.mp3', 4.0);
                window.aRetard = new Audio('https://anonmimi630-design.github.io/russian_gpws/retard.mp3', 4.0);
                window.stall = new Audio('https://anonmimi630-design.github.io/russian_gpws/stall.mp3', 4.0);
                window.glideSlope = new Audio('https://anonmimi630-design.github.io/russian_gpws/glide.mp3', 4.0);
                window.tooLowFlaps = new Audio('https://anonmimi630-design.github.io/russian_gpws/flaps.mp3', 4.0);
                window.tooLowGear = new Audio('https://anonmimi630-design.github.io/russian_gpws/gear.mp3', 4.0);
                window.apDisconnect = new Audio('https://anonmimi630-design.github.io/russian_gpws/ap.mp3', 4.0);
                window.minimumBaro = new Audio('https://anonmimi630-design.github.io/russian_gpws/minimums.mp3', 4.0);
                window.dontSink = new Audio('https://anonmimi630-design.github.io/russian_gpws/pull.mp3', 4.0);
                window.masterA = new Audio('https://anonmimi630-design.github.io/russian_gpws/master.mp3', 4.0);
                window.bankAngle = new Audio('https://anonmimi630-design.github.io/russian_gpws/bank.mp3', 4.0);
                window.overspeed = new Audio('https://anonmimi630-design.github.io/russian_gpws/overspeed.mp3', 4.0);
                window.masterA.loop = true;
                window.bankAngle.loop = true;
                window.overspeed.loop = true;
            } else if (window.vodka && !window.russians) {
                window.a2500 = new Audio('https://anonmimi630-design.github.io/russian_gpws/2500.mp3', 4.0);
                window.a2000 = new Audio('https://anonmimi630-design.github.io/russian_gpws/2000.mp3', 4.0);
                window.a1000 = new Audio('https://anonmimi630-design.github.io/russian_gpws/1000.mp3', 4.0);
                window.a500 = new Audio('https://anonmimi630-design.github.io/russian_gpws/500.mp3', 4.0);
                window.a400 = new Audio('https://anonmimi630-design.github.io/russian_gpws/400.mp3', 4.0);
                window.a300 = new Audio('https://anonmimi630-design.github.io/russian_gpws/300.mp3', 4.0);
                window.a200 = new Audio('https://anonmimi630-design.github.io/russian_gpws/200.mp3', 4.0);
                window.a100 = new Audio('https://anonmimi630-design.github.io/russian_gpws/100.mp3', 4.0);
                window.a50 = new Audio('https://anonmimi630-design.github.io/russian_gpws/50.mp3', 4.0);
                window.a40 = new Audio('https://anonmimi630-design.github.io/russian_gpws/40.mp3', 4.0);
                window.a30 = new Audio('https://anonmimi630-design.github.io/russian_gpws/30.mp3', 4.0);
                window.a20 = new Audio('https://anonmimi630-design.github.io/russian_gpws/20.mp3', 4.0);
                window.a10 = new Audio('https://anonmimi630-design.github.io/russian_gpws/10.mp3', 4.0);
                window.a5 = new Audio('https://anonmimi630-design.github.io/russian_gpws/5.mp3', 4.0);
                window.aRetard = new Audio('https://anonmimi630-design.github.io/russian_gpws/retard.mp3', 4.0);
                window.stall = new Audio('https://anonmimi630-design.github.io/russian_gpws/stall.mp3', 4.0);
                window.glideSlope = new Audio('https://anonmimi630-design.github.io/russian_gpws/glide.mp3', 4.0);
                window.tooLowFlaps = new Audio('https://anonmimi630-design.github.io/russian_gpws/flaps.mp3', 4.0);
                window.tooLowGear = new Audio('https://anonmimi630-design.github.io/russian_gpws/gear.mp3', 4.0);
                window.apDisconnect = new Audio('https://anonmimi630-design.github.io/russian_gpws/ap.mp3', 4.0);
                window.minimumBaro = new Audio('https://anonmimi630-design.github.io/russian_gpws/minimums.mp3', 4.0);
                window.dontSink = new Audio('https://anonmimi630-design.github.io/russian_gpws/pull.mp3', 4.0);
                window.masterA = new Audio('https://anonmimi630-design.github.io/russian_gpws/master.mp3', 4.0);
                window.bankAngle = new Audio('https://anonmimi630-design.github.io/russian_gpws/bank.mp3', 4.0);
                window.overspeed = new Audio('https://anonmimi630-design.github.io/russian_gpws/overspeed.mp3', 4.0);
                window.masterA.loop = true;
                window.bankAngle.loop = true;
                window.overspeed.loop = true;
            } else if (window.isAsOldAsYourMom && !window.wasAsOldAsYourMom) {
                window.a2500 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/b2500.wav');
                window.a2000 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/b2000.wav');
                window.a1000 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/b1000.wav');
                window.a500 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/b500.wav');
                window.a400 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/b400.wav');
                window.a300 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/b300.wav');
                window.a200 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/b200.wav');
                window.a100 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/b100.wav');
                window.a50 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/b50.wav');
                window.a40 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/b40.wav');
                window.a30 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/b30.wav');
                window.a20 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/b20.wav');
                window.a10 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/b10.wav');
                window.a5 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/b5.wav');
                window.aRetard = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/retard.wav');
                window.stall = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/bstall.wav');
                window.glideSlope = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/bglideslope.wav');
                window.tooLowFlaps = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/btoo-low_flaps.wav');
                window.tooLowGear = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/btoo-low_gear.wav');
                window.apDisconnect = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/bap-disconnect.wav');
                window.minimumBaro = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/bminimums.wav');
                window.dontSink = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/bdont-sink.wav');
                window.masterA = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/bmasterAlarm.wav');
                window.bankAngle = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/bbank-angle.wav');
                window.overspeed = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/boverspeed.wav');
                window.masterA.loop = true;
                window.bankAngle.loop = true;
                window.overspeed.loop = true;
            } else if (window.willTheDoorFallOff && !window.didAWheelFall && !window.isAsOldAsYourMom) {
                window.a2500 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/2500.wav');
                window.a2000 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/2000.wav');
                window.a1000 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/1000.wav');
                window.a500 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/500.wav');
                window.a400 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/400.wav');
                window.a300 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/300.wav');
                window.a200 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/200.wav');
                window.a100 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/100.wav');
                window.a50 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/50.wav');
                window.a40 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/40.wav');
                window.a30 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/30.wav');
                window.a20 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/20.wav');
                window.a10 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/10.wav');
                window.a5 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/5.wav');
                window.aRetard = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/retard.wav');
                window.stall = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/stall.wav');
                window.glideSlope = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/glideslope.wav');
                window.tooLowFlaps = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/too-low_flaps.wav');
                window.tooLowGear = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/too-low_gear.wav');
                window.apDisconnect = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/ap-disconnect.wav');
                window.minimumBaro = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/minimum.wav');
                window.dontSink = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/dont-sink.wav');
                window.masterA = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/masterAlarm.wav');
                window.bankAngle = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/bank-angle.wav');
                window.overspeed = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/overspeed.wav');
                window.masterA.loop = true;
                window.bankAngle.loop = true;
                window.overspeed.loop = true;
            } else if (!window.willTheDoorFallOff && window.didAWheelFall) {
                window.a2500 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/2500.wav');
                window.a2000 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/2000.wav');
                window.a1000 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/1000.wav');
                window.a500 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/500.wav');
                window.a400 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/400.wav');
                window.a300 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/300.wav');
                window.a200 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/200.wav');
                window.a100 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/100.wav');
                window.a50 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/50.wav');
                window.a40 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/40.wav');
                window.a30 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/30.wav');
                window.a20 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/20.wav');
                window.a10 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/10.wav');
                window.a5 = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/5.wav');
                window.aRetard = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/retard.wav');
                window.stall = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/stall.wav');
                window.glideSlope = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/glideslope.wav');
                window.tooLowFlaps = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/too-low_flaps.wav');
                window.tooLowGear = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/too-low_gear.wav');
                window.apDisconnect = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/ap-disconnect.wav');
                window.minimumBaro = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/minimum.wav');
                window.dontSink = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/dont-sink.wav');
                window.masterA = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/masterAlarm.wav');
                window.bankAngle = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/bank-angle.wav');
                window.overspeed = new Audio('https://tylerbmusic.github.io/GPWS-files_geofs/overspeed.wav');
                window.masterA.loop = true;
                window.bankAngle.loop = true;
                window.overspeed.loop = true;
            // Retrieve and format the required values
            var minimum = ((document.getElementById("minimums") !== null) && document.getElementById("minimums").value !== undefined) ? Number(document.getElementById("minimums").value) : undefined;
            var agl = (window.geofs.animation.values.altitude !== undefined && window.geofs.animation.values.groundElevationFeet !== undefined) ? Math.round((window.geofs.animation.values.altitude - window.geofs.animation.values.groundElevationFeet) + (window.geofs.aircraft.instance.collisionPoints[window.geofs.aircraft.instance.collisionPoints.length - 2].worldPosition[2]*3.2808399)) : 'N/A';
            var verticalSpeed = window.geofs.animation.values.verticalSpeed !== undefined ? Math.round(window.geofs.animation.values.verticalSpeed) : 'N/A';
            //Glideslope calculation
            var glideslope;
            if (window.geofs.animation.getValue("NAV1Direction") && (window.geofs.animation.getValue("NAV1Distance") !== window.geofs.runways.getNearestRunway([window.geofs.nav.units.NAV1.navaid.lat,window.geofs.nav.units.NAV1.navaid.lon,0]).lengthMeters*0.185)) { //The second part to the if statement prevents the divide by 0 error.
                glideslope = (window.geofs.animation.getValue("NAV1Direction") === "to") ? Number((Math.atan(((window.geofs.animation.values.altitude/3.2808399+(window.geofs.aircraft.instance.collisionPoints[window.geofs.aircraft.instance.collisionPoints.length - 2].worldPosition[2]+0.1))-window.geofs.nav.units.NAV1.navaid.elevation) / (window.geofs.animation.getValue("NAV1Distance")+window.geofs.runways.getNearestRunway([window.geofs.nav.units.NAV1.navaid.lat,window.geofs.nav.units.NAV1.navaid.lon,0]).lengthMeters*0.185))*Math.RAD_TO_DEGREES).toFixed(1)) : Number((Math.atan(((window.geofs.animation.values.altitude/3.2808399+(window.geofs.aircraft.instance.collisionPoints[window.geofs.aircraft.instance.collisionPoints.length - 2].worldPosition[2]+0.1))-window.geofs.nav.units.NAV1.navaid.elevation) / Math.abs(window.geofs.animation.getValue("NAV1Distance")-window.geofs.runways.getNearestRunway([window.geofs.nav.units.NAV1.navaid.lat,window.geofs.nav.units.NAV1.navaid.lon,0]).lengthMeters*0.185))*Math.RAD_TO_DEGREES).toFixed(1));
            } else {
                glideslope = undefined;
            } //End Glideslope calculation
            if (window.audio.on && window.soundsOn) {
                if (((window.geofs.aircraft.instance.stalling && !window.geofs.aircraft.instance.groundContact) || (window.geofs.nav.units.NAV1.navaid !== null && (agl > 100 && (glideslope < (window.geofs.nav.units.NAV1.navaid.slope - 1.5) || (glideslope > window.geofs.nav.units.NAV1.navaid.slope + 2)))) || (!window.geofs.aircraft.instance.groundContact && agl < 300 && (window.geofs.aircraft.instance.definition.gearTravelTime !== undefined) && (window.geofs.animation.values.gearPosition >= 0.5)) || (!window.geofs.aircraft.instance.groundContact && agl < 500 && (window.geofs.animation.values.flapsSteps !== undefined) && (window.geofs.animation.values.flapsPosition == 0) && window.tooLowGear.paused) || (!window.geofs.aircraft.instance.groundContact && agl < 300 && window.geofs.animation.values.throttle > 0.95 && verticalSpeed <= 0) || (Math.abs(window.geofs.aircraft.instance.animationValue.aroll) > 45)) && window.masterA.paused) {
                    window.masterA.play();
                } else if (!((window.geofs.aircraft.instance.stalling && !window.geofs.aircraft.instance.groundContact) || (window.geofs.nav.units.NAV1.navaid !== null && (agl > 100 && (glideslope < (window.geofs.nav.units.NAV1.navaid.slope - 1.5) || (glideslope > window.geofs.nav.units.NAV1.navaid.slope + 2)))) || (!window.geofs.aircraft.instance.groundContact && agl < 300 && (window.geofs.aircraft.instance.definition.gearTravelTime !== undefined) && (window.geofs.animation.values.gearPosition >= 0.5)) || (!window.geofs.aircraft.instance.groundContact && agl < 500 && (window.geofs.animation.values.flapsSteps !== undefined) && (window.geofs.animation.values.flapsPosition == 0) && window.tooLowGear.paused) || (!window.geofs.aircraft.instance.groundContact && agl < 300 && window.geofs.animation.values.throttle > 0.95 && verticalSpeed <= 0) || (Math.abs(window.geofs.aircraft.instance.animationValue.aroll) > 45)) && !window.masterA.paused) {
                    window.masterA.pause();
                }
                if (Math.abs(window.geofs.aircraft.instance.animationValue.aroll) > 45 && window.bankAngle.paused) {
                    window.bankAngle.play();
                } else if (!(Math.abs(window.geofs.aircraft.instance.animationValue.aroll) > 45) && !window.bankAngle.paused) {
                    window.bankAngle.pause();
                }
                if (window.geofs.aircraft.instance.stalling && !window.geofs.aircraft.instance.groundContact && window.stall.paused) { //Stall
                    window.stall.play();
                } else if (!window.stall.paused && !window.geofs.aircraft.instance.stalling) {
                    window.stall.pause();
                }
                if (window.geofs.nav.units.NAV1.navaid !== null && (agl > 100 && (glideslope < (window.geofs.nav.units.NAV1.navaid.slope - 1.5) || (glideslope > window.geofs.nav.units.NAV1.navaid.slope + 2)) && window.glideSlope.paused)) { //Glideslope
                    window.glideSlope.play();
                }
                if (!window.geofs.aircraft.instance.groundContact && agl < 300 && (window.geofs.aircraft.instance.definition.gearTravelTime !== undefined) && (window.geofs.animation.values.gearPosition >= 0.5) && window.tooLowGear.paused) { //Too Low - Gear (This warning takes priority over the Too Low - Flaps warning)
                    window.tooLowGear.play();
                }
                if (!window.geofs.aircraft.instance.groundContact && agl < 500 && (window.geofs.animation.values.flapsSteps !== undefined) && (window.geofs.animation.values.flapsPosition == 0) && window.tooLowGear.paused && window.tooLowFlaps.paused) { //Too Low - Flaps
                    window.tooLowFlaps.play();
                }
                if (!window.geofs.autopilot.on && window.wasAPOn) { //Autopilot Disconnect
                    window.apDisconnect.play();
                }
                if (verticalSpeed <= 0) {
                    if (!window.geofs.aircraft.instance.groundContact && agl < 300 && window.geofs.animation.values.throttle > 0.95 && window.dontSink.paused) { //Don't Sink
                        window.dontSink.play();
                    }
                    if ((minimum !== undefined) && (window.geofs.animation.values.altitude+2 > minimum && minimum > window.geofs.animation.values.altitude-2) && !window.iminimums) { //Minimum
                        window.minimumBaro.play();
                        window.iminimums = true;
                    }
                    if (isInRange(2500, agl) && !window.i2500) { //2,500
                        window.a2500.play();
                        window.i2500 = true;
                    }
                    if (isInRange(2000, agl) && !window.i2000) { //2,000
                        window.a2000.play();
                        window.i2000 = true;
                    }
                    if (isInRange(1000, agl) && !window.i1000) { //1,000
                        window.a1000.play();
                        window.i1000 = true;
                    }
                    if (isInRange(500, agl) && !window.i500) { //500
                        window.a500.play();
                        window.i500 = true;
                    }
                    if (isInRange(400, agl) && !window.i400) { //400
                        window.a400.play();
                        window.i400 = true;
                    }
                    if (isInRange(300, agl) && !window.i300) { //300
                        window.a300.play();
                        window.i300 = true;
                    }
                    if (isInRange(200, agl) && !window.i200) { //200
                        window.a200.play();
                        window.i200 = true;
                    }
                    if (isInRange(100, agl) && !window.i100) { //100
                        window.a100.play();
                        window.i100 = true;
                    }
                    if (isInRange(50, agl) && !window.i50) { //50
                        window.a50.play();
                        window.i50 = true;
                    }
                    if (isInRange(40, agl) && !window.i40) { //40
                        window.a40.play();
                        window.i40 = true;
                    }
                    if (isInRange(30, agl) && !window.i30) { //30
                        window.a30.play();
                        window.i30 = true;
                    }
                    if (isInRange(20, agl) && !window.i20) { //20
                        window.a20.play();
                        window.i20 = true;
                    }
                    if (isInRange(10, agl) && !window.i10) { //10
                        window.a10.play();
                        window.i10 = true;
                    }
                    if (!window.geofs.aircraft.instance.groundContact && ((agl+(window.geofs.animation.values.verticalSpeed/60)*2) <= 1.0) && !window.i7) { //Retard 2 seconds from touchdown
                        window.aRetard.play();
                        window.i7 = true;
                    }
                    if (isInRange(5, agl) && !window.i5) { //5
                        window.a5.play();
                        window.i5 = true;
                    }
                    window.gpwsRefreshRate = 30;
                } else if (verticalSpeed > 0) {
                    if (window.iminimums) {
                        window.iminimums = false;
                    }
                    if (window.i2500) {
                        window.i2500 = false;
                    }
                    if (window.i2000) {
                        window.i2000 = false;
                    }
                    if (window.i1000) {
                        window.i1000 = false;
                    }
                    if (window.i500) {
                        window.i500 = false;
                    }
                    if (window.i400) {
                        window.i400 = false;
                    }
                    if (window.i300) {
                        window.i300 = false;
                    }
                    if (window.i200) {
                        window.i200 = false;
                    }
                    if (window.i100) {
                        window.i100 = false;
                    }
                    if (window.i50) {
                        window.i50 = false;
                    }
                    if (window.i40) {
                        window.i40 = false;
                    }
                    if (window.i30) {
                        window.i30 = false;
                    }
                    if (window.i20) {
                        window.i20 = false;
                    }
                    if (window.i10) {
                        window.i10 = false;
                    }
                    if (window.i7) {
                        window.i7 = false;
                    }
                    if (window.i5) {
                        window.i5 = false;
                    }
                    window.gpwsRefreshRate = 100;
                }
            }
        } else if (window.geofs.isPaused() && !window.justPaused) {
            window.a2500.pause();
            window.a2000.pause();
            window.a1000.pause();
            window.a500.pause();
            window.a400.pause();
            window.a300.pause();
            window.a200.pause();
            window.a100.pause();
            window.a50.pause();
            window.a40.pause();
            window.a30.pause();
            window.a20.pause();
            window.a10.pause();
            window.aRetard.pause();
            window.a5.pause();
            window.stall.pause();
            window.glideSlope.pause();
            window.tooLowFlaps.pause();
            window.tooLowGear.pause();
            window.apDisconnect.pause();
            window.minimumBaro.pause();
            window.dontSink.pause();
            window.masterA.pause();
            window.bankAngle.pause();
            window.overspeed.pause();
            window.justPaused = true;
        }
        window.wasAPOn = window.geofs.autopilot.on;
        window.didAWheelFall = window.willTheDoorFallOff;
        window.wasAsOldAsYourMom = window.geofs.aircraft.instance.aircraftRecord.name.includes("757") || indow.geofs.aircraft.instance.aircraftRecord.name.includes("767") || window.geofs.aircraft.instance.aircraftRecord.name.includes("737-200") || window.geofs.aircraft.instance.aircraftRecord.name.includes("747-100");
        window.russians = window.russia
        window.vodka = window.russians
    }

    // Update flight data display every 100ms
    setInterval(updateGPWS, window.gpwsRefreshRate);
    document.addEventListener('keydown', function(event) {
        if (event.key === window.soundsToggleKey) {
            window.soundsOn = !window.soundsOn;
        }
    });
}), 8000);
