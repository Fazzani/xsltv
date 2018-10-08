import moment from 'moment';

export default class Common {
    static InitTimeline = ($tvFrame, $vline, hours) => {
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

    static percentElapsedTimeNowByDay = (startDay, hours) => {
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

    static parseQueryString = () => {

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
}