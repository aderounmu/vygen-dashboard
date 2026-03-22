
export function generateSecurePassword(length) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  let password = '';
  // Create a 32-bit array to store secure random values
  const randomValues = new Uint32Array(length);
  // Populate the array with cryptographically secure random values
  window.crypto.getRandomValues(randomValues);
  
  for (let i = 0; i < length; i++) {
    password += charset[randomValues[i] % charset.length];
  }
  return password;
}
console.log(generateSecurePassword(16)); 