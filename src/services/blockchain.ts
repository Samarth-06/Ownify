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
 * Register a copyright on-chain
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

    const tx = await contract.registerCopyright(
      data.title,
      data.description,
      data.fileHash,
      data.ipfsHash,
      data.licenseType
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
    const errorMessage = error?.reason || error?.message || 'Registration failed';
    toast.error(`Registration failed: ${errorMessage}`);
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
