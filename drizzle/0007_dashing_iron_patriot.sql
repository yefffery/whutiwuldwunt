CREATE TABLE `job_feedback` (
	`id` text PRIMARY KEY NOT NULL,
	`request_id` text NOT NULL,
	`token_hash` text NOT NULL,
	`token_cipher` text NOT NULL,
	`booking_hesitation` text DEFAULT '' NOT NULL,
	`next_time` text DEFAULT '' NOT NULL,
	`share_consent` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`submitted_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `job_feedback_request_id_unique` ON `job_feedback` (`request_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `job_feedback_token_hash_unique` ON `job_feedback` (`token_hash`);--> statement-breakpoint
ALTER TABLE `requests` ADD `building_name` text DEFAULT '' NOT NULL;