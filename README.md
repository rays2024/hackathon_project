# Token Pool Project

A Solana blockchain-based token staking and reward system that supports both SPL tokens and native SOL staking with mining capabilities.

## 🌟 Features

- 🔥 **Multi-Token Support**: Supports both SPL tokens and native SOL staking
- 💰 **Reward System**: Flexible reward distribution mechanism
- 🎯 **Smart Contracts**: Solana program built with Anchor framework
- 🖥️ **Modern Frontend**: React + TypeScript + Vite powered user interface
- 🌐 **Multi-Network**: Supports Localnet, Devnet, Testnet, and Mainnet
- 🛡️ **Secure & Reliable**: Complete permission verification and error handling

## 🏗️ Project Architecture

```
hackathon_project/
├── programs/
│   └── token_pool/           # Solana smart contract
│       ├── src/
│       │   ├── ctx/          # Account context definitions
│       │   ├── instructions/ # Instruction handlers
│       │   ├── state/        # State data structures
│       │   ├── error.rs      # Error definitions
│       │   ├── events.rs     # Event definitions
│       │   └── lib.rs        # Program entry point
│       └── Cargo.toml        # Rust dependencies
├── frontend/                 # React frontend interface
│   ├── src/
│   │   ├── App.tsx          # Main application component
│   │   ├── App.css          # Application styles
│   │   └── main.tsx         # Entry point
│   ├── index.html           # HTML template
│   └── package.json         # Frontend dependencies
├── tests/                   # Test files
│   ├── logic/               # Test logic
│   └── const.ts             # Test constants
├── migrations/              # Deployment scripts
├── Anchor.toml             # Anchor project configuration
├── Cargo.toml              # Rust workspace configuration
└── package.json            # Project dependencies
```

## 🚀 Core Functionality

### Smart Contract Features

1. **System Initialization**
   - `initialize_with_spl_token`: Initialize staking pool with SPL token
   - `initialize_with_rewards`: Initialize reward system

2. **Staking Functions**
   - `stake_spl_token`: Stake SPL tokens
   - `stake_native_token`: Stake native SOL

3. **Withdrawal and Rewards**
   - `withdraw`: Withdraw staked tokens
   - `claim_rewards`: Claim staking rewards
   - `transfer_to_rewards`: Transfer to reward pool

4. **Configuration Management**
   - `change_conf`: Modify system configuration

### Frontend Features

- 🔗 Wallet Connection (supports multiple Solana wallets)
- 💎 Token staking interface
- 📊 Real-time data dashboard
- 🎨 Modern UI design
- 📱 Responsive layout

## 📋 Requirements

### Development Environment

- **Rust**: 1.75.0+
- **Solana CLI**: 1.18.0+
- **Anchor CLI**: 0.29.0+
- **Node.js**: 16.0.0+
- **Yarn**: 1.22.0+

### Deployment Networks

- **Localnet**: Local development testing
- **Devnet**: Development network testing
- **Testnet**: Sonic testnet
- **Mainnet**: Production environment

## 🛠️ Quick Start

### Just Run the Test Cases

```bash

# if we just need to run the ts script without care about the contract deployments, we can just see below sections. and ignore the remaining sections.
# Install Node.js dependencies
yarn install

# Run tests
# initialize the smart contract
npm run test:step1 
# user stake amount into smart contract
npm run test:step2
# user withdraw amount from smart contract
npm run test:step3
# user claim amount from smart contract
npm run test:step4

```

### 1. Install Dependencies

```bash
# Install Rust dependencies
cargo install

# Install Node.js dependencies
yarn install

```

### 2. Environment Setup

```bash
# Configure Solana CLI
solana config set --url https://api.testnet.v1.sonic.game
solana config set --keypair ~/.config/solana/id.json

# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor --tag v0.29.0 anchor-cli --locked
```

### 3. Build Project

```bash
# Build smart contracts
anchor build

```

### 4. Deploy Contract

