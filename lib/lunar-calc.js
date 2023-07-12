"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcNumerology = exports.calenderConvert = exports.CalenderConvertTypeEnum = void 0;
const VN_TZ = 7;
var CalenderConvertTypeEnum;
(function (CalenderConvertTypeEnum) {
    CalenderConvertTypeEnum["SOLAR_TO_LUNAR"] = "SOLAR_TO_LUNAR";
    CalenderConvertTypeEnum["LUNAR_TO_SOLAR"] = "LUNAR_TO_SOLAR";
})(CalenderConvertTypeEnum = exports.CalenderConvertTypeEnum || (exports.CalenderConvertTypeEnum = {}));
function calenderConvert(date, convertType) {
    const dateObj = new Date(date);
    const month = dateObj.getUTCMonth() + 1; //months from 1-12
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    switch (convertType) {
        case CalenderConvertTypeEnum.LUNAR_TO_SOLAR:
            return convertLunarCalendarToSolarCalendar(day, month, year, 0);
        case CalenderConvertTypeEnum.SOLAR_TO_LUNAR:
            return convertSolarCalendarToLunarCalendar(day, month, year);
    }
}
exports.calenderConvert = calenderConvert;
function convertLunarCalendarToSolarCalendar(lunarDay, lunarMonth, lunarYear, lunarLeap) {
    let a11, b11, off, leapOff, leapMonth;
    if (lunarMonth < 11) {
        a11 = getLunarMonth11(lunarYear - 1);
        b11 = getLunarMonth11(lunarYear);
    }
    else {
        a11 = getLunarMonth11(lunarYear);
        b11 = getLunarMonth11(lunarYear + 1);
    }
    off = lunarMonth - 11;
    if (off < 0) {
        off += 12;
    }
    if (b11 - a11 > 365) {
        leapOff = getLeapMonthOffset(a11);
        leapMonth = leapOff - 2;
        if (leapMonth < 0) {
            leapMonth += 12;
        }
        if (lunarLeap != 0 && lunarMonth != leapMonth) {
            return [0, 0, 0];
        }
        else if (lunarLeap != 0 || off >= leapOff) {
            off += 1;
        }
    }
    const k = Math.floor(0.5 + (a11 - 2415021.076998695) / 29.530588853);
    const monthStart = getNewMoonDay(k + off);
    const { day, month, year } = juliusDayToCalendar(monthStart + lunarDay - 1);
    const solarDate = new Date(year, month - 1, day);
    return {
        day, month, year, solarDate
    };
}
function convertSolarCalendarToLunarCalendar(solarDay, solarMonth, solarYear) {
    const dayNumber = calendarToJuliusDay(solarDay, solarMonth, solarYear);
    const k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);
    let monthStart = getNewMoonDay(k + 1);
    if (monthStart > dayNumber) {
        monthStart = getNewMoonDay(k);
    }
    let a11 = getLunarMonth11(solarYear);
    let b11 = a11;
    let lunarYear;
    if (a11 >= monthStart) {
        lunarYear = solarYear;
        a11 = getLunarMonth11(solarYear - 1);
    }
    else {
        lunarYear = solarYear + 1;
        b11 = getLunarMonth11(solarYear + 1);
    }
    const lunarDay = dayNumber - monthStart + 1;
    const diff = Math.floor((monthStart - a11) / 29);
    let lunarMonth = diff + 11;
    let leapMonthDiff;
    if (b11 - a11 > 365) {
        leapMonthDiff = getLeapMonthOffset(a11);
        if (diff >= leapMonthDiff) {
            lunarMonth = diff + 10;
            if (diff == leapMonthDiff) {
            }
        }
    }
    if (lunarMonth > 12) {
        lunarMonth = lunarMonth - 12;
    }
    if (lunarMonth >= 11 && diff < 4) {
        lunarYear -= 1;
    }
    const lunarDate = new Date(lunarYear, lunarMonth - 1, lunarDay);
    return { lunarDay, lunarMonth, lunarYear, lunarDate };
}
function calendarToJuliusDay(day, month, year) {
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    const jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    return jd > 2299161 ? jd : day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
}
function juliusDayToCalendar(jd) {
    let a, b, c;
    if (jd > 2299160) {
        a = jd + 32044;
        b = Math.floor((4 * a + 3) / 146097);
        c = a - Math.floor((b * 146097) / 4);
    }
    else {
        b = 0;
        c = jd + 32082;
    }
    const d = Math.floor((4 * c + 3) / 1461);
    const e = c - Math.floor((1461 * d) / 4);
    const m = Math.floor((5 * e + 2) / 153);
    return {
        day: e - Math.floor((153 * m + 2) / 5) + 1,
        month: m + 3 - 12 * Math.floor(m / 10),
        year: b * 100 + d - 4800 + Math.floor(m / 10),
    };
}
function getNewMoonDay(k) {
    const T = k / 1236.85;
    const T2 = T * T;
    const T3 = T2 * T;
    const dr = Math.PI / 180;
    const Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
    const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
    const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
    const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
    const C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M)
        - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr)
        - 0.0004 * Math.sin(dr * 3 * Mpr)
        + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr))
        - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M))
        - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr))
        + 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
    const delta = T < -11 ? 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3 : -0.000278 + 0.000265 * T + 0.000262 * T2;
    const JdNew = Jd1 + C1 - delta;
    return Math.floor(JdNew + 0.5 + VN_TZ / 24);
}
function getSunLongitude(jdn) {
    const T = (jdn - 2451545.5 - VN_TZ / 24) / 36525;
    const T2 = Math.pow(T, 2);
    const dr = Math.PI / 180;
    const M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
    const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
    const DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M)
        + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000290 * Math.sin(dr * 3 * M);
    let L = (L0 + DL) * dr;
    L = L - Math.PI * 2 * (Math.floor(L / (Math.PI * 2))); // Normalize to (0, 2*PI)
    return Math.floor(L / Math.PI * 6);
}
function getLunarMonth11(year) {
    const off = calendarToJuliusDay(31, 12, year) - 2415021;
    const k = Math.floor(off / 29.530588853);
    const moonDay = getNewMoonDay(k);
    const sunLong = getSunLongitude(moonDay);
    return sunLong >= 9 ? getNewMoonDay(k - 1) : moonDay;
}
function getLeapMonthOffset(a11) {
    const k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
    let last = 0;
    let i = 1;
    let arc = getSunLongitude(getNewMoonDay(k + i));
    while (arc != last && i < 14) {
        last = arc;
        i++;
        arc = getSunLongitude(getNewMoonDay(k + i));
    }
    return i - 1;
}
const calcNumerology = (dobDate) => {
    if (!dobDate)
        return {
            totalScore: null,
            isSpecialNumerology: false
        };
    try {
        const dateObj = new Date(dobDate);
        const month = dateObj.getUTCMonth() + 1; //months from 1-12
        const day = dateObj.getUTCDate();
        const year = dateObj.getUTCFullYear();
        const dobArr = `${year}${month}${day}`.split('');
        let dobScore = dobArr.reduce((sum, dob) => sum + parseInt(dob), 0);
        let isSpecialNumerology = false;
        while (dobScore > 11) {
            if (dobScore === 22)
                isSpecialNumerology = true;
            dobScore = dobScore.toString().split("").reduce((sum, dob) => sum + parseInt(dob), 0);
        }
        return {
            totalScore: dobScore,
            isSpecialNumerology
        };
    }
    catch (error) {
        return {
            totalScore: null,
            isSpecialNumerology: false
        };
    }
};
exports.calcNumerology = calcNumerology;
