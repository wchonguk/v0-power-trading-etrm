export type TradeStatus = "Pending Validation" | "Approved" | "Confirmed" | "Settled" | "Rejected";
export type BuySell = "Buy" | "Sell";
export type ConfirmationStatus = "Pending" | "Sent" | "Matched" | "Disputed";
export type SettlementStatus = "Pending" | "Processed" | "Failed";

export interface Trade {
  id: string;
  tradeDate: string;
  counterparty: string;
  product: string;
  deliveryStart: string;
  deliveryEnd: string;
  volume: number;
  price: number;
  buySell: BuySell;
  book: string;
  status: TradeStatus;
  submittedBy: string;
}

export interface Counterparty {
  id: string;
  name: string;
  shortCode: string;
  status: "Active" | "Inactive";
}

export interface Book {
  id: string;
  name: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  unit: string;
  status: "Active" | "Inactive";
}

export interface AuditEntry {
  tradeId: string;
  user: string;
  action: string;
  timestamp: string;
  comments: string;
}

export const counterparties: Counterparty[] = [
  { id: "CP001", name: "Vitol Group", shortCode: "VIT", status: "Active" },
  { id: "CP002", name: "Trafigura", shortCode: "TRA", status: "Active" },
  { id: "CP003", name: "Glencore Energy", shortCode: "GLE", status: "Active" },
  { id: "CP004", name: "Shell Energy", shortCode: "SHE", status: "Active" },
  { id: "CP005", name: "BP Energy Trading", shortCode: "BPE", status: "Active" },
  { id: "CP006", name: "EDF Trading", shortCode: "EDF", status: "Active" },
  { id: "CP007", name: "Axpo Trading", shortCode: "AXP", status: "Inactive" },
  { id: "CP008", name: "Gunvor Group", shortCode: "GUN", status: "Active" },
];

export const books: Book[] = [
  { id: "BK001", name: "Power UK", description: "UK Power trading book" },
  { id: "BK002", name: "Power DE", description: "German Power trading book" },
  { id: "BK003", name: "Power FR", description: "French Power trading book" },
  { id: "BK004", name: "Gas UK", description: "UK Natural Gas book" },
  { id: "BK005", name: "Renewables", description: "Renewable energy certificates book" },
];

export const products: Product[] = [
  { id: "PR001", name: "UK Base Load Power", unit: "MWh", status: "Active" },
  { id: "PR002", name: "UK Peak Load Power", unit: "MWh", status: "Active" },
  { id: "PR003", name: "DE Base Load Power", unit: "MWh", status: "Active" },
  { id: "PR004", name: "FR Base Load Power", unit: "MWh", status: "Active" },
  { id: "PR005", name: "UK Natural Gas", unit: "MWh", status: "Active" },
  { id: "PR006", name: "REGO Certificates", unit: "MWh", status: "Active" },
  { id: "PR007", name: "Carbon Credits", unit: "tCO2", status: "Inactive" },
];

