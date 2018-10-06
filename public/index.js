import 'bootstrap';
import $ from 'jquery';
import moment from 'moment';
import './lang/english';
import 'jquery.cookie';
import index_xsl from './index.xsl';
import XsltvProcessor from './js/xsltvProcessor';
const api_files_url = 'https://api.myjson.com/bins/8tvgs';

$(function () {


    window.addEventListener('load', function () {
        if ('serviceWorker' in navigator &&
            (window.location.protocol === 'https:' || window.location.protocol === 'http:' || isLocalhost)) {
            if ('serviceWorker' in navigator) {
                let newWorker;
                navigator.serviceWorker
                    .register('./service-worker.js')
                    .then(reg => {
                        console.log('Service Worker Registered');
                        reg.addEventListener('updatefound', () => {
                            // A wild service worker has appeared in reg.installing!
                            if (navigator.serviceWorker.controller) {
                                newWorker = reg.installing;
                                if (newWorker != null) {
                                    newWorker.addEventListener('statechange', () => {
                                        // Has network.state changed?
                                        switch (newWorker.state) {
                                            case 'installed':
                                                // new update available
                                                showUpdateBar();
                                                break;
                                        }
                                    });
                                }
                            }
                        });
                    });

                let refreshing;
                navigator.serviceWorker.addEventListener('controllerchange', function () {
                    if (refreshing) return;
                    window.location.reload();
                    refreshing = true;
                });

                function showUpdateBar() {
                    let snackbar = document.getElementById('snackbar');
                    snackbar.className = 'show';
                }
                // The click event on the pop up notification
                document.getElementById('reload').addEventListener('click', function () {
                    newWorker.postMessage({
                        action: 'skipWaiting'
                    });
                });
            }
        }
    });

    if (window.location == window.parent.location) {
        $('#fullscreen').html('<span class="glyphicon glyphicon-resize-small"></span>')
            .attr('href', 'http://bootsnipp.com/mouse0270/snippets/PbDb5')
            .attr('title', 'Back To Bootsnipp');
    }
    $('#fullscreen').on('click', function (event) {
        event.preventDefault();
        window.parent.location = $('#fullscreen').attr('href');
    }).tooltip();;

    $('.navbar-toggler').on('click', function (event) {
        event.preventDefault();
        $(this).closest('.navbar-minimal').toggleClass('open');
    })

    var $clock = $('#barclock');
    var $xmltv_list = $("#xmlt_list");
    var $tvFrame = $("#tvframe");
    var $loading = $('#loading');
    var queryStringParams = parseQueryString();
    var xml;
    var xsltvProcessor;

    fetch(api_files_url)
        .then(res => res.json())
        .then(res => {
            $xmltv_list.empty().append('<option selected>Select one xmltv file</option>');

            //Loading file from queryString (ex: http://localhost:3000/?file=https://raw.githubusercontent.com/steventrux/epg/master/guide.xml)
            if (queryStringParams['file']) {
                $xmltv_list.append(`<option value="${queryStringParams['file']}">${queryStringParams['file']}</option>`);
            }
            if (res && res.files.length > 0) {
                res.files.forEach(file => $xmltv_list.append(`<option value="${file.url}">${file.name}</option>`));
                let selected = $($xmltv_list.find('option')[1]);
                selected.prop("selected", "selected");
                loadXSL(selected.val());
            }
        }).catch(e => console.error(e));

    $clock.find('.time').text(moment(new Date()).format("LLLL"));
    setInterval(() => {
        $clock.find('.time').text(moment(new Date()).format("LLLL"));
    }, 60000);

    $('[data-toggle="tooltip"]').tooltip();

    $xmltv_list.change(function () {
        loadXSL($xmltv_list.val());
    });

    function loadXSL(xmlfileneeded) {
        $loading.show();
        $loading.html("index.xsl");
        fetch(index_xsl, {
                method: 'GET'
            }).then(response => response.text())
            .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
            .then(xsl => {
                xsltvProcessor = new XsltvProcessor();
                xsltvProcessor.processor.importStylesheet(xsl);
                loadXML(xmlfileneeded);
            }).catch(function (error) {
                var errorstring = error.message;
                $loading.text(errorstring);
            });
    }

    function loadXML(xmlfileneeded) {
        if (xmlfileneeded) {

            $loading.show();
            $loading.text(xmlfileneeded);
            if (window.XMLHttpRequest && window.XSLTProcessor) {

                fetch(xmlfileneeded, {
                        method: 'GET'
                    }).then(response => response.text())
                    .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
                    .then(x => {
                        xml = x;
                        $loading.show();
                        $loading.text("Preparing grid...");
                        Init(xsltvProcessor.AppSettings.DisplayLength, ...getParamsCurrentDate());
                    }).catch(function (error) {
                        var errorstring = error.message;
                        $loading.text(errorstring);
                    });
            } else {
                alert('Your browser can\'t handle this script');
                return;
            }
        }
    }

    function Init(dl, ch, cd, cm, cy, offset) {
        /*This stuff needs to be done each time the time changes */
        $loading.show();
        $tvFrame.hide();
        $tvFrame.text("");

        xsltvProcessor.initDate(ch, cd, cm, cy, offset);
        let fragment = xsltvProcessor.Init(xml, document);

        let $far = $(fragment);
        let $vline = $('<div id="vline"><span class="vheader"></span></div>');
        $far.append($vline);
        $tvFrame.append($far);
        $loading.hide();

        var popperTab = [];
        $('[data-toggle="tooltip"]').tooltip();
        $('[data-toggle="popover"]').popover({
            html: true,
        }).on('shown.bs.popover', function (data) {
            popperTab.push($(data.target));
        });

        $(document).on('click touchend', function (e) {
            var target = $(e.target);
            popperTab.forEach(x => {
                if (!target.is(x)) {
                    x.popover('hide');
                    popperTab = popperTab.slice(popperTab.indexOf(x), 1);
                }
            });
        });

        InitTimeline($tvFrame, $vline, xsltvProcessor.AppSettings.DisplayLength);

        $tvFrame.show();
    }

    window.Init = Init;
    $loading.show();
});


