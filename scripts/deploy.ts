import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("🚀 Deploying CopyrightRegistry to Polygon Amoy...\n");

  const [deployer] = await ethers.getSigners();
  console.log(`📍 Deploying with account: ${deployer.address}`);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`💰 Balance: ${ethers.formatEther(balance)} MATIC\n`);

  // Compile the contract
  console.log("📦 Compiling contract...");
  const CopyrightRegistry = await ethers.getContractFactory("CopyrightRegistry");

  // Deploy
  console.log("🔗 Deploying...");
  const copyrightRegistry = await CopyrightRegistry.deploy();
  await copyrightRegistry.waitForDeployment();

  const contractAddress = await copyrightRegistry.getAddress();
  console.log(`✅ Deployed successfully!\n`);
  console.log(`📄 Contract Address: ${contractAddress}`);
  console.log(`🔗 Polygon Amoy Explorer: https://amoy.polygonscan.com/address/${contractAddress}`);

  // Save contract address to .env.local
  const envLocalPath = path.join(process.cwd(), ".env.local");
  let envContent = "";

  if (fs.existsSync(envLocalPath)) {
    envContent = fs.readFileSync(envLocalPath, "utf-8");
    // Remove old CONTRACT_ADDRESS if exists
    envContent = envContent.replace(/VITE_REACT_APP_CONTRACT_ADDRESS=.*/g, "");
  }

  envContent += `\nVITE_REACT_APP_CONTRACT_ADDRESS=${contractAddress}\n`;
  fs.writeFileSync(envLocalPath, envContent);

  console.log(`\n💾 Contract address saved to .env.local`);
  console.log("\n⚠️  Next steps:");
  console.log("1. Get test MATIC from: https://faucet.polygon.technology/");
  console.log("2. Add the contract address to your VITE_REACT_APP_CONTRACT_ADDRESS env var (done!)");
  console.log("3. Verify the contract on PolygonScan (optional)");
  console.log("\nGas used for deployment:");

  // Get transaction receipt for gas info
  const receipt = await ethers.provider.getTransactionReceipt(
    copyrightRegistry.deploymentTransaction()?.hash || ""
  );
  if (receipt) {
    const txCost = ethers.formatEther(
      receipt.gasUsed * receipt.gasPrice
    );
    console.log(`Gas: ${receipt.gasUsed}, Cost: ${txCost} MATIC`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
