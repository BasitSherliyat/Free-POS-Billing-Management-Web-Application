import {
  pgTable,
  pgEnum,
  bigserial,
  bigint,
  varchar,
  text,
  numeric,
  date,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const paymentStatus = pgEnum("payment_status", ["unpaid", "partial", "paid"]);

export const categories = pgTable("categories", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  categoryName: varchar("category_name", { length: 100 }).notNull(),
  ...timestamps,
});

export const customers = pgTable("customers", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  shopName: varchar("shop_name", { length: 150 }),
  customerName: varchar("customer_name", { length: 150 }).notNull(),
  customerContact: varchar("customer_contact", { length: 30 }).notNull(),
  altNumber: varchar("alt_number", { length: 30 }),
  address: text("address"),
  image: varchar("image", { length: 255 }),
  ...timestamps,
});

export const users = pgTable("users", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  userName: varchar("user_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 190 }).notNull().unique("users_email_unique"),
  password: varchar("password", { length: 255 }).notNull(),
  ...timestamps,
});

export const items = pgTable(
  "items",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    itemName: varchar("item_name", { length: 150 }).notNull(),
    categoryId: bigint("category_id", { mode: "number" })
      .notNull()
      .references(() => categories.id, { onUpdate: "cascade" }),
    price: numeric("price", { precision: 12, scale: 2 }).notNull().default("0.00"),
    unit: varchar("unit", { length: 30 }).notNull(),
    itemImage: varchar("item_image", { length: 255 }),
    ...timestamps,
  },
  (t) => [index("fk_items_category").on(t.categoryId)],
);

export const salesInvoices = pgTable(
  "sales_invoices",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    invoiceNo: varchar("invoice_no", { length: 50 }).notNull().unique("sales_invoices_invoice_no_unique"),
    customerId: bigint("customer_id", { mode: "number" }).references(() => customers.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    userId: bigint("user_id", { mode: "number" })
      .notNull()
      .references(() => users.id, { onUpdate: "cascade" }),
    invoiceDate: date("invoice_date").notNull(),
    subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull().default("0.00"),
    discount: numeric("discount", { precision: 12, scale: 2 }).notNull().default("0.00"),
    tax: numeric("tax", { precision: 12, scale: 2 }).notNull().default("0.00"),
    grandTotal: numeric("grand_total", { precision: 12, scale: 2 }).notNull().default("0.00"),
    paidAmount: numeric("paid_amount", { precision: 12, scale: 2 }).notNull().default("0.00"),
    dueAmount: numeric("due_amount", { precision: 12, scale: 2 }).notNull().default("0.00"),
    paymentStatus: paymentStatus("payment_status").notNull().default("unpaid"),
    notes: text("notes"),
    ...timestamps,
  },
  (t) => [
    index("fk_invoice_customer").on(t.customerId),
    index("fk_invoice_user").on(t.userId),
  ],
);

export const salesInvoiceItems = pgTable(
  "sales_invoice_items",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    invoiceId: bigint("invoice_id", { mode: "number" })
      .notNull()
      .references(() => salesInvoices.id, { onDelete: "cascade", onUpdate: "cascade" }),
    itemId: bigint("item_id", { mode: "number" }).references(() => items.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    itemName: varchar("item_name", { length: 150 }).notNull(),
    unit: varchar("unit", { length: 30 }).notNull(),
    quantity: numeric("quantity", { precision: 12, scale: 3 }).notNull(),
    price: numeric("price", { precision: 12, scale: 2 }).notNull(),
    discount: numeric("discount", { precision: 12, scale: 2 }).notNull().default("0.00"),
    total: numeric("total", { precision: 12, scale: 2 }).notNull(),
    ...timestamps,
  },
  (t) => [
    index("idx_invoice_items_invoice").on(t.invoiceId),
    index("idx_invoice_items_item").on(t.itemId),
  ],
);
