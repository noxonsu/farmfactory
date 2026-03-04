# FarmFactory — AI Agent Guide

## What is this project

FarmFactory is an ERC-20 token staking widget (yield farming UI).
Users stake one token and earn another. Contracts: Ethereum, BSC, Polygon.

Distribution: WordPress plugin + standalone static HTML (no backend needed).

---

## Repository structure

```
farmfactory/
├── src_react/          # React source (TypeScript, wagmi v2, Reown AppKit)
│   ├── src/
│   │   ├── App.tsx         # Root: WagmiProvider + QueryClientProvider
│   │   ├── Widget.tsx      # Main widget UI (stake / withdraw / harvest)
│   │   ├── components/
│   │   │   ├── ConnectWallet.tsx   # AppKit connect button
│   │   │   └── Modal.tsx          # Transaction modals
│   │   ├── utils/
│   │   │   ├── chains.ts          # Network configs + RPC URLs
│   │   │   ├── fetchCommon.ts     # Read contract state (APY, balances)
│   │   │   ├── callFarmContract.ts  # stake / withdraw / getReward
│   │   │   └── callApproveContract.ts
│   │   └── appkit.ts       # WagmiAdapter + AppKit modal init
│   └── scripts/
│       ├── build-non-split.js  # Single-bundle CRA build
│       └── make-widget.js      # Post-build: copies build → ../reactwidget/, patches chunk URLs
│
├── reactwidget/        # Built React bundle (committed to git)
│   ├── static/js/main.js       # Entry point loaded by HTML
│   ├── static/js/*.chunk.js    # Lazy-loaded chunks
│   └── rainbow.css             # AppKit / WalletConnect UI styles
│
├── wordpress/          # WordPress plugin source
│   ├── farmfactory.php         # Plugin entry
│   ├── inc/
│   │   ├── scripts.php         # Enqueues main.js + farmfactory.css
│   │   └── shortcode.php       # [farmfactory] shortcode
│   ├── assets/css/farmfactory.css  # Widget styles (shared with static demo)
│   └── lib/                    # Compiled deployer
│
├── contracts/
│   ├── Farm.json       # ABI + bytecode of StakingRewards contract
│   └── Farm.sol        # Solidity source
│
├── demo/
│   └── index.html      # Static demo — no WordPress
│
├── tests/e2e/
│   └── demo.test.js    # Puppeteer E2E tests (7 tests)
│
├── .github/workflows/deploy.yml  # CI/CD: build → ZIP → upload to farm.wpmix.net
└── SKILL.md            # This file
```

---

## How the widget works

The bundle (`reactwidget/static/js/main.js`) scans all `.ff-farmfactory-widget` divs on page load and mounts a React app into each one:

```html
<script>
  window.SO_FARM_FACTORY_ROOT = new URL('.', window.location.href).href.replace(/\/$/, '');
</script>
<div class="ff-farmfactory-widget"
  data-network-name="bsc_test"
  data-farm-address="0x..."
  data-rewards-address="0x..."
  data-staking-address="0x..."
  data-rewards-token-icon="https://..."   <!-- optional -->
  data-staking-token-icon="https://..."   <!-- optional -->
></div>
<script defer src="reactwidget/static/js/main.js"></script>
```

**SO_FARM_FACTORY_ROOT** — base URL of directory containing `reactwidget/`.
⚠️ Never hardcode `noxonsu.github.io` — has CNAME → noxon.su → Cloudflare 522.

### Supported networks (`data-network-name`)

See `src_react/src/utils/chains.ts`. Key values:
`mainnet`, `bsc`, `bsc_test`, `matic`, `sepolia`, `arbitrum_mainnet`, `avax`, `fantom`, `cronos`, `xdai`

### StakingRewards contract interface

- `stake(uint amount)` — deposit staking tokens
- `withdraw(uint amount)` — withdraw staking tokens
- `getReward()` — harvest earned rewards
- `earned(address)` — view earned amount
- `rewardRate()` — rewards per second (0 = farm inactive)
- `totalSupply()` — total staked
- `periodFinish()` — farming end timestamp
- `notifyRewardAmount(uint)` — fund farm (owner only)

---

## Development

### Build React widget

```bash
cd src_react
yarn build:widget
# Result: ../reactwidget/static/js/main.js + chunks
```

After building, commit `reactwidget/` — it's tracked in git.

### Run E2E tests

```bash
node tests/e2e/demo.test.js
# Uses puppeteer from /root/MultiCurrencyWallet/node_modules/puppeteer
# 7 tests: widget render, no JS errors, token symbols, APY/TVL, Connect button, AppKit modal
```

