const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const feeRecipient = deployer.address; // change later if you want
  const feeBps = 250; // 2.5%

  const M = await hre.ethers.getContractFactory("NovaTokMarketplace");
  const m = await M.deploy(feeRecipient, feeBps);
  await m.waitForDeployment();

  console.log("Marketplace deployed:", await m.getAddress());
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