export const trades: Trade[] = [
  {
    id: "TRD-2024-001",
    tradeDate: "2024-05-01",
    counterparty: "Vitol Group",
    product: "UK Base Load Power",
    deliveryStart: "2024-06-01",
    deliveryEnd: "2024-06-30",
    volume: 10000,
    price: 72.5,
    buySell: "Buy",
    book: "Power UK",
    status: "Confirmed",
    submittedBy: "J. Smith",
  },
  {
    id: "TRD-2024-002",
    tradeDate: "2024-05-01",
    counterparty: "Trafigura",
    product: "UK Peak Load Power",
    deliveryStart: "2024-06-01",
    deliveryEnd: "2024-06-30",
    volume: 5000,
    price: 95.0,
    buySell: "Sell",
    book: "Power UK",
    status: "Approved",
    submittedBy: "A. Jones",
  },
  {
    id: "TRD-2024-003",
    tradeDate: "2024-05-02",
    counterparty: "Glencore Energy",
    product: "DE Base Load Power",
    deliveryStart: "2024-07-01",
    deliveryEnd: "2024-07-31",
    volume: 15000,
    price: 68.0,
    buySell: "Buy",
    book: "Power DE",
    status: "Pending Validation",
    submittedBy: "M. Brown",
  },
  {
    id: "TRD-2024-004",
    tradeDate: "2024-05-02",
    counterparty: "Shell Energy",
    product: "UK Natural Gas",
    deliveryStart: "2024-06-01",
    deliveryEnd: "2024-08-31",
    volume: 8000,
    price: 42.3,
    buySell: "Sell",
    book: "Gas UK",
    status: "Pending Validation",
    submittedBy: "J. Smith",
  },
  {
    id: "TRD-2024-005",
    tradeDate: "2024-05-03",
    counterparty: "BP Energy Trading",
    product: "UK Base Load Power",
    deliveryStart: "2024-08-01",
    deliveryEnd: "2024-08-31",
    volume: 20000,
    price: 70.0,
    buySell: "Buy",
    book: "Power UK",
    status: "Confirmed",
    submittedBy: "A. Jones",
  },
  {
    id: "TRD-2024-006",
    tradeDate: "2024-05-03",
    counterparty: "EDF Trading",
    product: "FR Base Load Power",
    deliveryStart: "2024-06-01",
    deliveryEnd: "2024-09-30",
    volume: 12000,
    price: 65.5,
    buySell: "Sell",
    book: "Power FR",
    status: "Settled",
    submittedBy: "M. Brown",
  },
  {
    id: "TRD-2024-007",
    tradeDate: "2024-05-04",
    counterparty: "Gunvor Group",
    product: "UK Peak Load Power",
    deliveryStart: "2024-07-01",
    deliveryEnd: "2024-07-31",
    volume: 3000,
    price: 88.5,
    buySell: "Buy",
    book: "Power UK",
    status: "Pending Validation",
    submittedBy: "J. Smith",
  },
  {
    id: "TRD-2024-008",
    tradeDate: "2024-05-04",
    counterparty: "Vitol Group",
    product: "REGO Certificates",
    deliveryStart: "2024-06-01",
    deliveryEnd: "2024-12-31",
    volume: 25000,
    price: 5.2,
    buySell: "Buy",
    book: "Renewables",
    status: "Approved",
    submittedBy: "A. Jones",
  },
  {
    id: "TRD-2024-009",
    tradeDate: "2024-05-05",
    counterparty: "Trafigura",
    product: "UK Natural Gas",
    deliveryStart: "2024-09-01",
    deliveryEnd: "2024-09-30",
    volume: 6000,
    price: 44.1,
    buySell: "Buy",
    book: "Gas UK",
    status: "Confirmed",
    submittedBy: "M. Brown",
  },
  {
    id: "TRD-2024-010",
    tradeDate: "2024-05-05",
    counterparty: "Shell Energy",
    product: "DE Base Load Power",
    deliveryStart: "2024-08-01",
    deliveryEnd: "2024-08-31",
    volume: 9000,
    price: 71.0,
    buySell: "Sell",
    book: "Power DE",
    status: "Rejected",
    submittedBy: "J. Smith",
  },
  {
    id: "TRD-2024-011",
    tradeDate: "2024-05-06",
    counterparty: "EDF Trading",
    product: "UK Base Load Power",
    deliveryStart: "2024-09-01",
    deliveryEnd: "2024-09-30",
    volume: 7500,
    price: 69.8,
    buySell: "Buy",
    book: "Power UK",
    status: "Pending Validation",
    submittedBy: "A. Jones",
  },
  {
    id: "TRD-2024-012",
    tradeDate: "2024-05-06",
    counterparty: "BP Energy Trading",
    product: "FR Base Load Power",
    deliveryStart: "2024-07-01",
    deliveryEnd: "2024-09-30",
    volume: 11000,
    price: 63.0,
    buySell: "Sell",
    book: "Power FR",
    status: "Approved",
    submittedBy: "M. Brown",
  },
];

