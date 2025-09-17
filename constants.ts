import { Slot, Customer, AdminAnalytics, SlotStatus } from './types.ts';

export const INITIAL_SLOTS: Slot[] = [
  { id: 1, status: SlotStatus.Available, isBookable: true },
  { id: 2, status: SlotStatus.Available, isBookable: true },
  { id: 3, status: SlotStatus.Charging, isBookable: true, vehicleId: 'V2G-ROCKS', chargePercentage: 65 },
  { id: 4, status: SlotStatus.Available, isBookable: true },
  { id: 5, status: SlotStatus.OnSite, isBookable: false, vehicleId: 'WALK-IN-1', chargePercentage: 80 },
  { id: 6, status: SlotStatus.Discharging, isBookable: false, vehicleId: 'GRID-EV', chargePercentage: 75 },
];

// --- CURRENCY CONVERSION ---
const USD_TO_INR = 80;

// Data from MATLAB script
export const BASE_LOAD = [45, 42, 40, 38, 40, 48, 55, 65, 70, 68, 65, 62, 60, 62, 65, 70, 75, 80, 75, 68, 60, 55, 50, 47];
const GRID_BUY_PRICE_USD = [0.08, 0.08, 0.06, 0.06, 0.08, 0.12, 0.15, 0.18, 0.20, 0.18, 0.15, 0.12, 0.12, 0.15, 0.18, 0.20, 0.22, 0.25, 0.20, 0.15, 0.12, 0.10, 0.08, 0.08];
export const GRID_BUY_PRICE = GRID_BUY_PRICE_USD.map(p => p * USD_TO_INR);
export const PEAK_HOURS = [7, 8, 9, 10, 17, 18, 19, 20, 21];

export const MOCK_CUSTOMERS: Customer[] = [
    {
      id: 'CUST-001',
      name: 'Alex Johnson',
      email: 'alex.j@example.com',
      vehicle: {
        make: 'Tesla',
        model: 'Model Y',
        year: 2023,
        plate: 'V2G-ROCKS',
        capacityKwh: 75,
        maxPowerKw: 22,
        initialSoc: 0.25,
      },
      totalSavings: 25.72 * USD_TO_INR,
    },
    {
      id: 'CUST-002',
      name: 'Ben Carter',
      email: 'ben.c@example.com',
      vehicle: {
        make: 'Nissan',
        model: 'Leaf',
        year: 2022,
        plate: 'GRID-EV',
        capacityKwh: 60,
        maxPowerKw: 11,
        initialSoc: 0.3,
      },
      totalSavings: 18.45 * USD_TO_INR,
    },
    {
      id: 'CUST-003',
      name: 'Chloe Davis',
      email: 'chloe.d@example.com',
      vehicle: {
        make: 'Ford',
        model: 'Mustang Mach-E',
        year: 2024,
        plate: 'CHARGE-IT',
        capacityKwh: 80,
        maxPowerKw: 11,
        initialSoc: 0.2,
      },
      totalSavings: 32.10 * USD_TO_INR,
    }
];


export const INITIAL_ANALYTICS: AdminAnalytics = {
  energyBalanced: 125,
  totalSavingsProvided: 345.67 * USD_TO_INR,
  vehicleTurnover: 42,
  peakUsage: { time: '4:00 PM', slotsUsed: 5 },
  usageBySlot: [
    { name: 'Slot 1', value: 30 }, { name: 'Slot 2', value: 45 },
    { name: 'Slot 3', value: 60 }, { name: 'Slot 4', value: 25 },
    { name: 'Slot 5', value: 80 }, { name: 'Slot 6', value: 15 },
  ],
  gridLoadHistory: BASE_LOAD.map((load, i) => ({ time: i + 1, baseLoad: load, netLoad: load - Math.random() * 5})),
};