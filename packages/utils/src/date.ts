export const formatDate = (
  date: Date | string | number,
  locale: string = "en-US",
): string => {
  const d = new Date(date);
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
};

export const formatDateTime = (
  date: Date | string | number,
  locale: string = "en-US",
): string => {
  const d = new Date(date);
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(d);
};
