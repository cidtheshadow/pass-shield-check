
import { Shield } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">SecurePass+</h1>
              <p className="text-sm text-gray-500">Breach Detection Tool</p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Powered by HaveIBeenPwned
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
