
// Password breach checking - using HIBP K-Anonymity method
export const checkPasswordBreaches = async (password: string): Promise<number> => {
  try {
    // Generate SHA-1 hash of the password
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();

    // Use K-Anonymity: send only first 5 characters of hash
    const prefix = hashHex.substring(0, 5);
    const suffix = hashHex.substring(5);

    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: {
        'User-Agent': 'SecurePass+',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const text = await response.text();
    const lines = text.split('\n');

    // Look for our hash suffix in the results
    for (const line of lines) {
      const [hashSuffix, count] = line.trim().split(':');
      if (hashSuffix === suffix) {
        return parseInt(count, 10);
      }
    }

    return 0; // Password not found in breaches
  } catch (error) {
    console.error('Error checking password breaches:', error);
    throw new Error('Failed to check password breaches. Please try again.');
  }
};
