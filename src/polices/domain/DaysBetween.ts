export default class DaysBetween {
    static get(start: Date, end: Date) : number {
        return Math.ceil(( start.getTime() - end.getTime()) / (1000 * 3600 * 24));
    }
}