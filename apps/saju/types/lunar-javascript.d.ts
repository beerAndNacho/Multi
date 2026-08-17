declare module 'lunar-javascript' {
  export type EightChar = {
    getYear(): string;
    getMonth(): string;
    getDay(): string;
    getTime(): string;
    getYearWuXing(): string;
    getMonthWuXing(): string;
    getDayWuXing(): string;
    getTimeWuXing(): string;
  };

  export type LunarInstance = {
    getEightChar(): EightChar;
    getYearShengXiao(): string;
    getSolar(): Solar;
    toString(): string;
  };

  export class Solar {
    static fromYmdHms(year: number, month: number, day: number, hour: number, minute: number, second: number): Solar;
    getLunar(): LunarInstance;
    toYmd(): string;
  }

  export class Lunar {
    static fromYmdHms(year: number, month: number, day: number, hour: number, minute: number, second: number): LunarInstance;
  }
}
