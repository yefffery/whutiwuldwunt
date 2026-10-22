CREATE TABLE `requests` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`city` text DEFAULT '' NOT NULL,
	`vehicle` text DEFAULT '' NOT NULL,
	`preferred_date` text DEFAULT '' NOT NULL,
	`time_window` text DEFAULT 'flexible' NOT NULL,
	`topic` text DEFAULT 'general' NOT NULL,
	`message` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` integer NOT NULL,
	`fingerprint` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `requests_created_idx` ON `requests` (`created_at`);--> statement-breakpoint
CREATE INDEX `requests_email_created_idx` ON `requests` (`email`,`created_at`);--> statement-breakpoint
CREATE INDEX `requests_fingerprint_created_idx` ON `requests` (`fingerprint`,`created_at`);