CREATE TABLE `content_publications` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`revision` integer NOT NULL,
	`approved_by` text NOT NULL,
	`published_at` integer NOT NULL
);

--> statement-breakpoint
CREATE TRIGGER publication_no_update BEFORE UPDATE ON content_publications BEGIN SELECT RAISE(ABORT,'Publication history is immutable'); END;
--> statement-breakpoint
CREATE TRIGGER publication_no_delete BEFORE DELETE ON content_publications BEGIN SELECT RAISE(ABORT,'Publication history is immutable'); END;
