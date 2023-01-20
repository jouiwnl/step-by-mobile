import dayjs from 'dayjs'

export function generateRangeDatesFromYearStart(year: number) {
  const startDate = dayjs().year(year).startOf('year')
  const currentYear = dayjs().startOf('year').get('year');
  const isSameYear = currentYear === year;
  const endDate = isSameYear ? new Date() : dayjs().year(year).endOf('year').toDate();

  let dateRange = []
  let compareDate = startDate

  const weekDaysByStartDate = Array.from({ length: startDate.get('day') })
    .map((_, index) => {
      return {
        index: index,
        day_of_week: index + 1
      }
    });

  weekDaysByStartDate.reverse().forEach(day => {
    const newDate = startDate.subtract(day.day_of_week, 'day');

    dateRange.push({
      id: newDate.toISOString(),
      date: newDate.toDate(),
      day_of_week: startDate.get('day'),
      disabled: true
    })
  })

  while (compareDate.isBefore(endDate)) {
    dateRange.push({
      id: compareDate.toISOString(),
      date: compareDate.toDate(),
      day_of_week: compareDate.get('day'),
      disabled: false
    })

    compareDate = compareDate.add(1, 'day')
  }

  return dateRange
}