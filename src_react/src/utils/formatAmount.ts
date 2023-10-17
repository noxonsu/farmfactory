// @ts-nocheck
import BigNumber from 'bignumber.js'

const formatAmount: any = (amount: any, decimals: number) =>
  new BigNumber(amount).times(new BigNumber(10).pow(decimals)).toString(10)


export default formatAmount
