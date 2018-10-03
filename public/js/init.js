$(function () {
    var $clock = $('#barclock');
    var vline = $('#vline');
    var $xmltv_list = $("#xmlt_list");
    var $tvFrame = $("#tvframe");

    setInterval(function () {
        $clock.find('.time').text(moment(new Date()).format("LLLL"));
        vline.css('left', parseInt(vline.css('left')) + 1);
    }, 1000);

    $('[data-toggle="tooltip"]').tooltip();

    var processor = new XSLTProcessor();
    var sortstring;

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
        $('#loading').css('display', 'block');
        $('#loading').html("index.xsl");
        fetch("index.xsl", {
                method: 'GET'
            }).then(response => response.text())
            .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
            .then(x => {
                xsl = x;
                sortTag = xsl.getElementsByTagName('xsl:sort'); //for firefox 3
                if (!sortTag.item(0)) {
                    sortTag = xsl.getElementsByTagName('sort');
                } //for firefox 2
                sortTag.item(0).setAttribute("select", sortstring);
                processor.importStylesheet(xsl);
                loadXML(xmlfileneeded);
            }).catch(function (error) {
                var errorstring = error.message + ": " + filetext + " " + xmlfileneeded + " " + notfoundtext + ".";
                $('#loading').text(errorstring);
            });
    }

    function loadXML(xmlfileneeded) {
        if (xmlfileneeded) {

            $('#loading').css("display", "block");
            $('#loading').text(xmlfileneeded);
            if (window.XMLHttpRequest && window.XSLTProcessor) {

                fetch(xmlfileneeded, {
                        method: 'GET'
                    }).then(response => response.text())
                    .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
                    .then(x => {
                        xml = x;
                        xmlfileloaded = xmlfileneeded;
                        $('#loading').css("display", "block");
                        $('#loading').text("Preparing grid...");
                        Init(hours, myDate.getHours(), myDate.getDate(), myDate.getMonth() + 1, myDate.getFullYear());
                    }).catch(function (error) {
                        var errorstring = error.message + ": " + filetext + " " + xmlfileneeded + " " + notfoundtext + ".";
                        $('#loading').text(errorstring);
                    });
            } else {
                alert('Your browser can\'t handle this script');
                return;
            }
        }
    }

    function Init(dl, ch, cd, cm, cy, offset) {
        /*This stuff needs to be done each time the time changes */
        $('#loading').show();
        $("#tvframe").hide();
        $("#tvframe").text("");
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

        var fragment = processor.transformToFragment(xml, document);
        $('#loading').hide();
        far = $(fragment);
        far.append($('<div id="vline"></div>'));
        $tvFrame.append(far);
        $('[data-toggle="tooltip"]').tooltip();

       var popperTab = [];
        $('[data-toggle="popover"]').popover({
            html: true,
        }).on('shown.bs.popover', function (data) {
            popperTab.push($(data.target));
          });

        $(document).on('click touchend', function (e) {
            popperTab.forEach(x=> x.popover('hide'));
        });

        $tvFrame.show();
    }

   
    window.Init = Init;
    $('#loading').css("display", "block");
    if ($xmltv_list.find('option').length > 1) {
        let selected = $($xmltv_list.find('option')[1]);
        selected.prop("selected", "selected");
        loadXSL(selected.val());
    }
});

function initFromCookie() {
    var cookie = Cookies.get("xsltvhours");
    var hours = cookie ? Number(cookie) : 4;
    cookie = Cookies.get("xsltvfixgaps");
    var fixgaps = cookie ? cookie : false;
    cookie = Cookies.get("xsltvchannelpopups");
    var channelpopups = cookie ? cookie : true;
    cookie = Cookies.get("xsltvdescriptionpopups");
    var descriptionpopups = cookie ? cookie : true;
    cookie = Cookies.get("xsltvpopupdelay");
    var popupdelay = cookie ? Number(cookie) : 0;
    cookie = Cookies.get("xsltvpopuptimes");
    var popuptimes = cookie ? cookie : true;
    cookie = Cookies.get("xsltvpopuprating");
    var popuprating = cookie ? cookie : true;
    cookie = Cookies.get("xsltvpopupsubtitle");
    var popupsubtitle = cookie ? cookie : true;
    cookie = Cookies.get("xsltvpopupdescription");
    var popupdescription = cookie ? cookie : true;
    cookie = Cookies.get("xsltvpopupdate");
    var popupdate = cookie ? cookie : true;
    cookie = Cookies.get("xsltvpopupcategories");
    var popupcategories = cookie ? cookie : true;
    cookie = Cookies.get("xsltvpopupstarrating");
    var popupstarrating = cookie ? cookie : true;
    cookie = Cookies.get("xsltvoffsetminutes");
    var offsetminutes = cookie ? Number(cookie) : 60;
    cookie = Cookies.get("xsltvdayfirst");
    var dayfirst = cookie ? cookie : false;
    cookie = Cookies.get("xsltvcategorycolors");
    var categorycolors = cookie ? cookie : true;
    cookie = Cookies.get("xsltvloadonclick");
    var loadonclick = cookie ? cookie : 'POPER'; //IMDB URL
    cookie = Cookies.get("xsltvhighlightclickable");
    var highlightclickable = cookie ? cookie : true;
    var highlightmovies = 3,
        cookie = Cookies.get("xsltvhighlightnew");
    var highlightnew = cookie ? cookie : true;
    cookie = Cookies.get("xsltvprintdates");
    var printdates = cookie ? cookie : true;
    cookie = Cookies.get("xsltvtimebarfrequency");
    var timebarfrequency = cookie ? cookie : -1;
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
}