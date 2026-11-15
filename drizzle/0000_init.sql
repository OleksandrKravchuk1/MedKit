CREATE TABLE `medicine_tags` (
	`medicine_id` integer NOT NULL,
	`tag_id` integer NOT NULL,
	PRIMARY KEY(`medicine_id`, `tag_id`),
	FOREIGN KEY (`medicine_id`) REFERENCES `medicines`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `medicine_tags_tag_id_idx` ON `medicine_tags` (`tag_id`);--> statement-breakpoint
CREATE TABLE `medicines` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`form` text NOT NULL,
	`dosage` text,
	`barcode` text,
	`notes` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `medicines_barcode_unique` ON `medicines` (`barcode`);--> statement-breakpoint
CREATE TABLE `packages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`medicine_id` integer NOT NULL,
	`expiry_date` text NOT NULL,
	`quantity` integer DEFAULT 1 NOT NULL,
	`batch` text,
	`status` text DEFAULT 'active' NOT NULL,
	`notification_id` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`medicine_id`) REFERENCES `medicines`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `packages_medicine_id_idx` ON `packages` (`medicine_id`);--> statement-breakpoint
CREATE INDEX `packages_status_expiry_idx` ON `packages` (`status`,`expiry_date`);--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`color` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tags_name_unique` ON `tags` (`name`);