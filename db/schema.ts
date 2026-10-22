import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const requests = sqliteTable("requests", {
  id: text("id").primaryKey(),
  kind: text("kind").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull().default(""),
  city: text("city").notNull().default(""),
  vehicle: text("vehicle").notNull().default(""),
  preferred_date: text("preferred_date").notNull().default(""),
  time_window: text("time_window").notNull().default("flexible"),
  topic: text("topic").notNull().default("general"),
  message: text("message").notNull().default(""),
  status: text("status").notNull().default("new"),
  created_at: integer("created_at").notNull(),
  fingerprint: text("fingerprint").notNull(),
  service: text("service").notNull().default("essential_exterior"),
  care_profile: text("care_profile").notNull().default("{}"),
  building_name: text("building_name").notNull().default(""),
  customer_id: text("customer_id").references(() => customers.id),
  vehicle_id: text("vehicle_id").references(() => clientVehicles.id),
  claimed_code_text: text("claimed_code_text").notNull().default(""),
  // V72 dialogue-flag model: selections travel as raw string arrays and any
  // unresolved onboarding answer is flagged for human vetting.
  services: text("services").notNull().default("[]"),
  environment: text("environment").notNull().default("[]"),
  utilities: text("utilities").notNull().default("[]"),
  interests: text("interests").notNull().default("[]"),
  flags: text("flags").notNull().default("[]"),
});

export const portfolio = sqliteTable("portfolio", {
  id: text("id").primaryKey(),
  object_key: text("object_key").notNull(),
  caption: text("caption").notNull(),
  category: text("category").notNull(),
  content_type: text("content_type").notNull(),
  created_at: integer("created_at").notNull(),
  pair_id: text("pair_id").notNull().default(""),
  phase: text("phase").notNull().default(""),
  client_permission: integer("client_permission").notNull().default(0),
  request_id: text("request_id").notNull().default(""),
  permission_at: integer("permission_at"),
  published: integer("published").notNull().default(1),
});

export const campaign_settings = sqliteTable("campaign_settings", {
  id: text("id").primaryKey(),
  config: text("config").notNull(),
});

export const promo_bookings = sqliteTable("promo_bookings", {
  request_id: text("request_id").primaryKey(),
  visitor_id: text("visitor_id").notNull(),
  lead_id: text("lead_id"),
  code: text("code").notNull().default(""),
  quote: integer("quote"),
  floor: integer("floor"),
  discount: integer("discount"),
  addon_cost: integer("addon_cost"),
  paid: integer("paid"),
  cost: integer("cost"),
  confirmed_at: integer("confirmed_at"),
  paid_at: integer("paid_at"),
});

export const promo_events = sqliteTable("promo_events", {
  id: text("id").primaryKey(),
  visitor_id: text("visitor_id").notNull(),
  lead_id: text("lead_id"),
  kind: text("kind").notNull(),
  created_at: integer("created_at").notNull(),
});

export const promo_leads = sqliteTable("promo_leads", {
  id: text("id").primaryKey(),
  visitor_id: text("visitor_id").notNull().unique(),
  phone: text("phone").notNull(),
  name: text("name").notNull(),
  phone_hash: text("phone_hash").notNull().unique(),
  wheel: text("wheel").notNull(),
  sequence: text("sequence").notNull(),
  offer: text("offer").notNull(),
  code: text("code").notNull().unique(),
  click_token: text("click_token").notNull().unique(),
  source: text("source").notNull(),
  consent: text("consent").notNull(),
  created_at: integer("created_at").notNull(),
  expires_at: integer("expires_at").notNull(),
  provider_status: text("provider_status").notNull().default("pending"),
  redeemed_by: text("redeemed_by"),
  is_test: integer("is_test").notNull().default(0),
});

export const promo_outbox = sqliteTable("promo_outbox", {
  id: text("id").primaryKey(),
  request_id: text("request_id").notNull(),
  metric: text("metric").notNull(),
  state: text("state").notNull().default("pending"),
  created_at: integer("created_at").notNull(),
});

export const promo_visitors = sqliteTable("promo_visitors", {
  id: text("id").primaryKey(),
  token: text("token").notNull(),
  wheel: text("wheel").notNull(),
  is_test: integer("is_test").notNull().default(0),
  created_at: integer("created_at").notNull(),
});

export const site_content = sqliteTable("site_content", {
  id: text("id").primaryKey(),
  draft: text("draft").notNull(),
  published: text("published").notNull(),
  revision: integer("revision").notNull().default(0),
  updated_at: integer("updated_at").notNull(),
});

export const site_content_history = sqliteTable("site_content_history", {
  id: text("id").primaryKey(),
  content: text("content").notNull(),
  revision: integer("revision").notNull(),
  created_at: integer("created_at").notNull(),
});

export const site_media = sqliteTable("site_media", {
  id: text("id").primaryKey(),
  object_key: text("object_key").notNull(),
  name: text("name").notNull(),
  content_type: text("content_type").notNull(),
  created_at: integer("created_at").notNull(),
});

