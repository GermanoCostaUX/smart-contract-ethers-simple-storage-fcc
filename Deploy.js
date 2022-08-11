// synchronous [solidity]
// asynchronous [javascript]

const ethers = require("ethers")
const { ConstructorFragment } = require("ethers/lib/utils")
const fs = require("fs-extra")
require("dotenv").config()

async function main() {
    // compile them into our code
    // compile them separately
    // http://127.0.0.1:7545
    console.log(process.env.PRIVATE_KEY)
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL) // connect my script to my local blockchain.
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

    /* Encrypted Synthax */
    // const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8");
    // let wallet = new ethers.Wallet.fromEncryptedJsonSync(
    //   encryptedJson,
    //   process.env.PRIVATE_KEY_PASSWORD
    // );
    // wallet = await wallet.connect(provider);

    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8")
    const binary = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf8"
    )
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
    console.log("Deploying, please wait")
    const contract = await contractFactory.deploy() // The command "await" informs the code to wait for contract to deploy.
    console.log(contract)
    const transactionReceipt = await contract.deployTransaction.wait(1)
    console.log("Here is the deployment transaction (Transaction Response): ")
    console.log(contract.deployTransaction)
    console.log("Here is the Transaction Receipt: ")
    console.log(transactionReceipt)

    await contract.deployTransaction.wait(1)
    console.log(`Contract Adress: ${contract.address}`)
    // Get number
    const currentFavoriteNumber = await contract.retrieve()
    console.log(currentFavoriteNumber)
    console.log(`Current Favorite Number: ${currentFavoriteNumber.toString()}`)
    const transactionResponse = await contract.store("7")
    const transactionReceipt1 = await transactionResponse.wait(1)
    const updatedFavoriteNumber = await contract.retrieve()
    console.log(`Updated Favorite Number is: ${updatedFavoriteNumber}`)
    console.log(
        `The contract number is: ${process.env.PRIVATE_KEY}, from the .env`
    )
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
