import { getMultiPropertyByPath } from './object';
import { formatDate } from './date';

export function normalizePages<T>(pages?: any[]): T[] {
  return pages && pages?.length > 0 ? pages?.reduce((prev: T[], current) => [...prev, ...current.pages], []) : [];
}

export function normalizePaginated<T>(data: {
  pages: {
    msg: string;
    data: T[];
  }[];
}): T[] {
  return (data?.pages || []).flatMap((page) => page.data);
}

export type TTransformableTableData<T> = {
  data: any;
  fields: (string | ((item: T) => any))[];
  action?: (item: any) => any;
};

export const transformTableData = <T>({ data, fields, action }: TTransformableTableData<T>): any[] => {
  data = data ?? [];

  const tableData = data.map((item: any) => {
    const row: any = [];

    fields.forEach((field: string | ((item: T) => any)) => {
      if (field === 'S/N') {
        row.push(data.indexOf(item) + 1);
      } else if (typeof field === 'function') {
        const fieldFunc = field as any;
        const value = fieldFunc(item);
        row.push(value);
      } else if (field.includes('|')) {
        const path = field.replace(/\|/g, ',');
        let value = '';

        value = getMultiPropertyByPath<string>(item, path).values?.join(' ') as string;

        row.push(value);
      } else if (field.includes(',')) {
        const fieldArr = field.split(',');
        let value = '';
        fieldArr.forEach((f: string) => {
          if (f.includes('.')) {
            const nestedFieldArr = f.split('.');
            let nestedValue = item;
            nestedFieldArr.forEach((nf: string) => {
              nestedValue = nestedValue?.[nf] ?? 'N/A';
            });
            value += nestedValue + ' ';
          } else {
            value += (item[f] ?? 'N/A') + ' ';
          }
        });

        row.push(value.trim());
      } else {
        const fieldArr = field.split('.');
        let value = item;
        fieldArr.forEach((f: string) => {
          value = value?.[f] ?? 'N/A';
        });

        if (typeof value == 'number') {
          value = String(value);
        } else if (typeof value === 'string' && value.includes('T') && value.includes('Z') && !isNaN(Date.parse(value))) {
             // Replaced moment(value).format('YYYY-MM-DD') with formatDate helper
             value = formatDate(value);
        }

        row.push(value);
      }
    });

    if (action) {
      row.push(action(item));
    }

    return row;
  });

  return tableData;
};

export const gridCols = (widthString: string): number[] => {
  const fractions = widthString.split(',').map((fraction) => Number(fraction));
  const totalValue = fractions.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  const percentages = fractions.map((fraction) => (fraction / totalValue) * (100 / 1));
  return percentages;
};
