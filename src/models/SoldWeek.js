export class SoldWeek {
    constructor(data = {}) {
        this.intervalWeek = data.intervalWeek || null;
        this.totalSold = data.totalSold || 0.00;
    }
}