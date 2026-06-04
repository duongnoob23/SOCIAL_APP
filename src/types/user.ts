export interface User {
  id?: number;
  email?: string;
  encrypted_password?: string;
  reset_password_token?: string | null;
  reset_password_sent_at?: string | null;
  remember_created_at?: string | null;
  sign_in_count?: number;
  current_sign_in_at?: string | null;
  last_sign_in_at?: string | null;
  current_sign_in_ip?: string | null;
  last_sign_in_ip?: string | null;
  created_at?: string;
  updated_at?: string;
  authentication_token?: string;
  first_name?: string;
  last_name?: string;
  stripe_id?: string | null;
  notification_freq?: number;
  paused?: boolean;
  ios_token?: string | null;
  last_sync_version?: string | null;
  last_sync_at?: string | null;
  custom_month?: string | null;
  subscription_level?: number;
  promo_code?: string;
  has_billing_error?: boolean;
  timezone?: string;
  custom_month_created_at?: string | null;
  is_notification_tester?: boolean;
  ios_version?: string | null;
  custom_month_via_admin?: boolean;
  has_added_moments?: boolean;
  last_os_type?: number;
  android_version?: string | null;
  has_border?: boolean;
  android_last_sync_version?: string | null;
  status?: string;
  accepted_notifications?: boolean | null;
  tour_dismissed?: boolean | null;
  dismissed_double_mobile?: boolean;
  dismissed_double_web?: boolean;
  dismissed_double_web_google?: boolean;
  dismissed_add_moments?: boolean;
  rating_count?: number | null;
  free_month_date?: string | null;
  free_month_eligible?: boolean | null;
  credit_balance?: number;
  credit?: number;
  has_added_card?: boolean;
  seen_recip_modal_web?: boolean;
  seen_recip_modal_mobile?: boolean;
  created_at_platform?: string;
  signup_platform?: string | null;
  signup_method?: string | null;
  signup_at?: string | null;
  last_seen_at_mobile?: string | null;
  last_seen_at_web?: string | null;
  accepted_app_tracking?: boolean | null;
  has_subscribed?: boolean;
  billing?: boolean;
  signed_up?: boolean;
  account_status?:
    | 'active'
    | 'canceled'
    | 'closed'
    | 'unconverted'
    | 'paused'
    | 'signed-up'
    | 'expired';
  coupon?: {
    code_currently_active?: boolean;
    code_name?: string;
    value?: string;
    code_expiration_date?: string;
    new_users_only?: boolean;
    unlimited_redemptions?: boolean;
    max_redemptions?: number;
    duration?: number;
    payment_required?: boolean;
    details?: string;
    type?: UserCouponType;
    monthly_renewable_balance?: string;
  };
  has_failed_payment: boolean;
}

export enum UserCouponType {
  CUSTOM_CODE = 'custom_code',
}
