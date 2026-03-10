/**
 * Token encryption utilities for sessionStorage.
 *
 * Uses AES-256-GCM (via @noble/ciphers) with a SHA-256 derived key.
 * Key material = SHA-256( navigator.userAgent || VITE_CRYPTO_SECRET ).
 *
 * GCM provides authenticated encryption (AEAD) to prevent tampering.
 * Each encryption uses a random nonce.
 *
 * Format: base64(nonce || ciphertext+tag)
 */

import { gcm } from "@noble/ciphers/aes.js";
import { sha256 } from "@noble/hashes/sha2.js";

const APP_SECRET = import.meta.env.VITE_CRYPTO_SECRET || "";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

/**
 * Derives a 32-byte AES-256 key from browser user agent + app secret.
 *
 * Combines navigator.userAgent with VITE_CRYPTO_SECRET for key material.
 */
function getDerivedKey(): Uint8Array {
  const keyMaterial = `${navigator.userAgent}|${APP_SECRET}`;
  return sha256(encoder.encode(keyMaterial));
}

export function setEncryptedItem(storageKey: string, value: string): void {
  try {
    // Generate random 12-byte nonce (GCM recommended size)
    const nonce = new Uint8Array(12);
    crypto.getRandomValues(nonce);

    const plaintext = encoder.encode(value);
    const ciphertext = gcm(getDerivedKey(), nonce).encrypt(plaintext);

    // Store nonce + ciphertext+tag together
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

export function getEncryptedItem(storageKey: string): string | null {
  const stored = sessionStorage.getItem(storageKey);
  if (!stored) return null;

  try {
    const combined = Uint8Array.from(atob(stored), (c) => c.charCodeAt(0));

    // Extract nonce (first 12 bytes) and ciphertext+tag (rest)
    const nonce = combined.slice(0, 12);
    const ciphertext = combined.slice(12);

    const decrypted = gcm(getDerivedKey(), nonce).decrypt(ciphertext);
    return decoder.decode(decrypted);
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