export const auditTrail: AuditEntry[] = [
  {
    tradeId: "TRD-2024-003",
    user: "P. Wilson (Middle Office)",
    action: "Submitted for Validation",
    timestamp: "2024-05-02 09:14:00",
    comments: "Routine submission",
  },
  {
    tradeId: "TRD-2024-004",
    user: "P. Wilson (Middle Office)",
    action: "Submitted for Validation",
    timestamp: "2024-05-02 14:32:00",
    comments: "Routine submission",
  },
  {
    tradeId: "TRD-2024-007",
    user: "C. Davies (Middle Office)",
    action: "Submitted for Validation",
    timestamp: "2024-05-04 10:05:00",
    comments: "Requires senior approval due to size",
  },
  {
    tradeId: "TRD-2024-010",
    user: "P. Wilson (Middle Office)",
    action: "Rejected",
    timestamp: "2024-05-05 16:45:00",
    comments: "Price discrepancy with market data — returned to trader",
  },
  {
    tradeId: "TRD-2024-011",
    user: "C. Davies (Middle Office)",
    action: "Submitted for Validation",
    timestamp: "2024-05-06 08:55:00",
    comments: "",
  },
];

// Position data derived from trades
export const positionsByBook = [
  { book: "Power UK", netPosition: 32500, marketValue: 2308750 },
  { book: "Power DE", netPosition: 6000, marketValue: 408000 },
  { book: "Power FR", netPosition: -1000, marketValue: -65000 },
  { book: "Gas UK", netPosition: 2000, marketValue: 86200 },
  { book: "Renewables", netPosition: 25000, marketValue: 130000 },
];

export const positionsByProduct = [
  { product: "UK Base Load Power", netPosition: 37500, marketValue: 2662500 },
  { product: "UK Peak Load Power", netPosition: -2000, marketValue: -187000 },
  { product: "DE Base Load Power", netPosition: 6000, marketValue: 408000 },
  { product: "FR Base Load Power", netPosition: -1000, marketValue: -65000 },
  { product: "UK Natural Gas", netPosition: 2000, marketValue: 86200 },
  { product: "REGO Certificates", netPosition: 25000, marketValue: 130000 },
];

export const positionsByDelivery = [
  { delivery: "Jun 2024", netPosition: 10000, marketValue: 725000 },
  { delivery: "Jul 2024", netPosition: 18000, marketValue: 1278000 },
  { delivery: "Aug 2024", netPosition: 20000, marketValue: 1400000 },
  { delivery: "Sep 2024", netPosition: 13500, marketValue: 944100 },
  { delivery: "Oct-Dec 2024", netPosition: 25000, marketValue: 130000 },
];

// Time series data
export const positionOverTime = [
  { date: "01 Apr", position: 5000 },
  { date: "05 Apr", position: 12000 },
  { date: "10 Apr", position: 8500 },
  { date: "15 Apr", position: 18000 },
  { date: "20 Apr", position: 14000 },
  { date: "25 Apr", position: 22000 },
  { date: "30 Apr", position: 19500 },
  { date: "01 May", position: 19500 },
  { date: "02 May", position: 34500 },
  { date: "03 May", position: 47500 },
  { date: "04 May", position: 69500 },
  { date: "05 May", position: 70500 },
  { date: "06 May", position: 69500 },
];

export const pnlOverTime = [
  { date: "01 Apr", pnl: 12000 },
  { date: "05 Apr", pnl: 28500 },
  { date: "10 Apr", pnl: 15000 },
  { date: "15 Apr", pnl: -8000 },
  { date: "20 Apr", pnl: 22000 },
  { date: "25 Apr", pnl: 35000 },
  { date: "30 Apr", pnl: 41000 },
  { date: "01 May", pnl: 38000 },
  { date: "02 May", pnl: 52000 },
  { date: "03 May", pnl: 47000 },
  { date: "04 May", pnl: 61500 },
  { date: "05 May", pnl: 58000 },
  { date: "06 May", pnl: 63200 },
];

