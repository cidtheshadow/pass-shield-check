
import React from 'react';
import { Clock, Mail, Lock, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface SearchHistoryItem {
  id: string;
  type: 'email' | 'password';
  query: string;
  timestamp: number;
  hasBreaches: boolean;
  breachCount?: number;
}

interface SearchHistoryProps {
  history: SearchHistoryItem[];
  onRerun: (item: SearchHistoryItem) => void;
  onClear: () => void;
}

const SearchHistory = ({ history, onRerun, onClear }: SearchHistoryProps) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Search History</span>
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onClear}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {history.slice(0, 5).map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                {item.type === 'email' ? (
                  <Mail className="h-4 w-4 text-blue-600" />
                ) : (
                  <Lock className="h-4 w-4 text-green-600" />
                )}
                <div>
                  <p className="font-medium text-gray-900">{item.query}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(item.timestamp).toLocaleDateString()} • {' '}
                    {item.hasBreaches ? (
                      <span className="text-red-600">
                        {item.breachCount} breach{item.breachCount !== 1 ? 'es' : ''} found
                      </span>
                    ) : (
                      <span className="text-green-600">No breaches</span>
                    )}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRerun(item)}
              >
                Recheck
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchHistory;
