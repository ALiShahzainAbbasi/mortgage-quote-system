import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProductForm, { ProductFormData } from "@/components/admin/ProductForm";
import { productApi } from "@/lib/api";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<ProductFormData | null>(null);
  const { user, isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    if (isAuthenticated && user?.role !== "admin" && user?.role !== "broker") {
      toast({
        title: "Access Denied",
        description: "You do not have permission to access this page.",
        variant: "destructive",
      });
      navigate("/dashboard");
    }
    
    // Fetch products from backend
    const fetchProducts = async () => {
      const res = await productApi.getAll();
      if (res.success && res.data && Array.isArray(res.data.products)) {
        setProducts(res.data.products);
      } else {
        setProducts([]); // fallback to empty array
      }
    };
    fetchProducts();
  }, [isAuthenticated, user, navigate, toast]);
  
  const handleDelete = async (id: number) => {
    const res = await productApi.delete(id, token);
    if (res.success) {
      // Re-fetch products from backend
      const updated = await productApi.getAll();
      if (updated.success && updated.data && Array.isArray(updated.data.products)) {
        setProducts(updated.data.products);
      }
      toast({
        title: "Product Deleted",
        description: "The mortgage product has been successfully deleted.",
      });
    } else {
      toast({
        title: "Error",
        description: res.message || "Failed to delete product.",
        variant: "destructive",
      });
    }
  };

  const handleAddProduct = () => {
    setCurrentProduct(null);
    setIsAddDialogOpen(true);
  };

  const handleEditProduct = (product: ProductFormData) => {
    setCurrentProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleProductSubmit = async (data: ProductFormData) => {
    const backendData = {
      lender_name: data.lenderName,
      product_name: data.lenderName, // or another field if you have a separate product name
      max_income_multiple: data.maxIncome,
      min_credit_score: data.minCreditScore,
      min_deposit_percentage: data.initialDepositRequired,
      employment_type: data.employmentTypeRequired,
      interest_rate: data.interestRate,
      term_years: 25 // or get from your form if you have a term field
    };

    if (data.id) {
      // Update existing product in the database
      const res = await productApi.update(data.id, backendData, token);
      if (res.success) {
        // Re-fetch products from backend
        const updated = await productApi.getAll();
        if (updated.success && updated.data && Array.isArray(updated.data.products)) {
          setProducts(updated.data.products);
        }
        setIsEditDialogOpen(false);
        toast({ title: "Product Updated", description: "Product updated in database." });
      } else {
        toast({ title: "Error", description: res.message || "Failed to update product.", variant: "destructive" });
      }
    } else {
      const res = await productApi.create(backendData, token);
      if (res.success) {
        // Re-fetch products from backend
        const updated = await productApi.getAll();
        if (updated.success && updated.data && Array.isArray(updated.data.products)) {
          setProducts(updated.data.products);
        }
        setIsAddDialogOpen(false);
        toast({ title: "Product Added", description: "Product added to database." });
      } else {
        toast({ title: "Error", description: res.message || "Failed to add product.", variant: "destructive" });
      }
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-rose-900">Admin: Mortgage Products</h1>
            <Button 
              className="mt-2 md:mt-0 bg-rose-700 hover:bg-rose-800"
              onClick={handleAddProduct}
            >
              Add New Product
            </Button>
          </div>
          
          <Card className="shadow-lg">
            <CardHeader className="bg-rose-50">
              <CardTitle className="text-rose-800">Available Mortgage Products</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>A list of available mortgage products.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lender Name</TableHead>
                    <TableHead>Interest Rate</TableHead>
                    <TableHead>Max Income</TableHead>
                    <TableHead>Min Credit Score</TableHead>
                    <TableHead>Initial Deposit</TableHead>
                    <TableHead>Employment Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(Array.isArray(products) ? products : []).map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.lender_name}</TableCell>
                      <TableCell>{product.interest_rate}%</TableCell>
                      <TableCell>£{typeof product.max_income_multiple === "number" ? product.max_income_multiple.toLocaleString() : ""}</TableCell>
                      <TableCell>{product.min_credit_score}</TableCell>
                      <TableCell>£{typeof product.min_deposit_percentage === "number" ? product.min_deposit_percentage.toLocaleString() : ""}</TableCell>
                      <TableCell>{product.employment_type}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditProduct(product)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
      
      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Mortgage Product</DialogTitle>
          </DialogHeader>
          <ProductForm 
            onSubmit={handleProductSubmit}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Mortgage Product</DialogTitle>
          </DialogHeader>
          {currentProduct && (
            <ProductForm 
              product={currentProduct}
              onSubmit={handleProductSubmit}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default ProductsPage;
