


-- PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'faculty', 'student', 'reviewer')),
  avatar_url text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_authenticated"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- DEPARTMENTS TABLE
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  description text DEFAULT '',
  vision text DEFAULT '',
  mission text DEFAULT '',
  established_year integer,
  image_url text,
  hod_name text DEFAULT '',
  faculty_count integer DEFAULT 0,
  student_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "departments_select_all"
  ON departments FOR SELECT
  USING (true);

CREATE POLICY "departments_insert_admin"
  ON departments FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "departments_update_admin"
  ON departments FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "departments_delete_admin"
  ON departments FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- PROGRAMS TABLE
CREATE TABLE IF NOT EXISTS programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid REFERENCES departments(id) ON DELETE CASCADE,
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  type text NOT NULL CHECK (type IN ('UG', 'PG', 'PhD', 'Diploma')),
  duration_years integer NOT NULL DEFAULT 4,
  total_seats integer DEFAULT 60,
  intake integer DEFAULT 60,
  accreditation_status text DEFAULT 'NBA Accredited',
  description text DEFAULT '',
  eligibility text DEFAULT '',
  career_prospects text DEFAULT '',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "programs_select_all"
  ON programs FOR SELECT
  USING (true);

CREATE POLICY "programs_insert_admin"
  ON programs FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "programs_update_admin"
  ON programs FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- FACULTY TABLE
CREATE TABLE IF NOT EXISTS faculty (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid REFERENCES departments(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  designation text NOT NULL DEFAULT 'Assistant Professor',
  qualification text DEFAULT '',
  specialization text DEFAULT '',
  experience_years integer DEFAULT 0,
  research_interests text[] DEFAULT '{}',
  phone text,
  office_location text,
  joined_date date,
  google_scholar_url text,
  scopus_id text,
  publications_count integer DEFAULT 0,
  patents_count integer DEFAULT 0,
  projects_count integer DEFAULT 0,
  image_url text,
  is_hod boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;

CREATE POLICY "faculty_select_active"
  ON faculty FOR SELECT
  USING (is_active = true);

CREATE POLICY "faculty_select_admin"
  ON faculty FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'faculty')));

CREATE POLICY "faculty_insert_admin"
  ON faculty FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "faculty_update_admin"
  ON faculty FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "faculty_delete_admin"
  ON faculty FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- PUBLICATIONS TABLE
CREATE TABLE IF NOT EXISTS publications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id uuid REFERENCES faculty(id) ON DELETE CASCADE,
  department_id uuid REFERENCES departments(id),
  title text NOT NULL,
  authors text NOT NULL,
  journal_conference text NOT NULL,
  publication_type text NOT NULL CHECK (publication_type IN ('journal', 'conference', 'book_chapter', 'patent', 'book')),
  year integer NOT NULL,
  volume text,
  issue text,
  pages text,
  doi text,
  impact_factor numeric(4,2),
  is_scopus_indexed boolean DEFAULT false,
  is_scie_indexed boolean DEFAULT false,
  citations integer DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE publications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "publications_select_published"
  ON publications FOR SELECT
  USING (is_published = true);

CREATE POLICY "publications_select_authenticated"
  ON publications FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "publications_insert_faculty_admin"
  ON publications FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'faculty')));

CREATE POLICY "publications_update_faculty_admin"
  ON publications FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'faculty')))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'faculty')));

CREATE POLICY "publications_delete_admin"
  ON publications FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- FUNDED PROJECTS TABLE
CREATE TABLE IF NOT EXISTS funded_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id uuid REFERENCES faculty(id) ON DELETE SET NULL,
  department_id uuid REFERENCES departments(id),
  title text NOT NULL,
  funding_agency text NOT NULL,
  amount numeric(12,2) DEFAULT 0,
  start_date date,
  end_date date,
  project_type text DEFAULT 'research' CHECK (project_type IN ('research', 'consultancy', 'sponsored')),
  status text DEFAULT 'ongoing' CHECK (status IN ('ongoing', 'completed', 'submitted')),
  description text DEFAULT '',
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE funded_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "funded_projects_select_published"
  ON funded_projects FOR SELECT
  USING (is_published = true);

