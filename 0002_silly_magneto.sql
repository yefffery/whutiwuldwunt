CREATE TABLE `campaign_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`config` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `promo_bookings` (
	`request_id` text PRIMARY KEY NOT NULL,
	`visitor_id` text NOT NULL,
	`lead_id` text,
	`code` text DEFAULT '' NOT NULL,
	`quote` integer,
	`floor` integer,
	`discount` integer,
	`addon_cost` integer,
	`paid` integer,
	`cost` integer,
	`confirmed_at` integer,
	`paid_at` integer
);
--> statement-breakpoint
CREATE INDEX `promo_bookings_lead_idx` ON `promo_bookings` (`lead_id`);--> statement-breakpoint
CREATE TABLE `promo_events` (
	`id` text PRIMARY KEY NOT NULL,
	`visitor_id` text NOT NULL,
	`lead_id` text,
	`kind` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `promo_events_kind_idx` ON `promo_events` (`kind`);--> statement-breakpoint
CREATE TABLE `promo_leads` (
	`id` text PRIMARY KEY NOT NULL,
	`visitor_id` text NOT NULL,
	`phone` text NOT NULL,
	`name` text NOT NULL,
	`phone_hash` text NOT NULL,
	`wheel` text NOT NULL,
	`sequence` text NOT NULL,
	`offer` text NOT NULL,
	`code` text NOT NULL,
	`click_token` text NOT NULL,
	`source` text NOT NULL,
	`consent` text NOT NULL,
	`created_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	`provider_status` text DEFAULT 'pending' NOT NULL,
	`redeemed_by` text,
	`is_test` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `promo_leads_visitor_id_unique` ON `promo_leads` (`visitor_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `promo_leads_phone_hash_unique` ON `promo_leads` (`phone_hash`);--> statement-breakpoint
CREATE UNIQUE INDEX `promo_leads_code_unique` ON `promo_leads` (`code`);--> statement-breakpoint
CREATE UNIQUE INDEX `promo_leads_click_token_unique` ON `promo_leads` (`click_token`);--> statement-breakpoint
CREATE INDEX `promo_leads_visitor_idx` ON `promo_leads` (`visitor_id`);--> statement-breakpoint
CREATE TABLE `promo_outbox` (
	`id` text PRIMARY KEY NOT NULL,
	`request_id` text NOT NULL,
	`metric` text NOT NULL,
	`state` text DEFAULT 'pending' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `promo_visitors` (
	`id` text PRIMARY KEY NOT NULL,
	`token` text NOT NULL,
	`wheel` text NOT NULL,
	`is_test` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
