export declare enum CalenderConvertTypeEnum {
    SOLAR_TO_LUNAR = "SOLAR_TO_LUNAR",
    LUNAR_TO_SOLAR = "LUNAR_TO_SOLAR"
}
export interface StandardCalenderConvert {
    day: number;
    month: number;
    year: number;
    date: Date;
}
export declare function calenderConvert(date: Date, convertType: CalenderConvertTypeEnum): number[] | {
    day: number;
    month: number;
    year: number;
    solarDate: Date;
} | {
    lunarDay: number;
    lunarMonth: number;
    lunarYear: number;
    lunarDate: Date;
};
export declare const calcNumerology: (dobDate: Date) => {
    totalScore: null;
    isSpecialNumerology: boolean;
} | {
    totalScore: number;
    isSpecialNumerology: boolean;
};
