CREATE TABLE `portfolio` (
	`id` text PRIMARY KEY NOT NULL,
	`object_key` text NOT NULL,
	`caption` text NOT NULL,
	`category` text NOT NULL,
	`content_type` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `portfolio_created_idx` ON `portfolio` (`created_at`);--> statement-breakpoint
ALTER TABLE `requests` ADD `service` text DEFAULT 'exterior' NOT NULL;