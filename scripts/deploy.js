const hre = require("hardhat");

async function main() {
  console.log("Deploy script started...");
  console.log("Network:", hre.network.name);

  const [deployer] = await hre.ethers.getSigners();
  const balance = await hre.ethers.provider.getBalance(deployer.address);

  console.log("Deploying from:", deployer.address);
  console.log("Balance:", hre.ethers.formatEther(balance));

  // Unlock time: 1 hour from now
  const unlockTime = Math.floor(Date.now() / 1000) + 3600;
  console.log("Unlock Time:", unlockTime);

  const Lock = await hre.ethers.getContractFactory("Lock");
  const lock = await Lock.deploy(unlockTime);

  await lock.waitForDeployment();
  const address = await lock.getAddress();

  console.log("Contract deployed to:", address);
}

main().catch((error) => {
  console.error("DEPLOY FAILED:", error);
  process.exitCode = 1;
});

