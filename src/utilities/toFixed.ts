const toFixed = (num: number | string, decimal = 2) => {
  const base = 10 ** decimal
  return Number((parseInt(`${Number(num) * base}`, 10) / base).toFixed(decimal))
}

export default toFixed
