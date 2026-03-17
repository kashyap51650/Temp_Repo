/**
 * Token encryption utilities for sessionStorage.
 *
 * Uses AES-256-GCM (via Web Crypto API) with a SHA-256 derived key.
 * Key material = SHA-256( navigator.userAgent || VITE_CRYPTO_SECRET ).
 *
 * GCM provides authenticated encryption (AEAD) to prevent tampering.
 * Each encryption uses a random nonce.
 *
 * Format: base64(nonce || ciphertext+tag)
 */

const APP_SECRET = import.meta.env.VITE_CRYPTO_SECRET || "";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

/**
 * Derives an AES-256-GCM CryptoKey from browser user agent + app secret.
 *
 * Combines navigator.userAgent with VITE_CRYPTO_SECRET for key material,
 * hashes it with SHA-256, then imports the result as a non-extractable key.
 *
 * The derived CryptoKey is cached for the lifetime of the module to avoid
 * repeating expensive Web Crypto operations on every call.
 */
let derivedKeyPromise: Promise<CryptoKey> | null = null;

async function getDerivedKey(): Promise<CryptoKey> {
  if (!derivedKeyPromise) {
    const keyMaterial = `${navigator.userAgent}|${APP_SECRET}`;
    derivedKeyPromise = crypto.subtle
      .digest("SHA-256", encoder.encode(keyMaterial))
      .then((keyBytes) =>
        crypto.subtle.importKey("raw", keyBytes, { name: "AES-GCM" }, false, [
          "encrypt",
          "decrypt",
        ])
      );
  }
  return derivedKeyPromise;
}

export async function setEncryptedItem(
  storageKey: string,
  value: string
): Promise<void> {
  try {
    // Generate random 12-byte nonce (GCM recommended size)
    const nonce = crypto.getRandomValues(new Uint8Array(12));
    const key = await getDerivedKey();

    const ciphertextBuffer = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: nonce },
      key,
      encoder.encode(value)
    );

    // Store nonce + ciphertext+tag together
    const ciphertext = new Uint8Array(ciphertextBuffer);
    const combined = new Uint8Array(nonce.length + ciphertext.length);
    combined.set(nonce, 0);
    combined.set(ciphertext, nonce.length);

    const encoded = btoa(String.fromCharCode(...combined));
    sessionStorage.setItem(storageKey, encoded);
  } catch (error) {
    // Fail closed: do not store plaintext on encryption failure
    sessionStorage.removeItem(storageKey);
    if (import.meta.env.DEV) {
      console.warn(
        `[crypto] Failed to encrypt sessionStorage item '${storageKey}'; item was not stored.`,
        error
      );
    }
    throw error;
  }
}

export async function getEncryptedItem(
  storageKey: string
): Promise<string | null> {
  const stored = sessionStorage.getItem(storageKey);
  if (!stored) return null;

  try {
    const combined = Uint8Array.from(atob(stored), (c) => c.charCodeAt(0));

    // Extract nonce (first 12 bytes) and ciphertext+tag (rest)
    const nonce = combined.slice(0, 12);
    const ciphertext = combined.slice(12);

    const key = await getDerivedKey();
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: nonce },
      key,
      ciphertext
    );

    return decoder.decode(decryptedBuffer);
  } catch (error) {
    // Decryption/parsing failure: clear invalid data and return null
    if (import.meta.env.DEV) {
      console.warn(
        `[crypto] Failed to decrypt sessionStorage item '${storageKey}'; clearing item.`,
        error
      );
    }
    sessionStorage.removeItem(storageKey);
    return null;
  }
}
