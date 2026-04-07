#!/bin/bash

echo "🧪 CreatorShield Full-Stack Health Check"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node
echo "1️⃣  Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Node.js installed: $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js not found. Please install Node.js 18+"
    exit 1
fi

# Check .env.local exists
echo ""
echo "2️⃣  Checking environment files..."
if [ -f .env.local ]; then
    if grep -q "PRIVATE_KEY=" .env.local; then
        PRIVATE_KEY=$(grep "PRIVATE_KEY=" .env.local | cut -d'=' -f2)
        if [ ${#PRIVATE_KEY} -ge 64 ] || [ ${#PRIVATE_KEY} -ge 66 ]; then
            echo -e "${GREEN}✓${NC} Private key found (length: ${#PRIVATE_KEY} chars)"
        else
            echo -e "${YELLOW}⚠${NC} Private key too short! Need 64 hex chars (got $( readableLength=$(( ${#PRIVATE_KEY} )) ) echo $readableLength)"
            echo "   See GET_PRIVATE_KEY.md for instructions"
        fi
    else
        echo -e "${YELLOW}⚠${NC} PRIVATE_KEY not set in .env.local"
        echo "   See GET_PRIVATE_KEY.md for instructions"
    fi

    if grep -q "VITE_REACT_APP_CONTRACT_ADDRESS=" .env.local; then
        CONTRACT=$(grep "VITE_REACT_APP_CONTRACT_ADDRESS=" .env.local | cut -d'=' -f2)
        if [ -z "$CONTRACT" ] || [ "$CONTRACT" = "" ]; then
            echo -e "${YELLOW}⚠${NC} Contract address not set yet (deploy script fills this)"
        else
            echo -e "${GREEN}✓${NC} Contract address set: ${CONTRACT:0:10}..."
        fi
    fi
else
    echo -e "${RED}✗${NC} .env.local not found"
    exit 1
fi

# Check backend .env
echo ""
echo "3️⃣  Checking backend setup..."
if [ -f backend/.env.local ]; then
    if grep -q "SUPABASE_URL=" backend/.env.local; then
        echo -e "${GREEN}✓${NC} Backend .env.local found with Supabase config"
    else
        echo -e "${YELLOW}⚠${NC} Backend .env.local exists but missing Supabase config"
        echo "   See FULL_SETUP.md → Part 2 for Supabase credentials"
    fi
else
    echo -e "${YELLOW}⚠${NC} backend/.env.local not found"
    echo "   Create it using: backend/.env.example as template"
    echo "   See FULL_SETUP.md → Part 2"
fi

# Check backend node_modules
echo ""
echo "4️⃣  Checking backend dependencies..."
if [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Backend dependencies installed"
else
    echo -e "${YELLOW}⚠${NC} Backend dependencies not installed"
    echo "   Run: cd backend && npm install"
fi

# Check frontend node_modules
echo ""
echo "5️⃣  Checking frontend dependencies..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} Frontend dependencies installed"
else
    echo -e "${YELLOW}⚠${NC} Frontend dependencies not installed"
    echo "   Run: npm install"
fi

# Check smart contract
echo ""
echo "6️⃣  Checking smart contract files..."
if [ -f "contracts/CopyrightRegistry.sol" ]; then
    echo -e "${GREEN}✓${NC} Smart contract found"
else
    echo -e "${RED}✗${NC} Smart contract not found"
fi

if [ -f "scripts/deploy-simple.ts" ]; then
    echo -e "${GREEN}✓${NC} Deployment script found"
else
    echo -e "${RED}✗${NC} Deployment script not found"
fi

# Summary
echo ""
echo "=========================================="
echo "📊 Summary"
echo "=========================================="

ISSUES=0

if grep -q "PRIVATE_KEY=cEc" .env.local 2>/dev/null; then
    echo -e "${RED}❌ BLOCKER: Invalid private key${NC}"
    echo "   See GET_PRIVATE_KEY.md"
    ISSUES=$((ISSUES + 1))
fi

if ! [ -f "backend/.env.local" ]; then
    echo -e "${RED}❌ BLOCKER: Missing backend/.env.local${NC}"
    echo "   See FULL_SETUP.md → Part 2"
    ISSUES=$((ISSUES + 1))
fi

if ! grep -q "SUPABASE_URL=" backend/.env.local 2>/dev/null; then
    echo -e "${RED}❌ BLOCKER: Missing Supabase config${NC}"
    echo "   See FULL_SETUP.md → Part 2"
    ISSUES=$((ISSUES + 1))
fi

if ! [ -d "backend/node_modules" ]; then
    echo -e "${YELLOW}⚠️  Missing backend dependencies${NC}"
    echo "   Run: cd backend && npm install"
    ISSUES=$((ISSUES + 1))
fi

if [ $ISSUES -eq 0 ]; then
    echo -e "${GREEN}✅ All systems ready!${NC}"
    echo ""
    echo "Next steps:"
    echo "  Terminal 1: cd backend && npm run dev"
    echo "  Terminal 2: npm run dev"
    echo "  Browser: http://localhost:5173"
else
    echo ""
    echo -e "${RED}$ISSUES issue(s) found${NC}"
    echo ""
    echo "📚 See documentation:"
    echo "  - START_HERE.md (quick overview)"
    echo "  - GET_PRIVATE_KEY.md (private key)"
    echo "  - FULL_SETUP.md (complete guide)"
fi
