declare module 'lunar-javascript' {
  export class Solar {
    static fromYmdHms(year: number, month: number, day: number, hour: number, minute: number, second: number): Solar;
    getLunar(): {
      getEightChar(): {
        getYear(): string;
        getMonth(): string;
        getDay(): string;
        getTime(): string;
        getYearWuXing(): string;
        getMonthWuXing(): string;
        getDayWuXing(): string;
        getTimeWuXing(): string;
      };
    };
  }
}
