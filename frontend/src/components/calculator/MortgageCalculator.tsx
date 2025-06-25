import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { quoteApi, QuoteData, QuoteResponse, productApi } from '@/lib/api';
import { useToast } from "@/components/ui/use-toast";

interface MortgageCalculatorProps {
  onSaveQuote?: (quote: QuoteResponse) => void;
  userId?: number;
  publicMode?: boolean;
}

interface ValidationErrors {
  annual_income?: string;
  deposit_amount?: string;
  property_value?: string;
  term_years?: string;
}

const MortgageCalculator = ({ onSaveQuote, userId, publicMode = false }: MortgageCalculatorProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    annual_income: 0,
    deposit_amount: 0,
    property_value: 0,
    term_years: 25
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [eligibleProducts, setEligibleProducts] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingEligible, setIsSavingEligible] = useState(false);
  const [isSavingQuote, setIsSavingQuote] = useState(false);

  const validateInput = (field: string, value: number): string | undefined => {
    switch (field) {
      case 'annual_income':
        if (value <= 0) return 'Annual income must be greater than 0';
        if (value > 1000000) return 'Annual income seems too high';
        return undefined;
      case 'deposit_amount':
        if (value < 0) return 'Deposit amount cannot be negative';
        if (value > formData.property_value) return 'Deposit cannot be greater than property value';
        return undefined;
      case 'property_value':
        if (value <= 0) return 'Property value must be greater than 0';
        if (value > 10000000) return 'Property value seems too high';
        return undefined;
      case 'term_years':
        if (value < 5) return 'Minimum term is 5 years';
        if (value > 40) return 'Maximum term is 40 years';
        return undefined;
      default:
        return undefined;
    }
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
    
    // Clear previous error for this field
    setErrors(prev => ({ ...prev, [field]: undefined }));

    // Validate the input
    const error = validateInput(field, value);
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    // Validate all fields
    Object.keys(formData).forEach((field) => {
      const error = validateInput(field, formData[field as keyof typeof formData]);
      if (error) {
        newErrors[field as keyof ValidationErrors] = error;
        isValid = false;
      }
    });

    // Additional validation for deposit vs property value
    if (formData.deposit_amount > formData.property_value) {
      newErrors.deposit_amount = 'Deposit cannot be greater than property value';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCalculate = async () => {
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please correct the errors before calculating.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setEligibleProducts([]);
    setSelectedProducts([]);
    try {
      const result = await quoteApi.getEligibleProducts(formData);
      if (result.success && Array.isArray(result.data) && result.data.length > 0) {
        setEligibleProducts(result.data);
      } else {
        toast({
          title: 'No Products Found',
          description: 'No eligible mortgage products found for your details.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch eligible products.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductSelect = (product: any) => {
    setSelectedProducts(prev => {
      if (prev.some(p => p.product_id === product.product_id)) {
        return prev.filter(p => p.product_id !== product.product_id);
      } else if (prev.length < 3) {
        return [...prev, product];
      } else {
        toast({
          title: 'Limit Reached',
          description: 'You can only compare up to 3 products.',
          variant: 'destructive',
        });
        return prev;
      }
    });
  };

  const handleSaveEligibleProducts = async () => {
    if (!userId) {
      toast({
        title: 'Login Required',
        description: 'Please log in to save eligible products.',
        variant: 'destructive',
      });
      return;
    }
    setIsSavingEligible(true);
    try {
      const result = await quoteApi.saveEligibleProducts(userId, formData, eligibleProducts);
      if (result.success) {
        toast({
          title: 'Eligible Products Saved',
          description: 'Your eligible products have been saved successfully.',
        });
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Failed to save eligible products.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save eligible products.',
        variant: 'destructive',
      });
    } finally {
      setIsSavingEligible(false);
    }
  };

  const handleSaveQuote = async () => {
    if (!userId) {
      toast({
        title: 'Login Required',
        description: 'Please log in to save your quote.',
        variant: 'destructive',
      });
      return;
    }
    setIsSavingQuote(true);
    try {
      const quoteData = { ...formData, product_id: null };
      const result = await quoteApi.saveQuote(userId, quoteData);
      if (result.success) {
        toast({
          title: 'Quote Saved',
          description: 'Your quote has been saved successfully.',
        });
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Failed to save quote.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save quote.',
        variant: 'destructive',
      });
    } finally {
      setIsSavingQuote(false);
    }
  };

  return (
    <Card className="w-full max-w-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-rose-700">Mortgage Calculator</h2>
      <div className="grid gap-4">
        <div>
          <Label htmlFor="annualIncome">Annual Income (£)</Label>
          <Input
            type="number"
            id="annualIncome"
            placeholder="Enter annual income"
            value={formData.annual_income || ''}
            onChange={handleInputChange('annual_income')}
            min="0"
            step="1000"
          />
          {errors.annual_income && (
            <p className="text-red-500 text-sm mt-1">{errors.annual_income}</p>
          )}
        </div>
        <div>
          <Label htmlFor="depositAmount">Deposit Amount (£)</Label>
          <Input
            type="number"
            id="depositAmount"
            placeholder="Enter deposit amount"
            value={formData.deposit_amount || ''}
            onChange={handleInputChange('deposit_amount')}
            min="0"
            step="1000"
          />
          {errors.deposit_amount && (
            <p className="text-red-500 text-sm mt-1">{errors.deposit_amount}</p>
          )}
        </div>
        <div>
          <Label htmlFor="propertyValue">Property Value (£)</Label>
          <Input
            type="number"
            id="propertyValue"
            placeholder="Enter property value"
            value={formData.property_value || ''}
            onChange={handleInputChange('property_value')}
            min="0"
            step="1000"
          />
          {errors.property_value && (
            <p className="text-red-500 text-sm mt-1">{errors.property_value}</p>
          )}
        </div>
        <div>
          <Label htmlFor="termYears">Loan Term (Years)</Label>
          <Input
            type="number"
            id="termYears"
            placeholder="Enter loan term"
            value={formData.term_years || ''}
            onChange={handleInputChange('term_years')}
            min="5"
            max="40"
            step="1"
          />
          {errors.term_years && (
            <p className="text-red-500 text-sm mt-1">{errors.term_years}</p>
          )}
        </div>
      </div>
      <Button
        onClick={handleCalculate}
        className="w-full mt-4 bg-rose-700 hover:bg-rose-800"
        disabled={isLoading}
      >
        {isLoading ? 'Calculating...' : 'Calculate'}
      </Button>
      {!publicMode && (
        <Button
          className="w-full mt-2 bg-rose-600 hover:bg-rose-700"
          onClick={handleSaveQuote}
          disabled={isSavingQuote || !userId}
        >
          {isSavingQuote ? 'Saving...' : 'Save Quote'}
        </Button>
      )}

      {/* Eligible Products List */}
      {eligibleProducts.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Eligible Products</h3>
          <div className="space-y-2">
            {eligibleProducts.map(product => (
              <div key={product.product_id} className="border rounded p-3">
                <div className="font-bold">{product.product_name} <span className="text-xs text-gray-500">({product.lender_name})</span></div>
                <div className="text-sm">Interest Rate: {product.interest_rate}%</div>
                <div className="text-sm">Loan Amount: £{product.loan_amount.toFixed(2)}</div>
                <div className="text-sm">Monthly Payment: £{product.monthly_payment.toFixed(2)}</div>
                {!publicMode && (
                  <input
                    type="checkbox"
                    checked={selectedProducts.some(p => p.product_id === product.product_id)}
                    onChange={() => handleProductSelect(product)}
                    disabled={
                      !selectedProducts.some(p => p.product_id === product.product_id) && selectedProducts.length >= 3
                    }
                  />
                )}
              </div>
            ))}
          </div>
          {!publicMode && (
            <Button className="mt-4" onClick={handleSaveEligibleProducts} disabled={isSavingEligible || !userId}>
              {isSavingEligible ? 'Saving...' : 'Save Eligible Products'}
            </Button>
          )}
        </div>
      )}

      {/* Comparison Summary */}
      {!publicMode && selectedProducts.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Comparison Summary</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
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
                {selectedProducts.map(product => (
                  <tr key={product.product_id}>
                    <td className="border px-2 py-1">{product.product_name} <span className="text-xs text-gray-500">({product.lender_name})</span></td>
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
        </div>
      )}
    </Card>
  );
};

export default MortgageCalculator;
