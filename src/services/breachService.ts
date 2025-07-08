import { BreachData } from '@/components/ResultsCard';

const RAPIDAPI_BASE = 'https://breachdirectory.p.rapidapi.com';
const RAPIDAPI_KEY = 'd1b924367dmsh72fe49ad89c7c48p18ed9cjsn80d26d6657ae';

// Email breach checking using RapidAPI Breach Directory
export const checkEmailBreaches = async (email: string): Promise<BreachData[]> => {
  try {
    const response = await fetch(`${RAPIDAPI_BASE}/?func=auto&term=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'breachdirectory.p.rapidapi.com',
        'x-rapidapi-key': RAPIDAPI_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('RapidAPI response:', data);

    // Transform RapidAPI response to match our BreachData interface
    if (!data.found || !data.result || data.result.length === 0) {
      return [];
    }

    const breaches: BreachData[] = data.result.map((breach: any) => ({
      Name: breach.source || 'Unknown',
      Title: breach.source || 'Data Breach',
      Domain: breach.domain || '',
      BreachDate: breach.breach_date || new Date().toISOString().split('T')[0],
      AddedDate: new Date().toISOString(),
      ModifiedDate: new Date().toISOString(),
      PwnCount: breach.entries || 0,
      Description: `Email found in ${breach.source || 'data breach'}`,
      LogoPath: '',
      DataClasses: breach.fields ? breach.fields.split(',').map((field: string) => field.trim()) : ['Email addresses'],
      IsVerified: true,
      IsFabricated: false,
      IsSensitive: false,
      IsRetired: false,
      IsSpamList: false,
    }));

    return breaches;
  } catch (error) {
    console.error('Error checking email breaches:', error);
    throw new Error('Failed to check email breaches. Please try again.');
  }
};

// Password breach checking - keeping the original HIBP K-Anonymity method
// since RapidAPI Breach Directory doesn't offer password checking
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
