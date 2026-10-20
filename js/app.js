/**
 * PWA Vietnamese Calendar (Lịch Việt)
 * Continuous Vertical Flow Architecture with Alternating Month Themes & Side Rail
 */

(() => {
  'use strict';

  // ---------------------------------------------------------------------------
  // Device & Date Initialization
  // ---------------------------------------------------------------------------
  const now = new Date();
  const currentDeviceYear = now.getFullYear();
  const currentDeviceMonth = now.getMonth() + 1; // 1-12
  const currentDeviceDay = now.getDate();

  // Dynamic Year Range: Current - 80 to Current + 20
  const MIN_YEAR = currentDeviceYear - 80;
  const MAX_YEAR = currentDeviceYear + 20;

  // Application State
  const state = {
    viewingYear: currentDeviceYear,
    viewingMonth: currentDeviceMonth,
    selectedDate: null,
    sheetYear: currentDeviceYear,
    sheetMonth: currentDeviceMonth,
    isSheetOpen: false,
    renderedRange: {
      startYear: currentDeviceYear - 1,
      startMonth: 1,
      endYear: currentDeviceYear + 1,
      endMonth: 12
    }
  };

  // DOM Elements
  const headerPickerBtn = document.getElementById('headerPickerBtn');
  const calendarViewport = document.getElementById('calendarViewport');
  const calendarStage = document.getElementById('calendarStage');
  const prevMonthBtn = document.getElementById('prevMonthBtn');
  const nextMonthBtn = document.getElementById('nextMonthBtn');
  const todayBtn = document.getElementById('todayBtn');

  // Bottom / Top Sheet Elements
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
  const toastZodiacTag = document.getElementById('toastZodiacTag');
  const toastHolidaysContainer = document.getElementById('toastHolidaysContainer');

  let toastTimeout = null;

  // ---------------------------------------------------------------------------
  // Continuous Vertical Grid Generation Helpers
  // ---------------------------------------------------------------------------

  /**
   * Retrieves all Sunday dates (1..totalDaysInMonth) for a given solar month
   * A week is grouped by the month that its Sunday belongs to.
   */
  function getSundaysOfMonth(year, month) {
    const sundays = [];
    const daysInMonth = new Date(year, month, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(year, month - 1, d);
      if (dt.getDay() === 0) { // Sunday is 0
        sundays.push(d);
      }
    }
    return sundays;
  }

  /**
   * Given a Sunday date, returns the 7 days of that week from Monday to Sunday.
   * Monday = Sunday - 6 days.
   */
  function getWeekDaysFromSunday(year, month, sundayDay) {
    const sunDate = new Date(year, month - 1, sundayDay);
    const week = [];
    for (let offset = 6; offset >= 0; offset--) {
      const d = new Date(sunDate);
      d.setDate(sunDate.getDate() - offset);
      week.push({
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        day: d.getDate(),
        dayOfWeek: d.getDay() === 0 ? 6 : d.getDay() - 1 // 0: Mon, 1: Tue, ..., 6: Sun
      });
    }
    return week;
  }

  /**
   * Builds HTML for a single month block
   * - Side rail spans exactly the weeks whose Sunday belongs to this month
   * - Alternating themes: Yellow (vàng nhạt) & Taro Purple (tím khoai môn nhạt)
   */
  function renderMonthBlockHTML(year, month) {
    const sundays = getSundaysOfMonth(year, month);
    const weeksCount = sundays.length;
    const isYellowMonth = (year * 12 + month) % 2 !== 0;
    const railClass = isYellowMonth ? 'theme-yellow-rail' : 'theme-taro-rail';
    const yearCanChi = VNLunar.getYearCanChi(year);

    let daysHTML = '';

    for (let s = 0; s < sundays.length; s++) {
      const sundayDay = sundays[s];
      const weekDays = getWeekDaysFromSunday(year, month, sundayDay);

      for (let i = 0; i < 7; i++) {
        const d = weekDays[i];
        const isSun = d.dayOfWeek === 6;
        const isSat = d.dayOfWeek === 5;
        const isMonday = d.dayOfWeek === 0;

        // Individual cell theme follows the solar month of that specific date
        const isDayYellow = (d.year * 12 + d.month) % 2 !== 0;
        const dayThemeClass = isDayYellow ? 'theme-yellow-cell' : 'theme-taro-cell';

        const isToday =
          d.day === currentDeviceDay &&
          d.month === currentDeviceMonth &&
          d.year === currentDeviceYear;

        const isSelected =
          state.selectedDate &&
          d.day === state.selectedDate.day &&
          d.month === state.selectedDate.month &&
          d.year === state.selectedDate.year;

        const lunar = VNLunar.convertSolar2Lunar(d.day, d.month, d.year);
        // Show month rules: 1st solar day of month OR Monday of the week
        const isFirstSolar = d.day === 1;
        const showMonth = isFirstSolar || isMonday;
        const cellData = VNLunar.formatLunarCell(lunar, showMonth);

        // Determine holiday corner badge (Top-Left triangle indicator)
        let holidayCornerClass = '';
        const holidaysModule = (typeof VNHolidays !== 'undefined') ? VNHolidays : (window.VNHolidays || null);
        if (holidaysModule && typeof holidaysModule.getHolidays === 'function') {
          const cellHolidays = holidaysModule.getHolidays(d.day, d.month, d.year, lunar.day, lunar.month, lunar.year, lunar.leap, VNLunar);
          if (cellHolidays && cellHolidays.length > 0) {
            if (cellHolidays.some(h => h.isOff || h.type === 'national')) {
              holidayCornerClass = 'has-holiday-national';
            } else if (cellHolidays.some(h => h.type === 'traditional')) {
              holidayCornerClass = 'has-holiday-traditional';
            } else if (cellHolidays.some(h => h.type === 'commemoration')) {
              holidayCornerClass = 'has-holiday-commemoration';
            }
          }
        }

        const cellClasses = [
          'day-cell',
          dayThemeClass,
          isSun ? 'is-sunday' : '',
          isSat ? 'is-saturday' : '',
          isToday ? 'is-today' : '',
          isSelected ? 'is-selected' : '',
          cellData.isFirstDay ? 'is-lunar-first' : '',
          cellData.isFullMoon ? 'is-lunar-full' : '',
          holidayCornerClass
        ]
          .filter(Boolean)
          .join(' ');

        daysHTML += `
          <button type="button" class="${cellClasses}"
            data-day="${d.day}"
            data-month="${d.month}"
            data-year="${d.year}"
            aria-label="${d.day}/${d.month}/${d.year}, Âm lịch ${cellData.fullText}">
            <span class="solar-num">${d.day}</span>
            <span class="lunar-num">${cellData.text}</span>
          </button>
        `;
      }
    }

    return `
      <section class="month-block" id="month-${year}-${month}" data-year="${year}" data-month="${month}" style="--weeks-count: ${weeksCount};">
        <div class="month-days-container">
          ${daysHTML}
        </div>
        <aside class="month-rail ${railClass}" data-year="${year}" data-month="${month}" title="Tháng ${month} năm ${year} (${yearCanChi})">
          <div class="month-rail-badge">
            <span class="month-rail-num">${month}</span>
          </div>
          <div class="month-rail-body">
            <span class="month-rail-year">${year}</span>
          </div>
        </aside>
      </section>
    `;
  }

  /**
   * Renders a continuous stream of months into calendarStage
   */
  function renderCalendarStream(startYear, startMonth, endYear, endMonth) {
    let html = '';
    let currY = startYear;
    let currM = startMonth;

    while (currY < endYear || (currY === endYear && currM <= endMonth)) {
      html += renderMonthBlockHTML(currY, currM);
      currM++;
      if (currM > 12) {
        currM = 1;
        currY++;
      }
    }

    calendarStage.innerHTML = html;
    state.renderedRange = { startYear, startMonth, endYear, endMonth };

    attachCellClickListeners();
    attachRailClickListeners();
  }

  // ---------------------------------------------------------------------------
  // Day Detail Toast Handling
  // ---------------------------------------------------------------------------
  function attachCellClickListeners() {
    const cells = calendarStage.querySelectorAll('.day-cell');
    cells.forEach((cell) => {
      cell.addEventListener('click', () => {
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
          hideDayDetail();
        } else {
          showDayDetail(d, m, y, cell);
        }
      });
    });
  }

  function attachRailClickListeners() {
    const rails = calendarStage.querySelectorAll('.month-rail');
    rails.forEach((rail) => {
      rail.addEventListener('click', () => {
        const y = parseInt(rail.getAttribute('data-year'), 10);
        const m = parseInt(rail.getAttribute('data-month'), 10);
        state.sheetYear = y;
        state.sheetMonth = m;
        openBottomSheet();
      });
    });
  }

  function positionToastAboveWeek(cell) {
    if (!cell) return;
    const cellRect = cell.getBoundingClientRect();
    const toastHeight = dayDetailToast.offsetHeight || 66;
    const header = document.getElementById('appHeader');
    const weekdaysSticky = document.getElementById('calendarWeekdays');
    const headerBottom = weekdaysSticky
      ? weekdaysSticky.getBoundingClientRect().bottom
      : (header ? header.getBoundingClientRect().bottom : 50);
    const gap = 8;

    let targetTop = cellRect.top - toastHeight - gap;

    // If too close to the sticky header, place right below the cell
    if (targetTop < headerBottom + 4) {
      targetTop = cellRect.bottom + gap;
    }

    // Safety clamp: Ensure toast never overflows past bottom of viewport
    if (targetTop + toastHeight > window.innerHeight - 12) {
      targetTop = Math.max(headerBottom + 6, window.innerHeight - toastHeight - 12);
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

    if (toastZodiacTag && VNLunar.getZodiacSign) {
      const zodiac = VNLunar.getZodiacSign(dd, mm);
      if (zodiac && zodiac.name) {
        toastZodiacTag.textContent = `${zodiac.symbol} Cung ${zodiac.name}`;
        toastZodiacTag.style.display = '';
      } else {
        toastZodiacTag.style.display = 'none';
      }
    }

    // Vietnamese Holidays & Commemorations
    let hasHoliday = false;
    if (toastHolidaysContainer) {
      const holidays = (window.VNHolidays && typeof window.VNHolidays.getHolidays === 'function')
        ? window.VNHolidays.getHolidays(dd, mm, yy, lunar.day, lunar.month, lunar.year, lunar.leap, VNLunar)
        : [];

      if (holidays && holidays.length > 0) {
        hasHoliday = true;
        toastHolidaysContainer.innerHTML = holidays.map((h) => {
          const typeClass = `type-${h.type || 'national'}`;
          const icon = h.icon || '⭐';
          const meaningHTML = h.meaning ? `<div class="toast-holiday-meaning">${h.meaning}</div>` : '';

          return `
            <div class="toast-holiday-item ${typeClass} ${h.isOff ? 'is-off' : ''}">
              <div class="toast-holiday-header">
                <span class="toast-holiday-icon">${icon}</span>
                <span class="toast-holiday-name">${h.name}</span>
              </div>
              ${meaningHTML}
            </div>
          `;
        }).join('');
        toastHolidaysContainer.style.display = 'flex';
      } else {
        toastHolidaysContainer.innerHTML = '';
        toastHolidaysContainer.style.display = 'none';
      }
    }

    const cell = targetCell ||
      calendarStage.querySelector(`.day-cell[data-day="${dd}"][data-month="${mm}"][data-year="${yy}"]`) ||
      calendarStage.querySelector('.day-cell.is-today') ||
      calendarStage.querySelector('.day-cell.is-selected');

    if (cell) {
      positionToastAboveWeek(cell);
    }

    dayDetailToast.classList.remove('is-dismissing-left', 'is-dismissing-right', 'is-dragging');
    dayDetailToast.style.transform = '';
    dayDetailToast.style.opacity = '';
    dayDetailToast.classList.add('is-visible');

    // Auto dismiss: give extra reading time (5.2s) if day has holidays, else 3.5s
    const dismissDuration = hasHoliday ? 5200 : 3500;
    toastTimeout = setTimeout(() => {
      hideDayDetail();
    }, dismissDuration);
  }

  // Swipe ngang để tắt popup chi tiết ngày
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

    dayDetailToast.style.transform = `translateX(${dx}px)`;
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
      hideDayDetail('left');
    } else if (dx > threshold || vx > velocityThreshold) {
      hideDayDetail('right');
    } else {
      dayDetailToast.style.transform = '';
      dayDetailToast.style.opacity = '';
      toastTimeout = setTimeout(() => {
        hideDayDetail();
      }, 4000);
    }

    toastSwipe.pointerId = null;
  }

  dayDetailToast.addEventListener('pointerup', endToastSwipe);
  dayDetailToast.addEventListener('pointercancel', endToastSwipe);

  // ---------------------------------------------------------------------------
  // Smooth Navigation & Jump To Today
  // ---------------------------------------------------------------------------

  /**
   * Scrolls smoothly to today's date
   */
  function jumpToToday(smooth = true) {
    hideDayDetail();

    const todayBlock = document.getElementById(`month-${currentDeviceYear}-${currentDeviceMonth}`);
    if (!todayBlock) {
      renderCalendarStream(currentDeviceYear - 1, 1, currentDeviceYear + 1, 12);
    }

    if (!smooth) {
      const targetBlock = document.getElementById(`month-${currentDeviceYear}-${currentDeviceMonth}`);
      if (targetBlock) {
        calendarViewport.scrollTop = targetBlock.offsetTop;
      }
      updateTodayButtonState();
      if (state.isSheetOpen) closeBottomSheet();
      return;
    }

    requestAnimationFrame(() => {
      const todayCell = calendarStage.querySelector('.day-cell.is-today');
      if (todayCell) {
        todayCell.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    if (state.isSheetOpen) closeBottomSheet();
  }

  /**
   * Scrolls up or down by 1 month block
   */
  function scrollMonthDelta(delta) {
    hideDayDetail();
    const blocks = Array.from(calendarStage.querySelectorAll('.month-block'));
    if (blocks.length === 0) return;

    const vpRect = calendarViewport.getBoundingClientRect();
    const probeY = vpRect.top + 70;

    let activeIndex = 0;
    for (let i = 0; i < blocks.length; i++) {
      const r = blocks[i].getBoundingClientRect();
      if (r.top <= probeY && r.bottom > probeY) {
        activeIndex = i;
        break;
      }
    }

    const nextIndex = Math.max(0, Math.min(blocks.length - 1, activeIndex + delta));
    blocks[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /**
   * Updates today button active state according to scroll viewport visibility
   * And automatically hides day detail toast when scrolling
   */
  let scrollThrottle = false;
  calendarViewport.addEventListener('scroll', () => {
    // Tự động ẩn popup thông tin ngày khi user scroll lịch
    if (dayDetailToast && dayDetailToast.classList.contains('is-visible')) {
      hideDayDetail();
    }

    if (!scrollThrottle) {
      requestAnimationFrame(() => {
        updateTodayButtonState();
        scrollThrottle = false;
      });
      scrollThrottle = true;
    }
  }, { passive: true });

  calendarViewport.addEventListener('touchmove', () => {
    if (dayDetailToast && dayDetailToast.classList.contains('is-visible')) {
      hideDayDetail();
    }
  }, { passive: true });

  function updateTodayButtonState() {
    const todayCell = calendarStage.querySelector('.day-cell.is-today');
    if (!todayCell || !todayBtn) return;
    const cellRect = todayCell.getBoundingClientRect();
    const vpRect = calendarViewport.getBoundingClientRect();

    const isVisible = cellRect.bottom >= vpRect.top && cellRect.top <= vpRect.bottom;
    if (isVisible) {
      todayBtn.classList.add('is-active');
    } else {
      todayBtn.classList.remove('is-active');
    }
  }

  // ---------------------------------------------------------------------------
  // Quick Month/Year Picker - Top Sheet
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
    const targetY = state.sheetYear;
    const targetM = state.sheetMonth;
    hideDayDetail();
    closeBottomSheet();

    let targetEl = document.getElementById(`month-${targetY}-${targetM}`);
    if (!targetEl) {
      renderCalendarStream(targetY - 1, 1, targetY + 1, 12);
      targetEl = document.getElementById(`month-${targetY}-${targetM}`);
    }

    if (targetEl) {
      requestAnimationFrame(() => {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  function openBottomSheet() {
    hideDayDetail();
    state.isSheetOpen = true;
    headerPickerBtn.classList.add('is-active');
    headerPickerBtn.setAttribute('aria-expanded', 'true');

    setSheetYear(state.sheetYear);
    populateMonthsGrid();

    bottomSheet.style.transform = '';
    bottomSheetBackdrop.classList.add('is-open');
    bottomSheet.classList.add('is-open');

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

  // Jump to today button
  todayBtn.addEventListener('click', () => jumpToToday(true));

  // Chevrons (Scroll prev/next month)
  prevMonthBtn.addEventListener('click', () => scrollMonthDelta(-1));
  nextMonthBtn.addEventListener('click', () => scrollMonthDelta(1));

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (state.isSheetOpen) closeBottomSheet();
      hideDayDetail();
    } else if (e.key === 'ArrowUp') {
      scrollMonthDelta(-1);
    } else if (e.key === 'ArrowDown') {
      scrollMonthDelta(1);
    } else if (e.key === 't' || e.key === 'T' || e.key === 'h' || e.key === 'H') {
      jumpToToday(true);
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

  // Dismiss toast when clicking outside day cells
  calendarStage.addEventListener('click', (e) => {
    if (!e.target.closest('.day-cell')) {
      hideDayDetail();
    }
  });

  // ---------------------------------------------------------------------------
  // PWA Installation Management (Standard Rule 6)
  // ---------------------------------------------------------------------------
  let deferredInstallPrompt = null;

  function showSnackbar(message, duration = 3000) {
    const snackbar = document.getElementById('pwaSnackbar');
    if (!snackbar) return;
    snackbar.textContent = message;
    snackbar.classList.remove('hidden');
    void snackbar.offsetWidth;
    snackbar.classList.add('is-visible');

    setTimeout(() => {
      snackbar.classList.remove('is-visible');
      setTimeout(() => {
        snackbar.classList.add('hidden');
      }, 300);
    }, duration);
  }

  function initPWAInstallation() {
    const btnInstall = document.getElementById('btnInstall');
    const iosInstallModal = document.getElementById('iosInstallModal');
    const btnCloseIosModal = document.getElementById('btnCloseIosModal');
    const btnGotItIos = document.getElementById('btnGotItIos');

    // Check standalone mode (installed app)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    // Detect iOS Safari
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    if (isStandalone) {
      if (btnInstall) btnInstall.classList.add('hidden');
    } else if (isIOS && btnInstall) {
      // iOS Safari doesn't fire beforeinstallprompt; show button to open instructions
      btnInstall.classList.remove('hidden');
    }

    // 1. Listen for beforeinstallprompt on Chromium (Android / Desktop)
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredInstallPrompt = e;
      if (!isStandalone && btnInstall) {
        btnInstall.classList.remove('hidden');
      }
    });

    // 2. Listen for successful install
    window.addEventListener('appinstalled', () => {
      deferredInstallPrompt = null;
      if (btnInstall) btnInstall.classList.add('hidden');
      showSnackbar('Cài đặt ứng dụng thành công!');
    });

    // Helper to open/close iOS modal
    const openIosModal = () => {
      if (!iosInstallModal) return;
      iosInstallModal.classList.remove('hidden');
      void iosInstallModal.offsetWidth;
      iosInstallModal.classList.add('open');
    };

    const closeIosModal = () => {
      if (!iosInstallModal) return;
      iosInstallModal.classList.remove('open');
      setTimeout(() => {
        iosInstallModal.classList.add('hidden');
      }, 200);
    };

    // 3. Handle Install Button Click
    if (btnInstall) {
      btnInstall.addEventListener('click', async () => {
        if (deferredInstallPrompt) {
          deferredInstallPrompt.prompt();
          const { outcome } = await deferredInstallPrompt.userChoice;
          if (outcome === 'accepted') {
            btnInstall.classList.add('hidden');
          }
          deferredInstallPrompt = null;
        } else if (iosInstallModal) {
          openIosModal();
        }
      });
    }

    // Close iOS modal actions
    [btnCloseIosModal, btnGotItIos].forEach((btn) => {
      if (btn) btn.addEventListener('click', closeIosModal);
    });

    if (iosInstallModal) {
      iosInstallModal.addEventListener('click', (e) => {
        if (e.target === iosInstallModal) {
          closeIosModal();
        }
      });
    }

    // Keyboard accessibility: ESC key to close modal or bottom sheet (Rule 10)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (iosInstallModal && iosInstallModal.classList.contains('open')) {
          closeIosModal();
        } else if (state.isSheetOpen) {
          closeBottomSheet();
        }
      }
    });
  }

  // ---------------------------------------------------------------------------
  // PWA Service Worker Registration & In-App Update Flow (Rule 3, 4, 6.D)
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // PWA Service Worker Registration & In-App Update Flow (Rule 3, 4, 6.D)
  // ---------------------------------------------------------------------------
  function initServiceWorkerWithUpdatePrompt() {
    if (!('serviceWorker' in navigator)) return;

    const btnUpdateApp = document.getElementById('btnUpdateApp');
    const updateBanner = document.getElementById('updateBanner');
    const btnReloadUpdate = document.getElementById('btnReloadUpdate');
    let waitingWorker = null;
    let swRegistration = null;
    let refreshing = false;

    // Reload page once when new worker takes control
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });

    // Cập nhật trạng thái hiển thị của nút "Update App" khi có worker mới
    const markUpdateReady = (worker) => {
      waitingWorker = worker;
      if (btnUpdateApp) {
        btnUpdateApp.classList.add('is-ready');
        const textSpan = btnUpdateApp.querySelector('.update-btn-text');
        if (textSpan) textSpan.textContent = 'Update Ready';
        btnUpdateApp.setAttribute('title', 'Đã có bản cập nhật mới! Nhấn để áp dụng ngay.');
      }
      if (updateBanner) {
        updateBanner.classList.remove('hidden');
        void updateBanner.offsetWidth;
        updateBanner.classList.add('is-visible');
      }
      showSnackbar('Đã có bản cập nhật mới! Nhấn "Update Ready" để áp dụng.');
    };

    // Xử lý Force Update khi nhấn nút "Cập nhật / Update App" trên Top App Bar
    if (btnUpdateApp) {
      btnUpdateApp.addEventListener('click', async () => {
        // 1. Kiểm tra trạng thái mạng
        if (!navigator.onLine) {
          showSnackbar('Không thể cập nhật khi đang offline');
          return;
        }

        // Nếu đã có bản cập nhật đang chờ (is-ready) -> gửi skipWaiting để kích hoạt ngay
        if (waitingWorker) {
          waitingWorker.postMessage({ action: 'skipWaiting' });
          return;
        }

        // Đưa nút sang trạng thái đang cập nhật (spinner xoay, vô hiệu hoá click lặp)
        btnUpdateApp.classList.add('is-updating');
        const textSpan = btnUpdateApp.querySelector('.update-btn-text');
        const originalText = textSpan ? textSpan.textContent : 'Cập nhật';
        if (textSpan) textSpan.textContent = 'Updating...';

        try {
          if (swRegistration) {
            await swRegistration.update();
            if (swRegistration.waiting) {
              markUpdateReady(swRegistration.waiting);
              swRegistration.waiting.postMessage({ action: 'skipWaiting' });
              return;
            }
          }

          // Xóa cache cũ & reload ép tải bản mới nhất từ CDN/Server
          if ('caches' in window) {
            const cacheKeys = await caches.keys();
            await Promise.all(cacheKeys.map((key) => caches.delete(key)));
          }

          // Nếu có swRegistration, unregister để cài worker mới sạch sẽ
          if (swRegistration) {
            await swRegistration.unregister();
          }

          // Ép tải bản mới với tham số query forceUpdate
          window.location.href = window.location.pathname + '?forceUpdate=' + Date.now();
        } catch (err) {
          console.warn('[PWA] Force update error:', err);
          showSnackbar('Kiểm tra cập nhật thất bại, vui lòng thử lại.');
          btnUpdateApp.classList.remove('is-updating');
          if (textSpan) textSpan.textContent = originalText;
        }
      });
    }

    if (btnReloadUpdate) {
      btnReloadUpdate.addEventListener('click', () => {
        if (waitingWorker) {
          waitingWorker.postMessage({ action: 'skipWaiting' });
        } else {
          window.location.reload();
        }
      });
    }

    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./sw.js', { scope: './' })
        .then((reg) => {
          swRegistration = reg;
          console.log('[PWA] Service Worker registered with scope:', reg.scope);

          // If a worker is already waiting, prompt user
          if (reg.waiting) {
            markUpdateReady(reg.waiting);
            return;
          }

          // Listen for new workers installing
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (!newWorker) return;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                markUpdateReady(newWorker);
              }
            });
          });
        })
        .catch((err) => {
          console.warn('[PWA] Service Worker registration failed:', err);
        });
    });
  }

  // ---------------------------------------------------------------------------
  // Initialize App
  // ---------------------------------------------------------------------------
  initPWAInstallation();
  initServiceWorkerWithUpdatePrompt();

  populateYearStrip();
  // Initial stream: from previous year Jan to next year Dec (36 continuous months)
  renderCalendarStream(currentDeviceYear - 1, 1, currentDeviceYear + 1, 12);

  // Position immediately to current month block without animation
  const initialTodayBlock = document.getElementById(`month-${currentDeviceYear}-${currentDeviceMonth}`);
  if (initialTodayBlock) {
    calendarViewport.scrollTop = initialTodayBlock.offsetTop;
  }
  updateTodayButtonState();

})();
