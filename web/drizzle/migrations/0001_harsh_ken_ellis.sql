DROP INDEX "user_id_idx";--> statement-breakpoint
CREATE INDEX "parent_user_id_idx" ON "user" USING btree ("parent_user_id");--> statement-breakpoint
CREATE INDEX "user_status_idx" ON "user" USING btree ("status");--> statement-breakpoint
CREATE INDEX "role_status_idx" ON "role" USING btree ("status");--> statement-breakpoint
CREATE INDEX "user_role_role_id_idx" ON "user_role" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX "user_role_status_idx" ON "user_role" USING btree ("status");--> statement-breakpoint
CREATE INDEX "stock_user_id_idx" ON "stock" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "stock_status_idx" ON "stock" USING btree ("status");--> statement-breakpoint
CREATE INDEX "stock_created_at_idx" ON "stock" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "soil_data_user_id_idx" ON "soil_data" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "soil_data_status_idx" ON "soil_data" USING btree ("status");--> statement-breakpoint
CREATE INDEX "soil_data_created_at_idx" ON "soil_data" USING btree ("created_at");