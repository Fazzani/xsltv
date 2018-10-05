import 'bootstrap';
import $ from 'jquery';
import moment from 'moment';
import './lang/english';
import 'jquery.cookie';
import index_xsl from './index.xsl';

const api_files_url = 'https://api.myjson.com/bins/8tvgs';

$(function () {

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

    var $clock = $('#barclock');
    var $xmltv_list = $("#xmlt_list");
    var $tvFrame = $("#tvframe");
    var $loading = $('#loading');
    var queryStringParams = parseQueryString();
    var xmlfileloaded, fileDate, fileMonth, intHours, intMinutes, starthours, startminutes, endhours, endminutes, gridstarttimestring, gridendtimestring, earliertext, latertext, xsl, xml;
    var sortstring;

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

    setInterval(() => {
        $clock.find('.time').text(moment(new Date()).format("LLLL"));
    }, 60000);

    $('[data-toggle="tooltip"]').tooltip();

    var processor = new XSLTProcessor();
    var currenttime = new Date();

    $xmltv_list.change(function () {
        loadXSL($xmltv_list.val());
    });

    var {
        offsetminutes,
        hours,
        fixgaps,
        popupdelay,
        timebarfrequency,
        channelpopups,
        descriptionpopups,
        popuptimes,
        popuprating,
        popupsubtitle,
        popupdescription,
        popupdate,
        popupcategories,
        popupstarrating,
        highlightclickable,
        highlightmovies,
        printdates,
        dayfirst,
        categorycolors,
        highlightnew,
        loadonclick
    } = initFromCookie();

    var myDate = new Date(currenttime);
    myDate.setMinutes(myDate.getMinutes() + (60 - offsetminutes));

    sortstring = "display-name[3]";

    function loadXSL(xmlfileneeded) {
        $loading.show();
        $loading.html("index.xsl");
        fetch(index_xsl, {
                method: 'GET'
            }).then(response => response.text())
            .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
            .then(x => {
                xsl = x;
                var sortTag = xsl.getElementsByTagName('xsl:sort'); //for firefox 3
                if (!sortTag.item(0)) {
                    sortTag = xsl.getElementsByTagName('sort');
                } //for firefox 2
                sortTag.item(0).setAttribute("select", sortstring);
                processor.importStylesheet(xsl);
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
                        xmlfileloaded = xmlfileneeded;
                        $loading.show();
                        $loading.text("Preparing grid...");
                        Init(hours, myDate.getHours(), myDate.getDate(), myDate.getMonth() + 1, myDate.getFullYear());
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
        var startDate = new Date(cy, cm - 1, cd, ch, 0, 0);
        myDate = new Date(cy, cm - 1, cd, ch, 0, 0);
        var endDate = new Date(cy, cm - 1, cd, ch, 0, 0);
        endDate.setHours(endDate.getHours() + dl);
        var prevDate = new Date(cy, cm - 1, cd, ch, 0, 0);
        prevDate.setHours(prevDate.getHours() - dl);

        fileDate = startDate.getDate();
        if (fileDate < 10) {
            fileDate = "0" + fileDate;
        }

        fileMonth = startDate.getMonth() + 1;
        if (fileMonth < 10) {
            fileMonth = "0" + fileMonth;
        }

        intHours = startDate.getHours();
        intMinutes = startDate.getMinutes();
        starthours = intHours + ":";
        if (intMinutes < 10) {
            startminutes = "0" + intMinutes;
        } else {
            startminutes = intMinutes;
        }
        intHours = endDate.getHours();
        intMinutes = endDate.getMinutes();
        endhours = intHours + ":";
        if (intMinutes < 10) {
            endminutes = "0" + intMinutes;
        } else {
            endminutes = intMinutes;
        }
        gridstarttimestring = starthours + startminutes + " " + startDate.toDateString();
        gridendtimestring = endhours + endminutes + " " + endDate.toDateString();

        if (offset) {
            startDate.setHours(startDate.getHours() + offset);
            endDate.setHours(endDate.getHours() + offset);
            prevDate.setHours(prevDate.getHours() + offset);
        }

        processor.setParameter(null, "DisplayLength", dl);
        processor.setParameter(null, "CurrentHour", startDate.getHours());
        processor.setParameter(null, "CurrentDay", startDate.getDate());
        processor.setParameter(null, "CurrentMonth", startDate.getMonth() + 1);
        processor.setParameter(null, "CurrentYear", startDate.getFullYear());
        processor.setParameter(null, "StopHour", endDate.getHours());
        processor.setParameter(null, "StopDay", endDate.getDate());
        processor.setParameter(null, "StopMonth", endDate.getMonth() + 1);
        processor.setParameter(null, "StopYear", endDate.getFullYear());
        processor.setParameter(null, "PrevHour", prevDate.getHours());
        processor.setParameter(null, "PrevDay", prevDate.getDate());
        processor.setParameter(null, "PrevMonth", prevDate.getMonth() + 1);
        processor.setParameter(null, "PrevYear", prevDate.getFullYear());
        processor.setParameter(null, "FixGaps", fixgaps.toString() === "true" ? 1 : 0);
        processor.setParameter(null, "PopupDelay", popupdelay);
        processor.setParameter(null, "EarlierText", earliertext);
        processor.setParameter(null, "LaterText", latertext);
        processor.setParameter(null, "TimeBarFrequency", timebarfrequency);
        processor.setParameter(null, "ChannelPopups", channelpopups.toString() === "true" ? 1 : 0);
        processor.setParameter(null, "DescriptionPopups", descriptionpopups.toString() === "true" ? 1 : 0);
        processor.setParameter(null, "PopupTimes", popuptimes.toString() === "true" ? 1 : 0);
        processor.setParameter(null, "PopupRating", popuprating.toString() === "true" ? 1 : 0);
        processor.setParameter(null, "PopupSubtitle", popupsubtitle.toString() === "true" ? 1 : 0);
        processor.setParameter(null, "PopupDescription", popupdescription.toString() === "true" ? 1 : 0);
        processor.setParameter(null, "PopupDate", popupdate.toString() === "true" ? 1 : 0);
        processor.setParameter(null, "PopupCategories", popupcategories.toString() === "true" ? 1 : 0);
        processor.setParameter(null, "PopupStarRating", popupstarrating.toString() === "true" ? 1 : 0);
        processor.setParameter(null, "HighlightClickable", highlightclickable.toString() === "true" ? 1 : 0);
        processor.setParameter(null, "HighlightMovies", highlightmovies);
        processor.setParameter(null, "PrintDates", printdates.toString() === "true" ? 1 : 0);
        processor.setParameter(null, "DayFirst", dayfirst.toString() === "true" ? 1 : 0);
        processor.setParameter(null, "Categories", categorycolors.toString() === "true" ? 1 : 0);
        processor.setParameter(null, "HighlightNew", highlightnew.toString() === "true" ? 1 : 0);
        processor.setParameter(null, "OnClick", loadonclick);

        let fragment = processor.transformToFragment(xml, document);
        $loading.hide();
        let $far = $(fragment);
        let $vline = $('<div id="vline"><span class="vheader"></span></div>');
        $far.append($vline);
        $tvFrame.append($far);
        $('[data-toggle="tooltip"]').tooltip();

        var popperTab = [];
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

        InitTimeline($tvFrame, $vline, hours);

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

const initFromCookie = () => {
    var item = localStorage.getItem("xsltvhours");
    var hours = item ? Number(item) : 4;
    item = localStorage.getItem("xsltvfixgaps");
    var fixgaps = item ? item : false;
    item = localStorage.getItem("xsltvchannelpopups");
    var channelpopups = item ? item : true;
    item = localStorage.getItem("xsltvdescriptionpopups");
    var descriptionpopups = item ? item : true;
    item = localStorage.getItem("xsltvpopupdelay");
    var popupdelay = item ? Number(item) : 0;
    item = localStorage.getItem("xsltvpopuptimes");
    var popuptimes = item ? item : true;
    item = localStorage.getItem("xsltvpopuprating");
    var popuprating = item ? item : true;
    item = localStorage.getItem("xsltvpopupsubtitle");
    var popupsubtitle = item ? item : true;
    item = localStorage.getItem("xsltvpopupdescription");
    var popupdescription = item ? item : true;
    item = localStorage.getItem("xsltvpopupdate");
    var popupdate = item ? item : true;
    item = localStorage.getItem("xsltvpopupcategories");
    var popupcategories = item ? item : true;
    item = localStorage.getItem("xsltvpopupstarrating");
    var popupstarrating = item ? item : true;
    item = localStorage.getItem("xsltvoffsetminutes");
    var offsetminutes = item ? Number(item) : 60;
    item = localStorage.getItem("xsltvdayfirst");
    var dayfirst = item ? item : false;
    item = localStorage.getItem("xsltvcategorycolors");
    var categorycolors = item ? item : true;
    item = localStorage.getItem("xsltvloadonclick");
    var loadonclick = item ? item : 'POPER'; //IMDB URL
    item = localStorage.getItem("xsltvhighlightclickable");
    var highlightclickable = item ? item : true;
    var highlightmovies = 3,
        item = localStorage.getItem("xsltvhighlightnew");
    var highlightnew = item ? item : true;
    item = localStorage.getItem("xsltvprintdates");
    var printdates = item ? item : true;
    item = localStorage.getItem("xsltvtimebarfrequency");
    var timebarfrequency = item ? item : -1;
    return {
        offsetminutes,
        hours,
        fixgaps,
        popupdelay,
        timebarfrequency,
        channelpopups,
        descriptionpopups,
        popuptimes,
        popuprating,
        popupsubtitle,
        popupdescription,
        popupdate,
        popupcategories,
        popupstarrating,
        highlightclickable,
        highlightmovies,
        printdates,
        dayfirst,
        categorycolors,
        highlightnew,
        loadonclick
    };
};

var parseQueryString = () => {

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