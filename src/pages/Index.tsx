
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import SearchForm from '@/components/SearchForm';
import ResultsCard, { BreachData } from '@/components/ResultsCard';
import SearchHistory, { SearchHistoryItem } from '@/components/SearchHistory';
import ApiKeyInput from '@/components/ApiKeyInput';
import { checkEmailBreaches, checkPasswordBreaches } from '@/services/breachService';
import { saveSearchToHistory, getSearchHistory, clearSearchHistory } from '@/utils/storage';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    type: 'email' | 'password';
    query: string;
    breaches?: BreachData[];
    passwordCount?: number;
    error?: string;
  } | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [apiKey, setApiKey] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    setSearchHistory(getSearchHistory());
    // Load saved API key
    const savedApiKey = localStorage.getItem('rapidapi_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleEmailSearch = async (email: string) => {
    setIsLoading(true);
    setResults(null);

    try {
      const breaches = await checkEmailBreaches(email, apiKey);
      const hasBreaches = breaches.length > 0;
      
      setResults({
        type: 'email',
        query: email,
        breaches,
      });

      saveSearchToHistory('email', email, hasBreaches, breaches.length);
      setSearchHistory(getSearchHistory());

      toast({
        title: hasBreaches ? 'Breaches Found' : 'All Clear',
        description: hasBreaches 
          ? `Your email was found in ${breaches.length} breach${breaches.length > 1 ? 'es' : ''}`
          : 'No breaches found for this email address',
        variant: hasBreaches ? 'destructive' : 'default',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setResults({
        type: 'email',
        query: email,
        error: errorMessage,
      });
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSearch = async (password: string) => {
    setIsLoading(true);
    setResults(null);

    try {
      const passwordCount = await checkPasswordBreaches(password);
      const hasBreaches = passwordCount > 0;
      
      setResults({
        type: 'password',
        query: '*'.repeat(password.length), // Mask password in results
        passwordCount,
      });

      saveSearchToHistory('password', password, hasBreaches, passwordCount);
      setSearchHistory(getSearchHistory());

      toast({
        title: hasBreaches ? 'Password Compromised' : 'Password Secure',
        description: hasBreaches 
          ? `This password has been seen ${passwordCount.toLocaleString()} times in breaches`
          : 'This password has not been found in any known breaches',
        variant: hasBreaches ? 'destructive' : 'default',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setResults({
        type: 'password',
        query: '*'.repeat(password.length),
        error: errorMessage,
      });
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRerunSearch = (item: SearchHistoryItem) => {
    if (item.type === 'email') {
      // For email, we can rerun with the original query
      const originalQuery = item.query;
      handleEmailSearch(originalQuery);
    } else {
      // For password, we can't rerun since we don't store the original
      toast({
        title: 'Cannot Rerun',
        description: 'Password searches cannot be rerun for security reasons',
        variant: 'destructive',
      });
    }
  };

  const handleClearHistory = () => {
    clearSearchHistory();
    setSearchHistory([]);
    toast({
      title: 'History Cleared',
      description: 'Your search history has been cleared',
    });
  };

  const handleApiKeyChange = (newApiKey: string) => {
    setApiKey(newApiKey);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Protect Your Digital Identity
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Check if your email addresses or passwords have been compromised in data breaches. 
              Stay informed, stay secure.
            </p>
          </div>

          {/* API Key Configuration */}
          <ApiKeyInput 
            onApiKeyChange={handleApiKeyChange}
            currentApiKey={apiKey}
          />

          {/* Search Form */}
          <SearchForm
            onEmailSearch={handleEmailSearch}
            onPasswordSearch={handlePasswordSearch}
            isLoading={isLoading}
          />

          {/* Results */}
          {results && (
            <ResultsCard
              type={results.type}
              query={results.query}
              breaches={results.breaches}
              passwordCount={results.passwordCount}
              isLoading={false}
              error={results.error}
            />
          )}

          {/* Search History */}
          <SearchHistory
            history={searchHistory}
            onRerun={handleRerunSearch}
            onClear={handleClearHistory}
          />

          {/* Security Notice */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Privacy & Security Notice
              </h3>
              <div className="text-sm text-blue-800 space-y-2">
                <p>
                  <strong>Email checks:</strong> Your email is sent securely to Breach Directory's API to check against their breach database.
                </p>
                <p>
                  <strong>Password checks:</strong> We use K-Anonymity to protect your password. Only the first 5 characters of your password's hash are sent to the API - your actual password never leaves your device.
                </p>
                <p>
                  <strong>Data storage:</strong> Search history is stored locally in your browser and never sent to external servers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