export const exposureByCounterparty = [
  { counterparty: "Vitol", exposure: 2438750 },
  { counterparty: "Trafigura", exposure: 737500 },
  { counterparty: "Glencore", exposure: 1020000 },
  { counterparty: "Shell", exposure: 638400 },
  { counterparty: "BP", exposure: 1400000 },
  { counterparty: "EDF", exposure: 856000 },
];

// Market data
export const marketPriceCurves: Record<string, { date: string; price: number }[]> = {
  "UK Base Load Power": [
    { date: "Jan 24", price: 78.5 },
    { date: "Feb 24", price: 74.2 },
    { date: "Mar 24", price: 69.8 },
    { date: "Apr 24", price: 71.5 },
    { date: "May 24", price: 72.5 },
    { date: "Jun 24", price: 75.0 },
    { date: "Jul 24", price: 80.2 },
    { date: "Aug 24", price: 82.5 },
    { date: "Sep 24", price: 74.8 },
    { date: "Oct 24", price: 78.0 },
    { date: "Nov 24", price: 85.5 },
    { date: "Dec 24", price: 92.0 },
  ],
  "UK Peak Load Power": [
    { date: "Jan 24", price: 108.5 },
    { date: "Feb 24", price: 102.2 },
    { date: "Mar 24", price: 96.8 },
    { date: "Apr 24", price: 90.5 },
    { date: "May 24", price: 88.0 },
    { date: "Jun 24", price: 92.5 },
    { date: "Jul 24", price: 98.0 },
    { date: "Aug 24", price: 105.2 },
    { date: "Sep 24", price: 95.8 },
    { date: "Oct 24", price: 100.0 },
    { date: "Nov 24", price: 112.5 },
    { date: "Dec 24", price: 125.0 },
  ],
  "DE Base Load Power": [
    { date: "Jan 24", price: 72.0 },
    { date: "Feb 24", price: 68.5 },
    { date: "Mar 24", price: 64.0 },
    { date: "Apr 24", price: 66.5 },
    { date: "May 24", price: 67.8 },
    { date: "Jun 24", price: 70.5 },
    { date: "Jul 24", price: 75.0 },
    { date: "Aug 24", price: 78.2 },
    { date: "Sep 24", price: 69.5 },
    { date: "Oct 24", price: 73.0 },
    { date: "Nov 24", price: 80.5 },
    { date: "Dec 24", price: 88.0 },
  ],
  "UK Natural Gas": [
    { date: "Jan 24", price: 50.2 },
    { date: "Feb 24", price: 46.8 },
    { date: "Mar 24", price: 43.5 },
    { date: "Apr 24", price: 42.0 },
    { date: "May 24", price: 42.3 },
    { date: "Jun 24", price: 44.0 },
    { date: "Jul 24", price: 46.5 },
    { date: "Aug 24", price: 48.0 },
    { date: "Sep 24", price: 45.5 },
    { date: "Oct 24", price: 48.0 },
    { date: "Nov 24", price: 54.5 },
    { date: "Dec 24", price: 60.0 },
  ],
};

// Confirmations
export interface Confirmation {
  tradeId: string;
  counterparty: string;
  confirmationDate: string;
  status: ConfirmationStatus;
}

export const confirmations: Confirmation[] = [
  { tradeId: "TRD-2024-001", counterparty: "Vitol Group", confirmationDate: "2024-05-03", status: "Matched" },
  { tradeId: "TRD-2024-002", counterparty: "Trafigura", confirmationDate: "2024-05-03", status: "Sent" },
  { tradeId: "TRD-2024-005", counterparty: "BP Energy Trading", confirmationDate: "2024-05-05", status: "Matched" },
  { tradeId: "TRD-2024-006", counterparty: "EDF Trading", confirmationDate: "2024-05-04", status: "Matched" },
  { tradeId: "TRD-2024-008", counterparty: "Vitol Group", confirmationDate: "2024-05-06", status: "Pending" },
  { tradeId: "TRD-2024-009", counterparty: "Trafigura", confirmationDate: "2024-05-06", status: "Disputed" },
  { tradeId: "TRD-2024-012", counterparty: "BP Energy Trading", confirmationDate: "2024-05-07", status: "Pending" },
];

