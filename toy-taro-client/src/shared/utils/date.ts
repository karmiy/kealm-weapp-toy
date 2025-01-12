import { set } from 'date-fns';

export type CalendarItem = {
  date: number;
  year: number;
  month: number;
  day: number;
  dayNum: number;
  isPrevMonth: boolean;
  isNextMonth: boolean;
};

export function createCalendar(year: number, month: number) {
  const ROW_COUNT = 6,
    COL_COUNT = 7,
    TOTAL_COUNT = ROW_COUNT * COL_COUNT; // 共 6 * 7 = 42
  let currentCount = 0;
  const calendar: CalendarItem[][] = [];
  function addCalendar(item: CalendarItem, unShift = false) {
    if (currentCount % COL_COUNT === 0) {
      unShift ? calendar.unshift([item]) : calendar.push([item]);
    } else {
      unShift ? calendar[0].unshift(item) : calendar[calendar.length - 1].push(item);
    }
    currentCount++;
  }
  // 构造该月历的第一天 最后一天
  const firstDay = set(new Date(year, month - 1, 1), {
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });

  // 向前补全第一行在1号前的日期
  const loopDay = new Date(firstDay);
  while (loopDay.getDay() !== 0) {
    loopDay.setDate(loopDay.getDate() - 1);
    addCalendar(
      {
        date: loopDay.getDate(),
        year: loopDay.getFullYear(),
        month: loopDay.getMonth() + 1,
        day: loopDay.getDay(),
        dayNum: loopDay.getDay() || 7,
        isPrevMonth: true,
        isNextMonth: false,
      },
      true,
    );
  }
  // reset -01
  loopDay.setTime(firstDay.getTime());

  while (currentCount < TOTAL_COUNT) {
    const _year = loopDay.getFullYear(),
      _month = loopDay.getMonth() + 1;
    addCalendar({
      date: loopDay.getDate(),
      year: _year,
      month: _month,
      day: loopDay.getDay(),
      dayNum: loopDay.getDay() || 7,
      isPrevMonth: (_year === year && _month < month) || _year < year,
      isNextMonth: (_year === year && _month > month) || _year > year,
    });
    loopDay.setDate(loopDay.getDate() + 1);
  }
  return calendar;
}
