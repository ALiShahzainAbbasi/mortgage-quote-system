
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";

export interface ProductFormData {
  id?: number;
  lenderName: string;
  interestRate: number;
  maxIncome: number;
  minCreditScore: number;
  initialDepositRequired: number;
  employmentTypeRequired: string;
}

interface ProductFormProps {
  product?: ProductFormData;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
}

const ProductForm = ({ product, onSubmit, onCancel }: ProductFormProps) => {
  const { toast } = useToast();
  const form = useForm<ProductFormData>({
    defaultValues: product || {
      lenderName: "",
      interestRate: 0,
      maxIncome: 0,
      minCreditScore: 0,
      initialDepositRequired: 0,
      employmentTypeRequired: "",
    },
  });

  const handleSubmit = (data: ProductFormData) => {
    onSubmit({
      ...data,
      id: product?.id,
    });
    
    toast({
      title: product ? "Product Updated" : "Product Added",
      description: `Mortgage product has been successfully ${product ? "updated" : "added"}.`,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="lenderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lender Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="interestRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interest Rate (%)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  {...field} 
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maxIncome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Income (£)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="minCreditScore"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Min Credit Score</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="initialDepositRequired"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Initial Deposit Required (£)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="employmentTypeRequired"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employment Type Required</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onCancel} type="button">
            Cancel
          </Button>
          <Button type="submit" className="bg-rose-700 hover:bg-rose-800">
            {product ? "Update Product" : "Add Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
