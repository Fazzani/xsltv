import Settings from './settings';

export default class XsltvProcessor {
    constructor() {
        this.AppSettings = Settings.load('settings');
        this.processor = new XSLTProcessor();
        this.startDate = new Date();
    }

    loadSettings() {
        this.AppSettings = Settings.load('settings');
    }

    initDate(hour, day, month, year, offset) {
        this.ch = hour;
        this.cd = day;
        this.cm = month;
        this.cy = year;
        this.offset = offset;
        return this;
    }

    Init(xml, document) {
        /*This stuff needs to be done each time the time changes */
        this.startDate = new Date(this.cy, this.cm - 1, this.cd, this.ch, 0, 0);
        const endDate = new Date(this.cy, this.cm - 1, this.cd, this.ch, 0, 0);
        endDate.setHours(endDate.getHours() + this.AppSettings.DisplayLength);
        const prevDate = new Date(this.cy, this.cm - 1, this.cd, this.ch, 0, 0);
        prevDate.setHours(prevDate.getHours() - this.AppSettings.DisplayLength);

        if (this.offset) {
            this.startDate.setHours(this.startDate.getHours() + this.offset);
            endDate.setHours(endDate.getHours() + this.offset);
            prevDate.setHours(prevDate.getHours() + this.offset);
        }

        this.processor.setParameter(null, "DisplayLength", this.AppSettings.DisplayLength);
        this.processor.setParameter(null, "CurrentHour", this.startDate.getHours());
        this.processor.setParameter(null, "CurrentDay", this.startDate.getDate());
        this.processor.setParameter(null, "CurrentMonth", this.startDate.getMonth() + 1);
        this.processor.setParameter(null, "CurrentYear", this.startDate.getFullYear());
        this.processor.setParameter(null, "StopHour", endDate.getHours());
        this.processor.setParameter(null, "StopDay", endDate.getDate());
        this.processor.setParameter(null, "StopMonth", endDate.getMonth() + 1);
        this.processor.setParameter(null, "StopYear", endDate.getFullYear());
        this.processor.setParameter(null, "PrevHour", prevDate.getHours());
        this.processor.setParameter(null, "PrevDay", prevDate.getDate());
        this.processor.setParameter(null, "PrevMonth", prevDate.getMonth() + 1);
        this.processor.setParameter(null, "PrevYear", prevDate.getFullYear());
        this.processor.setParameter(null, "FixGaps", this.AppSettings.FixGaps);
        this.processor.setParameter(null, "HighlightClickable", this.AppSettings.highlightclickable);
        this.processor.setParameter(null, "HighlightMovies", this.AppSettings.highlightmovies);
        this.processor.setParameter(null, "HighlightNew", this.AppSettings.highlightnew);
        this.processor.setParameter(null, "OnClick", this.AppSettings.OnClick);

        return this.processor.transformToFragment(xml, document);
    }
}