#!/usr/bin/env node
/**
 * RPC health check for FarmFactory
 * Checks all RPC endpoints from chains.ts + deployment APIs
 * Usage: node scripts/check-rpc.js
 * Pre-commit: add to .husky/pre-commit
 */

const https = require('https')
const http = require('http')

// All RPCs from src_react/src/utils/chains.ts
// Skip testnets marked DEAD
// Must match src_react/src/utils/chains.ts NETWORKS
const RPCS = [
  // ── Production networks (critical = blocks commit if down) ───────
  { name: 'BSC (publicnode)',     url: 'https://bsc-rpc.publicnode.com',                         critical: true },
  { name: 'BSC (drpc fallback)', url: 'https://bsc.drpc.org',                                   critical: false },
  { name: 'Mainnet (publicnode)', url: 'https://ethereum-rpc.publicnode.com',                    critical: true },
  { name: 'Polygon (publicnode)', url: 'https://polygon-bor-rpc.publicnode.com',                 critical: true },
  { name: 'Arbitrum',            url: 'https://arb1.arbitrum.io/rpc',                           critical: false },
  { name: 'Avalanche',           url: 'https://api.avax.network/ext/bc/C/rpc',                  critical: false },
  { name: 'Gnosis (xDai)',       url: 'https://rpc.gnosischain.com',                            critical: false },
  { name: 'Aurora',              url: 'https://mainnet.aurora.dev',                              critical: false },
  { name: 'Cronos',              url: 'https://evm.cronos.org',                                  critical: false },
  { name: 'Fantom',              url: 'https://rpc.ftm.tools/',                                  critical: false },
  { name: 'Harmony',             url: 'https://api.harmony.one',                                 critical: false },
  { name: 'Moonriver',           url: 'https://rpc.moonriver.moonbeam.network',                  critical: false },
  { name: 'Arbitrum',            url: 'https://arb1.arbitrum.io/rpc',                           critical: false },
  { name: 'xDai/Gnosis',        url: 'https://rpc.gnosischain.com',                             critical: false },

  // ── Testnets ─────────────────────────────────────────────────────
  { name: 'BSC Testnet',         url: 'https://bsc-testnet-rpc.publicnode.com',                  critical: false },
  { name: 'Sepolia (publicnode)',url: 'https://ethereum-sepolia-rpc.publicnode.com',              critical: false },
]

// Other APIs used in the product
const APIS = [
  { name: 'farm.wpmix.net',        url: 'https://farm.wpmix.net/' },
  { name: 'farm.wpmix.net/updates',url: 'https://farm.wpmix.net/updates/farmfactory-info.json' },
]

const TIMEOUT_MS = 6000

function rpcRequest(url) {
  return new Promise((resolve) => {
    const body = JSON.stringify({ jsonrpc: '2.0', method: 'eth_blockNumber', params: [], id: 1 })
    const mod = url.startsWith('https') ? https : http
    const urlObj = new URL(url)

    const req = mod.request({
      hostname: urlObj.hostname,
      port: urlObj.port || (url.startsWith('https') ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
      timeout: TIMEOUT_MS,
    }, (res) => {
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => {
        try {
          const json = JSON.parse(data)
          if (json.result) {
            resolve({ ok: true, block: parseInt(json.result, 16) })
          } else {
            resolve({ ok: false, error: json.error?.message || 'no result' })
          }
        } catch {
          resolve({ ok: false, error: `invalid json: ${data.slice(0, 80)}` })
        }
      })
    })

    req.on('error', (e) => resolve({ ok: false, error: e.message }))
    req.on('timeout', () => { req.destroy(); resolve({ ok: false, error: 'timeout' }) })
    req.write(body)
    req.end()
  })
}

function httpCheck(url) {
  return new Promise((resolve) => {
    const mod = url.startsWith('https') ? https : http
    const req = mod.get(url, { timeout: TIMEOUT_MS }, (res) => {
      res.resume()
      resolve({ ok: res.statusCode < 400, status: res.statusCode })
    })
    req.on('error', (e) => resolve({ ok: false, error: e.message }))
    req.on('timeout', () => { req.destroy(); resolve({ ok: false, error: 'timeout' }) })
  })
}

function pad(str, len) {
  return str.length >= len ? str : str + ' '.repeat(len - str.length)
}

async function main() {
  console.log('\n=== FarmFactory RPC Health Check ===\n')

  const rpcResults = await Promise.all(RPCS.map(async (rpc) => {
    const result = await rpcRequest(rpc.url)
    return { ...rpc, result }
  }))

  let failed = 0
  let criticalFailed = 0

  console.log('RPC Endpoints:')
  for (const { name, critical, expectDead, result } of rpcResults) {
    const alive = result.ok
    const label = expectDead ? '[SKIP]' : (alive ? '  ✓  ' : '  ✗  ')
    const info = alive
      ? `block #${result.block.toLocaleString()}`
      : (result.error || 'failed')

    console.log(`  ${label} ${pad(name, 28)} ${info}`)

    if (!expectDead && !alive) {
      failed++
      if (critical) criticalFailed++
    }
  }

  console.log('\nAPIs:')
  const apiResults = await Promise.all(APIS.map(async (api) => {
    const result = await httpCheck(api.url)
    return { ...api, result }
  }))

  for (const { name, result } of apiResults) {
    const label = result.ok ? '  ✓  ' : '  ✗  '
    const info = result.ok ? `HTTP ${result.status}` : (result.error || `HTTP ${result.status}`)
    console.log(`  ${label} ${pad(name, 28)} ${info}`)
    if (!result.ok) failed++
  }

  console.log('')
  if (criticalFailed > 0) {
    console.error(`✗ ${criticalFailed} CRITICAL RPC(s) down — blocking commit\n`)
    process.exit(1)
  } else if (failed > 0) {
    console.warn(`⚠ ${failed} non-critical endpoint(s) down (non-blocking)\n`)
    process.exit(0)
  } else {
    console.log('✓ All endpoints OK\n')
    process.exit(0)
  }
}

main()
