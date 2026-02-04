export interface CardRecord {
  id: string;
  cardNumber: string; // formatted with spaces, e.g., 1234 5678 9012 3456
  expiryDate: string; // MM/YY
  CVV: string; // 3 digits
  holderName: string; // Card holder name
  pin: string; // 4-digit PIN (stored in plain text for demo; do NOT use in production)
}

const STORAGE_KEY = 'kpay.cards';

function read(): CardRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as CardRecord[];
    return [];
  } catch {
    return [];
  }
}

function write(cards: CardRecord[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

export function getCards(): CardRecord[] {
  return read();
}

export function addCard(card: Omit<CardRecord, 'id'>): CardRecord[] {
  const cards = read();
  const newCard: CardRecord = { id: cryptoRandomId(), ...card };
  const updated = [...cards, newCard];
  write(updated);
  return updated;
}

export function removeCard(id: string): CardRecord[] {
  const cards = read();
  const updated = cards.filter((c) => c.id !== id);
  write(updated);
  return updated;
}

export function saveCards(cards: CardRecord[]): void {
  write(cards);
}

export function verifyCardPin(cardId: string, pinAttempt: string): boolean {
  const cards = read();
  const found = cards.find((c) => c.id === cardId);
  if (!found) return false;
  return (found.pin || '') === (pinAttempt || '');
}

function cryptoRandomId(): string {
  // Use Web Crypto for better uniqueness if available, otherwise fallback
  try {
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    return Array.from(arr)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
}
