import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MortgageCalculator from "@/components/calculator/MortgageCalculator";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calculator } from "lucide-react";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="hero-gradient py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:w-1/2 space-y-6 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold text-rose-900 leading-tight animate-fade-in">
                  Find Your Perfect Mortgage with Rose Brokers
                </h1>
                <p className="text-lg text-rose-700">
                  Compare mortgage quotes, save money, and secure the best rate for your dream home.
                </p>
                <div className="flex gap-4 justify-center md:justify-start">
                  <Link to="/register">
                    <Button className="bg-rose-700 hover:bg-rose-800">
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" className="border-rose-600 text-rose-600 hover:bg-rose-50">
                      Login
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="md:w-1/2 flex justify-center">
                <div className="w-full max-w-md">
                  <MortgageCalculator publicMode={true} />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-rose-900 mb-12">
              Why Choose Rose Brokers?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-rose-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Calculator className="h-6 w-6 text-rose-700" />
                </div>
                <h3 className="text-xl font-semibold text-rose-800 text-center mb-2">
                  Accurate Calculations
                </h3>
                <p className="text-rose-700 text-center">
                  Our mortgage calculator uses the latest formulas to give you precise estimates of your monthly payments.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-rose-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Calculator className="h-6 w-6 text-rose-700" />
                </div>
                <h3 className="text-xl font-semibold text-rose-800 text-center mb-2">
                  Multiple Lenders
                </h3>
                <p className="text-rose-700 text-center">
                  Compare mortgage products from various lenders to find the best rates and terms for your situation.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="bg-rose-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Calculator className="h-6 w-6 text-rose-700" />
                </div>
                <h3 className="text-xl font-semibold text-rose-800 text-center mb-2">
                  Personalized Recommendations
                </h3>
                <p className="text-rose-700 text-center">
                  Get mortgage recommendations based on your financial situation and preferences.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-rose-900 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to find your perfect mortgage?</h2>
            <p className="text-rose-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have found their ideal mortgage rates through Rose Brokers.
            </p>
            <Link to="/register">
              <Button size="lg" className="bg-white text-rose-900 hover:bg-rose-100">
                Create Your Free Account
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;
