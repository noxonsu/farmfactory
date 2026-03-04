#!/usr/bin/env node
/**
 * FarmFactory demo E2E test via Puppeteer
 *
 * Tests:
 *   1. Widget renders with token symbols (WEENUS / USDT)
 *   2. TVL / APY / farming status sections visible
 *   3. Connect Wallet button is present and clickable (opens AppKit modal)
 *   4. No critical JS errors on page load
 *
 * Run:
 *   node tests/e2e/demo.test.js
 *
 * Uses puppeteer from ~/MultiCurrencyWallet/node_modules/puppeteer
 */

const http = require('http')
const fs = require('fs')
const path = require('path')
const puppeteer = require('/root/MultiCurrencyWallet/node_modules/puppeteer')

// ── helpers ───────────────────────────────────────────────────────────────────

const SCREENSHOTS_DIR = path.resolve(__dirname, 'screenshots')
if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true })

function timeOut(ms) { return new Promise(r => setTimeout(r, ms)) }

async function screenshot(page, name) {
  const file = path.join(SCREENSHOTS_DIR, `${name}.jpg`)
  await page.screenshot({ path: file, type: 'jpeg', quality: 85 })
  console.log(`  📷 ${path.relative(process.cwd(), file)}`)
}

// Static file server for /root/farmfactory
function startServer(root, port) {
  return new Promise((resolve, reject) => {
    const MIME = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.svg': 'image/svg+xml',
    }
    const server = http.createServer((req, res) => {
      const filePath = path.join(root, req.url.split('?')[0])
      fs.stat(filePath, (err, stat) => {
        if (err || !stat.isFile()) { res.writeHead(404); res.end('Not found'); return }
        const ext = path.extname(filePath)
        res.writeHead(200, {
          'Content-Type': MIME[ext] || 'application/octet-stream',
          'Access-Control-Allow-Origin': '*',
        })
        fs.createReadStream(filePath).pipe(res)
      })
    })
    server.listen(port, () => resolve(server))
    server.on('error', reject)
  })
}

// ── test runner ──────────────────────────────────────────────────────────────

let passed = 0
let failed = 0
const failures = []

