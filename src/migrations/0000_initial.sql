CREATE TABLE `character` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`description` text NOT NULL,
	`firstMessage` text,
	`image` text
);
--> statement-breakpoint
CREATE TABLE `chat` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `chat_characters` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`chat_id` integer NOT NULL,
	`character_id` integer NOT NULL,
	FOREIGN KEY (`chat_id`) REFERENCES `chat`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`character_id`) REFERENCES `character`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `generate_preset` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`context` integer NOT NULL,
	`max_tokens` integer NOT NULL,
	`temperature` real NOT NULL,
	`seed` integer NOT NULL,
	`top_k` real,
	`top_p` real,
	`min_p` real,
	`tfsz` real,
	`typical_p` real,
	`repeat_penalty` real,
	`repeat_last_n` real,
	`penalize_nl` integer,
	`presence_penalty` real,
	`frequency_penalty` real,
	`mirostat` integer,
	`mirostat_tau` real,
	`mirostat_eta` real
);
--> statement-breakpoint
CREATE TABLE `message` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`chat_id` integer NOT NULL,
	`character_id` integer NOT NULL,
	`generated` integer NOT NULL,
	`active_index` integer NOT NULL,
	`content` text NOT NULL,
	FOREIGN KEY (`chat_id`) REFERENCES `chat`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`character_id`) REFERENCES `character`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `prompt_template` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`instruction_template` text NOT NULL,
	`chat_template` text NOT NULL,
	`chat_instruction` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`generate_preset` integer NOT NULL,
	`prompt_template` integer NOT NULL,
	FOREIGN KEY (`generate_preset`) REFERENCES `generate_preset`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`prompt_template`) REFERENCES `prompt_template`(`id`) ON UPDATE no action ON DELETE no action
);
