import _ from 'lodash';
import moment from 'moment-timezone';

function isBissexto(year: number) {
  return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
}

function generateRangeDatesFromYearStart(year: number) {
  const startDate = moment(`${year}-01-01`);
  const currentYear = moment().year();
  const isSameYear = currentYear === year;
  const endDate = isSameYear 
    ? moment() 
    : moment().endOf('year');

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
      day_of_week: startDate.get('day'),
      disabled: true
    })
  })

  for (let i = 0; compareDate.isBefore(endDate); i++) {
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
    description: 'Janurary'
  },
  {
    id: 1,
    description: 'Fevereiro'
  },
  {
    id: 2,
    description: 'Março'
  },
  {
    id: 3,
    description: 'Abril'
  },
  {
    id: 4,
    description: 'Maio'
  },
  {
    id: 5,
    description: 'Junho'
  },
  {
    id: 6,
    description: 'Julho'
  },
  {
    id: 7,
    description: 'Agosto'
  },
  {
    id: 8,
    description: 'Setembro'
  },
  {
    id: 9,
    description: 'Outubro'
  },
  {
    id: 10,
    description: 'Novembro'
  },
  {
    id: 11,
    description: 'Dezembro'
  }
]

export { isBissexto, generateRangeDatesFromYearStart, week }