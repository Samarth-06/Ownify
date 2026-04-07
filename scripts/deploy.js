import pkg from "hardhat";
const { ethers } = pkg;
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local
const envPath = path.join(process.cwd(), ".env.local");
dotenv.config({ path: envPath });

async function main() {
  console.log("🚀 Deploying CopyrightRegistry to Polygon Amoy...\n");

  const privateKey = process.env.PRIVATE_KEY;
  const rpcUrl = process.env.POLYGON_AMOY_RPC_URL || "https://rpc-amoy.polygon.technology";

  if (!privateKey || privateKey.length !== 64) {
    throw new Error(`❌ Invalid PRIVATE_KEY (${privateKey?.length || 0} chars, need 64)`);
  }

  console.log(`✓ Private key: ${privateKey.substring(0, 10)}...`);
  console.log(`✓ RPC: ${rpcUrl}\n`);

  try {
    // Create provider and signer manually
    const provider = new ethers.JsonRpcProvider(rpcUrl, 80002);
    const wallet = new ethers.Wallet(privateKey, provider);

    console.log(`📍 Account: ${wallet.address}`);

    const balance = await provider.getBalance(wallet.address);
    const balanceMAT = ethers.formatEther(balance);
    console.log(`💰 Balance: ${balanceMAT} MATIC\n`);

    if (parseFloat(balanceMAT) < 0.01) {
      throw new Error("⚠️  Insufficient balance! Get test MATIC from https://faucet.polygon.technology/");
    }

    // Get contract factory
    const CopyrightRegistry = await ethers.getContractFactory("CopyrightRegistry", wallet);

    console.log("📦 Deploying contract...");
    const contract = await CopyrightRegistry.deploy();
    console.log(`📝 TX: ${contract.deploymentTransaction()?.hash}`);

    console.log("⏳ Waiting for confirmation (30-60 seconds)...");
    const deployedContract = await contract.waitForDeployment();

    const contractAddress = await deployedContract.getAddress();
    console.log(`\n✅ SUCCESS!\n`);
    console.log(`📄 Contract: ${contractAddress}`);
    console.log(`🔗 PolygonScan: https://amoy.polygonscan.com/address/${contractAddress}`);

    // Save to .env.local
    let envContent = fs.readFileSync(envPath, "utf-8");
    envContent = envContent.replace(/VITE_REACT_APP_CONTRACT_ADDRESS=.*/g, "");
    envContent = envContent.trimEnd() + `\nVITE_REACT_APP_CONTRACT_ADDRESS=${contractAddress}\n`;
    fs.writeFileSync(envPath, envContent);

    console.log(`\n💾 Saved to .env.local`);
    console.log("\n✨ Ready for testing!");
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    if (error.code === "INVALID_PRIVATE_KEY") {
      console.error("   → Private key format is invalid");
    }
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
