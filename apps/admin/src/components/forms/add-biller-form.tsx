import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from 'k-polygon-assets/components';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import UploadFileInput from '@/components/ui/upload-file-input';
import { toast } from 'sonner';

const addBillerSchema = z.object({
  categoryName: z.string().min(2, 'Category name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  logo: z.any().optional(),
  status: z.boolean()
});

type AddBillerFormData = z.infer<typeof addBillerSchema>;

interface AddBillerFormProps {
  onSubmit: (data: AddBillerFormData & { logoFile?: File }) => Promise<void>;
  isLoading?: boolean;
}

const AddBillerForm: React.FC<AddBillerFormProps> = ({ onSubmit, isLoading = false }) => {
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const form = useForm<AddBillerFormData>({
    resolver: zodResolver(addBillerSchema),
    defaultValues: {
      categoryName: '',
      description: '',
      status: true
    }
  });

  const handleSubmit = async (data: AddBillerFormData) => {
    try {
      await onSubmit({ ...data, logoFile: logoFile || undefined });
      toast.success('Biller added successfully');
      form.reset();
      setLogoFile(null);
    } catch (error) {
      toast.error('Failed to add biller. Please try again.');
      console.error('Error adding biller:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Category Name */}
        <FormField
          control={form.control}
          name="categoryName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-900">Category Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter category name" className="w-full h-12 py-3" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-900">Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Nigeria's largest telecom operator"
                  className="w-full min-h-[80px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Upload Logo */}
        <UploadFileInput
          label="Upload Logo"
          accept="image/*"
          onChange={(file) => setLogoFile(file)}
          placeholder="Choose File"
        />

        {/* Status */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel className="text-sm font-medium text-gray-900">Status</FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 py-3 rounded-lg font-medium"
          disabled={isLoading}
        >
          {isLoading ? 'Adding Bill...' : 'Add Bill'}
        </Button>
      </form>
    </Form>
  );
};

export default AddBillerForm;