// Settlements
export interface Settlement {
  tradeId: string;
  counterparty: string;
  settlementDate: string;
  value: number;
  currency: string;
  status: SettlementStatus;
}

export const settlements: Settlement[] = [
  { tradeId: "TRD-2024-001", counterparty: "Vitol Group", settlementDate: "2024-07-05", value: 725000, currency: "GBP", status: "Pending" },
  { tradeId: "TRD-2024-002", counterparty: "Trafigura", settlementDate: "2024-07-05", value: 475000, currency: "GBP", status: "Pending" },
  { tradeId: "TRD-2024-005", counterparty: "BP Energy Trading", settlementDate: "2024-09-05", value: 1400000, currency: "GBP", status: "Pending" },
  { tradeId: "TRD-2024-006", counterparty: "EDF Trading", settlementDate: "2024-05-10", value: 786000, currency: "EUR", status: "Processed" },
  { tradeId: "TRD-2024-008", counterparty: "Vitol Group", settlementDate: "2025-01-05", value: 130000, currency: "GBP", status: "Pending" },
  { tradeId: "TRD-2024-009", counterparty: "Trafigura", settlementDate: "2024-10-05", value: 264600, currency: "GBP", status: "Pending" },
];

// Insights
export interface Insight {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  category: "Risk" | "Opportunity" | "Market";
}

export const insights: Insight[] = [
  {
    id: "INS-001",
    title: "Concentration Risk: Vitol Group",
    description: "Exposure to Vitol Group represents 38% of total portfolio exposure (£2.44M). Consider diversifying counterparty risk by splitting future trades across multiple counterparties.",
    timestamp: "2024-05-06 08:00:00",
    category: "Risk",
  },
  {
    id: "INS-002",
    title: "Peak Load Premium Opportunity",
    description: "Current UK Peak Load spread over Base Load is £15.5/MWh, historically 12% above average. Consider increasing Peak Load buy positions ahead of Q3 demand season.",
    timestamp: "2024-05-06 08:05:00",
    category: "Opportunity",
  },
  {
    id: "INS-003",
    title: "Seasonal Price Signal: Winter 2024",
    description: "Forward curves indicate a 28% price premium for Dec 2024 vs Jun 2024 delivery. Q4 supply tightness expected based on current storage levels in NW Europe.",
    timestamp: "2024-05-06 08:10:00",
    category: "Market",
  },
  {
    id: "INS-004",
    title: "Pending Validation Backlog",
    description: "4 trades remain pending validation for over 24 hours. Delayed approval may impact confirmation timelines and counterparty relationships.",
    timestamp: "2024-05-06 09:00:00",
    category: "Risk",
  },
  {
    id: "INS-005",
    title: "Gas-Power Spread Tightening",
    description: "The gas-to-power spark spread has narrowed by 18% over the past 30 days, suggesting reduced generation profitability. Monitor gas book positions closely.",
    timestamp: "2024-05-06 09:30:00",
    category: "Market",
  },
  {
    id: "INS-006",
    title: "REGO Certificate Upside",
    description: "Renewable Energy Guarantee of Origin (REGO) certificates have appreciated 4% this week. Current book value of 25,000 MWh position has unrealised gains of £5,200.",
    timestamp: "2024-05-06 10:00:00",
    category: "Opportunity",
  },
];

export const totalPosition = positionsByBook.reduce((sum, b) => sum + b.netPosition, 0);
export const dailyPnl = 63200;
export const openExposure = exposureByCounterparty.reduce((sum, e) => sum + e.exposure, 0);
export const pendingValidationCount = trades.filter((t) => t.status === "Pending Validation").length;
