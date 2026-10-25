export type UserRole = 'campus_user' | 'security_personnel' | 'administrator';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  user_type?: string;
  identifier?: string;
  phone?: string;
  department?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  retention_period_days?: number;
}

export interface LostItem {
  id: number;
  user_id: number;
  category_id: number;
  title: string;
  description: string;
  color?: string | null;
  brand?: string | null;
  location: string;
  date_lost: string;
  photo_url?: string | null;
  contact_info?: string | null;
  status: 'OPEN' | 'MATCH_PENDING' | 'CLAIMED' | 'RESOLVED' | 'CLOSED';
  created_at: string;
  category_name?: string;
  category_icon?: string;
  reporter_name?: string;
}

export interface FoundItem {
  id: number;
  finder_id?: number | null;
  category_id: number;
  title: string;
  description: string;
  color?: string | null;
  brand?: string | null;
  location: string;
  date_found: string;
  photo_url?: string | null;
  storage_location: string;
  custody_status: 'UNCOLLECTED' | 'IN_CUSTODY' | 'VAULT_LOCKED' | 'RETURNED' | 'DISPOSED';
  is_verified: number;
  secret_identifying_details?: string;
  status: 'UNCLAIMED' | 'CLAIM_PENDING' | 'RETURNED' | 'AUCTIONED' | 'DISPOSED';
  created_at: string;
  category_name?: string;
  category_icon?: string;
  finder_name?: string;
}

export interface PotentialMatch {
  id: number;
  lost_item_id: number;
  found_item_id: number;
  score: number;
  match_reasons: {
    categoryMatch: boolean;
    brandMatch: boolean;
    colorMatch: boolean;
    locationMatch: boolean;
    titleOverlap: boolean;
    dateDiffDays: number;
    notes: string[];
  };
  status: 'PENDING' | 'CONFIRMED' | 'DISMISSED';
  created_at: string;
  lost_title?: string;
  lost_location?: string;
  date_lost?: string;
  found_title?: string;
  found_location?: string;
  date_found?: string;
  found_photo?: string;
  storage_location?: string;
  found_status?: string;
  category_name?: string;
}

export interface Claim {
  id: number;
  found_item_id: number;
  lost_item_id?: number | null;
  claimant_id: number;
  proof_description: string;
  contact_phone?: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  reviewer_id?: number | null;
  reviewer_remarks?: string | null;
  reviewed_at?: string | null;
  created_at: string;
  item_title?: string;
  item_description?: string;
  found_location?: string;
  date_found?: string;
  photo_url?: string;
  storage_location?: string;
  item_status?: string;
  secret_identifying_details?: string;
  category_name?: string;
  claimant_name?: string;
  claimant_email?: string;
  claimant_roll?: string;
  claimant_dept?: string;
  claimant_phone?: string;
  reviewer_name?: string;
}

export interface ReturnRecord {
  id: number;
  claim_id: number;
  found_item_id: number;
  receiver_id: number;
  handed_over_by: number;
  receiver_id_proof: string;
  receipt_no: string;
  remarks?: string;
  return_date: string;
  item_title?: string;
  item_color?: string;
  item_brand?: string;
  category_name?: string;
  receiver_name?: string;
  receiver_email?: string;
  receiver_roll?: string;
  receiver_phone?: string;
  officer_name?: string;
  officer_badge?: string;
}

export interface Experiment {
  id: number;
  title: string;
  aim: string;
  implementation: string;
  deliverables: string[];
  diagramType: string;
  diagramImage: string | null;
  featureLink: string;
  status: string;
}
