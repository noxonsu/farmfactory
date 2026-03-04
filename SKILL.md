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
│       ├── build-non-split.js  # Single-bundle CRA build (no code splitting across pages)
│       └── make-widget.js      # Post-build: copies build → ../reactwidget/, patches chunk URLs
│
├── reactwidget/        # Built React bundle (committed to git)
│   ├── static/js/main.js       # Entry point loaded by HTML
│   ├── static/js/*.chunk.js    # Lazy-loaded chunks
│   └── rainbow.css             # AppKit / WalletConnect UI styles
│
├── wordpress/          # WordPress plugin source
│   ├── farmfactory.php         # Plugin entry, defines FARMFACTORY_PATH / FARMFACTORY_URL
│   ├── inc/
│   │   ├── scripts.php         # Enqueues main.js + farmfactory.css
│   │   └── shortcode.php       # [farmfactory] shortcode → renders ff-farmfactory-widget divs
│   ├── assets/css/farmfactory.css  # Widget styles (shared with static demo)
│   └── lib/                    # Compiled deployer (rollup build, not React)
│
├── demo/
│   └── index.html      # Static demo — no WordPress, served via GitHub Pages
│
├── static_example/     # OLD demo (Web3/web3modal — deprecated, do not use)
│
├── src/                # TypeScript deployer source (rollup → lib/)
├── .github/workflows/deploy.yml  # CI/CD: build → ZIP → upload to farm.wpmix.net
└── SKILL.md            # This file
```

---

## How the widget works

### Widget initialization

The bundle (`reactwidget/static/js/main.js`) scans all `.ff-farmfactory-widget` divs on page load and mounts a React app into each one, reading config from `data-*` attributes:

```html
<script>
  window.SO_FARM_FACTORY_ROOT = "https://example.com/farmfactory";
</script>
<div class="ff-farmfactory-widget"
  data-network-name="bsc"
  data-farm-address="0x..."
  data-rewards-address="0x..."
  data-staking-address="0x..."
  data-rewards-token-icon="https://..."   <!-- optional -->
  data-staking-token-icon="https://..."   <!-- optional -->
></div>
<script defer src="https://example.com/farmfactory/reactwidget/static/js/main.js"></script>
```

`SO_FARM_FACTORY_ROOT` must be the base URL of the directory that *contains* `reactwidget/`.
Chunks are loaded from `SO_FARM_FACTORY_ROOT + "/reactwidget/static/js/"`.

### Supported networks (`data-network-name`)

See `src_react/src/utils/chains.ts` for full list. Key values:
- `mainnet` — Ethereum mainnet
- `bsc` — BNB Smart Chain
- `polygon` — Polygon

### Contract interface

The widget calls a **StakingRewards** contract:
- `stake(uint amount)` — deposit staking tokens
- `withdraw(uint amount)` — withdraw staking tokens
- `getReward()` — harvest earned rewards
- `earned(address)` — view earned amount
- `balanceOf(address)` — view staked amount
- `rewardRate()` — rewards per second
- `totalSupply()` — total staked
- `periodFinish()` — farming end timestamp

Staking token requires ERC-20 `approve(farmAddress, amount)` before stake.

---

## Development

### Run React dev server

```bash
cd src_react
npm install --legacy-peer-deps
npm start
# Opens http://localhost:3000 with example widget
```

### Build React widget (updates reactwidget/ at repo root)

```bash
cd src_react
npm run build:widget
# Internally: build-non-split.js → build/ → make-widget.js → ../reactwidget/
```

After building, commit `reactwidget/` — it's tracked in git.

### Build WordPress deployer (lib/)

```bash
npm install
npm run build
# rollup → lib/farmfactory.js + lib/farmdeployer.js
```

---

## Deployment

### GitHub Pages (static demo)

- URL: `https://noxonsu.github.io/farmfactory/demo/`
- Configured from repo Settings → Pages → branch: `main`, folder: `/` (root)
- `reactwidget/` is served directly from the repo root
- `SO_FARM_FACTORY_ROOT` in `demo/index.html` = `https://noxonsu.github.io/farmfactory`

### WordPress plugin (farm.wpmix.net)

CI workflow (`.github/workflows/deploy.yml`) on every push to `main`:
1. Builds `lib/` (rollup)
2. Packages ZIP: `wordpress/` + `reactwidget/` + `App/` + `lib/`
3. Uploads ZIP to `https://farm.wpmix.net/updates/farmfactory-vVERSION.zip`
4. WordPress auto-update uses `updates/farmfactory-info.json` to detect new version

**Manual plugin update** (if auto-update didn't run):
```bash
ssh -i ~/.ssh/github_deploy_key root@95.217.227.162 "
  ZIP=/home/farmFactory/web/farm.wpmix.net/public_html/updates/farmfactory-vVERSION.zip
  PLUGIN=/home/farmFactory/web/farm.wpmix.net/public_html/wp-content/plugins/farmfactory
  TMP=/tmp/ff-update && rm -rf \$TMP && mkdir \$TMP
  unzip -q \$ZIP -d \$TMP
  cp -r \$TMP/farmfactory/reactwidget \$PLUGIN/
"
```

Server: `95.217.227.162`, user path: `/home/farmFactory/web/farm.wpmix.net/public_html/`

---

## Common tasks

### Add a new network

1. Edit `src_react/src/utils/chains.ts` — add entry to `NETWORKS` object
2. Edit `src_react/src/appkit.ts` — add to `networks` array and `transports` if needed
3. Run `npm run build:widget` in `src_react/`
4. Commit `reactwidget/`

### Change RPC URL for existing network

Edit `src_react/src/utils/chains.ts` → `rpc` field.
For BSC also update `src_react/src/appkit.ts` → `transports[bsc.id]` fallback list.

### Embed on a custom static page (no WordPress)

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://noxonsu.github.io/farmfactory/wordpress/assets/css/farmfactory.css">
  <link rel="stylesheet" href="https://noxonsu.github.io/farmfactory/reactwidget/rainbow.css">
</head>
<body>
  <script>
    window.SO_FARM_FACTORY_ROOT = "https://noxonsu.github.io/farmfactory";
  </script>
  <div class="ff-farmfactory-widget"
    data-network-name="bsc"
    data-farm-address="YOUR_FARM_CONTRACT"
    data-rewards-address="YOUR_REWARD_TOKEN"
    data-staking-address="YOUR_STAKING_TOKEN"
  ></div>
  <script defer src="https://noxonsu.github.io/farmfactory/reactwidget/static/js/main.js"></script>
</body>
</html>
```

---

## Tech stack

| Layer | Tech |
|-------|------|
| UI | React 18, TypeScript |
| Wallet connection | Reown AppKit + wagmi v2 |
| Contract reads | viem (via wagmi publicClient) |
| Contract writes | wagmi connector.getProvider() → ethers-style |
| Build | CRA (react-scripts), single-bundle mode |
| WordPress | PHP 7.1+, shortcode API |
| CI/CD | GitHub Actions → SCP to 95.217.227.162 |

---

## Key files to edit for common changes

| Goal | File |
|------|------|
| Widget UI/UX | `src_react/src/Widget.tsx` |
| Wallet connect button | `src_react/src/components/ConnectWallet.tsx` |
| Networks / RPC | `src_react/src/utils/chains.ts` |
| AppKit config | `src_react/src/appkit.ts` |
| Contract calls (stake/withdraw) | `src_react/src/utils/callFarmContract.ts` |
| Read chain state | `src_react/src/utils/fetchCommon.ts` |
| WordPress shortcode | `src_react/src/wordpress/inc/shortcode.php` |
| Widget CSS | `wordpress/assets/css/farmfactory.css` |
| Static demo | `demo/index.html` |
| CI/CD pipeline | `.github/workflows/deploy.yml` |
