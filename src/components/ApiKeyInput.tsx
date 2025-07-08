
import React, { useState } from 'react';
import { Key, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ApiKeyInputProps {
  onApiKeyChange: (apiKey: string) => void;
  currentApiKey?: string;
}

const ApiKeyInput = ({ onApiKeyChange, currentApiKey }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState(currentApiKey || '');
  const [showInput, setShowInput] = useState(false);

  const handleSave = () => {
    onApiKeyChange(apiKey);
    setShowInput(false);
    localStorage.setItem('rapidapi_key', apiKey);
  };

  const handleClear = () => {
    setApiKey('');
    onApiKeyChange('');
    localStorage.removeItem('rapidapi_key');
    setShowInput(false);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Key className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg">RapidAPI Configuration</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            The default API key has limited access. For full functionality, please provide your own RapidAPI key with Breach Directory subscription.
          </AlertDescription>
        </Alert>

        {!showInput ? (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {currentApiKey ? 'Custom API key configured' : 'Using default API key (limited access)'}
            </div>
            <div className="space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowInput(true)}
              >
                {currentApiKey ? 'Update Key' : 'Add API Key'}
              </Button>
              {currentApiKey && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleClear}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <Input
              type="password"
              placeholder="Enter your RapidAPI key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <div className="flex space-x-2">
              <Button onClick={handleSave} disabled={!apiKey.trim()}>
                Save
              </Button>
              <Button variant="outline" onClick={() => setShowInput(false)}>
                Cancel
              </Button>
            </div>
            <div className="text-xs text-gray-500">
              Get your RapidAPI key from{' '}
              <a 
                href="https://rapidapi.com/rohan-patra/api/breachdirectory" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Breach Directory API
              </a>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiKeyInput;
