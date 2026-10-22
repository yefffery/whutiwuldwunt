CREATE TABLE `care_plans` (
	`id` text PRIMARY KEY NOT NULL,
	`request_id` text NOT NULL,
	`token_hash` text NOT NULL,
	`title` text NOT NULL,
	`scope` text NOT NULL,
	`product_notes` text NOT NULL,
	`base` integer NOT NULL,
	`premium` integer NOT NULL,
	`discount` integer NOT NULL,
	`total` integer NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`accepted_at` integer,
	`revoked_at` integer,
	`delivery_status` text DEFAULT 'not_sent' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `care_plans_token_hash_unique` ON `care_plans` (`token_hash`);--> statement-breakpoint
CREATE INDEX `care_plans_request_idx` ON `care_plans` (`request_id`);--> statement-breakpoint
CREATE TABLE `care_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`config` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `care_slots` (
	`id` text PRIMARY KEY NOT NULL,
	`starts_at` integer NOT NULL,
	`ends_at` integer NOT NULL,
	`plan_id` text,
	`disabled` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `care_slots_plan_id_unique` ON `care_slots` (`plan_id`);--> statement-breakpoint
CREATE INDEX `care_slots_start_idx` ON `care_slots` (`starts_at`);--> statement-breakpoint
ALTER TABLE `requests` ADD `care_profile` text DEFAULT '{}' NOT NULL;