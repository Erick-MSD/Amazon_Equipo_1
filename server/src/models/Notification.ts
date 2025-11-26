import { Schema, model, Document } from 'mongoose';

export interface INotification extends Document {
  userId: string; 
  title: string;
  body: string;
  read: boolean;
  meta?: any;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  read: { type: Boolean, default: false },
  meta: { type: Schema.Types.Mixed }
}, { timestamps: true });

export const Notification = model<INotification>('Notification', notificationSchema);
