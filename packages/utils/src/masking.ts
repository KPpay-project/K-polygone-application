export const maskCardNumber = (cardNumber: string, visibleDigits: number = 4): string => {
  const cleanNumber = cardNumber.replace(/\D/g, '');
  if (cleanNumber.length <= visibleDigits) return cleanNumber;
  
  const visible = cleanNumber.slice(-visibleDigits);
  const masked = '*'.repeat(cleanNumber.length - visibleDigits);
  
  if (cleanNumber.length === 16) {
      const all = masked + visible;
      return all.match(/.{1,4}/g)?.join(' ') || all;
  }
  
  return masked + visible;
};

export const maskEmail = (email: string): string => {
  const [user, domain] = email.split('@');
  if (!user || !domain) return email;
  
  const visibleUser = user.length > 2 ? user.slice(0, 2) + '*'.repeat(user.length - 2) : user;
  return `${visibleUser}@${domain}`;
};

export const maskPhoneNumber = (phone: string, visibleDigits: number = 4): string => {
    const cleanPhone = phone.replace(/\s/g, '');
    if (cleanPhone.length <= visibleDigits) return cleanPhone;
    return '*'.repeat(cleanPhone.length - visibleDigits) + cleanPhone.slice(-visibleDigits);
};
