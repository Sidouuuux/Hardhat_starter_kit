const fs = require("fs")
const { ethers } = require("hardhat")
const chalk = require("chalk")
const { batch } = require("./batch.js")

const TOKEN_PRICE = ethers.utils.parseEther("0.2")

async function minting() {
    const [owner, minter, ...accounts] = await ethers.getSigners()

    console.log(chalk.yellow("Deploying USDT contract..."))
    const USDT = await ethers.getContractFactory("Token")
    const usdt = await USDT.deploy("Stablecoin", "USDT")
    console.log(chalk.green(`USDT contract address: ${usdt.address}`))

    console.log(chalk.yellow("Deploying Token contract..."))
    const Token = await ethers.getContractFactory("Token")
    const token = await Token.deploy("Token", "TKN")
    console.log(chalk.green(`Token contract address: ${token.address}`))

    const tx = await token
        .connect(minter)
        .mint(ethers.utils.parseUnits("1000", "ether"))
    await tx.wait()

    // Mint 100 USDT for each account
    console.log(chalk.green("Minting stablecoin..."))

    for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i]
        const tx = await usdt
            .connect(account)
            .mint(ethers.utils.parseUnits("100", "ether"))
        const txReceipt = await tx.wait()
    }

    console.log(chalk.green("Buying tokens..."))
    const txList = []
    let total = 0
    for (const account of accounts) {
        const tokenAmount = Math.floor(Math.random() * 10) + 1
        const usdtAmount = tokenAmount * TOKEN_PRICE
        const transferUSDT = await usdt
            .connect(account)
            .transfer(owner.address, usdtAmount.toString())
        const txReceipt = await transferUSDT.wait()

        const txInfo = {
            hash: txReceipt.transactionHash,
            value: usdtAmount.toString(),
            from: account.address,
            to: owner.address,
            gasUsed: txReceipt.gasUsed,
            transactionIndex: txReceipt.transactionIndex,
            blockNumber: txReceipt.blockNumber,
            data: txReceipt.logs[0].data,
            tokenPrice: TOKEN_PRICE,
            tokenAmount: tokenAmount,
        }

        txList.push(txInfo)
        total += usdtAmount
    }

    console.log(chalk.green("Transactions done!"))
    fs.writeFileSync(
        "transactions.json",
        JSON.stringify({ txList: txList, contractAddress: token.address })
    )
    // return
    await batch(minter)
}
async function main() {
    const [owner, minter, ...accounts] = await ethers.getSigners()

    if (fs.existsSync("./transactions.json")) {
        await batch(minter)
    } else {
        console.log("Running prebatch")
        await minting()
    }
}
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
