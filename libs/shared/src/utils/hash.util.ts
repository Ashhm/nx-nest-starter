import * as crypto from 'crypto';

export function createHash(value: unknown) {
  return crypto.createHash('md5').update(JSON.stringify(value)).digest('hex');
}
