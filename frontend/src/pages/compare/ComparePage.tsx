
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

// Mock data for demonstration
const mockComparisonData = [
  {
    id: 1,
    lenderName: "National Bank",
    interestRate: 4.25,
    loanAmount: 250000,
    monthlyPayment: 1229.85,
    loanTerm: 30,
    totalInterest: 193746.00,
    initialDeposit: 25000,
    annualFee: 0,
  },
  {
    id: 2,
    lenderName: "City Finance",
    interestRate: 3.95,
    loanAmount: 250000,
    monthlyPayment: 1186.43,
    loanTerm: 30,
    totalInterest: 177114.80,
    initialDeposit: 30000,
    annualFee: 75,
  },
  {
    id: 3,
    lenderName: "Homeowner's Trust",
    interestRate: 4.5,
    loanAmount: 275000,
    monthlyPayment: 1393.82,
    loanTerm: 30,
    totalInterest: 226775.20,
    initialDeposit: 20000,
    annualFee: 50,
  }
];

const ComparePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-rose-900">Compare Quotes</h1>
            <Button 
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="mt-2 md:mt-0"
            >
              Back to Dashboard
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-rose-800 text-white">
                    <th className="py-3 px-4 text-left">Comparison Factor</th>
                    {mockComparisonData.map((quote) => (
                      <th key={quote.id} className="py-3 px-4 text-center">
                        {quote.lenderName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Interest Rate Row */}
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium bg-gray-50">Interest Rate</td>
                    {mockComparisonData.map((quote) => (
                      <td key={quote.id} className="py-3 px-4 text-center">
                        {quote.interestRate}%
                      </td>
                    ))}
                  </tr>
                  
                  {/* Loan Amount Row */}
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium bg-gray-50">Loan Amount</td>
                    {mockComparisonData.map((quote) => (
                      <td key={quote.id} className="py-3 px-4 text-center">
                        £{quote.loanAmount.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  
                  {/* Monthly Payment Row */}
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium bg-gray-50">Monthly Payment</td>
                    {mockComparisonData.map((quote) => (
                      <td key={quote.id} className="py-3 px-4 text-center">
                        <span className="font-bold">£{quote.monthlyPayment.toFixed(2)}</span>
                      </td>
                    ))}
                  </tr>
                  
                  {/* Loan Term Row */}
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium bg-gray-50">Loan Term</td>
                    {mockComparisonData.map((quote) => (
                      <td key={quote.id} className="py-3 px-4 text-center">
                        {quote.loanTerm} years
                      </td>
                    ))}
                  </tr>
                  
                  {/* Total Interest Row */}
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium bg-gray-50">Total Interest</td>
                    {mockComparisonData.map((quote) => (
                      <td key={quote.id} className="py-3 px-4 text-center">
                        £{quote.totalInterest.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  
                  {/* Initial Deposit Row */}
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium bg-gray-50">Initial Deposit</td>
                    {mockComparisonData.map((quote) => (
                      <td key={quote.id} className="py-3 px-4 text-center">
                        £{quote.initialDeposit.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  
                  {/* Annual Fee Row */}
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium bg-gray-50">Annual Fee</td>
                    {mockComparisonData.map((quote) => (
                      <td key={quote.id} className="py-3 px-4 text-center">
                        £{quote.annualFee.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  
                  {/* Action Buttons */}
                  <tr>
                    <td className="py-4 px-4 bg-gray-50"></td>
                    {mockComparisonData.map((quote) => (
                      <td key={quote.id} className="py-4 px-4 text-center">
                        <Button className="bg-rose-700 hover:bg-rose-800 w-full">
                          Select This Quote
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ComparePage;
