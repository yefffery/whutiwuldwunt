CREATE TABLE `care_keys_audit_log` (
	`id` text PRIMARY KEY NOT NULL,
	`key_code` text NOT NULL,
	`request_id` text,
	`customer_id` text,
	`plan_id` text,
	`action_type` text NOT NULL,
	`owner_context_notes` text DEFAULT '' NOT NULL,
	`logged_at` integer NOT NULL,
	CONSTRAINT "care_keys_audit_action_valid" CHECK("care_keys_audit_log"."action_type" IN ('assignment','inclusion','redemption','manual_release'))
);
--> statement-breakpoint
CREATE INDEX `care_keys_audit_code_idx` ON `care_keys_audit_log` (`key_code`,`logged_at`);--> statement-breakpoint
CREATE TABLE `care_keys_inventory` (
	`slot_index` integer PRIMARY KEY NOT NULL,
	`key_code` text NOT NULL,
	`current_state` text DEFAULT 'available' NOT NULL,
	`active_customer_id` text,
	`active_request_id` text,
	`active_plan_id` text,
	`updated_at` integer NOT NULL,
	CONSTRAINT "care_keys_slot_range" CHECK("care_keys_inventory"."slot_index" BETWEEN 1 AND 100),
	CONSTRAINT "care_keys_state_valid" CHECK("care_keys_inventory"."current_state" IN ('available','included_in_plan','used'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `care_keys_inventory_key_code_unique` ON `care_keys_inventory` (`key_code`);--> statement-breakpoint
CREATE INDEX `care_keys_state_idx` ON `care_keys_inventory` (`current_state`);--> statement-breakpoint
CREATE TABLE `customers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text DEFAULT '' NOT NULL,
	`email` text DEFAULT '' NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL,
	CONSTRAINT "customers_contact_required" CHECK(length(trim("customers"."email")) > 0 OR length(trim("customers"."phone")) > 0)
);
--> statement-breakpoint
CREATE INDEX `customers_email_idx` ON `customers` (`email`);--> statement-breakpoint
CREATE INDEX `customers_phone_idx` ON `customers` (`phone`);--> statement-breakpoint
ALTER TABLE `care_plans` ADD `care_key_code` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `care_plans` ADD `discount_basis_service` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `care_plans` ADD `discount_basis_cents` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `care_plans` ADD `discount_rate_bps` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `client_vehicles` ADD `customer_id` text REFERENCES customers(id);--> statement-breakpoint
ALTER TABLE `job_operations` ADD `operational_status` text DEFAULT 'pending_confirmation' NOT NULL;--> statement-breakpoint
ALTER TABLE `job_operations` ADD `cancelled_at` integer;--> statement-breakpoint
ALTER TABLE `job_operations` ADD `cancelled_by` text;--> statement-breakpoint
ALTER TABLE `job_operations` ADD `local_clearance_flag` integer;--> statement-breakpoint
ALTER TABLE `job_operations` ADD `utility_water_access` integer;--> statement-breakpoint
ALTER TABLE `job_operations` ADD `utility_power_access` integer;--> statement-breakpoint
ALTER TABLE `job_operations` ADD `manual_travel_buffer_minutes` integer;--> statement-breakpoint
ALTER TABLE `job_operations` ADD `scheduled_block_start` integer;--> statement-breakpoint
ALTER TABLE `job_operations` ADD `scheduled_block_end` integer;--> statement-breakpoint
ALTER TABLE `requests` ADD `customer_id` text REFERENCES customers(id);--> statement-breakpoint
ALTER TABLE `requests` ADD `vehicle_id` text REFERENCES client_vehicles(id);--> statement-breakpoint
ALTER TABLE `requests` ADD `claimed_code_text` text DEFAULT '' NOT NULL;--> statement-breakpoint
INSERT INTO customers (id,name,email,phone,created_at)
SELECT lower(hex(randomblob(16))),MIN(name),MIN(email),MIN(phone),MIN(created_at)
FROM requests
WHERE kind='booking' AND (trim(email)<>'' OR trim(phone)<>'')
GROUP BY CASE WHEN trim(email)<>'' THEN 'email:'||lower(trim(email)) ELSE 'phone:'||replace(replace(replace(replace(replace(trim(phone),' ',''),'-',''),'(',''),')',''),'+','') END;
--> statement-breakpoint
INSERT INTO customers (id,name,email,phone,created_at)
SELECT lower(hex(randomblob(16))),MIN(name),MIN(email),MIN(phone),MIN(updated_at)
FROM client_vehicles v
WHERE (trim(v.email)<>'' OR trim(v.phone)<>'')
AND NOT EXISTS (SELECT 1 FROM customers c WHERE (trim(v.email)<>'' AND lower(trim(c.email))=lower(trim(v.email))) OR (trim(v.email)='' AND trim(v.phone)<>'' AND c.phone=v.phone))
GROUP BY CASE WHEN trim(v.email)<>'' THEN 'email:'||lower(trim(v.email)) ELSE 'phone:'||replace(replace(replace(replace(replace(trim(v.phone),' ',''),'-',''),'(',''),')',''),'+','') END;
--> statement-breakpoint
UPDATE requests SET customer_id=COALESCE((SELECT c.id FROM customers c WHERE trim(requests.email)<>'' AND lower(trim(c.email))=lower(trim(requests.email)) ORDER BY c.created_at,c.id LIMIT 1),(SELECT c.id FROM customers c WHERE trim(requests.email)='' AND trim(requests.phone)<>'' AND c.phone=requests.phone ORDER BY c.created_at,c.id LIMIT 1)) WHERE kind='booking' AND (trim(email)<>'' OR trim(phone)<>'');
--> statement-breakpoint
UPDATE client_vehicles SET customer_id=COALESCE((SELECT c.id FROM customers c WHERE trim(client_vehicles.email)<>'' AND lower(trim(c.email))=lower(trim(client_vehicles.email)) ORDER BY c.created_at,c.id LIMIT 1),(SELECT c.id FROM customers c WHERE trim(client_vehicles.email)='' AND trim(client_vehicles.phone)<>'' AND c.phone=client_vehicles.phone ORDER BY c.created_at,c.id LIMIT 1)) WHERE trim(email)<>'' OR trim(phone)<>'';
--> statement-breakpoint
UPDATE requests SET vehicle_id=COALESCE((SELECT v.id FROM client_vehicles v WHERE v.request_id=requests.id ORDER BY v.updated_at DESC,v.id LIMIT 1),(SELECT v.id FROM client_vehicles v WHERE v.customer_id=requests.customer_id AND v.model=requests.vehicle ORDER BY v.updated_at DESC,v.id LIMIT 1)) WHERE kind='booking' AND trim(vehicle)<>'' AND EXISTS (SELECT 1 FROM client_vehicles v WHERE v.request_id=requests.id OR (v.customer_id=requests.customer_id AND v.model=requests.vehicle));
