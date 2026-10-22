CREATE TABLE `care_lifecycle_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`request_id` text NOT NULL,
	`plan_id` text,
	`event` text NOT NULL,
	`recorded_at` integer NOT NULL,
	`details` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `care_plan_snapshots` (
	`plan_id` text PRIMARY KEY NOT NULL,
	`request_id` text NOT NULL,
	`config_digest` text NOT NULL,
	`snapshot` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`plan_id`) REFERENCES `care_plans`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `care_record_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`service_id` text NOT NULL,
	`category` text NOT NULL,
	`content` text NOT NULL,
	`source` text NOT NULL,
	`observed_at` text,
	`approved_by` text NOT NULL,
	`created_at` integer NOT NULL,
	`supersedes` text
);
--> statement-breakpoint
CREATE TABLE `request_quote_snapshots` (
	`request_id` text PRIMARY KEY NOT NULL,
	`config_digest` text NOT NULL,
	`snapshot` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`request_id`) REFERENCES `requests`(`id`) ON UPDATE no action ON DELETE no action
);

--> statement-breakpoint
CREATE TRIGGER request_quote_no_update BEFORE UPDATE ON request_quote_snapshots BEGIN SELECT RAISE(ABORT,'Request quote snapshots are immutable'); END;
--> statement-breakpoint
CREATE TRIGGER request_quote_no_delete BEFORE DELETE ON request_quote_snapshots BEGIN SELECT RAISE(ABORT,'Request quote snapshots are immutable'); END;
--> statement-breakpoint
CREATE TRIGGER plan_quote_no_update BEFORE UPDATE ON care_plan_snapshots BEGIN SELECT RAISE(ABORT,'Issued quotes are immutable'); END;
--> statement-breakpoint
CREATE TRIGGER plan_quote_no_delete BEFORE DELETE ON care_plan_snapshots BEGIN SELECT RAISE(ABORT,'Issued quotes are immutable'); END;
--> statement-breakpoint
CREATE TRIGGER plan_terms_lock BEFORE UPDATE OF title,scope,product_notes,base,premium,discount,total,request_id,care_key_code,discount_basis_service,discount_basis_cents,discount_rate_bps ON care_plans BEGIN SELECT RAISE(ABORT,'Issue a new traceable plan revision'); END;
--> statement-breakpoint
CREATE TRIGGER plan_issued AFTER INSERT ON care_plans BEGIN INSERT INTO care_lifecycle_events(request_id,plan_id,event,recorded_at,details) VALUES(NEW.request_id,NEW.id,'plan_issued',NEW.created_at,json_object('title',NEW.title,'scope',NEW.scope,'base',NEW.base,'premium',NEW.premium,'discount',NEW.discount,'total',NEW.total)); END;
--> statement-breakpoint
CREATE TRIGGER plan_status AFTER UPDATE OF accepted_at,revoked_at,delivery_status ON care_plans BEGIN INSERT INTO care_lifecycle_events(request_id,plan_id,event,recorded_at,details) VALUES(NEW.request_id,NEW.id,'plan_status',CAST(unixepoch('subsec')*1000 AS INTEGER),json_object('accepted_at',NEW.accepted_at,'revoked_at',NEW.revoked_at,'delivery_status',NEW.delivery_status)); END;
--> statement-breakpoint
CREATE TRIGGER request_status AFTER UPDATE OF status ON requests WHEN OLD.status<>NEW.status BEGIN INSERT INTO care_lifecycle_events(request_id,event,recorded_at,details) VALUES(NEW.id,'request_status',CAST(unixepoch('subsec')*1000 AS INTEGER),json_object('from',OLD.status,'to',NEW.status)); END;
--> statement-breakpoint
CREATE TRIGGER operations_status AFTER UPDATE OF confirmed_at,completed_at,cancelled_at ON job_operations BEGIN INSERT INTO care_lifecycle_events(request_id,event,recorded_at,details) VALUES(NEW.request_id,'operations_status',CAST(unixepoch('subsec')*1000 AS INTEGER),json_object('confirmed_at',NEW.confirmed_at,'completed_at',NEW.completed_at,'cancelled_at',NEW.cancelled_at)); END;
--> statement-breakpoint
CREATE TRIGGER care_record_no_update BEFORE UPDATE ON care_record_entries BEGIN SELECT RAISE(ABORT,'Append a correction referencing the previous record'); END;
--> statement-breakpoint
CREATE TRIGGER care_record_no_delete BEFORE DELETE ON care_record_entries BEGIN SELECT RAISE(ABORT,'Keep the evidence audit trail'); END;
--> statement-breakpoint
CREATE TRIGGER lifecycle_no_update BEFORE UPDATE ON care_lifecycle_events BEGIN SELECT RAISE(ABORT,'Keep the lifecycle audit trail'); END;
--> statement-breakpoint
CREATE TRIGGER lifecycle_no_delete BEFORE DELETE ON care_lifecycle_events BEGIN SELECT RAISE(ABORT,'Keep the lifecycle audit trail'); END;
