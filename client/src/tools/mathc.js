import * as math from 'mathjs'

export const mathc = {
  addList: (list) => {
    return math.number(
      list.reduce((a, b) => math.add(math.bignumber(a), math.bignumber(b)), 0)
    )
  },
  add: (a, b) => {
    return math.number(math.add(math.bignumber(a), math.bignumber(b)))
  },
  subtract: (a, b) => {
    return math.number(math.subtract(math.bignumber(a), math.bignumber(b)))
  },
  multiply: (a, b) => {
    return math.number(math.multiply(math.bignumber(a), math.bignumber(b)))
  },
  divide: (a, b) => {
    return math.number(math.divide(math.bignumber(a), math.bignumber(b)))
  },
  round: (a, bit = 2) => {
    return math.round(a, bit)
  },
  abs: (n) => math.abs(n),
  formatRate: function (num, bit = 2) {
    const str = this.multiply(num, 100) + ''
    const dotIndex = str.indexOf('.')
    if (num >= 1 || dotIndex === -1) {
      return str + '%'
    } else {
      return str.slice(0, dotIndex + bit + 1) + '%'
    }
  }
}
