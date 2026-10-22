ALTER TABLE `requests` ADD `services` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `requests` ADD `environment` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `requests` ADD `utilities` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `requests` ADD `interests` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `requests` ADD `flags` text DEFAULT '[]' NOT NULL;
