$(function () {

    var xslrequest;
    var xmlrequest;
    var processor;
    var template;
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
        var totaloffset = (offsettype === "left") ? what.offsetLeft : what.offsetTop;
        var parentEl = what.offsetParent;
        while (parentEl !== null) {
            totaloffset = (offsettype === "left") ? totaloffset + parentEl.offsetLeft : totaloffset + parentEl.offsetTop;
            parentEl = parentEl.offsetParent;
        }
        return totaloffset;
    }

    function iecompattest() {
        return (document.compatMode && document.compatMode !== "BackCompat") ? document.documentElement : document.body;
    }

    function clearbrowseredge(obj, whichedge) {
        var edgeoffset = (whichedge === "rightedge") ? parseInt(horizontal_offset) * -1 : parseInt(vertical_offset) * -1;
        if (whichedge === "rightedge") {
            windowedge = ie && !window.opera ? iecompattest().scrollLeft + iecompattest().clientWidth - 30 : window.pageXOffset + window.innerWidth - 40
            dropmenuobj.contentmeasure = dropmenuobj.offsetWidth
            if (windowedge - dropmenuobj.x < dropmenuobj.contentmeasure)
                edgeoffset = dropmenuobj.contentmeasure + obj.offsetWidth + parseInt(horizontal_offset)
        } else {
            windowedge = ie && !window.opera ? iecompattest().scrollTop + iecompattest().clientHeight - 15 : window.pageYOffset + window.innerHeight - 18
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


    var cookie = Cookies.get("xsltvhours");
    var hours = cookie ? Number(cookie) : 4;
    cookie = Cookies.get("xsltvtablewidth");
    var tablewidth = cookie ? Number(cookie) : (200 + (hours * 150));
    cookie = Cookies.get("xsltvautosize");
    var autosize = cookie ? cookie : true;
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
        xmlfileneeded = 'https://raw.githubusercontent.com/Fazzani/grab/master/out/test.xml';
    }

    if (grabber === "tv_grab_fr") {
        sortstring = "substring-after(substring-before(./@id,'.'),'C')";
    } else if (grabber === "tv_grab_es") {
        sortstring = "display-name[2]";
    } else if (grabber === "tv_grab_huro") {
        sortstring = "substring(./@id,1,3)";
    } else {
        sortstring = "display-name[3]";
    }


    // document.styleSheets['topstyle'].addRule("#listings", "width:" + 800 + "px");
    // document.styleSheets['topstyle'].addRule("#gridtime", "width:" + 800 + "px");

    function loadXSL() {
        $('#loading').css('display', 'block');
        $('#loading').html("index.xsl");
        if (window.XMLHttpRequest && window.XSLTProcessor) { //netscape, but not IE7
            xslrequest = new XMLHttpRequest();
            xslrequest.onreadystatechange = handleXslResponse;
            xslrequest.overrideMimeType('text/xml');
            xslrequest.open("GET", "index.xsl", true);
            xslrequest.send(null);
        } else if (window.ActiveXObject) { //IE
            xslrequest = new ActiveXObject("Msxml2.FreeThreadedDOMDocument.3.0");
            xslrequest.async = true;
            xslrequest.onreadystatechange = handleXslResponse;
            xslrequest.load("index.xsl");
        } else {
            alert('Your browser can\'t handle this script');
            return;
        }
    }

    function loadXML() {
        $('#loading').css("display", "block");
        $('#loading').text(xmlfileneeded);
        if (window.XMLHttpRequest && window.XSLTProcessor) {
            xmlrequest = new XMLHttpRequest();
            xmlrequest.onreadystatechange = handleXmlResponse;
            xmlrequest.overrideMimeType('text/xml');
            xmlrequest.open("GET", xmlfileneeded, true);
            xmlrequest.send(null);
        } else if (window.ActiveXObject) {
            xmlrequest = new ActiveXObject("Msxml2.DOMDocument.3.0");
            xmlrequest.async = true;
            xmlrequest.onreadystatechange = handleXmlResponse;
            xmlrequest.load(xmlfileneeded);
        } else {
            alert('Your browser can\'t handle this script');
            return;
        }
    }

    function handleXslResponse() {
        if (xslrequest.readyState === 4) {
            if (window.XMLHttpRequest && window.XSLTProcessor) { //Netscape only
                xsl = xslrequest.responseXML;
                sortTag = xsl.getElementsByTagName('xsl:sort'); //for firefox 3
                if (!sortTag.item(0)) {
                    sortTag = xsl.getElementsByTagName('sort');
                } //for firefox 2
                sortTag.item(0).setAttribute("select", sortstring);
                processor.importStylesheet(xsl);
            } else if (window.ActiveXObject) {
                sortTag = xslrequest.selectSingleNode('//xsl:sort[0]');
                sortTag.setAttribute("select", sortstring);
                template = new ActiveXObject("Msxml2.XSLTemplate.3.0");
                template.stylesheet = xslrequest;
            }
            loadXML();
        } else {
            $('#loading').css("display", "block");
        }
    }

    function handleXmlResponse() {
        if (xmlrequest.readyState === 4) {
            if (xmlrequest.status >= 300) {
                var errorstring = errortext + " " + xmlrequest.status + ": " + filetext + " " + xmlfileneeded + " " + notfoundtext + ".";
                $('#loading').text(errorstring);
            } else {
                if (window.XMLHttpRequest && window.XSLTProcessor) { //Netscape only
                    xml = xmlrequest.responseXML;
                }
                xmlfileloaded = xmlfileneeded;
                $('#loading').css("display", "block");
                $('#loading').text("Preparing grid...");
                Init(hours, myDate.getHours(), myDate.getDate(), myDate.getMonth() + 1, myDate.getFullYear());
            }
        } else {
            $('#loading').css("display", "block");
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

            if (window.XMLHttpRequest && window.XSLTProcessor) {
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

                if (fixgaps.toString() === "true") {
                    processor.setParameter(null, "FixGaps", 1);
                } else {
                    processor.setParameter(null, "FixGaps", 0);
                }

                processor.setParameter(null, "PopupDelay", popupdelay);
                processor.setParameter(null, "EarlierText", earliertext);
                processor.setParameter(null, "LaterText", latertext);
                processor.setParameter(null, "TimeBarFrequency", timebarfrequency);
                if (channelpopups.toString() === "true") {
                    processor.setParameter(null, "ChannelPopups", 1);
                } else {
                    processor.setParameter(null, "ChannelPopups", 0);
                }
                if (descriptionpopups.toString() === "true") {
                    processor.setParameter(null, "DescriptionPopups", 1);
                } else {
                    processor.setParameter(null, "DescriptionPopups", 0);
                }

                if (absoluteicons.toString() === "true") {
                    processor.setParameter(null, "AbsoluteIcons", 1);
                } else {
                    processor.setParameter(null, "AbsoluteIcons", 0);
                }

                if (popuptimes.toString() === "true") {
                    processor.setParameter(null, "PopupTimes", 1);
                } else {
                    processor.setParameter(null, "PopupTimes", 0);
                }
                if (popuprating.toString() === "true") {
                    processor.setParameter(null, "PopupRating", 1);
                } else {
                    processor.setParameter(null, "PopupRating", 0);
                }
                if (popupsubtitle.toString() === "true") {
                    processor.setParameter(null, "PopupSubtitle", 1);
                } else {
                    processor.setParameter(null, "PopupSubtitle", 0);
                }
                if (popupdescription.toString() === "true") {
                    processor.setParameter(null, "PopupDescription", 1);
                } else {
                    processor.setParameter(null, "PopupDescription", 0);
                }
                if (popupdate.toString() === "true") {
                    processor.setParameter(null, "PopupDate", 1);
                } else {
                    processor.setParameter(null, "PopupDate", 0);
                }
                if (popupcategories.toString() === "true") {
                    processor.setParameter(null, "PopupCategories", 1);
                } else {
                    processor.setParameter(null, "PopupCategories", 0);
                }
                if (popupstarrating.toString() === "true") {
                    processor.setParameter(null, "PopupStarRating", 1);
                } else {
                    processor.setParameter(null, "PopupStarRating", 0);
                }

                processor.setParameter(null, "Grabber", grabber);

                processor.setParameter(null, "HighlightMovies", highlightmovies);
                if (highlightclickable.toString() === "true") {
                    processor.setParameter(null, "HighlightClickable", 1);
                } else {
                    processor.setParameter(null, "HighlightClickable", 0);
                }
                if (printdates.toString() === "true") {
                    processor.setParameter(null, "PrintDates", 1);
                } else {
                    processor.setParameter(null, "PrintDates", 0);
                }
                if (dayfirst.toString() === "true") {
                    processor.setParameter(null, "DayFirst", 1);
                } else {
                    processor.setParameter(null, "DayFirst", 0);
                }
                if (categorycolors.toString() === "true") {
                    processor.setParameter(null, "Categories", 1);
                } else {
                    processor.setParameter(null, "Categories", 0);
                }
                if (highlightnew.toString() === "true") {
                    processor.setParameter(null, "HighlightNew", 1);
                } else {
                    processor.setParameter(null, "HighlightNew", 0);
                }
                processor.setParameter(null, "OnClick", loadonclick);
                var fragment = processor.transformToFragment(xml, document);
                $('#loading').hide();
                far = $(fragment);
                far.append($('<div id="vline"></div>'));
                $("#tvframe").append(far);
            } else if (window.ActiveXObject) {
                processor = template.createProcessor();
                processor.input = xmlrequest;

                processor.addParameter("DisplayLength", dl);
                processor.addParameter("CurrentHour", startDate.getHours());
                processor.addParameter("CurrentDay", startDate.getDate());
                processor.addParameter("CurrentMonth", startDate.getMonth() + 1);
                processor.addParameter("CurrentYear", startDate.getFullYear());

                processor.addParameter("StopHour", endDate.getHours());
                processor.addParameter("StopDay", endDate.getDate());
                processor.addParameter("StopMonth", endDate.getMonth() + 1);
                processor.addParameter("StopYear", endDate.getFullYear());

                processor.addParameter("PrevHour", prevDate.getHours());
                processor.addParameter("PrevDay", prevDate.getDate());
                processor.addParameter("PrevMonth", prevDate.getMonth() + 1);
                processor.addParameter("PrevYear", prevDate.getFullYear());

                if (fixgaps.toString() === "true") {
                    processor.addParameter("FixGaps", 1);
                } else {
                    processor.addParameter("FixGaps", 0);
                }

                processor.addParameter("PopupDelay", popupdelay);
                processor.addParameter("EarlierText", earliertext);
                processor.addParameter("LaterText", latertext);
                processor.addParameter("TimeBarFrequency", timebarfrequency);
                if (channelpopups.toString() === "true") {
                    processor.addParameter("ChannelPopups", 1);
                } else {
                    processor.addParameter("ChannelPopups", 0);
                }
                if (descriptionpopups.toString() === "true") {
                    processor.addParameter("DescriptionPopups", 1);
                } else {
                    processor.addParameter("DescriptionPopups", 0);
                }

                if (popuptimes.toString() === "true") {
                    processor.addParameter("PopupTimes", 1);
                } else {
                    processor.addParameter("PopupTimes", 0);
                }
                if (popuprating.toString() === "true") {
                    processor.addParameter("PopupRating", 1);
                } else {
                    processor.addParameter("PopupRating", 0);
                }
                if (popupsubtitle.toString() === "true") {
                    processor.addParameter("PopupSubtitle", 1);
                } else {
                    processor.addParameter("PopupSubtitle", 0);
                }
                if (popupdescription.toString() === "true") {
                    processor.addParameter("PopupDescription", 1);
                } else {
                    processor.addParameter("PopupDescription", 0);
                }
                if (popupdate.toString() === "true") {
                    processor.addParameter("PopupDate", 1);
                } else {
                    processor.addParameter("PopupDate", 0);
                }
                if (popupcategories.toString() === "true") {
                    processor.addParameter("PopupCategories", 1);
                } else {
                    processor.addParameter("PopupCategories", 0);
                }
                if (popupstarrating.toString() === "true") {
                    processor.addParameter("PopupStarRating", 1);
                } else {
                    processor.addParameter("PopupStarRating", 0);
                }
                if (printdates.toString() === "true") {
                    processor.addParameter("PrintDates", 1);
                } else {
                    processor.addParameter("PrintDates", 0);
                }
                processor.addParameter("Grabber", grabber);
                processor.addParameter("HighlightMovies", highlightmovies);
                if (dayfirst.toString() === "true") {
                    processor.addParameter("DayFirst", 1);
                } else {
                    processor.addParameter("DayFirst", 0);
                }
                if (absoluteicons.toString() === "true") {
                    processor.addParameter("AbsoluteIcons", 1);
                } else {
                    processor.addParameter("AbsoluteIcons", 0);
                }
                if (categorycolors.toString() === "true") {
                    processor.addParameter("Categories", 1);
                } else {
                    processor.addParameter("Categories", 0);
                }
                if (highlightnew.toString() === "true") {
                    processor.addParameter("HighlightNew", 1);
                } else {
                    processor.addParameter("HighlightNew", 0);
                }
                if (highlightclickable.toString() === "true") {
                    processor.addParameter("HighlightClickable", 1);
                } else {
                    processor.addParameter("HighlightClickable", 0);
                }
                processor.addParameter("OnClick", loadonclick);
                // Transform
                processor.transform();
                //Write
                $('#loading').css("display", "none");
                $("#tvframe").html(processor.output);
            }
            if (self.scanDOM) scanDOM(document); //refresh popups?
            $('#tvframe').css("display", "block");
            $('#tvframe').find('#listings').addClass("container-fluid");
        } //All of this is inside the conditinal block requiring that the loadedfile equal the neededfile.
    }

    window.Init = Init;
    $('#loading').css("display", "block");
    loadXSL(); 
});