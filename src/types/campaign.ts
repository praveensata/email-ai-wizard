
export enum CampaignStatus {
  Draft = 'draft',
  Scheduled = 'scheduled',
  Sent = 'sent',
  Failed = 'failed'
}

export enum CustomerSegment {
  AllCustomers = 'all_customers',
  NewCustomers = 'new_customers',
  ReturningCustomers = 'returning_customers',
  InactiveCustomers = 'inactive_customers',
  HighValueCustomers = 'high_value_customers'
}

export interface CampaignStats {
  sent: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number;
}

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  status: CampaignStatus;
  customerSegment: CustomerSegment;
  scheduledDate: any; // Firestore timestamp
  createdAt: any; // Firestore timestamp
  updatedAt: any; // Firestore timestamp
  userId: string;
  stats: CampaignStats;
}

export interface CustomerSegmentOption {
  value: CustomerSegment;
  label: string;
  description: string;
}

export const customerSegmentOptions: CustomerSegmentOption[] = [
  {
    value: CustomerSegment.AllCustomers,
    label: 'All Customers',
    description: 'Send to all customers in your database'
  },
  {
    value: CustomerSegment.NewCustomers,
    label: 'New Customers',
    description: 'Customers who made their first purchase in the last 30 days'
  },
  {
    value: CustomerSegment.ReturningCustomers,
    label: 'Returning Customers',
    description: 'Customers who have made more than one purchase'
  },
  {
    value: CustomerSegment.InactiveCustomers,
    label: 'Inactive Customers',
    description: 'Customers who haven\'t made a purchase in the last 90 days'
  },
  {
    value: CustomerSegment.HighValueCustomers,
    label: 'High Value Customers',
    description: 'Top 20% of customers by total purchase value'
  }
];
