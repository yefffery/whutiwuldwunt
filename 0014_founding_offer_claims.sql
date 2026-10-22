CREATE TABLE `founding_offer_claims` (
	`phone_key` text PRIMARY KEY NOT NULL,
	`request_id` text NOT NULL,
	`plan_id` text NOT NULL,
	`claimed_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `founding_offer_claims_request_id_unique` ON `founding_offer_claims` (`request_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `founding_offer_claims_plan_id_unique` ON `founding_offer_claims` (`plan_id`);