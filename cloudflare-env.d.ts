declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    CARE_PLAN_LINK_KEY?: string;
    RESEND_API_KEY?: string;
    CARE_PLAN_FROM?: string;
    TWILIO_ACCOUNT_SID?: string;
    TWILIO_AUTH_TOKEN?: string;
    TWILIO_FROM?: string;
    OWNER_EMAIL?: string;
    SITE_ORIGIN?: string;
    KLAVIYO_API_KEY?: string;
    KLAVIYO_LIST_A?: string;
    KLAVIYO_LIST_B?: string;
    PROMO_WEBHOOK_SECRET?: string;
  }
}
