import dayjs from 'dayjs';

function isBissexto(year: number) {
  return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
}

function generateRangeDatesFromYearStart(year: number) {
  const startDate = dayjs().year(year).startOf('year').tz('America/Sao_Paulo')
  const currentYear = dayjs().startOf('year').get('year');
  const isSameYear = currentYear === year;
  const endDate = isSameYear ? dayjs().year(year).tz('America/Sao_Paulo').toDate() : dayjs().year(year).endOf('year').tz('America/Sao_Paulo').toDate();

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
    description: 'Domingo'
  },
  {
    id: 1,
    description: 'Segunda-feira'
  },
  {
    id: 2,
    description: 'Terça-feira'
  },
  {
    id: 3,
    description: 'Quarta-feira'
  },
  {
    id: 4,
    description: 'Quinta-feira'
  },
  {
    id: 5,
    description: 'Sexta-feira'
  },
  {
    id: 6,
    description: 'Sábado'
  }
]

export { isBissexto, generateRangeDatesFromYearStart, week }