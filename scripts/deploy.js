// imports
const { ethers, run, network } = require("hardhat")

// async main
async function main(params) {
    let ContractFactory
    let contractUSDT
    let contractUSDC
    let contractBUSD

    ContractFactory = await ethers.getContractFactory(params.name)

    console.log("🚀 Deploying StableUSDT... 🚀")
    contractUSDT = await ContractFactory.deploy("StableUSDT", "USDT")
    await contractUSDT.deployed()

    console.log("🚀 Deploying StableUSDC... 🚀")
    contractUSDC = await ContractFactory.deploy("StableUSDC", "USDC")
    await contractUSDC.deployed()
    console.log("🚀 Deploying StableBUSD... 🚀")

    contractBUSD = await ContractFactory.deploy("StableBUSD", "BUSD")
    await contractBUSD.deployed()

    console.log(`✨ Deployed contractUSDT to: ${contractUSDT.address} ✨`)
    console.log(`✨ Deployed contractUSDC to: ${contractUSDC.address} ✨`)
    console.log(`✨ Deployed contractBUSD to: ${contractBUSD.address} ✨`)

    const txcontractUSDT = await contractUSDT.mint(100000000000000000000n)
    await txcontractUSDT.wait()

    const txcontractUSDC = await contractUSDC.mint(10000000000000000000n)
    await txcontractUSDC.wait()

    const txcontractBUSD = await contractBUSD.mint(1000000000000000000n)
    await txcontractBUSD.wait()

    console.log("✨ All done !! ✨")
}

const verify = async (contractAddress, args) => {
    console.log("📝Verifying contract... 📝")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified!")
        } else {
            console.log(e)
        }
    }
}

const params = {
    name: "Token",
    address: "",
    args: [],
    verify: true,
}

main(params)
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
