
import React from 'react';
import { AlertTriangle, CheckCircle, Clock, Globe, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface BreachData {
  Name: string;
  Title: string;
  Domain: string;
  BreachDate: string;
  AddedDate: string;
  ModifiedDate: string;
  PwnCount: number;
  Description: string;
  LogoPath: string;
  DataClasses: string[];
  IsVerified: boolean;
  IsFabricated: boolean;
  IsSensitive: boolean;
  IsRetired: boolean;
  IsSpamList: boolean;
}

interface ResultsCardProps {
  type: 'email' | 'password';
  query: string;
  breaches?: BreachData[];
  passwordCount?: number;
  isLoading: boolean;
  error?: string;
}

const ResultsCard = ({ type, query, breaches, passwordCount, isLoading, error }: ResultsCardProps) => {
  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-lg text-gray-600">Analyzing security...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto border-red-200">
        <CardContent className="p-8">
          <div className="flex items-center space-x-3 text-red-600">
            <AlertTriangle className="h-8 w-8" />
            <div>
              <h3 className="text-lg font-semibold">Error</h3>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasBreaches = (type === 'email' && breaches && breaches.length > 0) || 
                     (type === 'password' && passwordCount && passwordCount > 0);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Summary Card */}
      <Card className={`border-2 ${hasBreaches ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
        <CardHeader>
          <div className="flex items-center space-x-3">
            {hasBreaches ? (
              <AlertTriangle className="h-8 w-8 text-red-600" />
            ) : (
              <CheckCircle className="h-8 w-8 text-green-600" />
            )}
            <div>
              <CardTitle className={`text-xl ${hasBreaches ? 'text-red-800' : 'text-green-800'}`}>
                {hasBreaches ? 'Security Alert' : 'All Clear'}
              </CardTitle>
              <p className={`text-sm ${hasBreaches ? 'text-red-600' : 'text-green-600'}`}>
                {type === 'email' && breaches ? (
                  hasBreaches ? 
                    `Found in ${breaches.length} breach${breaches.length > 1 ? 'es' : ''}` :
                    'No breaches found'
                ) : (
                  hasBreaches ?
                    `Found in ${passwordCount?.toLocaleString()} breach${passwordCount !== 1 ? 'es' : ''}` :
                    'Password appears secure'
                )}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            <strong>{type === 'email' ? 'Email' : 'Password'}:</strong> {query}
          </p>
          {hasBreaches && (
            <p className="text-sm text-gray-600 mt-2">
              {type === 'email' ? 
                'Your email was found in the breaches listed below. Consider changing passwords for affected accounts.' :
                'This password has been compromised. We strongly recommend changing it immediately.'
              }
            </p>
          )}
        </CardContent>
      </Card>

      {/* Breach Details */}
      {type === 'email' && breaches && breaches.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Breach Details</h3>
          {breaches.map((breach, index) => (
            <Card key={index} className="border-l-4 border-l-red-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-red-800">{breach.Title}</CardTitle>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      {breach.Domain && (
                        <div className="flex items-center space-x-1">
                          <Globe className="h-4 w-4" />
                          <span>{breach.Domain}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(breach.BreachDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{breach.PwnCount.toLocaleString()} accounts</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {breach.IsVerified && <Badge variant="secondary">Verified</Badge>}
                    {breach.IsSensitive && <Badge variant="destructive">Sensitive</Badge>}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: breach.Description }} />
                {breach.DataClasses && breach.DataClasses.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Compromised Data:</h4>
                    <div className="flex flex-wrap gap-2">
                      {breach.DataClasses.map((dataClass, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {dataClass}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultsCard;
