'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from 'k-polygon-assets/components';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'k-polygon-assets/components';
import { UserAvatar } from '@/components/ui/user-avatar';
import { Typography } from '@/components/sub-modules/typography/typography';
import { useUserStore } from '@/store/user-store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const personalDetailsSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.email('Please enter a valid email address'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  gender: z.string().optional(),
  language: z.string().optional()
});

type PersonalDetailsFormData = z.infer<typeof personalDetailsSchema>;

interface PersonalDetailsFormProps {
  className?: string;
}

export const PersonalDetailsForm: React.FC<PersonalDetailsFormProps> = ({ className }) => {
  const { userAccount } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);

  // Get user data from the store
  const user = userAccount?.user;
  const admin = userAccount?.admin;
  const merchant = userAccount?.merchant;

  // Determine which profile to use
  const profile = user || admin || merchant;
  const fullName = profile
    ? 'firstName' in profile
      ? `${profile.firstName} ${profile.lastName}`
      : 'businessName' in profile
        ? profile.businessName
        : 'Unknown User'
    : 'Unknown User';

  const form = useForm<PersonalDetailsFormData>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {
      firstName: profile && 'firstName' in profile ? profile.firstName : '',
      lastName: profile && 'lastName' in profile ? profile.lastName : '',
      email: user?.email || (admin && 'email' in admin ? admin.email : '') || '',
      phoneNumber: user?.phone || '',
      gender: 'N/A',
      language: 'English'
    }
  });

  const onSubmit = (data: PersonalDetailsFormData) => {
    setIsLoading(true);
    console.log('Form data:', data);

    setTimeout(() => {
      setIsLoading(false);
      toast.success('Personal details updated successfully!');
    }, 2000);
  };

  const handleDiscard = () => {
    form.reset();
    toast.info('Changes discarded');
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* User Avatar and Info Card */}
      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <div className="flex items-center space-x-4">
          <UserAvatar
            name={fullName}
            email={user?.email || (admin && 'email' in admin ? admin.email : '') || ''}
            size="lg"
          />
        </div>
      </div>

      {/* Personal Details Form Card */}
      <div className="border border-gray-200 rounded-lg px-6 py-8 bg-white">
        <Typography variant="h3" className="text-gray-900 mb-6">
          Personal Details
        </Typography>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <div className="flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 rounded-l-md">
                          <span className="text-sm text-gray-600">🇺🇸 +1</span>
                        </div>
                        <Input placeholder="Enter your phone number" className="rounded-l-none" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="N/A">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="French">French</SelectItem>
                        <SelectItem value="German">German</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>

      {/* Action Buttons - Outside of cards */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={handleDiscard} disabled={isLoading}>
          Discard changes
        </Button>
        <Button
          type="submit"
          onClick={form.handleSubmit(onSubmit)}
          disabled={isLoading}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          {isLoading ? 'Saving...' : 'Save changes'}
        </Button>
      </div>
    </div>
  );
};
