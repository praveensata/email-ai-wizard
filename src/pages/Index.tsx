
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, BarChart, Settings, Zap } from 'lucide-react';

const Index = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Mail className="h-6 w-6 text-marketing-blue-600 mr-2" />
            <span className="font-bold text-xl text-marketing-blue-800">Email AI Wizard</span>
          </div>
          <div className="space-x-4">
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link to="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            AI-Powered Email Marketing
            <span className="text-marketing-blue-600"> Made Simple</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            Create personalized, high-converting email campaigns in minutes with our AI assistant. 
            Optimize your copy, analyze performance, and grow your business.
          </p>
          <Link to="/register">
            <Button size="lg" className="mr-4">
              Get Started Free
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="bg-blue-50 p-3 rounded-lg inline-block mb-4">
              <Zap className="h-6 w-6 text-marketing-blue-600" />
            </div>
            <h3 className="font-bold text-xl mb-3">AI-Generated Content</h3>
            <p className="text-gray-600">
              Create personalized email copy based on your product details and customer segments with Gemini AI.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="bg-blue-50 p-3 rounded-lg inline-block mb-4">
              <BarChart className="h-6 w-6 text-marketing-blue-600" />
            </div>
            <h3 className="font-bold text-xl mb-3">Performance Analytics</h3>
            <p className="text-gray-600">
              Track opens, clicks, and conversions with beautiful, interactive charts and dashboards.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="bg-blue-50 p-3 rounded-lg inline-block mb-4">
              <Settings className="h-6 w-6 text-marketing-blue-600" />
            </div>
            <h3 className="font-bold text-xl mb-3">Campaign Management</h3>
            <p className="text-gray-600">
              Schedule, manage, and optimize your email campaigns for maximum engagement and results.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-marketing-blue-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to transform your email marketing?</h2>
          <Link to="/register">
            <Button size="lg" variant="secondary">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Mail className="h-5 w-5 text-marketing-blue-600 mr-2" />
              <span className="font-bold text-marketing-blue-800">Email AI Wizard</span>
            </div>
            <div className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Email AI Wizard. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