---

## Deployment

### GitHub Pages — appsource/farm

- URL: `https://appsource.github.io/farm/`
- Repo: `https://github.com/appsource/farm` (local: `/tmp/appsource-farm-deploy/`)
- Branch: `main` (GitHub Pages serves from `main /`)
- Token: marsiandeployer — key in `/root/PolyFactory/.env` → `DEPLOYER_PRIVATE_KEY` (not this, check git remote)

```bash
cd /tmp/appsource-farm-deploy
# Edit index.html
git add index.html
git commit -m "update: ..."
git checkout main
git push origin main
```

### farm.wpmix.net (WordPress)

CI workflow (`.github/workflows/deploy.yml`) on every push to `main`:
1. Builds widget
2. Packages ZIP: `wordpress/` + `reactwidget/`
3. Uploads to `https://farm.wpmix.net/updates/`
4. WordPress auto-update detects new version via `farmfactory-info.json`

**Update WordPress farm settings** (contracts, network):
```bash
ssh -i ~/.ssh/github_deploy_key root@95.217.227.162 "
mysql -u farmFactory_user -pMKRVJUqHRF23123123121 farmFactory_db -e \"
  UPDATE wp_options SET option_value='NEW_FARM_ADDR' WHERE option_name='farmfactory_farmAddress';
  UPDATE wp_options SET option_value='NEW_REWARDS_ADDR' WHERE option_name='farmfactory_rewardsAddress';
  UPDATE wp_options SET option_value='NEW_STAKING_ADDR' WHERE option_name='farmfactory_stakingAddress';
  UPDATE wp_options SET option_value='bsc_test' WHERE option_name='farmfactory_networkName';
  UPDATE wp_options SET option_value='97' WHERE option_name='farmfactory_networkId';
  UPDATE wp_options SET option_value='18' WHERE option_name='farmfactory_rewarddecimals';
\""
```

Key WP options: `farmfactory_networkName`, `farmfactory_networkId`, `farmfactory_farmAddress`,
`farmfactory_rewardsAddress`, `farmfactory_stakingAddress`, `farmfactory_rewarddecimals`.

---

## Managing Farms (deploy / fund / update)

### Deployer wallet

```
Address: 0x0b5Ce0876F4Ddae8612d4a3E3587f27dd46820C6
Key:     /root/PolyFactory/.env → DEPLOYER_PRIVATE_KEY
Balance: ~0.26 BNB testnet (check before ops)
```

### Active farm (BSC Testnet, 2026-03-04)

| Contract | Address |
|----------|---------|
| Farm (StakingRewards) | `0xd8B2EbFD5fe6d392cCd79711Ef66Bb181aE3d278` |
| Staking token (WEENUS) | `0xB9757f522B1D3B0705d3ffcaf332c2645bEDB04f` |
| Rewards token (FFT) | `0xda9A5915b85028c2c0882b44dEd38A396dfEB55a` |
| Owner | deployer (`0x0b5Ce...`) |
| Funded | 1M FFT, 30 days, expires 2026-04-03 |

### Deploy new farm from scratch

```javascript
// node /tmp/deploy-new-farm.js
const { ethers } = require('/root/PolyFactory/node_modules/ethers')
const fs = require('fs')

const PK = require('fs').readFileSync('/root/PolyFactory/.env','utf8').match(/DEPLOYER_PRIVATE_KEY=(.+)/)[1].trim()
const provider = new ethers.JsonRpcProvider('https://bsc-testnet-rpc.publicnode.com')
const wallet = new ethers.Wallet(PK, provider)

// 1. Compile SimpleToken if needed:
//    node -e "const solc=require('/root/PolyFactory/node_modules/solc'); ..."
//    Result: /tmp/SimpleToken.json  (see contracts/Farm.sol for StakingRewards)

const tokenABI = JSON.parse(fs.readFileSync('/tmp/SimpleToken.json'))
const farmABI  = JSON.parse(fs.readFileSync('/root/farmfactory/contracts/Farm.json'))

const TokenF = new ethers.ContractFactory(tokenABI.abi, tokenABI.bytecode, wallet)
const stakeToken  = await TokenF.deploy('Weenus', 'WEENUS', 18, ethers.parseUnits('10000000', 18))
const rewardToken = await TokenF.deploy('FarmFactory Token', 'FFT', 18, ethers.parseUnits('10000000', 18))
await stakeToken.waitForDeployment()
await rewardToken.waitForDeployment()

const FarmF = new ethers.ContractFactory(farmABI.abi, farmABI.bytecode, wallet)
const farm = await FarmF.deploy(
  await rewardToken.getAddress(),
  await stakeToken.getAddress(),
  30 * 24 * 3600, // duration seconds
  18              // staking token decimals
)
await farm.waitForDeployment()

// Fund: transfer rewards → call notifyRewardAmount
const amount = ethers.parseUnits('1000000', 18)
await rewardToken.transfer(await farm.getAddress(), amount)
await farm.notifyRewardAmount(amount)
```