CREATE POLICY "funded_projects_insert_faculty_admin"
  ON funded_projects FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'faculty')));

CREATE POLICY "funded_projects_update_faculty_admin"
  ON funded_projects FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'faculty')))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'faculty')));

CREATE POLICY "funded_projects_delete_admin"
  ON funded_projects FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- LABS TABLE
CREATE TABLE IF NOT EXISTS labs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid REFERENCES departments(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  area_sqft integer,
  capacity integer,
  established_year integer,
  equipment_list text[] DEFAULT '{}',
  image_url text,
  in_charge_name text DEFAULT '',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE labs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "labs_select_active"
  ON labs FOR SELECT
  USING (is_active = true);

CREATE POLICY "labs_insert_admin"
  ON labs FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "labs_update_admin"
  ON labs FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- EVENTS TABLE
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid REFERENCES departments(id),
  title text NOT NULL,
  description text DEFAULT '',
  event_type text DEFAULT 'seminar' CHECK (event_type IN ('seminar', 'workshop', 'conference', 'fest', 'symposium', 'guest_lecture', 'other')),
  event_date date NOT NULL,
  end_date date,
  venue text DEFAULT '',
  image_url text,
  registration_url text,
  is_published boolean DEFAULT false,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "events_select_published"
  ON events FOR SELECT
  USING (is_published = true);

CREATE POLICY "events_select_authenticated"
  ON events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "events_insert_faculty_admin"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'faculty')));

CREATE POLICY "events_update_faculty_admin"
  ON events FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'faculty')))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'faculty')));

CREATE POLICY "events_delete_admin"
  ON events FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid REFERENCES departments(id),
  title text NOT NULL,
  content text NOT NULL,
  priority text DEFAULT 'normal' CHECK (priority IN ('high', 'normal', 'low')),
  announcement_type text DEFAULT 'general' CHECK (announcement_type IN ('general', 'academic', 'exam', 'placement', 'research', 'event')),
  attachment_url text,
  expires_at timestamptz,
  is_published boolean DEFAULT false,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "announcements_select_published"
  ON announcements FOR SELECT
  USING (is_published = true AND (expires_at IS NULL OR expires_at > now()));

CREATE POLICY "announcements_select_authenticated"
  ON announcements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "announcements_insert_faculty_admin"
  ON announcements FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'faculty')));

CREATE POLICY "announcements_update_faculty_admin"
  ON announcements FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'faculty')))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'faculty')));

CREATE POLICY "announcements_delete_admin"
  ON announcements FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- STUDENT ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS student_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid REFERENCES departments(id),
  program_id uuid REFERENCES programs(id),
  student_name text NOT NULL,
  batch_year integer,
  achievement_type text NOT NULL CHECK (achievement_type IN ('academic', 'sports', 'cultural', 'research', 'placement', 'competition', 'other')),
  title text NOT NULL,
  description text DEFAULT '',
  award_value text,
  organizer text,
  achievement_date date,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE student_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "achievements_select_published"
  ON student_achievements FOR SELECT
  USING (is_published = true);

CREATE POLICY "achievements_select_authenticated"
  ON student_achievements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "achievements_insert_faculty_admin"
  ON student_achievements FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'faculty')));

CREATE POLICY "achievements_update_faculty_admin"
  ON student_achievements FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'faculty')))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'faculty')));

CREATE POLICY "achievements_delete_admin"
  ON student_achievements FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_faculty_department ON faculty(department_id);
CREATE INDEX IF NOT EXISTS idx_publications_faculty ON publications(faculty_id);
CREATE INDEX IF NOT EXISTS idx_publications_year ON publications(year);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_published ON events(is_published);
CREATE INDEX IF NOT EXISTS idx_announcements_published ON announcements(is_published);
CREATE INDEX IF NOT EXISTS idx_programs_department ON programs(department_id);
