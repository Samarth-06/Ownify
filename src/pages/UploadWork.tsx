import { motion } from 'framer-motion';
import { Upload, FileImage, Music, Code, FileText, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { registerCopyrightOnChain, getTransactionUrl, verifyFileHash as verifyFileHashService } from '@/services/blockchain';
import { uploadFileToIPFS } from '@/services/ipfs';

const fileTypes = [
  { icon: FileImage, label: 'Image / Art', ext: '.png, .jpg, .svg' },
  { icon: Music, label: 'Audio / Music', ext: '.mp3, .wav, .flac' },
  { icon: Code, label: 'Code / Software', ext: '.zip, .tar, .gz' },
  { icon: FileText, label: 'Document / Writing', ext: '.pdf, .doc, .txt' },
];

export default function UploadWork() {
  const { account, isConnected, contract, switchToAmoy, isCorrectNetwork, connectWallet } = useWeb3();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [licenseType, setLicenseType] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<{
    stage: string;
    status: 'pending' | 'success' | 'error';
    message: string;
  } | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast.success(`File selected: ${file.name}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if contract is deployed
    if (!import.meta.env.VITE_REACT_APP_CONTRACT_ADDRESS) {
      toast.error('⏳ Smart contract not deployed yet');
      toast.info('Run: npx hardhat run scripts/deploy.js --network polygonAmoy');
      return;
    }

    // Validation
    if (!title.trim()) {
      toast.error('Work title is required');
      return;
    }

    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }

    if (!licenseType) {
      toast.error('Please select a license type');
      return;
    }

    // Check wallet connection
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      await connectWallet();
      return;
    }

    // Check network
    if (!isCorrectNetwork) {
      toast.error('Please switch to Polygon Amoy network');
      await switchToAmoy();
      return;
    }

    if (!contract) {
      toast.error('Smart contract not loaded. Please refresh and try again.');
      return;
    }

    setIsUploading(true);

    try {
      // Step 1: Upload to IPFS
      setRegistrationStatus({
        stage: 'uploading',
        status: 'pending',
        message: 'Uploading file to IPFS...',
      });

      const { ipfsHash, fileHash } = await uploadFileToIPFS(selectedFile);

      setRegistrationStatus({
        stage: 'verifying',
        status: 'pending',
        message: 'Checking for duplicate registrations...',
      });

      // Step 2: Verify file hash (check for duplicates)
      const existingCopyright = await verifyFileHashService(contract, fileHash);
      if (existingCopyright !== 0) {
        setRegistrationStatus({
          stage: 'verifying',
          status: 'error',
          message: `File already registered as Copyright #${existingCopyright}. Duplicate files cannot be registered.`,
        });
        toast.error(`File already registered as Copyright #${existingCopyright}`);
        setIsUploading(false);
        return;
      }

      // Step 3: Register on blockchain
      setRegistrationStatus({
        stage: 'registering',
        status: 'pending',
        message: 'Registering on blockchain. Approve the transaction in MetaMask...',
      });

      const { transactionHash, copyrightId } = await registerCopyrightOnChain(contract, {
        title,
        description,
        fileHash,
        ipfsHash,
        licenseType,
      });

      setRegistrationStatus({
        stage: 'registering',
        status: 'success',
        message: `Copyright #${copyrightId} registered successfully!`,
      });

      // Step 4: Save to backend database
      setRegistrationStatus({
        stage: 'saving',
        status: 'pending',
        message: 'Saving to database...',
      });

      try {
        const response = await fetch(`${API_URL}/api/copyrights`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            copyright_id: copyrightId,
            title,
            description,
            file_hash: fileHash,
            ipfs_hash: ipfsHash,
            license_type: licenseType,
            transaction_hash: transactionHash,
            contract_address: import.meta.env.VITE_REACT_APP_CONTRACT_ADDRESS,
          }),
        });

        if (!response.ok) {
          console.warn('Failed to save to database, but blockchain registration succeeded');
        }
      } catch (err) {
        console.warn('Failed to save to database:', err);
      }

      // Reset form
      setSelectedFile(null);
      setTitle('');
      setDescription('');
      setLicenseType('');

      // Success - redirect to portfolio after 2 seconds
      setTimeout(() => {
        toast.success('Redirecting to portfolio...');
        navigate('/portfolio');
      }, 2000);
    } catch (error: any) {
      console.error('Registration failed:', error);

      if (error?.code === 'ACTION_REJECTED') {
        setRegistrationStatus({
          stage: 'registering',
          status: 'error',
          message: 'Transaction rejected by user',
        });
      } else {
        setRegistrationStatus({
          stage: 'registering',
          status: 'error',
          message: error?.message || 'Registration failed. Please try again.',
        });
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative min-h-screen px-6 pt-28 pb-20">
      <div className="absolute inset-0 bg-gradient-to-b from-neon-blue/10 to-background" />
      <div className="relative mx-auto max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-foreground glow-text mb-2">
            Upload Work
          </h1>
          <p className="text-sm text-muted-foreground mb-10">
            Protect your creation with blockchain-backed proof on Polygon Amoy
          </p>

          {/* Wallet Connection Status */}
          {!isConnected ? (
            <div className="glass-panel border border-neon-cyan/30 p-4 mb-8 rounded-2xl">
              <p className="text-sm text-foreground mb-4">
                📱 Connect your MetaMask wallet to register your copyright on blockchain
              </p>
              <Button onClick={connectWallet} className="w-full">
                Connect Wallet
              </Button>
            </div>
          ) : !isCorrectNetwork ? (
            <div className="glass-panel border border-yellow-500/30 p-4 mb-8 rounded-2xl">
              <p className="text-sm text-foreground mb-4">
                ⚠️ Wrong network detected. Please switch to Polygon Amoy.
              </p>
              <Button onClick={switchToAmoy} variant="destructive" className="w-full">
                Switch to Polygon Amoy
              </Button>
            </div>
          ) : (
            <div className="glass-panel border border-green-500/30 p-4 mb-8 rounded-2xl">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                <p className="text-sm text-green-500">
                  ✓ Connected - Ready to register copyright
                </p>
              </div>
            </div>
          )}

          {/* Drop zone */}
          <label className="glass-panel neon-border flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-neon-cyan/30 p-16 mb-8 hover:border-neon-cyan/60 transition-colors cursor-pointer">
            <Upload size={40} className="text-neon-cyan opacity-60" />
            <p className="font-display text-sm text-foreground">Drag & drop your file here</p>
            <p className="text-xs text-muted-foreground">or click to browse</p>
            {selectedFile && (
              <p className="text-xs text-green-500 font-semibold">✓ {selectedFile.name}</p>
            )}
            <input
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading}
            />
          </label>

          {/* File types */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {fileTypes.map((f) => (
              <div key={f.label} className="glass-panel flex items-center gap-3 p-4">
                <f.icon size={20} className="text-neon-purple" />
                <div>
                  <p className="font-display text-xs font-semibold text-foreground">{f.label}</p>
                  <p className="text-[10px] text-muted-foreground">{f.ext}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="glass-panel p-6 space-y-4">
            <input
              type="text"
              placeholder="Work Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isUploading}
              className="w-full rounded-xl border border-border bg-secondary/30 py-3 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-neon-cyan/50 focus:outline-none transition-colors disabled:opacity-50"
            />
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isUploading}
              rows={3}
              className="w-full rounded-xl border border-border bg-secondary/30 py-3 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-neon-cyan/50 focus:outline-none transition-colors resize-none disabled:opacity-50"
            />
            <select
              value={licenseType}
              onChange={(e) => setLicenseType(e.target.value)}
              disabled={isUploading}
              className="w-full rounded-xl border border-border bg-secondary/30 py-3 px-4 text-sm text-foreground focus:border-neon-cyan/50 focus:outline-none transition-colors disabled:opacity-50"
            >
              <option value="">Select License Type</option>
              <option value="CC-BY-NC">Creative Commons BY-NC</option>
              <option value="Exclusive">Exclusive License</option>
              <option value="Commercial">Commercial License</option>
              <option value="Personal-Use">Personal Use Only</option>
            </select>

            {/* Transaction Status */}
            {registrationStatus && (
              <div
                className={`p-4 rounded-xl border ${
                  registrationStatus.status === 'success'
                    ? 'border-green-500/30 bg-green-500/10'
                    : registrationStatus.status === 'pending'
                      ? 'border-yellow-500/30 bg-yellow-500/10'
                      : 'border-red-500/30 bg-red-500/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  {registrationStatus.status === 'success' && (
                    <CheckCircle size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                  )}
                  {registrationStatus.status === 'pending' && (
                    <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mt-0.5 flex-shrink-0" />
                  )}
                  {registrationStatus.status === 'error' && (
                    <XCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-xs font-semibold text-foreground capitalize">
                      {registrationStatus.stage}: {registrationStatus.status}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{registrationStatus.message}</p>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isUploading || !isConnected || !isCorrectNetwork}
              className="magnetic-btn w-full rounded-full py-3 font-display text-sm font-semibold uppercase tracking-widest"
            >
              {isUploading ? 'Processing...' : 'Protect & Publish'}
            </Button>
          </form>

          {/* Info */}
          <div className="mt-8 space-y-3 text-xs text-muted-foreground">
            <p>
              💾 <strong>What happens:</strong> Your file is uploaded to IPFS (decentralized storage),
              and a proof is recorded on the Polygon blockchain.
            </p>
            <p>
              ⛽ <strong>Gas fees:</strong> Transaction costs ~0.001-0.01 MATIC per registration (very
              cheap). Get free testnet MATIC from the faucet.
            </p>
            <p>
              🔐 <strong>Privacy:</strong> Only file hash is stored on-chain, not the file itself. Your
              work stays private until you share it.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
