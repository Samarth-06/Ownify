#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 CreatorShield - Full Stack Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}✓ Frontend${NC} - Ready on http://localhost:5173"
echo -e "${BLUE}✓ Backend${NC} - Ready on http://localhost:3001"
echo ""
echo -e "${YELLOW}⚠️  REQUIRED BEFORE STARTING:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1️⃣  Complete Smart Contract Deployment"
echo "   → Get 0.5+ MATIC from https://faucet.polygon.technology/"
echo "   → Run: npx hardhat run scripts/deploy.js --network polygonAmoy"
echo ""
echo "2️⃣  Set Up Supabase Database"
echo "   → Read: SUPABASE_SETUP.md"
echo "   → Create free Supabase project"
echo "   → Run SQL schema"
echo "   → Copy SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to backend/.env"
echo ""
echo "3️⃣  Add JWT Secret to backend/.env"
echo "   → Generate random: openssl rand -hex 32"
echo "   → Paste into backend/.env JWT_SECRET=..."
echo ""
echo -e "${GREEN}Once complete, run:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  npm run dev"
echo ""
echo "Terminal 2 (Frontend):"
echo "  npm run dev"
echo ""
echo -e "${GREEN}Then visit: http://localhost:5173${NC}"
echo ""
