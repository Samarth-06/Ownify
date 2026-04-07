/**
 * Web3 Configuration
 * Centralized settings for blockchain integration
 */

export const CHAIN_CONFIG = {
  POLYGON_AMOY: {
    chainId: 80002,
    name: 'Polygon Amoy',
    rpc: 'https://rpc-amoy.polygon.technology',
    explorer: 'https://amoy.polygonscan.com',
    explorerTx: (hash: string) => `https://amoy.polygonscan.com/tx/${hash}`,
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
};

// Contract ABI - CopyrightRegistry
export const COPYRIGHT_REGISTRY_ABI = [
  {
    inputs: [
      { internalType: 'string', name: '_title', type: 'string' },
      { internalType: 'string', name: '_description', type: 'string' },
      { internalType: 'string', name: '_fileHash', type: 'string' },
      { internalType: 'string', name: '_ipfsHash', type: 'string' },
      { internalType: 'string', name: '_licenseType', type: 'string' },
    ],
    name: 'registerCopyright',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_copyrightId', type: 'uint256' }],
    name: 'getCopyright',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'id', type: 'uint256' },
          { internalType: 'address', name: 'artist', type: 'address' },
          { internalType: 'string', name: 'title', type: 'string' },
          { internalType: 'string', name: 'description', type: 'string' },
          { internalType: 'string', name: 'fileHash', type: 'string' },
          { internalType: 'string', name: 'ipfsHash', type: 'string' },
          { internalType: 'string', name: 'licenseType', type: 'string' },
          { internalType: 'uint256', name: 'timestamp', type: 'uint256' },
          { internalType: 'bool', name: 'exists', type: 'bool' },
        ],
        internalType: 'struct CopyrightRegistry.Copyright',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_artist', type: 'address' }],
    name: 'getArtistCopyrights',
    outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_artist', type: 'address' }],
    name: 'getArtistCopyrightCount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'string', name: '_fileHash', type: 'string' }],
    name: 'verifyCopyright',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_copyrightId', type: 'uint256' },
      { internalType: 'string', name: '_newTitle', type: 'string' },
      { internalType: 'string', name: '_newDescription', type: 'string' },
    ],
    name: 'updateCopyrightMetadata',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getTotalCopyrights',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'copyrightId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'artist', type: 'address' },
      { indexed: false, internalType: 'string', name: 'title', type: 'string' },
      { indexed: false, internalType: 'string', name: 'fileHash', type: 'string' },
      { indexed: false, internalType: 'uint256', name: 'timestamp', type: 'uint256' },
    ],
    name: 'CopyrightRegistered',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'copyrightId', type: 'uint256' },
      { indexed: false, internalType: 'string', name: 'newTitle', type: 'string' },
      { indexed: false, internalType: 'string', name: 'newDescription', type: 'string' },
    ],
    name: 'CopyrightMetadataUpdated',
    type: 'event',
  },
];

export const IPFS_CONFIG = {
  GATEWAY: 'https://w3s.link/ipfs/',
  DWEB_GATEWAY: (cid: string) => `https://${cid}.ipfs.dweb.link/`,
  CLOUDFLARE_GATEWAY: (cid: string) => `https://cloudflare-ipfs.com/ipfs/${cid}`,
  PUBLIC_GATEWAY: (cid: string) => `https://ipfs.io/ipfs/${cid}`,
};

// Get contract address from environment
export function getContractAddress(): string {
  return import.meta.env.VITE_REACT_APP_CONTRACT_ADDRESS || '';
}

// Get Web3.Storage token from environment
export function getWeb3StorageToken(): string | undefined {
  return import.meta.env.VITE_WEB3_STORAGE_TOKEN;
}
