// Fix: Removed circular dependency and defined all necessary types.

export type ViewMode = 'customer' | 'admin';

export interface NotificationMessage {
  message: string;
  type: 'success' | 'error' | 'info';
}

export enum SlotStatus {
  Available = 'available',
  Booked = 'booked',
  Charging = 'charging',
  Discharging = 'discharging',
  OnSite = 'on-site',
  MandatoryCharging = 'mandatory-charging',
}

export interface Slot {
  id: number;
  status: SlotStatus;
  isBookable: boolean;
  vehicleId?: string;
  chargePercentage?: number;
  bookingStartTime?: number;
  bookingDuration?: number;
  gridSupport?: boolean;
  departureTime?: number;
}

export interface Vehicle {
  make: string;
  model: string;
  year: number;
  plate: string;
  capacityKwh: number;
  maxPowerKw: number;
  initialSoc: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  vehicle: Vehicle;
  totalSavings: number;
}

export interface PreviousCustomer {
  name: string;
  email: string;
  vehicle: Vehicle;
}

export interface Transaction {
  id: string;
  timestamp: Date;
  customerId: string;
  slotId: number;
  type: 'discount';
  amount: number;
  description: string;
}

export interface AdminAnalytics {
  energyBalanced: number;
  totalSavingsProvided: number;
  vehicleTurnover: number;
  peakUsage: {
    time: string;
    slotsUsed: number;
  };
  usageBySlot: {
    name: string;
    value: number;
  }[];
  gridLoadHistory: {
    time: number;
    baseLoad: number;
    netLoad: number;
  }[];
}