export interface CreateCardRequest {
  number: string;
  cardDate: string;
  name: string;
  cvv: string;
  zipCode: string;
}

export interface StripeCardData {
  cvc: string;
  exp_month: string;
  exp_year: string;
  name: string;
  number: string;
}

export interface StripeTokenResponse {
  id: string; // token ID
  card?: {
    id: string;
    brand: string;
    last4: string;
  };
  error?: {
    message: string;
  };
}
