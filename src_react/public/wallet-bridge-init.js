/**
 * FarmFactory — MCW Apps Wallet Bridge auto-connect
 *
 * Activates ONLY when:
 *   1. URL contains ?walletBridge=swaponline
 *   2. Page is opened inside an iframe (window.parent !== window)
 *
 * Loads bridge client from swaponline.github.io, sets window.ethereum to the
 * bridge provider so wagmi injected connector picks it up automatically.
 */
(function () {
  var params = new URLSearchParams(window.location.search);
  if (params.get('walletBridge') !== 'swaponline' || window.parent === window) {
    return;
  }

  window.__bridgeActive = true;
  console.log('[FarmFactory] Bridge mode: loading MCW bridge client');

  var BRIDGE_CLIENT_URL = 'https://swaponline.github.io/wallet-apps-bridge-client.js';

  function onBridgeLoaded() {
    if (!window.ethereum || !window.ethereum.isSwapWalletAppsBridge) {
      console.warn('[FarmFactory Bridge] Provider not set after script load');
      window.__bridgeActive = false;
      return;
    }

    // Wait for bridge handshake (READY with accounts) before notifying React
    window.ethereum.on('bridgeReady', function (payload) {
      console.log('[FarmFactory Bridge] Handshake complete, accounts:', payload.accounts);
      document.dispatchEvent(new CustomEvent('bridgeProviderReady'));
    });

    // Also handle accountsChanged for subsequent changes
    window.ethereum.on('accountsChanged', function (accounts) {
      document.dispatchEvent(new CustomEvent('wcAccountChanged', {
        detail: {
          address: accounts && accounts.length > 0 ? accounts[0] : null,
          isConnected: !!(accounts && accounts.length > 0),
        },
      }));
    });

    // Race-condition fix: READY may have arrived before this listener registered
    if (window.ethereum.selectedAddress) {
      console.log('[FarmFactory Bridge] Already connected:', window.ethereum.selectedAddress);
      document.dispatchEvent(new CustomEvent('bridgeProviderReady'));
    }

    console.log('[FarmFactory Bridge] Listeners registered, waiting for handshake...');
  }

  var script = document.createElement('script');
  script.src = BRIDGE_CLIENT_URL;
  script.onload = onBridgeLoaded;
  script.onerror = function () {
    console.error('[FarmFactory Bridge] Failed to load bridge client:', BRIDGE_CLIENT_URL);
    window.__bridgeActive = false;
  };
  document.head.appendChild(script);
})();
