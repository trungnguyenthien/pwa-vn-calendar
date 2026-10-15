/**
 * Vietnamese Lunisolar Calendar (Âm Lịch Việt Nam)
 * Based on the astronomical algorithm developed by Dr. Hồ Ngọc Đức (Leipzig University).
 * Time zone: UTC+7 (Vietnam standard time)
 * Completely offline - Zero dependencies.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.VNLunar = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const TIME_ZONE = 7.0;

  const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
  const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
  const THU = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];

  // Cache conversions to make 60fps gestures and rendering instantaneous
  const cache = new Map();

  function INT(d) {
    return Math.floor(d);
  }

  /**
   * Convert Gregorian solar date to Julian Day Number
   */
  function jdFromDate(dd, mm, yy) {
    const a = INT((14 - mm) / 12);
    const y = yy + 4800 - a;
    const m = mm + 12 * a - 3;
    let jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045;
    if (jd < 2299161) {
      jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
    }
    return jd;
  }

  /**
   * Calculate Sun's longitude at a given Julian Day
   */
  function getSunLongitude(jdn, timeZone) {
    const T = (jdn - 2451545.5 - timeZone / 24) / 36525;
    const T2 = T * T;
    const dr = Math.PI / 180;

    const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
    const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;

    let DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
    DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.00029 * Math.sin(dr * 3 * M);

    let L = (L0 + DL) * dr;
    L = L - Math.PI * 2 * Math.floor(L / (Math.PI * 2));
    return Math.floor((L / Math.PI) * 6);
  }

  /**
   * Calculate the Julian Day Number of the k-th New Moon
   */
  function getNewMoonDay(k, timeZone) {
    const T = k / 1236.85;
    const T2 = T * T;
    const T3 = T2 * T;
    const dr = Math.PI / 180;

    let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
    Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);

    const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
    const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
    const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;

    let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
    C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr) - 0.0004 * Math.sin(dr * 3 * Mpr);
    C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
    C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
    C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
    C1 = C1 + 0.001 * Math.sin(dr * (3 * M));

    const JdNew = Jd1 + C1;
    return Math.floor(JdNew + 0.5 + timeZone / 24);
  }

  /**
   * Find the Julian day number for the start of Lunar Month 11
   */
  function getLunarMonth11(yy, timeZone) {
    const off = jdFromDate(31, 12, yy) - 2415021;
    const k = Math.floor(off / 29.530588853);
    let nm = getNewMoonDay(k, timeZone);
    const sunLong = getSunLongitude(nm, timeZone);
    if (sunLong >= 9) {
      nm = getNewMoonDay(k - 1, timeZone);
    }
    return nm;
  }

  /**
   * Determine the leap month offset after Lunar Month 11
   */
  function getLeapMonthOffset(a11, timeZone) {
    const k = Math.floor((a11 - 2415021.07699869) / 29.530588853 + 0.5);
    let last = 0;
    let i = 1;
    let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
    do {
      last = arc;
      i++;
      arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
    } while (arc !== last && i < 14);
    return i - 1;
  }

  /**
   * Convert solar date to Vietnamese lunar date
   * @param {number} dd Day of month (1-31)
   * @param {number} mm Month of year (1-12)
   * @param {number} yy Full year (e.g. 2026)
   * @param {number} timeZone Time zone offset in hours (default 7.0 for Vietnam)
   * @returns {{ day: number, month: number, year: number, leap: number, jd: number }}
   */
  function convertSolar2Lunar(dd, mm, yy, timeZone = TIME_ZONE) {
    const cacheKey = `${dd}-${mm}-${yy}-${timeZone}`;
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    const dayNumber = jdFromDate(dd, mm, yy);
    const k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);
    let monthStart = getNewMoonDay(k + 1, timeZone);
    if (monthStart > dayNumber) {
      monthStart = getNewMoonDay(k, timeZone);
    }

    let a11 = getLunarMonth11(yy, timeZone);
    let b11 = a11;
    let lunarYear;
    if (a11 >= monthStart) {
      lunarYear = yy;
      a11 = getLunarMonth11(yy - 1, timeZone);
    } else {
      lunarYear = yy + 1;
      b11 = getLunarMonth11(yy + 1, timeZone);
    }

    const lunarDay = dayNumber - monthStart + 1;
    const diff = Math.floor((monthStart - a11) / 29);
    let lunarLeap = 0;
    let lunarMonth = diff + 11;

    if (b11 - a11 > 365) {
      const leapMonthDiff = getLeapMonthOffset(a11, timeZone);
      if (diff >= leapMonthDiff) {
        lunarMonth = diff + 10;
        if (diff === leapMonthDiff) {
          lunarLeap = 1;
        }
      }
    }

    if (lunarMonth > 12) {
      lunarMonth = lunarMonth - 12;
    }
    if (lunarMonth >= 11 && diff < 4) {
      lunarYear -= 1;
    }

    const result = {
      day: lunarDay,
      month: lunarMonth,
      year: lunarYear,
      leap: lunarLeap,
      jd: dayNumber
    };

    cache.set(cacheKey, result);
    return result;
  }

  /**
   * Get Can-Chi name for a given lunar or solar year
   */
  function getYearCanChi(year) {
    const can = CAN[((year + 6) % 10 + 10) % 10];
    const chi = CHI[((year + 8) % 12 + 12) % 12];
    return `${can} ${chi}`;
  }

  /**
   * Get Can-Chi name for a given day by Julian Day Number
   */
  function getDayCanChi(jd) {
    const can = CAN[((jd + 9) % 10 + 10) % 10];
    const chi = CHI[((jd + 1) % 12 + 12) % 12];
    return `${can} ${chi}`;
  }

  /**
   * Format lunar date label for display on calendar cell
   * @param {Object} lunar - Lunar date object { day, month, year, leap }
   * @param {boolean|number} [showMonthOrSolarDay=false] - If true (or solarDay === 1), displays day/month
   * Returns:
   * - '1/M' or '1/M nhuận' if lunar day == 1
   * - 'D/M' or 'D/M nhuận' if showMonth is true
   * - '15' (marked special)
   * - 'D' otherwise
   */
  function formatLunarCell(lunar, showMonthOrSolarDay = false) {
    const showMonth = typeof showMonthOrSolarDay === 'number'
      ? showMonthOrSolarDay === 1
      : Boolean(showMonthOrSolarDay);

    if (lunar.day === 1) {
      return {
        text: `1/${lunar.month}${lunar.leap ? 'N' : ''}`,
        fullText: `Mùng 1 tháng ${lunar.month}${lunar.leap ? ' (nhuận)' : ''}`,
        isFirstDay: true,
        isFullMoon: false,
        isLeap: Boolean(lunar.leap)
      };
    }
    if (lunar.day === 15) {
      return {
        text: showMonth ? `15/${lunar.month}${lunar.leap ? 'N' : ''}` : '15',
        fullText: `Rằm tháng ${lunar.month}${lunar.leap ? ' (nhuận)' : ''}`,
        isFirstDay: false,
        isFullMoon: true,
        isLeap: Boolean(lunar.leap)
      };
    }
    if (showMonth) {
      return {
        text: `${lunar.day}/${lunar.month}${lunar.leap ? 'N' : ''}`,
        fullText: `Ngày ${lunar.day} tháng ${lunar.month}${lunar.leap ? ' (nhuận)' : ''}`,
        isFirstDay: false,
        isFullMoon: false,
        isLeap: Boolean(lunar.leap)
      };
    }
    return {
      text: `${lunar.day}`,
      fullText: `Ngày ${lunar.day} tháng ${lunar.month}${lunar.leap ? ' (nhuận)' : ''}`,
      isFirstDay: false,
      isFullMoon: false,
      isLeap: Boolean(lunar.leap)
    };
  }

  /**
   * Determine Western Zodiac Sign (Cung Hoàng Đạo) from Solar day and month
   */
  function getZodiacSign(day, month) {
    const d = Number(day);
    const m = Number(month);

    if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) return { name: 'Bạch Dương', symbol: '♈', eng: 'Aries' };
    if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) return { name: 'Kim Ngưu', symbol: '♉', eng: 'Taurus' };
    if ((m === 5 && d >= 21) || (m === 6 && d <= 21)) return { name: 'Song Tử', symbol: '♊', eng: 'Gemini' };
    if ((m === 6 && d >= 22) || (m === 7 && d <= 22)) return { name: 'Cự Giải', symbol: '♋', eng: 'Cancer' };
    if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return { name: 'Sư Tử', symbol: '♌', eng: 'Leo' };
    if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return { name: 'Xử Nữ', symbol: '♍', eng: 'Virgo' };
    if ((m === 9 && d >= 23) || (m === 10 && d <= 23)) return { name: 'Thiên Bình', symbol: '♎', eng: 'Libra' };
    if ((m === 10 && d >= 24) || (m === 11 && d <= 22)) return { name: 'Bọ Cạp', symbol: '♏', eng: 'Scorpio' };
    if ((m === 11 && d >= 23) || (m === 12 && d <= 21)) return { name: 'Nhân Mã', symbol: '♐', eng: 'Sagittarius' };
    if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) return { name: 'Ma Kết', symbol: '♑', eng: 'Capricorn' };
    if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) return { name: 'Bảo Bình', symbol: '♒', eng: 'Aquarius' };
    if ((m === 2 && d >= 19) || (m === 3 && d <= 20)) return { name: 'Song Ngư', symbol: '♓', eng: 'Pisces' };

    return { name: '', symbol: '', eng: '' };
  }

  return {
    convertSolar2Lunar,
    getYearCanChi,
    getDayCanChi,
    getZodiacSign,
    formatLunarCell,
    jdFromDate,
    CAN,
    CHI,
    THU
  };
});
