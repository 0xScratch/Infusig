const hre = require("hardhat");

async function main() {
    const platform = await hre.ethers.deployContract("Platform");
    await platform.waitForDeployment()

    console.log("Platform deployed to:", platform.target);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})