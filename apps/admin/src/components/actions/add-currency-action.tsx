import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import useCurrency from '@/hooks/api/use-currency';

const AddCurrencyAction = () => {
  const [formData, setFormData] = useState({
    code: '',
    countryCode: '',
    countryNames: '',
    exchangeRateUSD: '',
    isActive: true,
    name: '',
    precision: 2,
    symbol: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { createCurrency, createLoading } = useCurrency();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.code.trim()) {
      newErrors.code = 'Currency code is required';
    } else if (formData.code.length < 2 || formData.code.length > 5) {
      newErrors.code = 'Currency code must be 2-5 characters';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Currency name is required';
    }

    if (!formData.symbol.trim()) {
      newErrors.symbol = 'Currency symbol is required';
    }

    if (!formData.countryNames.trim()) {
      newErrors.countryNames = 'Country names are required';
    }

    // Optional field validations
    if (formData.countryCode && formData.countryCode.length !== 2) {
      newErrors.countryCode = 'Country code must be exactly 2 characters';
    }

    if (
      formData.exchangeRateUSD &&
      (parseFloat(formData.exchangeRateUSD) <= 0 || isNaN(parseFloat(formData.exchangeRateUSD)))
    ) {
      newErrors.exchangeRateUSD = 'Exchange rate must be a valid positive number';
    }

    if (formData.precision < 0 || formData.precision > 8) {
      newErrors.precision = 'Precision must be between 0 and 8';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const countryNamesArray = formData.countryNames
      .split(',')
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    if (countryNamesArray.length === 0) {
      setErrors({ countryNames: 'At least one country name is required' });
      return;
    }

    const currencyInput: any = {
      code: formData.code.toUpperCase(),
      name: formData.name,
      symbol: formData.symbol,
      countryNames: countryNamesArray,
      isActive: formData.isActive
    };

    // Add optional fields only if they have values
    if (formData.countryCode.trim()) {
      currencyInput.countryCode = formData.countryCode.toUpperCase();
    }

    if (formData.exchangeRateUSD.trim()) {
      currencyInput.exchangeRateUSD = parseFloat(formData.exchangeRateUSD);
    }

    if (formData.precision !== undefined) {
      currencyInput.precision = formData.precision;
    }

    const result = await createCurrency(currencyInput);

    if (result.success) {
      setFormData({
        code: '',
        countryCode: '',
        countryNames: '',
        exchangeRateUSD: '',
        isActive: true,
        name: '',
        precision: 2,
        symbol: ''
      });
      setErrors({});
    }
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === 'code' || field === 'countryCode' ? String(value).toUpperCase() : value
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Add New Currency</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Currency Code <span className="text-red-500">*</span>
            </Label>
            <Input
              value={formData.code}
              onChange={(e) => handleInputChange('code', e.target.value)}
              placeholder="e.g., NGN, USD, EUR"
              maxLength={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.code && <p className="text-sm text-red-600">{errors.code}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Currency Name <span className="text-red-500">*</span>
            </Label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., Nigerian Naira, US Dollar"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Currency Symbol <span className="text-red-500">*</span>
            </Label>
            <Input
              value={formData.symbol}
              onChange={(e) => handleInputChange('symbol', e.target.value)}
              placeholder="e.g., ₦, $, €"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.symbol && <p className="text-sm text-red-600">{errors.symbol}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Country Code</Label>
            <Input
              value={formData.countryCode}
              onChange={(e) => handleInputChange('countryCode', e.target.value)}
              placeholder="e.g., NG, US, DE"
              maxLength={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.countryCode && <p className="text-sm text-red-600">{errors.countryCode}</p>}
            <p className="text-xs text-gray-500">Optional: ISO 3166-1 alpha-2 country code</p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Exchange Rate to USD</Label>
            <Input
              type="text"
              value={formData.exchangeRateUSD}
              onChange={(e) => handleInputChange('exchangeRateUSD', e.target.value)}
              placeholder="e.g., 1600.50"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.exchangeRateUSD && <p className="text-sm text-red-600">{errors.exchangeRateUSD}</p>}
            <p className="text-xs text-gray-500">Optional: Current exchange rate to USD</p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Precision (Decimal Places)</Label>
            <Input
              type="number"
              value={formData.precision}
              onChange={(e) => handleInputChange('precision', parseInt(e.target.value) || 0)}
              placeholder="2"
              min="0"
              max="8"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.precision && <p className="text-sm text-red-600">{errors.precision}</p>}
            <p className="text-xs text-gray-500">Number of decimal places (0-8)</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Country Names <span className="text-red-500">*</span>
          </Label>
          <Input
            value={formData.countryNames}
            onChange={(e) => handleInputChange('countryNames', e.target.value)}
            placeholder="e.g., Nigeria, Ghana, Kenya"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500">Enter countries separated by commas (at least one required)</p>
          {errors.countryNames && <p className="text-sm text-red-600">{errors.countryNames}</p>}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium text-gray-700">Active Status</Label>
            <p className="text-xs text-gray-500">Enable or disable this currency</p>
          </div>
          <Switch
            checked={formData.isActive}
            onCheckedChange={(checked) => handleInputChange('isActive', checked)}
            className="data-[state=checked]:bg-blue-600"
          />
        </div>

        <Button
          type="submit"
          disabled={createLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createLoading ? 'Creating Currency...' : 'Create Currency'}
        </Button>
      </form>
    </div>
  );
};

export default AddCurrencyAction;
