export default class Period {
    public premium: number;
    public startDate: Date;
    public endDate: Date;
    public event: string;

    public next : Period | undefined;

    constructor(premium: number, startDate: Date, endDate: Date, event: string){
        this.premium = premium;
        this.startDate = startDate;
        this.endDate = endDate;
        this.event = event;
        this.next = undefined;        
    }

    insert(premium: number, startDate: Date, endDate: Date, event: string){
        if(+startDate === +this.startDate){
            if(event !== "Inception") this.premium = premium;

            this.startDate = startDate;
            this.endDate = endDate;
            this.next = undefined;
            return;
        } 
        
        if(this.next === undefined) {
            this.endDate = startDate
            this.next = new Period(
                event === "Inception" ? this.premium : premium, 
                startDate, 
                endDate,
                event
            )
            return;
        }
        
        this.next.insert(
            event === "Inception" ? this.premium : premium, 
            startDate, 
            endDate,
            event
        )
    }

    cancel(cancelDate: Date) {
        if(cancelDate>=this.startDate && cancelDate<=this.endDate){
            this.endDate = cancelDate;
            this.next = undefined;
            return;
        }

        if(this.next===undefined) return;
        
        this.next.cancel(cancelDate)
    }

    toArray() : {premium: number, startDate: Date, endDate: Date} []{
        const items : {premium: number, startDate: Date, endDate: Date} [] = [this.toJson()]

        let next = this.next;
        while( next ){
            items.push(next.toJson())
            next = next.next;
        }

        return items;
    }

    toJson() : {premium: number, startDate: Date, endDate: Date} {
        return {
            premium: this.premium,
            startDate: this.startDate,
            endDate: this.endDate
        }
    } 
}