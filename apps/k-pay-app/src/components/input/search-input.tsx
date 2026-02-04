import { View, TextInput, TextInputProps } from 'react-native';
import { useState } from 'react';
import { Filter, SearchNormal1 } from 'iconsax-react-nativejs';
import { useTranslation } from 'react-i18next';

type SearchInputProps = TextInputProps & {
  iconPosition?: 'left' | 'right';
  placeholder?: string;
};

export const SearchInput = ({
  iconPosition = 'left',
  placeholder,
  ...rest
}: SearchInputProps) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  return (
    <View className="flex items-center flex-row gap-2 ">
      <View
        className="flex-row items-center w-[85%]
       bg-gray-50/20 rounded-xl px-4 py-1 border-gray-200 border"
      >
        {iconPosition === 'left' && (
          <SearchNormal1 size={20} color="#9ca3af" variant="Outline" />
        )}
        <TextInput
          placeholder={placeholder || t('search')}
          value={search}
          onChangeText={setSearch}
          className="flex-1 mx-3 text-gray-900"
          placeholderTextColor="#9ca3af"
          {...rest}
        />
        {iconPosition === 'right' && (
          <SearchNormal1 size={20} color="#9ca3af" variant="Outline" />
        )}
      </View>

      <View
        className="border-gray-200 border p-2 rounded-lg
        items-center  justify-center w-[49px] h-[49px]"
      >
        <Filter />
      </View>
    </View>
  );
};
