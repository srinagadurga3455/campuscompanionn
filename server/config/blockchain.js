const { ethers } = require('ethers');

// Initialize provider and wallet only if private key is set
let provider, wallet;

if (process.env.PRIVATE_KEY && process.env.PRIVATE_KEY !== 'your_private_key_here') {
  provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
  wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
} else {
  console.warn('⚠️  Blockchain not configured - PRIVATE_KEY not set. Blockchain features disabled.');
}

// Contract ABIs (will be imported from blockchain/artifacts after deployment)
let StudentIdABI, CertificateABI, BadgeABI;

try {
  StudentIdABI = require('../../blockchain/artifacts/contracts/StudentId.sol/StudentId.json').abi;
  CertificateABI = require('../../blockchain/artifacts/contracts/Certificate.sol/Certificate.json').abi;
  BadgeABI = require('../../blockchain/artifacts/contracts/Badge.sol/Badge.json').abi;
} catch (error) {
  console.warn('⚠️  Blockchain contracts not compiled yet. Run "npx hardhat compile" in blockchain directory.');
}

// Contract instances
const getStudentIdContract = () => {
  if (!wallet) throw new Error('Blockchain not configured');
  if (!process.env.STUDENT_ID_CONTRACT_ADDRESS) throw new Error('StudentId contract not deployed');
  return new ethers.Contract(
    process.env.STUDENT_ID_CONTRACT_ADDRESS,
    StudentIdABI,
    wallet
  );
};

const getCertificateContract = () => {
  if (!wallet) throw new Error('Blockchain not configured');
  if (!process.env.CERTIFICATE_CONTRACT_ADDRESS) {
    console.warn('⚠️  Certificate contract not deployed. Using database only.');
    return null;
  }
  return new ethers.Contract(
    process.env.CERTIFICATE_CONTRACT_ADDRESS,
    CertificateABI,
    wallet
  );
};

const getBadgeContract = () => {
  if (!wallet) throw new Error('Blockchain not configured');
  if (!process.env.BADGE_CONTRACT_ADDRESS) {
    console.warn('⚠️  Badge contract not deployed. Using database only.');
    return null;
  }
  return new ethers.Contract(
    process.env.BADGE_CONTRACT_ADDRESS,
    BadgeABI,
    wallet
  );
};

module.exports = {
  provider,
  wallet,
  getStudentIdContract,
  getCertificateContract,
  getBadgeContract
};