After deploy → update `demo/index.html`, `appsource/farm/index.html`, and WordPress DB.

### Fund existing farm (if deployer is owner)

```javascript
const { ethers } = require('/root/PolyFactory/node_modules/ethers')
const PK = '0xb387...' // from /root/PolyFactory/.env
const FARM = '0x...'
const REWARD_TOKEN = '0x...'
const AMOUNT = ethers.parseUnits('100000', 18)

const provider = new ethers.JsonRpcProvider('https://bsc-testnet-rpc.publicnode.com')
const wallet = new ethers.Wallet(PK, provider)

const token = new ethers.Contract(REWARD_TOKEN,
  ['function transfer(address,uint256) returns(bool)'], wallet)
const farm = new ethers.Contract(FARM,
  ['function notifyRewardAmount(uint256) external'], wallet)

await token.transfer(FARM, AMOUNT)
await farm.notifyRewardAmount(AMOUNT)
```

---

## Common tasks

### Add a new network

1. `src_react/src/utils/chains.ts` — add entry to `NETWORKS`
2. `src_react/src/appkit.ts` — add to `networks` array + `transports` if needed
3. `yarn build:widget` in `src_react/`
4. Commit `reactwidget/` + push → CI deploys

### Change contract on live site

1. Update `demo/index.html` → commit → push → CI deploys to farm.wpmix.net
2. Update WordPress DB via SSH (see above)
3. Update `appsource/farm/index.html` → push to `appsource/farm` main branch

### Embed on a custom page (no WordPress)

```html
<link rel="stylesheet" href="https://appsource.github.io/farm/wordpress/assets/css/farmfactory.css">
<link rel="stylesheet" href="https://appsource.github.io/farm/reactwidget/rainbow.css">
<script>
  window.SO_FARM_FACTORY_ROOT = "https://appsource.github.io/farm";
</script>
<div class="ff-farmfactory-widget"
  data-network-name="bsc_test"
  data-farm-address="0xd8B2EbFD5fe6d392cCd79711Ef66Bb181aE3d278"
  data-rewards-address="0xda9A5915b85028c2c0882b44dEd38A396dfEB55a"
  data-staking-address="0xB9757f522B1D3B0705d3ffcaf332c2645bEDB04f"
></div>
<script defer src="https://appsource.github.io/farm/reactwidget/static/js/main.js"></script>
```

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| `TypeError: undefined 'rpc'` | Unknown network name | Update `networkName` in WP DB or add to `chains.ts` |
| Chunks 404 / Cloudflare 522 | Wrong `SO_FARM_FACTORY_ROOT` | Use `new URL('.', location.href)` |
| APY = 0, no countdown timer | Farm not funded (rewardRate=0) | Call `notifyRewardAmount` as owner |
| Widget not rendering | `main.js` not loaded | Check `<script defer src="...main.js">` |
| Connect button missing | JS error before mount | Check browser console for errors |

---

## Tech stack

| Layer | Tech |
|-------|------|
| UI | React 18, TypeScript |
| Wallet connection | Reown AppKit + wagmi v2 |
| Contract reads | viem (via wagmi publicClient) |
| Build | CRA (react-scripts), single-bundle mode |
| WordPress | PHP 7.1+, shortcode API |
| CI/CD | GitHub Actions → SCP to 95.217.227.162 |

---

## Key files

| Goal | File |
|------|------|
| Widget UI/UX | `src_react/src/Widget.tsx` |
| Connect button | `src_react/src/components/ConnectWallet.tsx` |
| Networks / RPC | `src_react/src/utils/chains.ts` |
| AppKit config | `src_react/src/appkit.ts` |
| stake/withdraw/harvest | `src_react/src/utils/callFarmContract.ts` |
| Read APY/TVL | `src_react/src/utils/fetchCommon.ts` |
| WordPress shortcode | `wordpress/inc/shortcode.php` |
| Widget CSS | `wordpress/assets/css/farmfactory.css` |
| Static demo | `demo/index.html` |
| CI/CD pipeline | `.github/workflows/deploy.yml` |
| Farm ABI+bytecode | `contracts/Farm.json` |
