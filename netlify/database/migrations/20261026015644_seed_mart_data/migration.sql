-- Seed data imported from the original `mart` MySQL dump (timestamps are UTC).
INSERT INTO "categories" ("id", "category_name", "created_at", "updated_at") VALUES
(1, 'Grocery', '2026-10-20 19:04:14+00', '2026-10-20 19:04:14+00'),
(2, 'General Items', '2026-10-20 19:29:22+00', '2026-10-20 19:29:22+00');
--> statement-breakpoint
INSERT INTO "customers" ("id", "shop_name", "customer_name", "customer_contact", "alt_number", "address", "image", "created_at", "updated_at") VALUES
(1, 'ABC Store', 'Ali Ahmed', '03001234567', NULL, 'Karachi, Pakistan', NULL, '2026-10-20 19:03:06+00', '2026-10-20 19:03:06+00'),
(2, 'ABC Store', 'Ali Ahmed', '03001234567', NULL, 'Karachi, Pakistan', NULL, '2026-10-20 19:04:53+00', '2026-10-20 19:04:53+00');
--> statement-breakpoint
INSERT INTO "users" ("id", "user_name", "email", "password", "created_at", "updated_at") VALUES
(1, 'admin', 'admin@mail.com', 'admin123', '2026-10-20 19:07:57+00', '2026-10-20 19:07:57+00');
--> statement-breakpoint
INSERT INTO "items" ("id", "item_name", "category_id", "price", "unit", "item_image", "created_at", "updated_at") VALUES
(1, 'Rice', 1, 250.00, 'kg', NULL, '2026-10-20 19:04:30+00', '2026-10-20 19:04:30+00'),
(2, 'Aata', 2, 140.00, 'Kg', NULL, '2026-10-20 19:33:54+00', '2026-10-20 19:33:54+00'),
(3, 'Cooking Oil 5Ltr', 2, 3000.00, 'bottle', NULL, '2026-10-20 19:35:34+00', '2026-10-20 19:35:57+00');
--> statement-breakpoint
INSERT INTO "sales_invoices" ("id", "invoice_no", "customer_id", "user_id", "invoice_date", "subtotal", "discount", "tax", "grand_total", "paid_amount", "due_amount", "payment_status", "notes", "created_at", "updated_at") VALUES
(3, 'INV-0001', 1, 1, '2026-10-21', 2500.00, 0.00, 0.00, 2500.00, 1000.00, 1500.00, 'partial', NULL, '2026-10-20 19:09:07+00', '2026-10-20 19:09:07+00');
--> statement-breakpoint
INSERT INTO "sales_invoice_items" ("id", "invoice_id", "item_id", "item_name", "unit", "quantity", "price", "discount", "total", "created_at", "updated_at") VALUES
(2, 3, 1, 'Rice', 'kg', 10.000, 250.00, 0.00, 2500.00, '2026-10-20 19:28:06+00', '2026-10-20 19:28:06+00');
--> statement-breakpoint
-- Advance id sequences to match the dump's AUTO_INCREMENT values.
SELECT setval(pg_get_serial_sequence('categories', 'id'), 2);--> statement-breakpoint
SELECT setval(pg_get_serial_sequence('customers', 'id'), 2);--> statement-breakpoint
SELECT setval(pg_get_serial_sequence('users', 'id'), 1);--> statement-breakpoint
SELECT setval(pg_get_serial_sequence('items', 'id'), 3);--> statement-breakpoint
SELECT setval(pg_get_serial_sequence('sales_invoices', 'id'), 3);--> statement-breakpoint
SELECT setval(pg_get_serial_sequence('sales_invoice_items', 'id'), 2);
