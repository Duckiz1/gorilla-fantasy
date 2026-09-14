CREATE TABLE `entries` (
	`user` text NOT NULL,
	`tournament` text NOT NULL,
	`data` text NOT NULL,
	PRIMARY KEY(`user`, `tournament`)
);
--> statement-breakpoint
CREATE TABLE `tournaments` (
	`id` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL
);
