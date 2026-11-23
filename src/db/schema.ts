import { MEDICINE_FORMS, PACKAGE_STATUSES } from "@/constants/medicine";
import { sql } from "drizzle-orm";
import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

const createdAt = () =>
  integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`);

export const medicines = sqliteTable("medicines", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  form: text("form", { enum: MEDICINE_FORMS }).notNull(),
  dosage: text("dosage"),
  barcode: text("barcode").unique(),
  notes: text("notes"),
  createdAt: createdAt(),
});

export const packages = sqliteTable(
  "packages",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    medicineId: integer("medicine_id")
      .notNull()
      .references(() => medicines.id, { onDelete: "cascade" }),
    expiryDate: text("expiry_date").notNull(),
    quantity: integer("quantity").notNull().default(1),
    batch: text("batch"),
    status: text("status", { enum: PACKAGE_STATUSES })
      .notNull()
      .default("active"),
    createdAt: createdAt(),
  },
  (t) => [
    index("packages_medicine_id_idx").on(t.medicineId),
    index("packages_status_expiry_idx").on(t.status, t.expiryDate),
  ],
);

export const tags = sqliteTable("tags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  color: text("color").notNull(),
});

export const medicineTags = sqliteTable(
  "medicine_tags",
  {
    medicineId: integer("medicine_id")
      .notNull()
      .references(() => medicines.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => [
    primaryKey({ columns: [t.medicineId, t.tagId] }),
    index("medicine_tags_tag_id_idx").on(t.tagId),
  ],
);

export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export type Medicine = typeof medicines.$inferSelect;
export type NewMedicine = typeof medicines.$inferInsert;
export type Package = typeof packages.$inferSelect;
export type NewPackage = typeof packages.$inferInsert;
export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
export type MedicineTag = typeof medicineTags.$inferSelect;
export type Setting = typeof settings.$inferSelect;
