function isBissexto(year: number) {
  return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
}

export { isBissexto }