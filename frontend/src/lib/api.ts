const API_BASE_URL = 'http://localhost:8000/api';

export interface QuoteData {
  product_id: number;
  annual_income: number;
  deposit_amount: number;
  property_value: number;
  term_years: number;
}

export interface QuoteResponse {
  success: boolean;
  data?: {
    loan_amount: number;
    monthly_payment: number;
    total_interest: number;
    total_payment: number;
    term_years: number;
    interest_rate: number;
  };
  message?: string;
}

export interface SavedQuote {
  id: number;
  user_id: number;
  product_id: number;
  product_name: string;
  annual_income: number;
  deposit_amount: number;
  property_value: number;
  loan_amount: number;
  interest_rate: number;
  term_years: number;
  monthly_payment: number;
  total_interest: number;
  total_payment: number;
  created_at: string;
}

export const quoteApi = {
  calculateQuote: async (data: QuoteData): Promise<QuoteResponse> => {
    const response = await fetch(`${API_BASE_URL}/quotes.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'calculate',
        ...data
      }),
    });
    return response.json();
  },

  saveQuote: async (userId: number, quoteData: any): Promise<QuoteResponse> => {
    const response = await fetch(`${API_BASE_URL}/quotes.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'save',
        user_id: userId,
        quote_data: quoteData
      }),
    });
    return response.json();
  },

  getUserQuotes: async (userId: number): Promise<{ success: boolean; data: SavedQuote[] }> => {
    const response = await fetch(`${API_BASE_URL}/quotes.php?user_id=${userId}`);
    return response.json();
  },

  getQuoteById: async (quoteId: number, userId: number): Promise<{ success: boolean; data: SavedQuote }> => {
    const response = await fetch(`${API_BASE_URL}/quotes.php?user_id=${userId}&quote_id=${quoteId}`);
    return response.json();
  },

  deleteQuote: async (quoteId: number, userId: number): Promise<QuoteResponse> => {
    const response = await fetch(`${API_BASE_URL}/quotes.php`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quote_id: quoteId,
        user_id: userId
      }),
    });
    return response.json();
  },

  compareQuotes: async (quoteIds: number[], userId: number): Promise<{ success: boolean; data: SavedQuote[]; message?: string }> => {
    const response = await fetch(`${API_BASE_URL}/quotes.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'compare',
        quote_ids: quoteIds,
        user_id: userId
      }),
    });
    return response.json();
  },

  getEligibleProducts: async (data: { annual_income: number; deposit_amount: number; property_value: number; term_years: number }) => {
    const response = await fetch(`${API_BASE_URL}/quotes.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'eligible_products',
        ...data
      }),
    });
    return response.json();
  },

  fetchSavedEligibleProducts: async (userId: number) => {
    const response = await fetch(`${API_BASE_URL}/quotes.php?user_id=${userId}&action=get_eligible_products`);
    return response.json();
  },

  saveComparison: async (userId: number, comparisonData: any[]) => {
    const response = await fetch(`${API_BASE_URL}/quotes.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'save_comparison',
        user_id: userId,
        comparison_data: comparisonData
      }),
    });
    return response.json();
  },

  saveEligibleProducts: async (userId: number, inputData: any, products: any[]) => {
    const response = await fetch(`${API_BASE_URL}/quotes.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'save_eligible_products',
        user_id: userId,
        input_data: inputData,
        products: products
      }),
    });
    return response.json();
  },

  updateQuote: async (quoteId: number, userId: number, quoteData: any) => {
    const response = await fetch(`${API_BASE_URL}/quotes.php`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quote_id: quoteId,
        user_id: userId,
        quote_data: quoteData
      }),
    });
    return response.json();
  },
};

export const productApi = {
  getAll: async () => {
    const response = await fetch('http://localhost:8000/api/products/list.php');
    return response.json();
  },
  create: async (productData: any, token: string) => {
    const response = await fetch('http://localhost:8000/api/products/create.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    return response.json();
  },
  update: async (id: number, productData: any, token: string) => {
    const response = await fetch(`http://localhost:8000/api/products/update.php?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    return response.json();
  },
  delete: async (id: number, token: string) => {
    const response = await fetch(`http://localhost:8000/api/products/delete.php?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },
  // ... (add create, update, delete as needed)
}; 