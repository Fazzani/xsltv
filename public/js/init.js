$(function () {

    var processor = new XSLTProcessor();
    var sortstring;
    var xmlfileneeded = '';
    var xmlfileloaded;

    var vline = $('#vline');
    setInterval(function () {
        vline.css('left', parseInt(vline.css('left')) + 1);
    }, 50);


    var currenttime = new Date();

    /***********************************************
     * Show Hint script- copyright Dynamic Drive (www.dynamicdrive.com)
     * This notice MUST stay intact for legal use
     * Visit http://www.dynamicdrive.com/ for this script and 100s more.
     ***********************************************/

    var horizontal_offset = "9px"; //horizontal offset of hint box from anchor link

    /////No further editting needed

    var vertical_offset = "0"; //horizontal offset of hint box from anchor link. No need to change.
    var ie = document.all;
    var ns6 = document.getElementById && !document.all;

    function getposOffset(what, offsettype) {
        var totaloffset = offsettype === "left" ? what.offsetLeft : what.offsetTop;
        var parentEl = what.offsetParent;
        while (parentEl !== null) {
            totaloffset = offsettype === "left" ? totaloffset + parentEl.offsetLeft : totaloffset + parentEl.offsetTop;
            parentEl = parentEl.offsetParent;
        }
        return totaloffset;
    }

    function iecompattest() {
        return document.compatMode && document.compatMode !== "BackCompat" ? document.documentElement : document.body;
    }

    function clearbrowseredge(obj, whichedge) {
        var edgeoffset = (whichedge === "rightedge") ? parseInt(horizontal_offset) * -1 : parseInt(vertical_offset) * -1;
        if (whichedge === "rightedge") {
            windowedge = ie && !window.opera ? iecompattest().scrollLeft + iecompattest().clientWidth - 30 : window.pageXOffset + window.innerWidth - 40;
            dropmenuobj.contentmeasure = dropmenuobj.offsetWidth
            if (windowedge - dropmenuobj.x < dropmenuobj.contentmeasure)
                edgeoffset = dropmenuobj.contentmeasure + obj.offsetWidth + parseInt(horizontal_offset);
        } else {
            windowedge = ie && !window.opera ? iecompattest().scrollTop + iecompattest().clientHeight - 15 : window.pageYOffset + window.innerHeight - 18;
            dropmenuobj.contentmeasure = dropmenuobj.offsetHeight
            if (windowedge - dropmenuobj.y < dropmenuobj.contentmeasure)
                edgeoffset = dropmenuobj.contentmeasure - obj.offsetHeight;
        }
        return edgeoffset;
    }

    function showhint(menucontents, obj, e) {
        if ((ie || ns6) && document.getElementById("hintbox")) {
            dropmenuobj = document.getElementById("hintbox");
            dropmenuobj.innerHTML = menucontents;
            dropmenuobj.style.left = dropmenuobj.style.top = -500;
            dropmenuobj.x = getposOffset(obj, "left");
            dropmenuobj.y = getposOffset(obj, "top");
            dropmenuobj.style.left = dropmenuobj.x - clearbrowseredge(obj, "rightedge") + obj.offsetWidth + "px";
            dropmenuobj.style.top = dropmenuobj.y - clearbrowseredge(obj, "bottomedge") + "px";
            dropmenuobj.style.visibility = "visible";
            obj.onmouseout = hidetip;
        }
    }

    function hidetip(e) {
        dropmenuobj.style.visibility = "hidden";
        dropmenuobj.style.left = "-500px";
    }

    function createhintbox() {
        var divblock = document.createElement("div");
        divblock.setAttribute("id", "hintbox");
        document.body.appendChild(divblock);
    }

    if (window.addEventListener)
        window.addEventListener("load", createhintbox, false);
    else if (window.attachEvent)
        window.attachEvent("onload", createhintbox);
    else if (document.getElementById);
    window.onload = createhintbox;


    var { offsetminutes, dailyfiles, hours, fixgaps, popupdelay, timebarfrequency, channelpopups, descriptionpopups, absoluteicons, popuptimes, popuprating, popupsubtitle, popupdescription, popupdate, popupcategories, popupstarrating, grabber, highlightclickable, highlightmovies, printdates, dayfirst, categorycolors, highlightnew, loadonclick } = initFromCookie();

    // var languagefile = 'lang/' + language + '.js'
    // document.write('<script type="text/javascript" src="' + languagefile + '"><\/script>')

    var myDate = new Date(currenttime);
    myDate.setMinutes(myDate.getMinutes() + (60 - offsetminutes));

    if (dailyfiles.toString() === "true") {
        fileDate = myDate.getDate();
        if (fileDate < 10) {
            fileDate = "0" + fileDate;
        }
        fileMonth = myDate.getMonth() + 1;
        if (fileMonth < 10) {
            fileMonth = "0" + fileMonth;
        }
        xmlfileneeded = xmlfileneeded.concat(myDate.getFullYear(), fileMonth, fileDate, '.xml');
    } else {
        xmlfileneeded = 'https://raw.githubusercontent.com/Fazzani/grab/master/fr_canal.xmltv';
    }

    sortstring = "display-name[3]";

    function loadXSL() {
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
                loadXML();
            }).catch(function (error) {
                var errorstring = error.message + ": " + filetext + " " + xmlfileneeded + " " + notfoundtext + ".";
                $('#loading').text(errorstring);
            });
    }

    function loadXML() {
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

    function Init(dl, ch, cd, cm, cy, offset) {
        /*This stuff needs to be done each time the time changes */
        $('#loading').css("display", "block");
        $("#tvframe").css("display", "none");
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
        if (dailyfiles.toString() === "true") {
            xmlfileneeded = '';
            xmlfileneeded = xmlfileneeded.concat(startDate.getFullYear(), fileMonth, fileDate, '.xml');
            //xmlfileneeded is YYYYMMDD.xml
        }
        if (xmlfileneeded !== xmlfileloaded) {
            //reload everything
            loadXML();
        } else { //this is the entire remainder of the Init() function.
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
            // selectOption(startDate.getFullYear(), document.getElementById('year').options);
            // selectOption(startDate.getMonth(), document.getElementById('month').options);
            // selectOption(startDate.getDate(), document.getElementById('day').options);
            // selectOption(startDate.getHours(), document.getElementById('hour').options);

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
            processor.setParameter(null, "AbsoluteIcons", absoluteicons.toString() === "true" ? 1 : 0);
            processor.setParameter(null, "PopupTimes", popuptimes.toString() === "true" ? 1 : 0);
            processor.setParameter(null, "PopupRating", popuprating.toString() === "true" ? 1 : 0);
            processor.setParameter(null, "PopupSubtitle", popupsubtitle.toString() === "true" ? 1 : 0);
            processor.setParameter(null, "PopupDescription", popupdescription.toString() === "true" ? 1 : 0);
            processor.setParameter(null, "PopupDate", popupdate.toString() === "true" ? 1 : 0);
            processor.setParameter(null, "PopupCategories", popupcategories.toString() === "true" ? 1 : 0);
            processor.setParameter(null, "PopupStarRating", popupstarrating.toString() === "true" ? 1 : 0);
            processor.setParameter(null, "Grabber", grabber);
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
            $("#tvframe").append(far);
            if (self.scanDOM) scanDOM(document); //refresh popups?
            $('#tvframe').css("display", "block");
            $('#tvframe').find('#listings').addClass("container-fluid");
        } //All of this is inside the conditinal block requiring that the loadedfile equal the neededfile.
    }

    window.Init = Init;
    $('#loading').css("display", "block");
    loadXSL();
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
    cookie = Cookies.get("xsltvabsoluteicons");
    var absoluteicons = cookie ? cookie : false;
    cookie = Cookies.get("xsltvoffsetminutes");
    var offsetminutes = cookie ? Number(cookie) : 60;
    cookie = Cookies.get("xsltvrefreshonthe");
    var refreshonthe = cookie ? Number(cookie) : -1;
    cookie = Cookies.get("xsltvgrabber");
    var grabber = cookie ? cookie : "tv_grab_na_dd";
    cookie = Cookies.get("xsltvdayfirst");
    var dayfirst = cookie ? cookie : false;
    cookie = Cookies.get("xsltvcategorycolors");
    var categorycolors = cookie ? cookie : true;
    cookie = Cookies.get("xsltvdailyfiles");
    var dailyfiles = cookie ? cookie : false;
    cookie = Cookies.get("xsltvtwelvehour");
    var twelvehour = cookie ? cookie : false;
    cookie = Cookies.get("xsltvloadonclick");
    var loadonclick = cookie ? cookie : 'IMDB';
    cookie = Cookies.get("xsltvlanguage");
    var language = cookie ? cookie : 'english';
    cookie = Cookies.get("xsltvhighlightclickable");
    var highlightclickable = cookie ? cookie : false;
    cookie = Cookies.get("xsltvhighlightmovies");
    var highlightmovies = cookie ? Number(cookie) : 10;
    cookie = Cookies.get("xsltvhighlightnew");
    var highlightnew = cookie ? cookie : false;
    cookie = Cookies.get("xsltvprintdates");
    var printdates = cookie ? cookie : true;
    cookie = Cookies.get("xsltvtimebarfrequency");
    var timebarfrequency = cookie ? cookie : -1;
    cookie = Cookies.get("xsltvshowclock");
    var showclock = cookie ? cookie : true;
    cookie = Cookies.get("xsltvshowbarclock");
    var showbarclock = cookie ? cookie : false;
    return { offsetminutes, dailyfiles, hours, fixgaps, popupdelay, timebarfrequency, channelpopups, descriptionpopups, absoluteicons, popuptimes, popuprating, popupsubtitle, popupdescription, popupdate, popupcategories, popupstarrating, grabber, highlightclickable, highlightmovies, printdates, dayfirst, categorycolors, highlightnew, loadonclick };
}
