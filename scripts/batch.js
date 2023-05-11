const fs = require("fs")
const { ethers } = require("hardhat")
const chalk = require("chalk")

const SlackNotify = require("slack-notify")

// Import as ES Module:

const slack = SlackNotify(
    "https://hooks.slack.com/services/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"
)

// get transaction from db and change status to processing
async function getTransactionsAndUpdateDB() {
    try {
        const contents = fs.readFileSync("transactions.json", "utf8")
        const transactions = JSON.parse(contents).txList
        const contractAddress = JSON.parse(contents).contractAddress
        return { transactions, contractAddress }
    } catch (error) {
        console.error(
            `Error while getting transactions and updating DB: ${error}`
        )
        throw error
    }
}

async function validateTransactionData(transactions) {
    const provider = ethers.provider
    const validatedHash = []
    const notvalidatedHash = []
    for (const transaction of transactions) {
        try {
            const txBlockchain = await provider.getTransactionReceipt(
                transaction.hash
            )
            const isValid =
                txBlockchain &&
                txBlockchain.from === transaction.from &&
                txBlockchain.logs[0].data === transaction.data &&
                txBlockchain.blockNumber === transaction.blockNumber &&
                txBlockchain.transactionIndex ===
                    transaction.transactionIndex &&
                txBlockchain.gasUsed.eq(transaction.gasUsed)

            isValid
                ? validatedHash.push(transaction.hash)
                : notvalidatedHash.push({ txNotOnchain: transaction.hash })
        } catch (error) {
            console.log("Error validating the transaction:", error)
            notvalidatedHash.push({ txNotOnchain: transaction.hash })
        }
    }
    console.log("here")
    try {
        await slack.alert({
            text: validatedHash.toString(),
            attachments: [
                {
                    fallback: "Required Fallback String",
                    color: "#0dff00",
                    fields: validatedHash.toString().replaceAll(",", "\n"),
                },
            ],
        })
    } catch (error) {
        console.log("Error sending message to Slack:", error)
    }
    console.log("hereeee")

    return { validatedHash, notvalidatedHash }
}
async function mint(
    minter,
    contractAddress,
    transactions,
    validatedHash,
    notvalidatedHash
) {
    try {
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
                            ethers.utils.parseUnits(
                                transaction.tokenAmount.toString(),
                                "ether"
                            )
                        )
                    const txReceipt = await transferToken.wait()
                    totalTokenSent += transaction.tokenAmount
                } catch (error) {
                    console.error(
                        `Transaction ${transaction.hash} failed: ${error}`
                    )
                    notvalidatedHash.push(transaction.hash)
                }
            }
        }

        console.log("validatedHash")
        console.log(validatedHash)
        console.log("notvalidatedHash")
        console.log(notvalidatedHash)
        console.log("totalBefore")
        console.log(totalBefore)
        console.log("totalTokenSent")
        console.log(totalTokenSent)

        const totalAfter = await token.balanceOf(minter.address)
        console.log("totalAfter")
        console.log(totalAfter)
    } catch (error) {
        console.log("Error in minting tokens: ", error)
    }
}

async function batch(minter) {
    try {
        const { transactions, contractAddress } =
            await getTransactionsAndUpdateDB()

        const { validatedHash, notvalidatedHash } =
            await validateTransactionData(transactions)
        await mint(
            minter,
            contractAddress,
            transactions,
            validatedHash,
            notvalidatedHash
        )
    } catch (error) {
        console.error(`Error in batch(): ${error}`)
    }
}

// main().catch((error) => {
//     console.error(error)
//     process.exitCode = 1
// })

module.exports = {
    batch,
}