```bash

# Deploy to testnet
anchor deploy

```

## 📖 Usage Guide

### Smart Contract Interaction

```typescript
import * as anchor from "@coral-xyz/anchor";
import { TokenPool } from "./target/types/token_pool";

// Connect to program
const program = anchor.workspace.TokenPool as Program<TokenPool>;

// Initialize staking pool
await program.methods
  .initializeWithSplToken(params)
  .accounts({
    admin: wallet.publicKey,
    // other accounts...
  })
  .rpc();

// Stake tokens
await program.methods
  .stakeSplToken(new anchor.BN(amount))
  .accounts({
    user: wallet.publicKey,
    // other accounts...
  })
  .rpc();
```

### Frontend Interface

1. Visit http://localhost:3000
2. Connect your Solana wallet
3. Select token type to stake
4. Enter staking amount
5. Confirm transaction

## 🔧 Configuration

### Network Configuration

Configure different networks in `Anchor.toml`:

```toml
[provider]
cluster = "https://api.testnet.v1.sonic.game"  # Sonic Testnet
# cluster = "https://api.devnet.solana.com"    # Solana Devnet
# cluster = "http://localhost:8899"            # Local network

[programs.localnet]
token_pool = "2NueBFH5VmAM3o9iDyZf1Z5tt7dZZvnXXw6w3rLUWirU"
```

### Program IDs

- **Localnet**: `2NueBFH5VmAM3o9iDyZf1Z5tt7dZZvnXXw6w3rLUWirU`
- **Devnet**: `2NueBFH5VmAM3o9iDyZf1Z5tt7dZZvnXXw6w3rLUWirU`
- **Testnet**: `2NueBFH5VmAM3o9iDyZf1Z5tt7dZZvnXXw6w3rLUWirU`

## 🧪 Testing

### Run Tests

```bash
# Run all tests
anchor test

# Run specific tests
yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/logic/index.ts

# Redeploy and test
anchor run reTest
```

### Test Coverage

- ✅ Contract initialization tests
- ✅ Token staking functionality tests
- ✅ Reward distribution tests
- ✅ Permission verification tests
- ✅ Error handling tests

## 🔒 Security Features

- **Access Control**: Strict admin and user permission verification
- **Value Checks**: Prevention of overflow and invalid inputs
- **Account Validation**: Complete account constraints and verification
- **Error Handling**: Comprehensive error type definitions and handling

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Rust Version Error**
   ```bash
   rustup update stable
   rustup default stable
   ```

2. **Anchor Version Conflict**
   ```bash
   cargo uninstall anchor-cli
   cargo install --git https://github.com/coral-xyz/anchor --tag v0.29.0 anchor-cli --locked
   ```

3. **Borsh Version Conflict**
   ```bash
   cargo clean
   cargo update -p borsh --precise 0.10.4
   ```

### Getting Help

- 📧 Submit Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 💬 Community Discussion: [Discord Server](https://discord.gg/your-server)
- 📖 Documentation: [Documentation](https://your-docs-site.com)

## 🔗 Related Links

- [Solana Documentation](https://docs.solana.com/)
- [Anchor Framework](https://anchor-lang.com/)
- [Sonic Network](https://sonic.game/)
- [React Documentation](https://reactjs.org/)

## 📊 Project Stats

- **Smart Contract**: Rust + Anchor framework
- **Frontend**: React + TypeScript + Vite
- **Testing**: Comprehensive test suite with TypeScript
- **Networks**: Multi-network deployment support
- **Security**: Production-ready security features

## 🎯 Roadmap

- [ ] Enhanced reward calculation algorithms
- [ ] Multi-token reward distribution
- [ ] Advanced staking strategies
- [ ] Mobile app development
- [ ] Cross-chain integration
- [ ] Governance token implementation

---

**Built with ❤️ for the Solana ecosystem**

### Made for Hackathon 🏆

This project was developed for the Solana/Sonic hackathon, showcasing innovative DeFi solutions on the Solana blockchain.