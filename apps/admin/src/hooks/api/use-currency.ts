import { useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { CREATE_CURRENCY_MUTATION, UPDATE_CURRENCY_MUTATION, DELETE_CURRENCY_MUTATION } from '@repo/api';

interface CreateCurrencyInput {
  code: string;
  countryCode?: string;
  countryNames: string[];
  exchangeRateUSD?: number;
  isActive?: boolean;
  name: string;
  precision?: number;
  symbol: string;
}

interface UpdateCurrencyInput {
  code?: string;
  countryCode?: string;
  countryNames?: string[];
  exchangeRateUSD?: number;
  isActive?: boolean;
  name?: string;
  precision?: number;
  symbol?: string;
}

interface CurrencyResponse {
  success: boolean;
  message?: string;
  currency?: any;
}

const useCurrency = () => {
  const [createCurrencyMutation, { loading: createLoading, error: createError }] =
    useMutation(CREATE_CURRENCY_MUTATION);
  const [updateCurrencyMutation, { loading: updateLoading, error: updateError }] =
    useMutation(UPDATE_CURRENCY_MUTATION);
  const [deleteCurrencyMutation, { loading: deleteLoading, error: deleteError }] =
    useMutation(DELETE_CURRENCY_MUTATION);

  const createCurrency = async (input: CreateCurrencyInput): Promise<CurrencyResponse> => {
    try {
      const { data } = await createCurrencyMutation({
        variables: {
          input
        }
      });

      if (data?.createCurrency) {
        toast.success('Currency created successfully');
        return {
          success: true,
          message: 'Currency created successfully',
          currency: data.createCurrency
        };
      }

      return {
        success: false,
        message: 'Failed to create currency'
      };
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create currency';
      toast.error(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    }
  };

  const updateCurrency = async (id: string, input: UpdateCurrencyInput): Promise<CurrencyResponse> => {
    try {
      const { data } = await updateCurrencyMutation({
        variables: {
          id,
          input
        }
      });

      if (data?.updateCurrency) {
        toast.success('Currency updated successfully');
        return {
          success: true,
          message: 'Currency updated successfully',
          currency: data.updateCurrency
        };
      }

      return {
        success: false,
        message: 'Failed to update currency'
      };
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update currency';
      toast.error(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    }
  };

  const deleteCurrency = async (id: string): Promise<CurrencyResponse> => {
    try {
      const { data } = await deleteCurrencyMutation({
        variables: { id }
      });

      if (data?.deleteCurrency?.success) {
        toast.success('Currency deleted successfully');
        return {
          success: true,
          message: 'Currency deleted successfully'
        };
      }

      return {
        success: false,
        message: data?.deleteCurrency?.message || 'Failed to delete currency'
      };
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to delete currency';
      toast.error(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    }
  };

  return {
    createCurrency,
    createLoading,
    createError,
    updateCurrency,
    updateLoading,
    updateError,
    deleteCurrency,
    deleteLoading,
    deleteError
  };
};

export default useCurrency;
export type { CreateCurrencyInput, UpdateCurrencyInput, CurrencyResponse };
