import { Schema, model, type Model } from 'mongoose';

export enum EventType {
  WORKSHOP = 'workshop',
  HARVEST_FESTIVAL = 'harvest_festival',
  FARM_TOUR = 'farm_tour',
  MARKET = 'market',
  TRAINING = 'training',
  OTHER = 'other'
}

export interface IEvent {
  organizer: Schema.Types.ObjectId;
  attendees: Schema.Types.ObjectId[];
  eventType: EventType;
  title: string;
  description: string;
  location: {
    type: string;
    coordinates: number[];
    address?: string;
  };
  startDate: Date;
  endDate: Date;
  maxAttendees?: number;
  tags: string[];
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>({
  organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  attendees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  eventType: { type: String, enum: Object.values(EventType), required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true },
    address: String
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  maxAttendees: Number,
  tags: [{ type: String }],
  imageUrl: String
}, {
  timestamps: true
});

eventSchema.index({ location: '2dsphere' });

// Safe model creation with typing
let Event: Model<IEvent>;

try {
  Event = model<IEvent>('Event');
} catch {
  Event = model<IEvent>('Event', eventSchema);
}

export { Event };
