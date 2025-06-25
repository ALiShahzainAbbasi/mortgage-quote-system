import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Check, ArrowRight, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { quoteApi, SavedQuote } from "@/lib/api";
import { Card } from '@/components/ui/card';

interface QuotesListProps {
  userId: number;
  onCompare?: (quotes: SavedQuote[]) => void;
}

const QuotesList = ({ userId, onCompare }: QuotesListProps) => {
  const [quotes, setQuotes] = useState<SavedQuote[]>([]);
  const [selectedQuotes, setSelectedQuotes] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [savedEligible, setSavedEligible] = useState<any[]>([]);
  const [editingQuote, setEditingQuote] = useState<SavedQuote | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  useEffect(() => {
    loadQuotes();
    fetchSavedEligibleProducts();
  }, [userId]);

  const loadQuotes = async () => {
    try {
      setIsLoading(true);
      const response = await quoteApi.getUserQuotes(userId);
      if (response.success) {
        setQuotes(response.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to load quotes",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load quotes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSavedEligibleProducts = async () => {
    try {
      const response = await quoteApi.fetchSavedEligibleProducts(userId);
      if (response.success && Array.isArray(response.data)) {
        setSavedEligible(response.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load saved eligible products. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleQuoteSelect = (quoteId: number) => {
    setSelectedQuotes(prev => {
      if (prev.includes(quoteId)) {
        return prev.filter(id => id !== quoteId);
      }
      if (prev.length >= 3) {
        toast({
          title: "Selection limit reached",
          description: "You can only select up to 3 quotes for comparison",
          variant: "destructive",
        });
        return prev;
      }
      return [...prev, quoteId];
    });
  };

  const handleDeleteQuote = async (quoteId: number) => {
    try {
      const response = await quoteApi.deleteQuote(quoteId, userId);
      if (response.success) {
        setQuotes(quotes.filter(quote => quote.id !== quoteId));
        setSelectedQuotes(prev => prev.filter(id => id !== quoteId));
        toast({
          title: "Success",
          description: "Quote deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to delete quote",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete quote. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCompareClick = async () => {
    if (selectedQuotes.length >= 2 && selectedQuotes.length <= 3) {
      try {
        const response = await quoteApi.compareQuotes(selectedQuotes, userId);
        if (response.success) {
          if (onCompare) {
            onCompare(response.data);
          }
        } else {
          toast({
            title: "Error",
            description: response.message || "Failed to compare quotes",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to compare quotes. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Invalid Selection",
        description: "Please select 2 or 3 quotes to compare",
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (quote: SavedQuote) => {
    setEditingQuote(quote);
    setEditForm({
      annual_income: quote.annual_income,
      deposit_amount: quote.deposit_amount,
      property_value: quote.property_value,
      term_years: quote.term_years,
    });
  };

  const handleEditFormChange = (field: string, value: number) => {
    setEditForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleEditSave = async () => {
    if (!editingQuote) return;
    setIsSavingEdit(true);
    try {
      // Prepare updated quote data
      const updatedData = {
        ...editingQuote,
        ...editForm,
      };
      // Call backend to update quote
      const response = await quoteApi.updateQuote(editingQuote.id, userId, updatedData);
      if (response.success) {
        toast({ title: "Quote Updated", description: "Quote updated successfully." });
        setEditingQuote(null);
        loadQuotes();
      } else {
        toast({ title: "Error", description: response.message || "Failed to update quote.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update quote.", variant: "destructive" });
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleEditCancel = () => {
    setEditingQuote(null);
    setEditForm({});
  };

  if (isLoading) {
    return (
      <div className="w-full text-center py-10">
        <p className="text-rose-800">Loading quotes...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Card className="mt-6 p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Your Saved Quotes</h2>
        {quotes.length === 0 ? (
          <div>No saved quotes found.</div>
        ) : (
          <Table>
            <TableCaption>A list of your saved mortgage quotes.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Interest Rate</TableHead>
                <TableHead>Loan Amount</TableHead>
                <TableHead>Monthly Payment</TableHead>
                <TableHead>Total Interest</TableHead>
                <TableHead>Total Payment</TableHead>
                <TableHead>Term (Years)</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotes.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell className="font-medium">
                    {quote.product_name || "Custom Quote"}
                  </TableCell>
                  <TableCell>{quote.interest_rate}%</TableCell>
                  <TableCell>£{Number(quote.loan_amount).toLocaleString()}</TableCell>
                  <TableCell>£{Number(quote.monthly_payment).toFixed(2)}</TableCell>
                  <TableCell>£{Number(quote.total_interest).toFixed(2)}</TableCell>
                  <TableCell>£{Number(quote.total_payment).toFixed(2)}</TableCell>
                  <TableCell>{quote.term_years}</TableCell>
                  <TableCell>{new Date(quote.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditClick(quote)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteQuote(quote.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {editingQuote && (
                <tr>
                  <td colSpan={9} className="bg-rose-50">
                    <div className="flex flex-col md:flex-row gap-2 items-center justify-between p-2">
                      <div className="flex gap-2 flex-wrap">
                        <Input
                          type="number"
                          value={editForm.annual_income}
                          onChange={e => handleEditFormChange('annual_income', parseFloat(e.target.value) || 0)}
                          placeholder="Annual Income"
                        />
                        <Input
                          type="number"
                          value={editForm.deposit_amount}
                          onChange={e => handleEditFormChange('deposit_amount', parseFloat(e.target.value) || 0)}
                          placeholder="Deposit Amount"
                        />
                        <Input
                          type="number"
                          value={editForm.property_value}
                          onChange={e => handleEditFormChange('property_value', parseFloat(e.target.value) || 0)}
                          placeholder="Property Value"
                        />
                        <Input
                          type="number"
                          value={editForm.term_years}
                          onChange={e => handleEditFormChange('term_years', parseFloat(e.target.value) || 0)}
                          placeholder="Term (Years)"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleEditSave} disabled={isSavingEdit}>
                          {isSavingEdit ? 'Saving...' : 'Save'}
                        </Button>
                        <Button variant="outline" onClick={handleEditCancel}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </TableBody>
          </Table>
        )}
      </Card>
      <Card className="mt-6 p-6">
        <h2 className="text-2xl font-bold mb-4">Your Saved Eligible Products</h2>
        {savedEligible.length === 0 ? (
          <div>No saved eligible products found.</div>
        ) : (
          savedEligible.map((entry, idx) => {
            const products = JSON.parse(entry.products);
            const input = JSON.parse(entry.input_data);
            return (
              <div key={entry.id} className="mb-6 border-b pb-4">
                <div className="mb-2 text-sm text-gray-600">
                  <strong>Saved on:</strong> {new Date(entry.created_at).toLocaleString()}
                  <br />
                  <strong>Input:</strong> Income £{input.annual_income}, Deposit £{input.deposit_amount}, Property £{input.property_value}, Term {input.term_years} years
                </div>
                <table className="min-w-full border text-sm mb-2">
                  <thead>
                    <tr>
                      <th className="border px-2 py-1">Product</th>
                      <th className="border px-2 py-1">Interest Rate</th>
                      <th className="border px-2 py-1">Loan Amount</th>
                      <th className="border px-2 py-1">Monthly Payment</th>
                      <th className="border px-2 py-1">Total Interest</th>
                      <th className="border px-2 py-1">Total Payment</th>
                      <th className="border px-2 py-1">Term (Years)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product: any) => (
                      <tr key={product.product_id}>
                        <td className="border px-2 py-1">{product.product_name || "Custom Quote"} <span className="text-xs text-gray-500">({product.lender_name})</span></td>
                        <td className="border px-2 py-1">{product.interest_rate}%</td>
                        <td className="border px-2 py-1">£{product.loan_amount.toFixed(2)}</td>
                        <td className="border px-2 py-1">£{product.monthly_payment.toFixed(2)}</td>
                        <td className="border px-2 py-1">£{product.total_interest.toFixed(2)}</td>
                        <td className="border px-2 py-1">£{product.total_payment.toFixed(2)}</td>
                        <td className="border px-2 py-1">{product.term_years}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })
        )}
      </Card>
    </div>
  );
};

export default QuotesList;
