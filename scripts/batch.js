const fs = require("fs")
const { ethers } = require("hardhat")
const chalk = require("chalk")

// get transaction from db and change status to processing
async function getTransactionsAndUpdateDB() {
    const contents = fs.readFileSync("transactions.json", "utf8")
    const transactions = JSON.parse(contents).txList
    const contractAddress = JSON.parse(contents).contractAddress
    return { transactions, contractAddress }
}

async function validateTransactionData(transactions) {
    const provider = ethers.provider
    const validatedHash = []
    const notvalidatedHash = []
    for (const transaction of transactions) {
        const txBlockchain = await provider.getTransactionReceipt(
            transaction.hash
        )
        const isValid =
            txBlockchain &&
            txBlockchain.from === transaction.from &&
            txBlockchain.logs[0].data === transaction.data &&
            txBlockchain.blockNumber === transaction.blockNumber &&
            txBlockchain.transactionIndex === transaction.transactionIndex &&
            txBlockchain.gasUsed.eq(transaction.gasUsed)

        isValid
            ? validatedHash.push(transaction.hash)
            : notvalidatedHash.push({ txNotOnchain: transaction.hash })
    }

    return { validatedHash, notvalidatedHash }
}

async function mint(
    minter,
    contractAddress,
    transactions,
    validatedHash,
    notvalidatedHash
) {
    // const wallet = new ethers.Wallet(
    //     "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
    //     provider
    // )
    ContractFactory = await ethers.getContractFactory("Token")
    token = ContractFactory.attach(contractAddress)
    let totalTokenSent = 0
    const totalBefore = await token.balanceOf(minter.address)
    for (const transaction of transactions) {
        if (validatedHash.includes(transaction.hash)) {
            try {
                const transferToken = await token
                    .connect(minter)
                    .transfer(
                        transaction.from,
                        ethers.utils.parseUnits(transaction.tokenAmount.toString(), "ether")
                    )
                const txReceipt = await transferToken.wait()
                totalTokenSent += transaction.tokenAmount
            } catch (error) {
                console.error(
                    `Transaction ${transaction.hash} failed: ${error}`
                )
                notvalidatedHash.push({
                    txMintingFailed: {
                        txOrigin: transaction.hash,
                        txMint: transaction.hash,
                        error: error,
                    },
                })
            }
        }
    }

    console.log("validatedHash")
    console.log(validatedHash)
    console.log("notvalidatedHash")
    console.log(notvalidatedHash)
    console.log('totalBefore')
    console.log(totalBefore)
    console.log('totalTokenSent')
    console.log(totalTokenSent)

    const totalAfter = await token.balanceOf(minter.address)
    console.log('totalAfter')
    console.log(totalAfter)

}
async function batch(minter) {
    const { transactions, contractAddress } = await getTransactionsAndUpdateDB()

    const { validatedHash, notvalidatedHash } = await validateTransactionData(
        transactions
    )
    await mint(
        minter,
        contractAddress,
        transactions,
        validatedHash,
        notvalidatedHash
    )
}

// main().catch((error) => {
//     console.error(error)
//     process.exitCode = 1
// })

module.exports = {
    batch,
}