export const care_plans = sqliteTable("care_plans", {
  id: text("id").primaryKey(),
  request_id: text("request_id").notNull(),
  token_hash: text("token_hash").notNull().unique(),
  title: text("title").notNull(),
  scope: text("scope").notNull(),
  product_notes: text("product_notes").notNull(),
  base: integer("base").notNull(),
  premium: integer("premium").notNull(),
  discount: integer("discount").notNull(),
  total: integer("total").notNull(),
  expires_at: integer("expires_at").notNull(),
  created_at: integer("created_at").notNull(),
  accepted_at: integer("accepted_at"),
  revoked_at: integer("revoked_at"),
  delivery_status: text("delivery_status").notNull().default("not_sent"),
  token_cipher: text("token_cipher").notNull().default(""),
  care_key_code: text("care_key_code").notNull().default(""),
  discount_basis_service: text("discount_basis_service").notNull().default(""),
  discount_basis_cents: integer("discount_basis_cents").notNull().default(0),
  discount_rate_bps: integer("discount_rate_bps").notNull().default(0),
});

export const care_settings = sqliteTable("care_settings", {
  id: text("id").primaryKey(),
  config: text("config").notNull(),
});

export const care_slots = sqliteTable("care_slots", {
  id: text("id").primaryKey(),
  starts_at: integer("starts_at").notNull(),
  ends_at: integer("ends_at").notNull(),
  plan_id: text("plan_id").unique(),
  disabled: integer("disabled").notNull().default(0),
});

export const job_feedback = sqliteTable("job_feedback", {
  id: text("id").primaryKey(),
  request_id: text("request_id").notNull().unique(),
  token_hash: text("token_hash").notNull().unique(),
  token_cipher: text("token_cipher").notNull(),
  booking_hesitation: text("booking_hesitation").notNull().default(""),
  next_time: text("next_time").notNull().default(""),
  share_consent: integer("share_consent").notNull().default(0),
  created_at: integer("created_at").notNull(),
  submitted_at: integer("submitted_at"),
});

export const client_vehicles = sqliteTable("client_vehicles", {
  id: text("id").primaryKey(),
  request_id: text("request_id").notNull().default(""),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull().default(""),
  year: text("year").notNull().default(""),
  make: text("make").notNull().default(""),
  model: text("model").notNull().default(""),
  size: text("size").notNull().default("sedan"),
  last_service: text("last_service").notNull().default(""),
  finish_notes: text("finish_notes").notNull().default(""),
  next_due: text("next_due").notNull().default(""),
  offer_used: text("offer_used").notNull().default(""),
  updated_at: integer("updated_at").notNull(),
  customer_id: text("customer_id").references(() => customers.id),
});

export const job_operations = sqliteTable("job_operations", {
  request_id: text("request_id").primaryKey(),
  vehicle_id: text("vehicle_id").notNull().default(""),
  starts_at: integer("starts_at"),
  confirmed_at: integer("confirmed_at"),
  completed_at: integer("completed_at"),
  followup_sent_at: integer("followup_sent_at"),
  agreed_total: integer("agreed_total").notNull().default(0),
  deposit_amount: integer("deposit_amount").notNull().default(0),
  payment_url: text("payment_url").notNull().default(""),
  refund_terms: text("refund_terms").notNull().default(""),
  maintenance_consent: integer("maintenance_consent").notNull().default(0),
  channel: text("channel").notNull().default("email"),
  paid_at: integer("paid_at"),
  updated_at: integer("updated_at").notNull(),
  operational_status: text("operational_status").notNull().default("pending_confirmation"),
  cancelled_at: integer("cancelled_at"),
  cancelled_by: text("cancelled_by"),
  cancelled_reason: text("cancelled_reason"),
  local_clearance_flag: integer("local_clearance_flag"),
  utility_water_access: integer("utility_water_access"),
  utility_power_access: integer("utility_power_access"),
  manual_travel_buffer_minutes: integer("manual_travel_buffer_minutes"),
  scheduled_block_start: integer("scheduled_block_start"),
  scheduled_block_end: integer("scheduled_block_end"),
});

export const operations_messages = sqliteTable("operations_messages", {
  id: text("id").primaryKey(),
  request_id: text("request_id").notNull(),
  kind: text("kind").notNull(),
  due_at: integer("due_at").notNull(),
  channel: text("channel").notNull(),
  body: text("body").notNull(),
  state: text("state").notNull().default("pending"),
  provider_id: text("provider_id").notNull().default(""),
  updated_at: integer("updated_at").notNull(),
});

export const operations_settings = sqliteTable("operations_settings", {
  id: text("id").primaryKey(),
  config: text("config").notNull(),
});

export const care_keys_audit_log = sqliteTable("care_keys_audit_log", {
  id: text("id").primaryKey(),
  key_code: text("key_code").notNull(),
  request_id: text("request_id"),
  customer_id: text("customer_id"),
  plan_id: text("plan_id"),
  action_type: text("action_type").notNull(),
  owner_context_notes: text("owner_context_notes").notNull().default(""),
  logged_at: integer("logged_at").notNull(),
});

export const care_keys_inventory = sqliteTable("care_keys_inventory", {
  slot_index: integer("slot_index").primaryKey(),
  key_code: text("key_code").notNull().unique(),
  current_state: text("current_state").notNull().default("available"),
  active_customer_id: text("active_customer_id"),
  active_request_id: text("active_request_id"),
  active_plan_id: text("active_plan_id"),
  updated_at: integer("updated_at").notNull(),
});

export const customers = sqliteTable("customers", {
  id: text("id").primaryKey(),
  name: text("name").notNull().default(""),
  email: text("email").notNull().default(""),
  phone: text("phone").notNull().default(""),
  created_at: integer("created_at").notNull(),
});
