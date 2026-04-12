export type UserRole = 'admin' | 'faculty' | 'student' | 'reviewer';

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  vision: string;
  mission: string;
  established_year?: number;
  image_url?: string;
  hod_name: string;
  faculty_count: number;
  student_count: number;
  is_active: boolean;
  created_at: string;
}

export interface Program {
  id: string;
  department_id: string;
  name: string;
  code: string;
  type: 'UG' | 'PG' | 'PhD' | 'Diploma';
  duration_years: number;
  total_seats: number;
  intake: number;
  accreditation_status: string;
  description: string;
  eligibility: string;
  career_prospects: string;
  is_active: boolean;
  created_at: string;
  departments?: Department;
}

export interface Faculty {
  id: string;
  department_id?: string;
  name: string;
  email: string;
  designation: string;
  qualification: string;
  specialization: string;
  experience_years: number;
  research_interests: string[];
  phone?: string;
  office_location?: string;
  joined_date?: string;
  google_scholar_url?: string;
  scopus_id?: string;
  publications_count: number;
  patents_count: number;
  projects_count: number;
  image_url?: string;
  is_hod: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  departments?: Department;
}

export interface Publication {
  id: string;
  faculty_id?: string;
  department_id?: string;
  title: string;
  authors: string;
  journal_conference: string;
  publication_type: 'journal' | 'conference' | 'book_chapter' | 'patent' | 'book';
  year: number;
  volume?: string;
  doi?: string;
  impact_factor?: number;
  is_scopus_indexed: boolean;
  is_scie_indexed: boolean;
  citations: number;
  is_published: boolean;
  created_at: string;
  faculty?: Faculty;
  departments?: Department;
}

export interface FundedProject {
  id: string;
  faculty_id?: string;
  department_id?: string;
  title: string;
  funding_agency: string;
  amount: number;
  start_date?: string;
  end_date?: string;
  project_type: 'research' | 'consultancy' | 'sponsored';
  status: 'ongoing' | 'completed' | 'submitted';
  description: string;
  is_published: boolean;
  created_at: string;
  faculty?: Faculty;
  departments?: Department;
}

export interface Lab {
  id: string;
  department_id: string;
  name: string;
  description: string;
  area_sqft?: number;
  capacity?: number;
  established_year?: number;
  equipment_list: string[];
  image_url?: string;
  in_charge_name: string;
  is_active: boolean;
  created_at: string;
  departments?: Department;
}

export interface Event {
  id: string;
  department_id?: string;
  title: string;
  description: string;
  event_type: 'seminar' | 'workshop' | 'conference' | 'fest' | 'symposium' | 'guest_lecture' | 'other';
  event_date: string;
  end_date?: string;
  venue: string;
  image_url?: string;
  registration_url?: string;
  is_published: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
  departments?: Department;
}

export interface Announcement {
  id: string;
  department_id?: string;
  title: string;
  content: string;
  priority: 'high' | 'normal' | 'low';
  announcement_type: 'general' | 'academic' | 'exam' | 'placement' | 'research' | 'event';
  attachment_url?: string;
  expires_at?: string;
  is_published: boolean;
  created_by?: string;
  created_at: string;
  departments?: Department;
}

export interface StudentAchievement {
  id: string;
  department_id?: string;
  program_id?: string;
  student_name: string;
  batch_year?: number;
  achievement_type: 'academic' | 'sports' | 'cultural' | 'research' | 'placement' | 'competition' | 'other';
  title: string;
  description: string;
  award_value?: string;
  organizer?: string;
  achievement_date?: string;
  is_published: boolean;
  created_at: string;
  departments?: Department;
  programs?: Program;
}
