
export default class DateUtils {

    static convertDate(dateStr: string): Date {
        let date = new Date(dateStr);
        date.setHours(0,0,0,0);
        return date;
    }

}