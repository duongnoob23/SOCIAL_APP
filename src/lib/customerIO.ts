import {
  CioConfig,
  CioLogLevel,
  CioRegion,
  CustomerIO,
} from 'customerio-reactnative';

let initialized = false;

export const initCustomerIO = async () => {
  if (initialized) return;
  initialized = true;

  try {
    const config: CioConfig = {
      cdpApiKey: process.env.EXPO_PUBLIC_CIO_CDP_API_KEY ?? '',
      region: CioRegion.US,
      logLevel: CioLogLevel.Error,
      trackApplicationLifecycleEvents: true,
      inApp: process.env.EXPO_PUBLIC_CIO_SITE_ID
        ? {
            siteId: process.env.EXPO_PUBLIC_CIO_SITE_ID,
          }
        : undefined,
    };

    console.log('[CustomerIO] Initializing with config:', {
      cdpApiKey: config.cdpApiKey ? `${config.cdpApiKey.substring(0, 10)}...` : 'MISSING',
      siteId: config.inApp?.siteId || 'MISSING',
      region: config.region,
    });

    if (!config.cdpApiKey) {
      console.warn('[CustomerIO] CDP API Key is missing! Check .env file.');
      return;
    }

    // Only initialize inApp messaging if siteId is provided
    if (!config.inApp) {
      console.log('[CustomerIO] Initializing without In-App messaging (no siteId)');
      // Initialize without inApp messaging to avoid 400 errors
      await CustomerIO.initialize({
        ...config,
        inApp: undefined,
      });
      console.log('[CustomerIO] SDK initialized successfully (Push only)');
      return;
    }

    await CustomerIO.initialize(config);
    console.log('[CustomerIO] SDK initialized successfully (Push + In-App)');
  } catch (error) {
    // Silently fail - only log in development if needed
    if (__DEV__) {
      console.error('[CustomerIO] Failed to initialize SDK', error);
    }
  }
};

export const identifyCustomerIOUser = async (
  userId?: string | number,
  traits?: Record<string, unknown>
) => {
  if (!userId) return;

  try {
    console.log('[CustomerIO] Identifying user:', {
      userId: String(userId),
      email: traits?.email,
      firstName: traits?.first_name,
      lastName: traits?.last_name,
    });
    
    await CustomerIO.identify({
      userId: String(userId),
      traits,
    });
    
    console.log('[CustomerIO] User identified successfully');
  } catch (error) {
    // Silently fail - only log in development if needed
    if (__DEV__) {
      console.error('[CustomerIO] Failed to identify user', error);
    }
  }
};
