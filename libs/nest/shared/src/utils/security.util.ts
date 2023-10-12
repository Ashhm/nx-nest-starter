import * as crypto from 'crypto';
import { SECURITY } from './constants';

function generateSalt() {
  return crypto.randomBytes(SECURITY.SALT_LENGTH).toString('hex');
}

/**
 * Create Password Based Key
 */
async function createPbk(value: string, salt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      value,
      salt,
      SECURITY.PBKDF2_ITERATIONS,
      SECURITY.PBKDF2_KEYLEN,
      SECURITY.PBKDF2_DIGEST,
      (err, key) => {
        if (err) {
          reject(err);
        }
        resolve(key.toString('hex'));
      },
    );
  });
}

/**
 * Create hash
 * Hash string includes salt and pbk
 * There is no security issue to store salt in the same place as pbk
 */
export async function createHash(value: string) {
  const salt = generateSalt();
  const pbk = await createPbk(value, salt);

  return `${salt}${SECURITY.SALT_PBK_SEPARATOR}${pbk}`;
}

export async function verifyHash(value: string, storedHash: string): Promise<boolean> {
  const [salt, storedPbk] = storedHash.split(SECURITY.SALT_PBK_SEPARATOR);
  const pbk = await createPbk(value, salt);
  return pbk === storedPbk;
}
