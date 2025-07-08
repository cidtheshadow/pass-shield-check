
import { BreachData } from '@/components/ResultsCard';

const HIBP_API_BASE = 'https://haveibeenpwned.com/api/v3';
const HIBP_PASSWORD_API = 'https://api.pwnedpasswords.com';

// Email breach checking
export const checkEmailBreaches = async (email: string): Promise<BreachData[]> => {
  try {
    const response = await fetch(`${HIBP_API_BASE}/breachedaccount/${encodeURIComponent(email)}?truncateResponse=false`, {
      headers: {
        'User-Agent': 'SecurePass+',
      },
    });

    if (response.status === 404) {
      return []; // No breaches found
    }

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const breaches: BreachData[] = await response.json();
    return breaches;
  } catch (error) {
    console.error('Error checking email breaches:', error);
    throw new Error('Failed to check email breaches. Please try again.');
  }
};

// Password breach checking using K-Anonymity
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

    const response = await fetch(`${HIBP_PASSWORD_API}/range/${prefix}`, {
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
