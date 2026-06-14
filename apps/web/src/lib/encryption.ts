import crypto from 'crypto';

/**
 * Dynamically extracts encryption key from environment configurations.
 * Standardizes to a 32-byte key via SHA-256.
 */
const getEncryptionKey = (): Buffer => {
  const envKey = process.env.DATABASE_ENCRYPTION_KEY || process.env.PROCESS_ENV_ENCRYPTION_KEY || 'fallback-dev-key-32-chars-length!!';
  return crypto.createHash('sha256').update(envKey).digest();
};

/**
 * Extracts the secret key for deterministic blind indexing (HMAC-SHA-256).
 */
const getBlindIndexSecret = (): string => {
  return process.env.BLIND_INDEX_SECRET || 'fallback-blind-index-secret-key-12345';
};

/**
 * Encrypts plaintext using AES-256-GCM.
 * Returns a colon-separated string: "iv:ciphertext:tag"
 */
export function encryptText(plainText: string): string {
  if (!plainText) return '';
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(12); // Standard 12-byte IV for GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  
  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const tag = cipher.getAuthTag().toString('hex');
  
  return `${iv.toString('hex')}:${encrypted}:${tag}`;
}

/**
 * Decrypts ciphertext (format "iv:ciphertext:tag") using AES-256-GCM.
 * If data is not in the encrypted format, returns it as-is for compatibility.
 */
export function decryptText(cipherText: string): string {
  if (!cipherText) return '';
  
  const parts = cipherText.split(':');
  if (parts.length !== 3) {
    return cipherText;
  }
  
  try {
    const key = getEncryptionKey();
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = Buffer.from(parts[1], 'hex');
    const tag = Buffer.from(parts[2], 'hex');
    
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encrypted as any, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    console.error('[Cryptography] Decryption failed, returning ciphertext as fallback:', err);
    return cipherText;
  }
}

/**
 * Generates a deterministic SHA-256 HMAC hash for blind indexing.
 * Standards-compliant: standardizes string to lowercase and trims whitespace before hashing.
 */
export function getBlindIndex(text: string): string {
  if (!text) return '';
  const standardized = text.trim().toLowerCase();
  const secret = getBlindIndexSecret();
  return crypto
    .createHmac('sha256', secret)
    .update(standardized)
    .digest('hex');
}
