import { useCallback, useMemo } from 'react';
import { Text, View } from '@tarojs/components';
import { clsx } from 'clsx';
import { CalendarItem, createCalendar } from '@shared/utils/date';
import { useConsistentFunc, useValue } from '@ui/hooks';
import styles from './index.module.scss';

interface CalendarProps {
  className?: string;
  value?: Date;
  onChange?: (v: Date) => void;
  markDates?: Date[];
}

const WEEK_NAMES = ['日', '一', '二', '三', '四', '五', '六'];

const Calendar = (props: CalendarProps) => {
  const { className, value, onChange, markDates = [] } = props;
  const today = useMemo(() => new Date(), []);
  // const [currentValue, setCurrentValue] = useValue<Date>({
  //   value,
  //   defaultValue: today,
  //   onChange,
  // });
  const handleChange = useConsistentFunc((v: Date) => {
    onChange?.(v);
  });
  const { currentYear, currentMonth, currentDate } = useMemo(() => {
    return {
      currentYear: value?.getFullYear(),
      currentMonth: value ? value.getMonth() + 1 : undefined,
      currentDate: value?.getDate(),
    };
  }, [value]);

  const { todayYear, todayMonth, todayDate } = useMemo(() => {
    return {
      todayYear: today.getFullYear(),
      todayMonth: today.getMonth() + 1,
      todayDate: today.getDate(),
    };
  }, [today]);

  const CalendarBodyThead = useMemo(() => {
    return (
      <View className={styles.row}>
        {WEEK_NAMES.map(week => {
          return (
            <View key={week} className={styles.col}>
              {week}
            </View>
          );
        })}
      </View>
    );
  }, []);

  const createCalendarRow = useCallback(
    (dateList: CalendarItem[], rowIdx: number) => {
      return (
        <View key={rowIdx} className={styles.row}>
          {dateList.map(dateItem => {
            const { year, month, date, isPrevMonth, isNextMonth } = dateItem;
            const isToday = year === todayYear && month === todayMonth && date === todayDate;
            const isSelected =
              year === currentYear && month === currentMonth && date === currentDate;
            const isMarked = markDates.some(item => {
              return (
                year === item.getFullYear() &&
                month === item.getMonth() + 1 &&
                date === item.getDate()
              );
            });
            return (
              <View
                key={`${year}_${month}_${date}`}
                className={clsx(styles.col, {
                  [styles.isOuterDate]: isPrevMonth || isNextMonth,
                  [styles.isToday]: isToday,
                  [styles.isSelected]: isSelected,
                  [styles.isMarked]: isMarked,
                })}
                onClick={() => {
                  if (isPrevMonth || isNextMonth) {
                    return;
                  }
                  handleChange(new Date(year, month - 1, date));
                }}
              >
                <View className={styles.colPlaceHolder}>
                  <View className={styles.colContent}>{date}</View>
                </View>
              </View>
            );
          })}
        </View>
      );
    },
    [
      currentDate,
      currentMonth,
      currentYear,
      markDates,
      handleChange,
      todayDate,
      todayMonth,
      todayYear,
    ],
  );

  const CalendarBodyTbody = useMemo(() => {
    const date2DList = createCalendar(currentYear ?? todayYear, currentMonth ?? todayMonth);
    return date2DList.map(createCalendarRow);
  }, [currentYear, todayYear, currentMonth, todayMonth, createCalendarRow]);

  return (
    <View className={clsx(styles.calendarWrapper, className)}>
      <View className={styles.calendarHeader}>
        <Text>
          {currentYear ?? todayYear}年{currentMonth ?? todayMonth}月
        </Text>
      </View>
      <View className={styles.calendarBody}>
        {CalendarBodyThead}
        {CalendarBodyTbody}
      </View>
    </View>
  );
};

export { Calendar };
