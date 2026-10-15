/**
 * Lịch Việt PWA - Main Application Controller
 * Handles 2-month viewport rendering, gesture navigation, quick picker, and offline PWA.
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Date & State Setup
  // ---------------------------------------------------------------------------
  const today = new Date();
  const currentDeviceYear = today.getFullYear();
  const currentDeviceMonth = today.getMonth() + 1; // 1-12
  const currentDeviceDay = today.getDate();

  // Range: ~80 years before, ~20 years after current year.
  // Guarantee MIN_YEAR is ODD (top line) and MAX_YEAR is EVEN (bottom line)
  // so that every column contains (Odd year on top, Even year on bottom).
  const rawMinYear = currentDeviceYear - 80;
  const MIN_YEAR = rawMinYear % 2 !== 0 ? rawMinYear : rawMinYear - 1;
  const rawMaxYear = currentDeviceYear + 20;
  const MAX_YEAR = rawMaxYear % 2 === 0 ? rawMaxYear : rawMaxYear + 1;

  let state = {
    month: currentDeviceMonth,
    year: currentDeviceYear,
    selectedDate: { day: currentDeviceDay, month: currentDeviceMonth, year: currentDeviceYear },
    sheetYear: currentDeviceYear,
    sheetMonth: currentDeviceMonth,
    isSheetOpen: false
  };

  // DOM Elements
  const headerPickerBtn = document.getElementById('headerPickerBtn');
  const calendarViewport = document.getElementById('calendarViewport');
  const calendarStage = document.getElementById('calendarStage');
  const prevMonthBtn = document.getElementById('prevMonthBtn');
  const nextMonthBtn = document.getElementById('nextMonthBtn');
  const todayBtn = document.getElementById('todayBtn');
  const pullRefreshIndicator = document.getElementById('pullRefreshIndicator');
  const pullRefreshText = document.getElementById('pullRefreshText');

  // Bottom Sheet Elements
  const bottomSheet = document.getElementById('bottomSheet');
  const bottomSheetBackdrop = document.getElementById('bottomSheetBackdrop');
  const sheetHandle = document.getElementById('sheetHandle');
  const sheetCloseBtn = document.getElementById('sheetCloseBtn');
  const sheetSubmitBtn = document.getElementById('sheetSubmitBtn');
  const sheetYearNum = document.getElementById('sheetYearNum');
  const sheetYearCanChi = document.getElementById('sheetYearCanChi');
  const yearStripContainer = document.getElementById('yearStripContainer');
  const yearStrip = document.getElementById('yearStrip');
  const monthsGrid = document.getElementById('monthsGrid');
  const prev10YearBtn = document.getElementById('prev10YearBtn');
  const prevYearBtn = document.getElementById('prevYearBtn');
  const nextYearBtn = document.getElementById('nextYearBtn');
  const next10YearBtn = document.getElementById('next10YearBtn');

  // Day Detail Toast Elements
  const dayDetailToast = document.getElementById('dayDetailToast');
  const toastSolarTitle = document.getElementById('toastSolarTitle');
  const toastLunarDesc = document.getElementById('toastLunarDesc');
  const toastCanChiTag = document.getElementById('toastCanChiTag');

  let toastTimeout = null;



  // ---------------------------------------------------------------------------
  // Calendar Render Helpers
  // ---------------------------------------------------------------------------
  function getNextMonth(m, y) {
    if (m === 12) {
      return { month: 1, year: y + 1 };
    }
    return { month: m + 1, year: y };
  }

  function getPrevMonth(m, y) {
    if (m === 1) {
      return { month: 12, year: y - 1 };
    }
    return { month: m - 1, year: y };
  }

  /**
   * Generates grid data (42 days, 7 cols x 6 rows) for a month
   */
  function buildMonthDays(year, month) {
    const days = [];
    const firstDayDate = new Date(year, month - 1, 1);
    const totalDaysInMonth = new Date(year, month, 0).getDate();

    // Monday is column 0, Sunday is column 6
    const jsDay = firstDayDate.getDay(); // 0 is Sunday, 1 is Monday
    const startCol = jsDay === 0 ? 6 : jsDay - 1;

    // Previous month filler days
    const prevMonthDaysCount = new Date(year, month - 1, 0).getDate();
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;

    for (let i = startCol - 1; i >= 0; i--) {
      const dayNum = prevMonthDaysCount - i;
      const lunar = VNLunar.convertSolar2Lunar(dayNum, prevMonth, prevYear);
      days.push({
        solarDay: dayNum,
        solarMonth: prevMonth,
        solarYear: prevYear,
        isOutside: true,
        lunar: lunar,
        cellData: VNLunar.formatLunarCell(lunar, dayNum),
        dayOfWeek: (startCol - 1 - i) % 7
      });
    }

    // Current month days
    for (let dayNum = 1; dayNum <= totalDaysInMonth; dayNum++) {
      const lunar = VNLunar.convertSolar2Lunar(dayNum, month, year);
      const dayOfWeek = (startCol + dayNum - 1) % 7;
      days.push({
        solarDay: dayNum,
        solarMonth: month,
        solarYear: year,
        isOutside: false,
        lunar: lunar,
        cellData: VNLunar.formatLunarCell(lunar, dayNum),
        dayOfWeek: dayOfWeek
      });
    }

    // Next month filler days (fill to 42 cells = 6 rows x 7 cols)
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    let nextDayNum = 1;

    while (days.length < 42) {
      const lunar = VNLunar.convertSolar2Lunar(nextDayNum, nextMonth, nextYear);
      const dayOfWeek = days.length % 7;
      days.push({
        solarDay: nextDayNum,
        solarMonth: nextMonth,
        solarYear: nextYear,
        isOutside: true,
        lunar: lunar,
        cellData: VNLunar.formatLunarCell(lunar, nextDayNum),
        dayOfWeek: dayOfWeek
      });
      nextDayNum++;
    }

    return days;
  }

  /**
   * Renders a single month card HTML
   */
  function renderMonthCardHTML(month, year, isTop) {
    const days = buildMonthDays(year, month);
    const yearCanChi = VNLunar.getYearCanChi(year);
    const isEvenYear = year % 2 === 0;

    const weekdays = [
      { text: 'T2', isSun: false, isSat: false },
      { text: 'T3', isSun: false, isSat: false },
      { text: 'T4', isSun: false, isSat: false },
      { text: 'T5', isSun: false, isSat: false },
      { text: 'T6', isSun: false, isSat: false },
      { text: 'T7', isSun: false, isSat: true },
      { text: 'CN', isSun: true, isSat: false }
    ];

    let weekdaysHTML = weekdays
      .map(
        (w) =>
          `<div class="weekday-col ${w.isSun ? 'is-sunday' : ''} ${w.isSat ? 'is-saturday' : ''}">${w.text}</div>`
      )
      .join('');

    let cellsHTML = days
      .map((d) => {
        const isSun = d.dayOfWeek === 6;
        const isSat = d.dayOfWeek === 5;
        const isToday =
          !d.isOutside &&
          d.solarDay === currentDeviceDay &&
          d.solarMonth === currentDeviceMonth &&
          d.solarYear === currentDeviceYear;

        const isSelected =
          state.selectedDate &&
          d.solarDay === state.selectedDate.day &&
          d.solarMonth === state.selectedDate.month &&
          d.solarYear === state.selectedDate.year;

        const cellClasses = [
          'day-cell',
          d.isOutside ? 'is-outside' : '',
          isSun ? 'is-sunday' : '',
          isSat ? 'is-saturday' : '',
          isToday ? 'is-today' : '',
          isSelected ? 'is-selected' : '',
          d.cellData.isFirstDay ? 'is-lunar-first' : '',
          d.cellData.isFullMoon ? 'is-lunar-full' : ''
        ]
          .filter(Boolean)
          .join(' ');

        return `
          <button type="button" class="${cellClasses}"
            data-day="${d.solarDay}"
            data-month="${d.solarMonth}"
            data-year="${d.solarYear}"
            aria-label="${d.solarDay}/${d.solarMonth}/${d.solarYear}, Âm lịch ${d.cellData.fullText}">
            <span class="solar-num">${d.solarDay}</span>
            <span class="lunar-num">${d.cellData.text}</span>
          </button>
        `;
      })
      .join('');

    return `
      <section class="month-card ${isTop ? 'month-top' : 'month-bottom'}" aria-label="Tháng ${month} năm ${year}">
        <div class="month-meta-bar">
          <div class="month-title">
            <span>Tháng ${month}</span>
            <span class="month-title-badge ${isEvenYear ? 'is-even' : 'is-odd'}">${year} - ${yearCanChi.toUpperCase()}</span>
          </div>
        </div>
        <div class="weekdays-row" aria-hidden="true">${weekdaysHTML}</div>
        <div class="days-grid">${cellsHTML}</div>
      </section>
    `;
  }

  /**
   * Main render method for the 2-month screen
   */
  function renderCalendar() {
    const m1 = state.month;
    const y1 = state.year;
    const next = getNextMonth(m1, y1);
    const m2 = next.month;
    const y2 = next.year;

    // Check if the current pair of months contains today's device month & year
    const hasCurrentMonth =
      (m1 === currentDeviceMonth && y1 === currentDeviceYear) ||
      (m2 === currentDeviceMonth && y2 === currentDeviceYear);

    if (todayBtn) {
      if (hasCurrentMonth) {
        todayBtn.classList.add('is-active');
      } else {
        todayBtn.classList.remove('is-active');
      }
    }

    // Render both months into the stage
    calendarStage.innerHTML = `
      ${renderMonthCardHTML(m1, y1, true)}
      ${renderMonthCardHTML(m2, y2, false)}
    `;

    attachCellClickListeners();
  }

  // ---------------------------------------------------------------------------
  // Day Detail Toast Handling
  // ---------------------------------------------------------------------------
  function attachCellClickListeners() {
    const cells = calendarStage.querySelectorAll('.day-cell');
    cells.forEach((cell) => {
      cell.addEventListener('click', (e) => {
        const d = parseInt(cell.getAttribute('data-day'), 10);
        const m = parseInt(cell.getAttribute('data-month'), 10);
        const y = parseInt(cell.getAttribute('data-year'), 10);

        const isToastVisible = dayDetailToast.classList.contains('is-visible');

        state.selectedDate = { day: d, month: m, year: y };

        // Highlight selected cell
        cells.forEach((c) => c.classList.remove('is-selected'));
        if (!cell.classList.contains('is-today')) {
          cell.classList.add('is-selected');
        }

        if (isToastVisible) {
          // Khi popup đang mở: tap vào cell khác (hoặc tap lại chính cell đó) -> tự tắt popup
          hideDayDetail();
        } else {
          // Khi popup đang đóng: mở popup trong 3s
          showDayDetail(d, m, y, cell);
        }
      });
    });
  }

  function positionToastAboveWeek(cell) {
    if (!cell) return;
    const cellRect = cell.getBoundingClientRect();
    const toastHeight = dayDetailToast.offsetHeight || 66;
    const header = document.querySelector('.calendar-header');
    const headerBottom = header ? header.getBoundingClientRect().bottom : 50;
    const gap = 6;

    // Display directly above the week row containing the selected day
    let targetTop = cellRect.top - toastHeight - gap;

    // If too close to the header (e.g. week 1 of top month), place right below that week row
    if (targetTop < headerBottom + 4) {
      targetTop = cellRect.bottom + gap;
    }

    dayDetailToast.style.top = `${Math.round(targetTop)}px`;
  }

  function hideDayDetail(direction = 'none') {
    if (toastTimeout) {
      clearTimeout(toastTimeout);
      toastTimeout = null;
    }

    if (direction === 'left') {
      dayDetailToast.classList.add('is-dismissing-left');
      setTimeout(() => {
        dayDetailToast.classList.remove('is-visible', 'is-dismissing-left', 'is-dragging');
        dayDetailToast.style.transform = '';
        dayDetailToast.style.opacity = '';
      }, 220);
    } else if (direction === 'right') {
      dayDetailToast.classList.add('is-dismissing-right');
      setTimeout(() => {
        dayDetailToast.classList.remove('is-visible', 'is-dismissing-right', 'is-dragging');
        dayDetailToast.style.transform = '';
        dayDetailToast.style.opacity = '';
      }, 220);
    } else {
      dayDetailToast.classList.remove('is-visible', 'is-dragging');
      dayDetailToast.style.transform = '';
      dayDetailToast.style.opacity = '';
    }
  }

  function showDayDetail(dd, mm, yy, targetCell = null) {
    if (toastTimeout) clearTimeout(toastTimeout);

    const solarDate = new Date(yy, mm - 1, dd);
    const dayOfWeekName = VNLunar.THU[solarDate.getDay()];
    const lunar = VNLunar.convertSolar2Lunar(dd, mm, yy);
    const yearCanChi = VNLunar.getYearCanChi(lunar.year);
    const dayCanChi = VNLunar.getDayCanChi(lunar.jd);

    toastSolarTitle.textContent = `${dayOfWeekName}, ngày ${dd} tháng ${mm} năm ${yy}`;

    let lunarStr = `Ngày ${lunar.day} tháng ${lunar.month}${lunar.leap ? ' (nhuận)' : ''} năm ${yearCanChi}`;
    if (lunar.day === 1) lunarStr += ' · Mùng 1 đầu tháng';
    if (lunar.day === 15) lunarStr += ' · Ngày Rằm';
    toastLunarDesc.textContent = lunarStr;

    toastCanChiTag.textContent = `Ngày ${dayCanChi} (Âm lịch)`;

    // Position toast directly above the week of the selected day
    const cell = targetCell ||
      calendarStage.querySelector(`.day-cell[data-day="${dd}"][data-month="${mm}"][data-year="${yy}"]:not(.is-outside)`) ||
      calendarStage.querySelector(`.day-cell[data-day="${dd}"][data-month="${mm}"][data-year="${yy}"]`) ||
      calendarStage.querySelector('.day-cell.is-today') ||
      calendarStage.querySelector('.day-cell.is-selected');

    if (cell) {
      positionToastAboveWeek(cell);
    }

    // Reset inline transforms and show
    dayDetailToast.classList.remove('is-dismissing-left', 'is-dismissing-right', 'is-dragging');
    dayDetailToast.style.transform = '';
    dayDetailToast.style.opacity = '';
    dayDetailToast.classList.add('is-visible');

    // Auto dismiss after 3 seconds (3s)
    toastTimeout = setTimeout(() => {
      hideDayDetail();
    }, 3000);
  }

  // Swipe ngang (trái sang phải hoặc phải sang trái) để tắt popup
  let toastSwipe = {
    isDown: false,
    startX: 0,
    startY: 0,
    startTime: 0,
    pointerId: null
  };

  dayDetailToast.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    toastSwipe.isDown = true;
    toastSwipe.startX = e.clientX;
    toastSwipe.startY = e.clientY;
    toastSwipe.startTime = performance.now();
    toastSwipe.pointerId = e.pointerId;
    dayDetailToast.classList.add('is-dragging');

    if (toastTimeout) {
      clearTimeout(toastTimeout);
      toastTimeout = null;
    }

    try {
      dayDetailToast.setPointerCapture(e.pointerId);
    } catch (_) {}
  });

  dayDetailToast.addEventListener('pointermove', (e) => {
    if (!toastSwipe.isDown || e.pointerId !== toastSwipe.pointerId) return;
    const dx = e.clientX - toastSwipe.startX;

    // Follow horizontal drag
    dayDetailToast.style.transform = `translateX(${dx}px)`;

    // Subtle fade out when dragged further away
    const progress = Math.min(1, Math.abs(dx) / 180);
    dayDetailToast.style.opacity = `${1 - progress * 0.55}`;
  });

  function endToastSwipe(e) {
    if (!toastSwipe.isDown || e.pointerId !== toastSwipe.pointerId) return;
    toastSwipe.isDown = false;
    dayDetailToast.classList.remove('is-dragging');

    try {
      if (dayDetailToast.hasPointerCapture(e.pointerId)) {
        dayDetailToast.releasePointerCapture(e.pointerId);
      }
    } catch (_) {}

    const dx = e.clientX - toastSwipe.startX;
    const dt = Math.max(1, performance.now() - toastSwipe.startTime);
    const vx = dx / dt;

    const threshold = 40;
    const velocityThreshold = 0.25;

    if (dx < -threshold || vx < -velocityThreshold) {
      // Swiped left to dismiss
      hideDayDetail('left');
    } else if (dx > threshold || vx > velocityThreshold) {
      // Swiped right to dismiss
      hideDayDetail('right');
    } else {
      // Return to center position and resume 5s timeout
      dayDetailToast.style.transform = '';
      dayDetailToast.style.opacity = '';
      toastTimeout = setTimeout(() => {
        hideDayDetail();
      }, 5000);
    }

    toastSwipe.pointerId = null;
  }

  dayDetailToast.addEventListener('pointerup', endToastSwipe);
  dayDetailToast.addEventListener('pointercancel', endToastSwipe);

  // ---------------------------------------------------------------------------
  // Navigation: Month & Year transitions
  // ---------------------------------------------------------------------------
  let isNavigating = false;

  function canNavigate(targetMonth, targetYear) {
    if (targetYear < MIN_YEAR) return false;
    if (targetYear === MIN_YEAR && targetMonth < 1) return false;
    if (targetYear > MAX_YEAR) return false;
    if (targetYear === MAX_YEAR && targetMonth > 11) return false;
    return true;
  }

  /**
   * Switches to the next (+1) or previous (-1) pair of months (advances/regresses by 1 month sliding window).
   * Sequence: [1, 2] -> [2, 3] -> [3, 4] -> [4, 5]...
   */
  function changePair(direction, animated = true) {
    if (isNavigating) return;
    hideDayDetail();

    const totalMonths = state.year * 12 + (state.month - 1) + direction;
    const targetYear = Math.floor(totalMonths / 12);
    const targetMonth = (totalMonths % 12) + 1;

    if (!canNavigate(targetMonth, targetYear)) {
      bounceStage();
      return;
    }

    if (!animated) {
      state.month = targetMonth;
      state.year = targetYear;
      renderCalendar();
      return;
    }

    isNavigating = true;
    calendarStage.classList.add('animating');
    const exitX = direction > 0 ? -100 : 100;
    calendarStage.style.transform = `translate3d(${exitX}%, 0, 0)`;

    setTimeout(() => {
      state.month = targetMonth;
      state.year = targetYear;
      renderCalendar();

      calendarStage.classList.remove('animating');
      const enterX = direction > 0 ? 100 : -100;
      calendarStage.style.transform = `translate3d(${enterX}%, 0, 0)`;

      void calendarStage.offsetWidth;
      calendarStage.classList.add('animating');
      calendarStage.style.transform = 'translate3d(0, 0, 0)';

      setTimeout(() => {
        calendarStage.classList.remove('animating');
        isNavigating = false;
      }, 240);
    }, 200);
  }

  function changeMonth(delta, animated = true, axis = 'y') {
    if (isNavigating) return;

    let targetMonth = state.month + delta;
    let targetYear = state.year;

    if (targetMonth > 12) {
      targetMonth = 1;
      targetYear += 1;
    } else if (targetMonth < 1) {
      targetMonth = 12;
      targetYear -= 1;
    }

    if (!canNavigate(targetMonth, targetYear)) {
      bounceStage();
      return;
    }

    if (!animated) {
      state.month = targetMonth;
      state.year = targetYear;
      renderCalendar();
      return;
    }

    isNavigating = true;
    calendarStage.classList.add('animating');

    if (axis === 'y') {
      const exitY = delta > 0 ? -100 : 100;
      calendarStage.style.transform = `translate3d(0, ${exitY}%, 0)`;

      setTimeout(() => {
        state.month = targetMonth;
        state.year = targetYear;
        renderCalendar();

        calendarStage.classList.remove('animating');
        const enterY = delta > 0 ? 100 : -100;
        calendarStage.style.transform = `translate3d(0, ${enterY}%, 0)`;

        void calendarStage.offsetWidth;
        calendarStage.classList.add('animating');
        calendarStage.style.transform = 'translate3d(0, 0, 0)';

        setTimeout(() => {
          calendarStage.classList.remove('animating');
          isNavigating = false;
        }, 240);
      }, 200);
    } else {
      const exitX = delta > 0 ? -100 : 100;
      calendarStage.style.transform = `translate3d(${exitX}%, 0, 0)`;

      setTimeout(() => {
        state.month = targetMonth;
        state.year = targetYear;
        renderCalendar();

        calendarStage.classList.remove('animating');
        const enterX = delta > 0 ? 100 : -100;
        calendarStage.style.transform = `translate3d(${enterX}%, 0, 0)`;

        void calendarStage.offsetWidth;
        calendarStage.classList.add('animating');
        calendarStage.style.transform = 'translate3d(0, 0, 0)';

        setTimeout(() => {
          calendarStage.classList.remove('animating');
          isNavigating = false;
        }, 240);
      }, 200);
    }
  }

  function changeYear(delta, animated = true) {
    if (isNavigating) return;

    const targetYear = state.year + delta;
    if (!canNavigate(state.month, targetYear)) {
      bounceStage();
      return;
    }

    if (!animated) {
      state.year = targetYear;
      renderCalendar();
      return;
    }

    isNavigating = true;
    calendarStage.classList.add('animating');
    const exitY = delta > 0 ? -100 : 100;
    calendarStage.style.transform = `translate3d(0, ${exitY}%, 0)`;

    setTimeout(() => {
      state.year = targetYear;
      renderCalendar();

      calendarStage.classList.remove('animating');
      const enterY = delta > 0 ? 100 : -100;
      calendarStage.style.transform = `translate3d(0, ${enterY}%, 0)`;

      void calendarStage.offsetWidth;
      calendarStage.classList.add('animating');
      calendarStage.style.transform = 'translate3d(0, 0, 0)';

      setTimeout(() => {
        calendarStage.classList.remove('animating');
        isNavigating = false;
      }, 260);
    }, 220);
  }

  function bounceStage() {
    calendarStage.classList.add('animating');
    calendarStage.style.transform = 'translate3d(0, 0, 0)';
    setTimeout(() => {
      calendarStage.classList.remove('animating');
    }, 260);
  }

  // ---------------------------------------------------------------------------
  // Touch & Pointer Gesture Engine (Spec 4)
  // Distance & Velocity thresholds + Axis Locking
  // ---------------------------------------------------------------------------
  let pointerState = {
    isDown: false,
    startX: 0,
    startY: 0,
    startTime: 0,
    axis: null, // 'x' | 'y' | null
    pointerId: null
  };

  calendarViewport.addEventListener('pointerdown', (e) => {
    // Only primary button
    if (e.button !== 0) return;
    if (isNavigating || state.isSheetOpen) return;

    pointerState.isDown = true;
    pointerState.startX = e.clientX;
    pointerState.startY = e.clientY;
    pointerState.startTime = performance.now();
    pointerState.axis = null;
    pointerState.pointerId = e.pointerId;

    calendarStage.classList.remove('animating');
  });

  calendarViewport.addEventListener('pointermove', (e) => {
    if (!pointerState.isDown || e.pointerId !== pointerState.pointerId) return;

    const dx = e.clientX - pointerState.startX;
    const dy = e.clientY - pointerState.startY;

    // Lock axis if not yet decided
    if (pointerState.axis === null) {
      const dist = Math.hypot(dx, dy);
      if (dist >= 8) {
        if (Math.abs(dx) >= Math.abs(dy)) {
          pointerState.axis = 'x';
          try {
            calendarViewport.setPointerCapture(e.pointerId);
          } catch (_) {}
        } else {
          pointerState.axis = 'y';
          try {
            calendarViewport.setPointerCapture(e.pointerId);
          } catch (_) {}
        }
      }
    }

    if (pointerState.axis === 'x') {
      hideDayDetail();
      let dragX = dx;
      // Damping at limits
      const isAtMin = state.year <= MIN_YEAR && state.month <= 1 && dx > 0;
      const isAtMax = state.year >= MAX_YEAR && state.month >= 11 && dx < 0;
      if (isAtMin || isAtMax) {
        dragX = dx * 0.25;
      }
      calendarStage.style.transform = `translate3d(${dragX}px, 0, 0)`;
    } else if (pointerState.axis === 'y') {
      hideDayDetail();
      if (dy > 0) {
        // Pull down for Pull-to-Refresh to today
        const pullDist = Math.min(80, Math.pow(dy, 0.82) * 1.6);
        calendarStage.style.transform = `translate3d(0, ${pullDist}px, 0)`;

        if (pullRefreshIndicator) {
          pullRefreshIndicator.classList.add('is-pulling');
          const indicatorY = Math.min(60, -50 + pullDist * 0.9);
          pullRefreshIndicator.style.transform = `translateX(-50%) translateY(${indicatorY}px)`;

          if (pullDist >= 46) {
            pullRefreshIndicator.classList.add('is-ready');
            if (pullRefreshText) pullRefreshText.textContent = 'Thả ra để về Hôm nay';
          } else {
            pullRefreshIndicator.classList.remove('is-ready');
            if (pullRefreshText) pullRefreshText.textContent = 'Kéo xuống về Hôm nay';
          }
        }
      } else {
        // Swiping up: do NOT change month, apply strong damping resistance
        const pushUp = Math.max(-12, dy * 0.07);
        calendarStage.style.transform = `translate3d(0, ${pushUp}px, 0)`;
        if (pullRefreshIndicator) {
          pullRefreshIndicator.classList.remove('is-pulling', 'is-ready');
          pullRefreshIndicator.style.transform = '';
        }
      }
    }
  });

  function endPointerGesture(e) {
    if (!pointerState.isDown || e.pointerId !== pointerState.pointerId) return;
    pointerState.isDown = false;

    try {
      if (calendarViewport.hasPointerCapture(e.pointerId)) {
        calendarViewport.releasePointerCapture(e.pointerId);
      }
    } catch (_) {}

    const dx = e.clientX - pointerState.startX;
    const dy = e.clientY - pointerState.startY;
    const dt = Math.max(1, performance.now() - pointerState.startTime);
    const vx = dx / dt;

    const threshold = 45;
    const velocityThreshold = 0.25;

    if (pointerState.axis === 'x') {
      // Horizontal swipe: switch to new pair of months
      if (dx < -threshold || vx < -velocityThreshold) {
        changePair(1, true);
      } else if (dx > threshold || vx > velocityThreshold) {
        changePair(-1, true);
      } else {
        bounceStage();
      }
    } else if (pointerState.axis === 'y') {
      const pullDist = dy > 0 ? Math.min(80, Math.pow(dy, 0.82) * 1.6) : 0;
      if (dy > 0 && pullDist >= 46) {
        // Trigger pull-to-refresh to today
        if (pullRefreshIndicator) {
          pullRefreshIndicator.classList.remove('is-pulling', 'is-ready');
          pullRefreshIndicator.classList.add('is-refreshing');
          if (pullRefreshText) pullRefreshText.textContent = 'Đang về Hôm nay...';
        }

        calendarStage.classList.add('animating');
        calendarStage.style.transform = 'translate3d(0, 42px, 0)';

        jumpToToday();

        setTimeout(() => {
          calendarStage.style.transform = 'translate3d(0, 0, 0)';
          if (pullRefreshIndicator) {
            pullRefreshIndicator.style.transform = 'translateX(-50%) translateY(-65px)';
          }
          setTimeout(() => {
            if (pullRefreshIndicator) {
              pullRefreshIndicator.classList.remove('is-refreshing');
              pullRefreshIndicator.style.transform = '';
            }
            calendarStage.classList.remove('animating');
          }, 240);
        }, 320);
      } else {
        // Cancel pull / push up bounce back
        calendarStage.classList.add('animating');
        calendarStage.style.transform = 'translate3d(0, 0, 0)';
        if (pullRefreshIndicator) {
          pullRefreshIndicator.classList.remove('is-pulling', 'is-ready');
          pullRefreshIndicator.style.transform = '';
        }
        setTimeout(() => {
          calendarStage.classList.remove('animating');
        }, 220);
      }
    }

    pointerState.axis = null;
    pointerState.pointerId = null;
  }

  calendarViewport.addEventListener('pointerup', endPointerGesture);
  calendarViewport.addEventListener('pointercancel', endPointerGesture);

  // ---------------------------------------------------------------------------
  // Quick Month/Year Picker - Bottom Sheet (Spec 5)
  // Dynamic Range: CurrentYear - 80 to CurrentYear + 20
  // ---------------------------------------------------------------------------
  function populateYearStrip() {
    yearStrip.innerHTML = '';
    for (let y = MIN_YEAR; y <= MAX_YEAR; y++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      const isOdd = y % 2 !== 0;
      btn.className = `year-chip ${isOdd ? 'is-odd' : 'is-even'} ${y === state.sheetYear ? 'is-selected' : ''}`;
      btn.textContent = y;
      btn.setAttribute('data-year', y);
      btn.setAttribute('aria-label', `Năm ${y} (${VNLunar.getYearCanChi(y)})`);
      btn.addEventListener('click', () => {
        setSheetYear(y);
      });
      yearStrip.appendChild(btn);
    }
  }

  function setSheetYear(year) {
    if (year < MIN_YEAR || year > MAX_YEAR) return;
    state.sheetYear = year;
    sheetYearNum.textContent = year;
    sheetYearCanChi.textContent = VNLunar.getYearCanChi(year);

    const chips = yearStrip.querySelectorAll('.year-chip');
    chips.forEach((chip) => {
      const chipYear = parseInt(chip.getAttribute('data-year'), 10);
      if (chipYear === year) {
        chip.classList.add('is-selected');
        // Center the active chip into view
        chip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        chip.classList.remove('is-selected');
      }
    });
  }

  function populateMonthsGrid() {
    monthsGrid.innerHTML = '';
    for (let m = 1; m <= 12; m++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `month-select-btn ${m === state.sheetMonth ? 'is-active' : ''}`;
      btn.textContent = `Tháng ${m}`;
      btn.setAttribute('data-month', m);

      btn.addEventListener('click', () => {
        state.sheetMonth = m;
        const allBtns = monthsGrid.querySelectorAll('.month-select-btn');
        allBtns.forEach((b) => {
          const bm = parseInt(b.getAttribute('data-month'), 10);
          if (bm === m) {
            b.classList.add('is-active');
          } else {
            b.classList.remove('is-active');
          }
        });
      });

      monthsGrid.appendChild(btn);
    }
  }

  function submitSheetSelection() {
    state.month = state.sheetMonth;
    state.year = state.sheetYear;
    hideDayDetail();
    renderCalendar();
    closeBottomSheet();
  }

  function openBottomSheet() {
    hideDayDetail();
    state.isSheetOpen = true;
    state.sheetYear = state.year;
    state.sheetMonth = state.month;
    headerPickerBtn.classList.add('is-active');
    headerPickerBtn.setAttribute('aria-expanded', 'true');

    setSheetYear(state.sheetYear);
    populateMonthsGrid();

    bottomSheet.style.transform = '';
    bottomSheetBackdrop.classList.add('is-open');
    bottomSheet.classList.add('is-open');

    // Scroll active chip into view after animation
    setTimeout(() => {
      const activeChip = yearStrip.querySelector('.year-chip.is-selected');
      if (activeChip) {
        activeChip.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' });
      }
    }, 80);
  }

  function closeBottomSheet() {
    state.isSheetOpen = false;
    headerPickerBtn.classList.remove('is-active');
    headerPickerBtn.setAttribute('aria-expanded', 'false');

    bottomSheet.style.transform = '';
    bottomSheetBackdrop.classList.remove('is-open');
    bottomSheet.classList.remove('is-open');
  }

  // Quick navigation buttons in Bottom Sheet
  prev10YearBtn.addEventListener('click', () => setSheetYear(Math.max(MIN_YEAR, state.sheetYear - 10)));
  prevYearBtn.addEventListener('click', () => setSheetYear(Math.max(MIN_YEAR, state.sheetYear - 1)));
  nextYearBtn.addEventListener('click', () => setSheetYear(Math.min(MAX_YEAR, state.sheetYear + 1)));
  next10YearBtn.addEventListener('click', () => setSheetYear(Math.min(MAX_YEAR, state.sheetYear + 10)));

  headerPickerBtn.addEventListener('click', () => {
    if (state.isSheetOpen) {
      closeBottomSheet();
    } else {
      openBottomSheet();
    }
  });

  sheetCloseBtn.addEventListener('click', closeBottomSheet);
  sheetSubmitBtn.addEventListener('click', submitSheetSelection);
  bottomSheetBackdrop.addEventListener('click', closeBottomSheet);

  // Jump to today
  function jumpToToday() {
    state.month = currentDeviceMonth;
    state.year = currentDeviceYear;
    state.selectedDate = { day: currentDeviceDay, month: currentDeviceMonth, year: currentDeviceYear };
    hideDayDetail();
    renderCalendar();
    if (state.isSheetOpen) closeBottomSheet();
  }

  todayBtn.addEventListener('click', jumpToToday);

  // Chevrons (Switch pairs of months)
  prevMonthBtn.addEventListener('click', () => changePair(-1, true));
  nextMonthBtn.addEventListener('click', () => changePair(1, true));

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (state.isSheetOpen) closeBottomSheet();
      hideDayDetail();
    } else if (e.key === 'ArrowLeft') {
      changePair(-1, true);
    } else if (e.key === 'ArrowRight') {
      changePair(1, true);
    } else if (e.key === 'ArrowDown') {
      jumpToToday();
    } else if (e.key === 't' || e.key === 'T' || e.key === 'h' || e.key === 'H') {
      jumpToToday();
    }
  });

  // Drag up to close top sheet
  let sheetDragStartY = 0;
  if (sheetHandle) {
    sheetHandle.addEventListener('pointerdown', (e) => {
      sheetDragStartY = e.clientY;
      sheetHandle.setPointerCapture(e.pointerId);
    });
    sheetHandle.addEventListener('pointermove', (e) => {
      if (!sheetHandle.hasPointerCapture(e.pointerId)) return;
      const dy = e.clientY - sheetDragStartY;
      if (dy < 0) {
        bottomSheet.style.transform = `translateY(${dy}px)`;
      }
    });
    sheetHandle.addEventListener('pointerup', (e) => {
      if (!sheetHandle.hasPointerCapture(e.pointerId)) return;
      sheetHandle.releasePointerCapture(e.pointerId);
      const dy = e.clientY - sheetDragStartY;
      bottomSheet.style.transform = '';
      if (dy < -60) {
        closeBottomSheet();
      }
    });
  }

  // Reposition toast on window resize/orientation change if active
  window.addEventListener('resize', () => {
    if (dayDetailToast.classList.contains('is-visible')) {
      const activeCell =
        calendarStage.querySelector('.day-cell.is-selected') ||
        calendarStage.querySelector('.day-cell.is-today');
      if (activeCell) {
        positionToastAboveWeek(activeCell);
      }
    }
  });

  // ---------------------------------------------------------------------------
  // PWA Service Worker Registration
  // ---------------------------------------------------------------------------
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./sw.js', { scope: './' })
        .then((reg) => {
          console.log('[PWA] Service Worker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[PWA] Service Worker registration failed:', err);
        });
    });
  }

  // ---------------------------------------------------------------------------
  // Initialize App
  // ---------------------------------------------------------------------------
  calendarStage.addEventListener('click', (e) => {
    if (!e.target.closest('.day-cell')) {
      hideDayDetail();
    }
  });

  populateYearStrip();
  renderCalendar();
})();
