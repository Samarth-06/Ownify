import { ethers } from 'ethers';
import { toast } from 'sonner';
import { CHAIN_CONFIG } from '@/config/web3';

export interface CopyrightData {
  id: number;
  artist: string;
  title: string;
  description: string;
  fileHash: string;
  ipfsHash: string;
  licenseType: string;
  timestamp: number;
}

/**
 * Get recommended gas prices for Polygon Amoy
 */
export async function getRecommendedGasPrices(provider: ethers.Provider) {
  try {
    const feeData = await provider.getFeeData();

    // Polygon Amoy minimum gas requirements
    const minGasTip = ethers.parseUnits('25', 'gwei'); // Minimum 25 Gwei based on error
    const minMaxFee = ethers.parseUnits('40', 'gwei'); // Safe maximum

    const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas
      ? feeData.maxPriorityFeePerGas < minGasTip
        ? minGasTip
        : feeData.maxPriorityFeePerGas
      : minGasTip;

    const maxFeePerGas = feeData.maxFeePerGas
      ? feeData.maxFeePerGas < minMaxFee
        ? minMaxFee
        : feeData.maxFeePerGas
      : minMaxFee;

    return {
      maxPriorityFeePerGas,
      maxFeePerGas,
      gasLimit: ethers.parseUnits('380000', 'wei'),
    };
  } catch (error) {
    console.error('Failed to get gas prices:', error);
    // Return safe defaults
    return {
      maxPriorityFeePerGas: ethers.parseUnits('30', 'gwei'),
      maxFeePerGas: ethers.parseUnits('50', 'gwei'),
      gasLimit: ethers.parseUnits('380000', 'wei'),
    };
  }
}

/**
 * Register a copyright on-chain with proper gas settings
 */
export async function registerCopyrightOnChain(
  contract: ethers.Contract,
  data: {
    title: string;
    description: string;
    fileHash: string;
    ipfsHash: string;
    licenseType: string;
  }
): Promise<{ transactionHash: string; copyrightId: string }> {
  try {
    toast.loading('Registering copyright on blockchain...');

    // Get the signer to access provider for gas price
    const signer = await contract.runner?.getAddress ? contract.runner : null;
    if (!signer) {
      throw new Error('Signer not available');
    }

    // Get recommended gas prices
    const gasConfig = await getRecommendedGasPrices(provider);
    const maxPriorityFeePerGas = gasConfig.maxPriorityFeePerGas;
    const maxFeePerGas = gasConfig.maxFeePerGas;
    const gasLimit = gasConfig.gasLimit;

    console.log('📊 Gas settings:', {
      maxPriorityFeePerGas: ethers.formatUnits(maxPriorityFeePerGas, 'gwei'),
      maxFeePerGas: ethers.formatUnits(maxFeePerGas, 'gwei'),
    });

    // Send transaction with explicit gas settings
    const tx = await contract.registerCopyright(
      data.title,
      data.description,
      data.fileHash,
      data.ipfsHash,
      data.licenseType,
      {
        maxPriorityFeePerGas,
        maxFeePerGas,
        gasLimit,
      }
    );

    toast.loading(`Waiting for confirmation (TX: ${tx.hash.slice(0, 6)}...)...`);
    const receipt = await tx.wait();

    if (!receipt) {
      throw new Error('Transaction failed');
    }

    // Extract copyright ID from events
    const event = receipt.events?.find((e: any) => e.eventName === 'CopyrightRegistered');
    const copyrightId = event?.args?.[0]?.toString() || '0';

    toast.dismiss();
    toast.success('Copyright registered successfully! 🎉');

    return {
      transactionHash: receipt.hash || tx.hash,
      copyrightId,
    };
  } catch (error: any) {
    toast.dismiss();

    // Parse error message for gas-related issues
    let errorMessage = error?.reason || error?.message || 'Registration failed';

    if (errorMessage.includes('gas')) {
      errorMessage = 'Gas price too low. Please try again - network will use automatic gas estimation.';
      toast.info('💡 Tip: Increase MetaMask gas settings if this persists');
    }

    toast.error(`Registration failed: ${errorMessage}`);
    console.error('Full error:', error);
    throw error;
  }
}

/**
 * Fetch copyright details by ID
 */
export async function fetchCopyrightById(
  contract: ethers.Contract,
  copyrightId: string | number
): Promise<CopyrightData> {
  try {
    const copyright = await contract.getCopyright(copyrightId);

    return {
      id: Number(copyright.id),
      artist: copyright.artist,
      title: copyright.title,
      description: copyright.description,
      fileHash: copyright.fileHash,
      ipfsHash: copyright.ipfsHash,
      licenseType: copyright.licenseType,
      timestamp: Number(copyright.timestamp),
    };
  } catch (error) {
    console.error('Failed to fetch copyright:', error);
    throw error;
  }
}

/**
 * Fetch all copyrights registered by an artist
 */
export async function fetchArtistCopyrights(
  contract: ethers.Contract,
  artistAddress: string
): Promise<number[]> {
  try {
    const copyrightIds = await contract.getArtistCopyrights(artistAddress);
    return copyrightIds.map((id: any) => Number(id));
  } catch (error) {
    console.error('Failed to fetch artist copyrights:', error);
    throw error;
  }
}

/**
 * Verify if a file hash is already registered
 * @returns copyrightId if registered, 0 if not
 */
export async function verifyFileHash(
  contract: ethers.Contract,
  fileHash: string
): Promise<number> {
  try {
    const copyrightId = await contract.verifyCopyright(fileHash);
    return Number(copyrightId);
  } catch (error) {
    console.error('Failed to verify file hash:', error);
    throw error;
  }
}

/**
 * Get copyright count for an artist
 */
export async function getArtistCopyrightCount(
  contract: ethers.Contract,
  artistAddress: string
): Promise<number> {
  try {
    const count = await contract.getArtistCopyrightCount(artistAddress);
    return Number(count);
  } catch (error) {
    console.error('Failed to get copyright count:', error);
    throw error;
  }
}

/**
 * Get total copyrights registered on the contract
 */
export async function getTotalCopyrights(contract: ethers.Contract): Promise<number> {
  try {
    const total = await contract.getTotalCopyrights();
    return Number(total);
  } catch (error) {
    console.error('Failed to get total copyrights:', error);
    throw error;
  }
}

/**
 * Get PolygonScan URL for a transaction
 */
export function getTransactionUrl(txHash: string): string {
  return `${CHAIN_CONFIG.POLYGON_AMOY.explorer}/tx/${txHash}`;
}

/**
 * Get PolygonScan URL for an address
 */
export function getAddressUrl(address: string): string {
  return `${CHAIN_CONFIG.POLYGON_AMOY.explorer}/address/${address}`;
}
