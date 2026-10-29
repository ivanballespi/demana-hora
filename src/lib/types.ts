export type Business = {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  email: string;
  phone: string | null;
  address: string | null;
  description: string | null;
  timezone: string;
  cancel_hours: number;
  min_notice_hours: number;
  max_days_ahead: number;
  stripe_account_id: string | null;
  stripe_charges_enabled: boolean;
  stripe_customer_id: string | null;
  subscription_id: string | null;
  subscription_status: string | null;
  trial_ends_at: string;
  created_at: string;
};

export type Service = {
  id: string;
  business_id: string;
  name: string;
  duration_min: number;
  price_cents: number;
  deposit_cents: number;
  active: boolean;
};

export type OpeningHour = {
  id: string;
  business_id: string;
  weekday: number;
  start_time: string;
  end_time: string;
};

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "attended" | "no_show" | "expired";

export type Booking = {
  id: string;
  business_id: string;
  service_id: string | null;
  service_name: string;
  starts_at: string;
  ends_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  status: BookingStatus;
  price_cents: number;
  deposit_cents: number;
  refunded: boolean;
  stripe_session_id: string | null;
  stripe_payment_intent: string | null;
  cancel_token: string;
  hold_expires_at: string | null;
  reminder_sent: boolean;
  created_at: string;
};
