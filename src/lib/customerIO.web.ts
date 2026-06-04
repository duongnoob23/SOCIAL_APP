// Customer.io stub for web platform
// Customer.io SDK is only available on native platforms (iOS/Android)

let initialized = false;

/**
 * Initialize Customer.io - Web stub (no-op)
 */
export const initCustomerIO = async (): Promise<void> => {
  if (initialized) return;
  initialized = true;

  console.log('[CustomerIO] Web platform - SDK initialization skipped');
  console.log('[CustomerIO] Customer.io is only available on iOS/Android');
};

/**
 * Identify user in Customer.io - Web stub (no-op)
 */
export const identifyCustomerIOUser = async (
  userId?: string | number,
  traits?: Record<string, unknown>
): Promise<void> => {
  if (!userId) return;

  console.log('[CustomerIO] Web platform - User identification skipped:', {
    userId: String(userId),
    email: traits?.email,
    firstName: traits?.first_name,
    lastName: traits?.last_name,
  });
  
  console.log('[CustomerIO] For web analytics, consider using Google Analytics or Meta Pixel');
};
