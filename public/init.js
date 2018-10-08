import 'bootstrap';
import $ from 'jquery';
import moment from 'moment';
import './lang/english';
import index_xsl from './index.xsl';
import XsltvProcessor from './js/xsltvProcessor';
const api_files_url = 'https://api.myjson.com/bins/8tvgs';

$(function () {

    if (window.location == window.parent.location) {
        $('#fullscreen').html('<i class="fa fa-expand"></i>');
    }
    $('#fullscreen').on('click', function (event) {
        event.preventDefault();
        window.parent.location = $('#fullscreen').attr('href');
    }).tooltip();

    $('.navbar-toggler').on('click', function (event) {
        event.preventDefault();
        $(this).closest('.navbar-minimal').toggleClass('open');
    })

    var $xmltv_list = $("#xmlt_list");
    var $tvFrame = $("#tvframe");
    var $loading = $('#loading');
    var queryStringParams = parseQueryString();
    var xml;
    const xsltvProcessor = new XsltvProcessor();



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



