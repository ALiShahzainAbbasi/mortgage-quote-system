import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import QuotesList from "@/components/quotes/QuotesList";
import MortgageCalculator from "@/components/calculator/MortgageCalculator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { QuoteResponse } from "@/lib/api";

const DashboardPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (user?.role === "broker") {
      navigate("/admin/products");
    }
  }, [isAuthenticated, user, navigate]);

  const handleCompareQuotes = (quotes: any[]) => {
    const quoteIds = quotes.map(q => q.id);
    if (quoteIds.length >= 2 && quoteIds.length <= 3) {
      navigate(`/compare?quotes=${quoteIds.join(',')}`);
    } else {
      toast({
        title: "Invalid Selection",
        description: "Please select 2 or 3 quotes to compare",
        variant: "destructive",
      });
    }
  };

  const handleSaveNewQuote = (quote: QuoteResponse) => {
    toast({
      title: "Quote Saved",
      description: "Your new quote has been saved successfully",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-rose-900 mb-6">Your Dashboard</h1>
          <Tabs defaultValue="quotes" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="quotes">Your Quotes</TabsTrigger>
              <TabsTrigger value="calculator">Calculate New Quote</TabsTrigger>
            </TabsList>
            <TabsContent value="quotes" className="space-y-6">
              <QuotesList 
                userId={user?.id}
                onCompare={handleCompareQuotes}
              />
            </TabsContent>
            <TabsContent value="calculator">
              <div className="flex justify-center">
                <MortgageCalculator onSaveQuote={handleSaveNewQuote} userId={user?.id} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;
