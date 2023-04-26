// imports
const { ethers, run, network } = require("hardhat")

// async main
async function main(params) {
    let ContractFactory
    let contract
    let admin

    if (params.address === "") {
        ContractFactory = await ethers.getContractFactory(params.name)
        console.log("🚀 Deploying contract... 🚀")
        contract = await ContractFactory.deploy(params.args)
        await contract.deployed()
    } else {
        console.log("🚀 Getting deployed contract... 🚀")

        ContractFactory = await ethers.getContractFactory(params.name)
        contract = ContractFactory.attach(params.address)
    }

    console.log(`✨ Deployed contract to: ${contract.address} ✨`)

    if (network.config.chainId !== 31337 && process.env.ETHERSCAN_API_KEY) {
        if (params.verify) {
            if (!params.address) {
                console.log("📝 Waiting for block confirmations... 📝")
                await contract.deployTransaction.wait(3)
            }
            await verify(contract.address, params.args)
        }
    }

    console.log("✨ All done !! ✨");
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