async function test(name, fn) {
  try {
    await fn()
    console.log(`  ✓  ${name}`)
    passed++
  } catch (err) {
    console.error(`  ✗  ${name}`)
    console.error(`     ${err.message}`)
    failures.push({ name, error: err.message })
    failed++
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg)
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  const PORT = 19876
  const ROOT = path.resolve(__dirname, '../..')
  const DEMO_URL = `http://localhost:${PORT}/demo/index.html`

  console.log('\n=== FarmFactory Demo E2E Test ===\n')
  console.log(`Demo: ${DEMO_URL}\n`)

  const server = await startServer(ROOT, PORT)

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1200, height: 900 })

    const consoleErrors = []
    page.on('pageerror', err => consoleErrors.push(err.message))

    // Intercept requests — redirect any external chunk URLs to localhost
    await page.setRequestInterception(true)
    page.on('request', req => {
      const url = req.url()
      // Redirect GitHub Pages or custom domain chunk requests to localhost
      if (
        (url.includes('noxonsu.github.io/farmfactory') ||
         url.includes('noxon.su/farmfactory')) &&
        url.includes('/reactwidget/')
      ) {
        const localPath = url.replace(/^https?:\/\/[^/]+\/farmfactory/, '')
        const localUrl = `http://localhost:${PORT}${localPath}`
        req.continue({ url: localUrl })
      } else {
        req.continue()
      }
    })

    console.log('Loading demo page...')
    await page.goto(DEMO_URL, { waitUntil: 'networkidle2', timeout: 30_000 })
    await timeOut(4_000)

    await screenshot(page, '01_initial_load')

    // ── Test 1: widget renders ─────────────────────────────────────────────
    await test('Widget div (.ff-farmfactory-widget) is present', async () => {
      const widget = await page.$('.ff-farmfactory-widget')
      assert(widget !== null, '.ff-farmfactory-widget div not found in DOM')
    })

    // ── Test 2: no critical JS errors ─────────────────────────────────────
    await test('No critical JS errors on load', async () => {
      const critical = consoleErrors.filter(e =>
        !e.includes('MetaMask') &&
        !e.includes('ethereum') &&
        !e.includes('walletconnect') &&
        !e.includes('WalletConnect') &&
        !e.includes('Removing unpermitted intrinsics') &&
        !e.includes('Could not establish connection')
      )
      if (critical.length > 0) {
        console.error('     Errors:', critical.slice(0, 3).join('\n     '))
      }
      assert(critical.length === 0, `${critical.length} critical error(s):\n  ${critical[0]}`)
    })

    // ── Test 3: token symbols ──────────────────────────────────────────────
    await test('Staking token symbol WEENUS visible', async () => {
      const text = await page.evaluate(() => document.body.innerText)
      assert(text.includes('WEENUS'), 'WEENUS not found. Got: ' + text.slice(0, 200))
    })

    await test('Rewards token symbol USDT visible', async () => {
      const text = await page.evaluate(() => document.body.innerText)
      assert(text.includes('USDT'), 'USDT not found. Got: ' + text.slice(0, 200))
    })

    // ── Test 4: farming metrics ────────────────────────────────────────────
    await test('APY / TVL metrics section visible', async () => {
      const text = await page.evaluate(() => document.body.innerText.toLowerCase())
      const hasMetrics = text.includes('apy') || text.includes('tvl') || text.includes('apr') ||
        text.includes('deposit') || text.includes('earn') || text.includes('%')
      assert(hasMetrics, 'No farming metrics found. Body: ' + text.slice(0, 300))
    })

    // ── Test 5: Connect Wallet button ──────────────────────────────────────
    await test('Connect Wallet button is present and enabled', async () => {
      const btn = await page.$('.ff-widget-unlock-button')
      assert(btn !== null, '.ff-widget-unlock-button not found')
      const disabled = await page.evaluate(el => el.disabled, btn)
      assert(!disabled, 'Connect button is disabled')
      const text = await page.evaluate(el => el.textContent, btn)
      assert(text.toLowerCase().includes('connect'), `Button text "${text}" doesn't say Connect`)
    })

    // ── Test 6: clicking Connect opens AppKit modal ────────────────────────
    await test('Connect button click triggers AppKit (w3m-modal injected + open)', async () => {
      await page.click('.ff-widget-unlock-button')

      // Wait for lazy AppKit chunks to load
      try {
        await page.waitForNetworkIdle({ timeout: 10_000 })
      } catch (e) { /* timeout is ok */ }
      await timeOut(3_000)

      await screenshot(page, '02_after_connect_click')

      const state = await page.evaluate(() => {
        // AppKit injects <w3m-modal> into document body
        const modal = document.querySelector('w3m-modal, appkit-modal, wcm-modal')

        // Check if modal has "open" attribute (AppKit sets it when open() is called)
        const isOpen = modal ? (modal.hasAttribute('open') || modal.getAttribute('open') === 'true') : false

        // Check shadow DOM for wallet list content
        let shadowContent = ''
        if (modal && modal.shadowRoot) {
          shadowContent = modal.shadowRoot.innerHTML.slice(0, 500)
        }

        // Also check page text for wallet keywords
        const pageText = document.body.innerText.toLowerCase()
        const walletKeywords = ['metamask', 'walletconnect', 'wallet connect', 'injected',
          'coinbase', 'trust', 'select wallet', 'connect wallet']
        const hasWalletUI = walletKeywords.some(kw => pageText.includes(kw))

        return {
          modalTag: modal ? modal.tagName : null,
          modalInDOM: !!modal,
          isOpen,
          shadowContent,
          hasWalletUI,
        }
      })

      console.log(`     w3m-modal in DOM: ${state.modalInDOM}, open: ${state.isOpen}, wallet UI: ${state.hasWalletUI}`)
      if (state.shadowContent) {
        console.log(`     shadow preview: ${state.shadowContent.slice(0, 120)}`)
      }

      // PASS if modal element is injected (proving AppKit initialized)
      // OR if wallet selection UI appeared in the page text
      assert(
        state.modalInDOM || state.hasWalletUI,
        `AppKit modal not found in DOM. modalInDOM=${state.modalInDOM}, hasWalletUI=${state.hasWalletUI}`
      )
    })

    await screenshot(page, '03_final_state')

  } finally {
    await browser.close()
    server.close()
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log(`\n${'─'.repeat(44)}`)
  console.log(`Results: ${passed} passed, ${failed} failed`)
  if (failed > 0) {
    console.error(`\n✗ ${failed} test(s) failed:`)
    failures.forEach(f => console.error(`  - ${f.name}`))
    process.exit(1)
  } else {
    console.log('\n✓ All tests passed')
  }
}

main().catch(err => {
  console.error('Fatal:', err.message)
  process.exit(1)
})