const InitTimeline = ($tvFrame, $vline, hours) => {
    let startTimeInit = $tvFrame.find('th.time[onclick^=Init]').attr('onclick');
    let startTime = (startTimeInit.split('Init(')[1].split(')')[0]).split(',');
    let startTimeMoment = `${startTime[2]}-${startTime[3]}-${startTime[4]} ${startTime[1]}:00:00`;
    var paddingLeft = undefined;

    setInterval(() => {
        if (undefined == paddingLeft) {
            paddingLeft = ($('div.leftchannel').width() / $tvFrame.width()) * 100;
        }
        $vline.css('margin-left', (percentElapsedTimeNowByDay(startTimeMoment, hours) + paddingLeft) + '%');
    }, 1000);
};

const percentElapsedTimeNowByDay = (startDay, hours) => {
    let from = moment(startDay, 'DD-MM-YYYY hh:mm:ss');
    let diff = moment().diff(from);
    let elapsedDuration = moment.duration(diff);
    let percent = (elapsedDuration.asMinutes() / (60 * hours)) * 100;

    //var s = Math.floor(elapsedDuration.asHours()) + moment(diff).format(":mm:ss");
    // console.log({
    //     from,
    //     diff,
    //     elapsedDuration: s,
    //     percent
    // });
    return Math.floor(parseInt(percent));
};

const parseQueryString = () => {

    var str = window.location.search;
    var objURL = {};

    str.replace(
        new RegExp("([^?=&]+)(=([^&]*))?", "g"),
        function ($0, $1, $2, $3) {
            objURL[$1] = $3;
        }
    );
    return objURL;
};

/**
 * Datetime to xsltv format
 * @param {current date time} currenttime 
 * @param {Décalage horaire} offsetminutes 
 */
const getParamsCurrentDate = (currenttime = new Date(), offsetminutes = 60) => {
    let myDate = new Date(currenttime);
    myDate.setMinutes(myDate.getMinutes() + (60 - offsetminutes));
    return [
        myDate.getHours(),
        myDate.getDate(),
        myDate.getMonth() + 1,
        myDate.getFullYear()
    ];
}

// Check to make sure service workers are supported in the current browser,
// and that the current page is accessed from a secure origin. Using a
// service worker from an insecure origin will trigger JS console errors.
const isLocalhost = Boolean(window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);