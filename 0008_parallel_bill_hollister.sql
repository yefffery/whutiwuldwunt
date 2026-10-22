CREATE TABLE `client_vehicles` (
	`id` text PRIMARY KEY NOT NULL,
	`request_id` text DEFAULT '' NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`year` text DEFAULT '' NOT NULL,
	`make` text DEFAULT '' NOT NULL,
	`model` text DEFAULT '' NOT NULL,
	`size` text DEFAULT 'sedan' NOT NULL,
	`last_service` text DEFAULT '' NOT NULL,
	`finish_notes` text DEFAULT '' NOT NULL,
	`next_due` text DEFAULT '' NOT NULL,
	`offer_used` text DEFAULT '' NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `job_operations` (
	`request_id` text PRIMARY KEY NOT NULL,
	`vehicle_id` text DEFAULT '' NOT NULL,
	`starts_at` integer,
	`confirmed_at` integer,
	`completed_at` integer,
	`followup_sent_at` integer,
	`agreed_total` integer DEFAULT 0 NOT NULL,
	`deposit_amount` integer DEFAULT 0 NOT NULL,
	`payment_url` text DEFAULT '' NOT NULL,
	`refund_terms` text DEFAULT '' NOT NULL,
	`maintenance_consent` integer DEFAULT 0 NOT NULL,
	`channel` text DEFAULT 'email' NOT NULL,
	`paid_at` integer,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `operations_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`request_id` text NOT NULL,
	`kind` text NOT NULL,
	`due_at` integer NOT NULL,
	`channel` text NOT NULL,
	`body` text NOT NULL,
	`state` text DEFAULT 'pending' NOT NULL,
	`provider_id` text DEFAULT '' NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `operations_messages_due_idx` ON `operations_messages` (`state`,`due_at`);--> statement-breakpoint
CREATE TABLE `operations_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`config` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `portfolio` ADD `pair_id` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `portfolio` ADD `phase` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `portfolio` ADD `client_permission` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `portfolio` ADD `request_id` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `portfolio` ADD `permission_at` integer;