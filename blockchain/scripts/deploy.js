const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting deployment...\n");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());
  console.log();

  // Deploy StudentId contract
  console.log("📝 Deploying StudentId contract...");
  const StudentId = await hre.ethers.getContractFactory("StudentId");
  const studentId = await StudentId.deploy();
  await studentId.waitForDeployment();
  const studentIdAddress = await studentId.getAddress();
  console.log("✅ StudentId deployed to:", studentIdAddress);
  console.log();

  // Deploy Certificate contract
  console.log("🏆 Deploying Certificate contract...");
  const Certificate = await hre.ethers.getContractFactory("Certificate");
  const certificate = await Certificate.deploy();
  await certificate.waitForDeployment();
  const certificateAddress = await certificate.getAddress();
  console.log("✅ Certificate deployed to:", certificateAddress);
  console.log();

  // Deploy Badge contract
  console.log("🎖️ Deploying Badge contract...");
  const Badge = await hre.ethers.getContractFactory("Badge");
  const badge = await Badge.deploy();
  await badge.waitForDeployment();
  const badgeAddress = await badge.getAddress();
  console.log("✅ Badge deployed to:", badgeAddress);
  console.log();

  // Save contract addresses
  const addresses = {
    network: hre.network.name,
    studentId: studentIdAddress,
    certificate: certificateAddress,
    badge: badgeAddress,
    deployer: deployer.address,
    deployedAt: new Date().toISOString()
  };

  const addressesPath = path.join(__dirname, "../deployed-addresses.json");
  fs.writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));
  console.log("📄 Contract addresses saved to:", addressesPath);
  console.log();

  // Update server .env template
  console.log("📝 Updating server .env.example with contract addresses...");
  const serverEnvPath = path.join(__dirname, "../../server/.env.example");
  if (fs.existsSync(serverEnvPath)) {
    let envContent = fs.readFileSync(serverEnvPath, "utf8");
    envContent = envContent.replace(/STUDENT_ID_CONTRACT_ADDRESS=.*/, `STUDENT_ID_CONTRACT_ADDRESS=${studentIdAddress}`);
    envContent = envContent.replace(/CERTIFICATE_CONTRACT_ADDRESS=.*/, `CERTIFICATE_CONTRACT_ADDRESS=${certificateAddress}`);
    envContent = envContent.replace(/BADGE_CONTRACT_ADDRESS=.*/, `BADGE_CONTRACT_ADDRESS=${badgeAddress}`);
    fs.writeFileSync(serverEnvPath, envContent);
    console.log("✅ Server .env.example updated");
  }
  console.log();

  console.log("🎉 Deployment completed successfully!");
  console.log("\n=== Contract Addresses ===");
  console.log("StudentId:", studentIdAddress);
  console.log("Certificate:", certificateAddress);
  console.log("Badge:", badgeAddress);
  console.log("\n⚠️ Make sure to update your server/.env file with these addresses!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
