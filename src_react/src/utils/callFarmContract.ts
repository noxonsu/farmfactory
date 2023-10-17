// @ts-nocheck
import { farmAbi } from './createContracts'
import Web3 from 'web3'
import { calcSendArgWithFee } from "./calcSendArgWithFee"
import { BigNumber } from 'bignumber.js'

const callFarmContract = (options) => {
  return new Promise( async (resolve, reject) => {
    const {
      provider,
      account,
      contractAddress,
      method,
      args,
      weiAmount
    } = options
    const onTrx = options.onTrx || (() => {})
    const onSuccess = options.onSuccess || (() => {})
    const onError = options.onError || (() => {})
    const onFinally = options.onFinally || (() => {})

    const activeWeb3 = new Web3(provider)

    activeWeb3.eth.getAccounts().then(async (accounts) => {
      const activeWallet = accounts[0]
      if (accounts.length>0) {
        const contract = new activeWeb3.eth.Contract(farmAbi, contractAddress)

        const sendArgs = await calcSendArgWithFee(
          activeWallet,
          contract,
          method,
          args || [],
          weiAmount
        )

        const gasPrice = await activeWeb3.eth.getGasPrice()
        sendArgs.gasPrice = gasPrice

        let txHash
        contract.methods[method](...(args || []))
          .send(sendArgs)
          .on('transactionHash', (hash) => {
            txHash = hash
            onTrx(hash)
          })
          .on('error', (error) => {
            console.log('transaction error:', error)
            onError(error)
            reject(error)
          })
          .on('receipt', (receipt) => {
            onSuccess(receipt)
          })
          .then((res) => {
            resolve(res)
            onFinally(res)
          }).catch((err) => {
            if(err.message.includes('not mined within 50 blocks')) {
              const handle = setInterval(() => {
                activeWeb3.eth.getTransactionReceipt(txHash).then((resp) => {
                  // @to-do - process logs
                  if(resp != null && resp.blockNumber > 0) {
                    clearInterval(handle)
                    resolve(resp)
                    onSuccess(resp)
                  }
                })
              }, 1000)
            } else {
              onError(err)
              reject(err)
            }
          })
      } else {
        reject('NO_ACTIVE_ACCOUNT')
      }
    }).catch((err) => {
      console.log('>>> callFarmContract', err)
      reject(err)
    })
  })
        
}


export default callFarmContract