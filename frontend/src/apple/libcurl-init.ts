import { libcurl } from 'libcurl.js/bundled';
import { getAccessToken } from '../components/Auth/PasswordGate';
import { backendWispUrl } from '../config/backend';

let initialized = false;
let initPromise: Promise<void> | null = null;

export async function initLibcurl(): Promise<void> {
  if (initialized) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    let wsUrl = backendWispUrl();
    const token = getAccessToken();
    if (token) {
      wsUrl += `?token=${encodeURIComponent(token)}`;
    }
    libcurl.set_websocket(wsUrl);
    await libcurl.load_wasm();
    initialized = true;
  })();

  return initPromise;
}

export { libcurl };
