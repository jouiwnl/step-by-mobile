import _ from 'lodash';
import moment from 'moment-timezone';
import { timezone } from '../lib/localization';

function isBissexto(year: number) {
  return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
}

function generateRangeDatesFromYearStart(year: number) {
  const startDate = moment(`${year}-01-01`).tz(timezone);
  const endDate = moment(startDate).tz(timezone).endOf('year');

  let dateRange = []
  let compareDate = startDate

  const weekDaysByStartDate = Array.from({ length: startDate.get('day') })
    .map((_, index) => {
      return {
        index: index,
        day_of_week: index + 1
      }
    });

  weekDaysByStartDate.forEach(day => {
    const newDate = startDate.subtract(day.day_of_week, 'day');

    dateRange.push({
      id: newDate.toISOString(),
      date: newDate.toDate(),
      day_of_week: newDate.get('day'),
      month:  months.find(m => m.id === newDate.get('month'))?.description,
      parsed_date: newDate.format('YYYYMMDD'),
      disabled: true
    })
  })

  for (let i = 0; compareDate.isBefore(endDate); i++) {
    dateRange.push({
      id: compareDate.toISOString(),
      date: compareDate.toDate(),
      day_of_week: compareDate.get('day'),
      month:  months.find(m => m.id === compareDate.get('month'))?.description,
      parsed_date: compareDate.format('YYYYMMDD'),
      disabled: false
    })

    compareDate = compareDate.add(1, 'day')
  }

  return dateRange
}

const week = [
  {
    id: 0,
    description: 'Sunday'
  },
  {
    id: 1,
    description: 'Monday'
  },
  {
    id: 2,
    description: 'Tuesday'
  },
  {
    id: 3,
    description: 'Wednesday'
  },
  {
    id: 4,
    description: 'Thursday'
  },
  {
    id: 5,
    description: 'Friday'
  },
  {
    id: 6,
    description: 'Saturday'
  }
]

const months = [
  {
    id: 0,
    description: 'January',
    days: 31
  },
  {
    id: 1,
    description: 'February',
    days: 28
  },
  {
    id: 2,
    description: 'March',
    days: 31
  },
  {
    id: 3,
    description: 'April',
    days: 30
  },
  {
    id: 4,
    description: 'May',
    days: 31
  },
  {
    id: 5,
    description: 'June',
    days: 30
  },
  {
    id: 6,
    description: 'July',
    days: 31
  },
  {
    id: 7,
    description: 'August',
    days: 31
  },
  {
    id: 8,
    description: 'September',
    days: 30
  },
  {
    id: 9,
    description: 'October',
    days: 31
  },
  {
    id: 10,
    description: 'November',
    days: 30
  },
  {
    id: 11,
    description: 'December',
    days: 31
  }
]

export { isBissexto, generateRangeDatesFromYearStart, week, months }