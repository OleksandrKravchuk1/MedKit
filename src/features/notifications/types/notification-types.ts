/** Fields of an active package needed to plan its reminder. */
export type ReminderPackage = {
  id: number;
  medicineId: number;
  expiryDate: string;
  createdAt: Date;
};

export type NotificationPlanItem = {
  packageId: number;
  medicineId: number;
  medicineName: string;
  expiryDate: string;
  /** When the reminder fires. */
  date: Date;
};
