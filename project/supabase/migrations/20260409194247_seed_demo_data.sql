

-- DEPARTMENTS
INSERT INTO departments 
(name, code, description, vision, mission, established_year, hod_name, faculty_count, student_count, image_url) 
VALUES
(
  'Computer Science & Engineering',
  'CSE',
  'The Department of Computer Science & Engineering at K.R. Mangalam University focuses on cutting-edge technologies such as Artificial Intelligence, Data Science, and Cloud Computing, preparing students for industry and research roles.',
  'To be a center of excellence in computing education and research, fostering innovation, entrepreneurship, and global competence.',
  'To deliver outcome-based education through industry-aligned curriculum, research-driven learning, and strong ethical values.',
  2013,
  'Dr. Amitabh Singh',
  28,
  650,
  'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800'
),
(
  'Electronics & Communication Engineering',
  'ECE',
  'The ECE department emphasizes modern communication systems, embedded systems, and VLSI design, enabling students to work on real-world electronics applications.',
  'To develop globally competent electronics engineers with strong analytical and innovation capabilities.',
  'To provide quality education through practical exposure, interdisciplinary learning, and research in emerging electronics domains.',
  2013,
  'Dr. Neha Bansal',
  20,
  480,
  'https://images.pexels.com/photos/3912981/pexels-photo-3912981.jpeg?auto=compress&cs=tinysrgb&w=800'
),
(
  'Mechanical Engineering',
  'ME',
  'The Mechanical Engineering department integrates traditional engineering principles with modern tools like CAD/CAM, robotics, and automation.',
  'To become a leading department producing industry-ready mechanical engineers and innovators.',
  'To impart strong fundamentals in mechanical engineering along with hands-on training and industrial exposure.',
  2013,
  'Dr. Vivek Sharma',
  18,
  420,
  'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=800'
),
(
  'Civil Engineering',
  'CE',
  'The Civil Engineering department focuses on sustainable infrastructure, smart cities, and modern construction technologies.',
  'To produce skilled civil engineers capable of addressing global infrastructure challenges.',
  'To provide high-quality education with emphasis on sustainability, innovation, and field-based learning.',
  2013,
  'Dr. Shalini Mehta',
  16,
  350,
  'https://images.pexels.com/photos/159306/construction-site-build-construction-work-159306.jpeg?auto=compress&cs=tinysrgb&w=800'
),
(
  'Electrical & Electronics Engineering',
  'EEE',
  'The EEE department specializes in power systems, renewable energy, and automation technologies aligned with modern industry needs.',
  'To be a pioneer in electrical engineering education promoting sustainable and smart energy solutions.',
  'To develop competent engineers through practical learning, research, and innovation in electrical systems.',
  2013,
  'Dr. Rohit Aggarwal',
  17,
  390,
  'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=800'
)
ON CONFLICT (code) DO NOTHING;

-- PROGRAMS
INSERT INTO programs 
(department_id, name, code, type, duration_years, total_seats, intake, accreditation_status, description, eligibility)
SELECT
  d.id,
  p.name,
  p.code,
  p.type,
  p.duration_years,
  p.total_seats,
  p.intake,
  p.accreditation_status,
  p.description,
  p.eligibility
FROM (VALUES
  ('CSE', 'B.Tech Computer Science & Engineering', 'BTCSE', 'UG', 4, 180, 180, 'NAAC Accredited', 'Undergraduate program focused on AI, Data Science, Cloud Computing, and Software Development aligned with industry needs.', '10+2 with PCM, Merit/University Entrance'),
  
  ('CSE', 'B.Tech CSE (AI & ML)', 'BTCSAI', 'UG', 4, 120, 120, 'NAAC Accredited', 'Specialization in Artificial Intelligence and Machine Learning with hands-on industry projects.', '10+2 with PCM, Merit/University Entrance'),
  
  ('CSE', 'B.Tech CSE (Data Science)', 'BTCSDS', 'UG', 4, 120, 120, 'NAAC Accredited', 'Focus on Big Data, Analytics, and Data Engineering with real-world applications.', '10+2 with PCM, Merit/University Entrance'),

  ('ECE', 'B.Tech Electronics & Communication Engineering', 'BTECE', 'UG', 4, 120, 120, 'NAAC Accredited', 'Program covering embedded systems, IoT, VLSI design, and modern communication systems.', '10+2 with PCM, Merit/University Entrance'),

  ('ME', 'B.Tech Mechanical Engineering', 'BTME', 'UG', 4, 90, 90, 'NAAC Accredited', 'Focus on design, manufacturing, robotics, and thermal engineering with practical exposure.', '10+2 with PCM, Merit/University Entrance'),

  ('CE', 'B.Tech Civil Engineering', 'BTCE', 'UG', 4, 90, 90, 'NAAC Accredited', 'Program focused on infrastructure, smart cities, and sustainable construction technologies.', '10+2 with PCM, Merit/University Entrance'),

  ('EEE', 'B.Tech Electrical & Electronics Engineering', 'BTEEE', 'UG', 4, 90, 90, 'NAAC Accredited', 'Covers power systems, renewable energy, and automation technologies.', '10+2 with PCM, Merit/University Entrance')

) AS p(dept_code, name, code, type, duration_years, total_seats, intake, accreditation_status, description, eligibility)
JOIN departments d ON d.code = p.dept_code
ON CONFLICT (code) DO NOTHING;

-- FACULTY
INSERT INTO faculty (department_id, name, email, designation, qualification, specialization, experience_years, research_interests, phone, office_location, joined_date, publications_count, patents_count, projects_count, is_hod, image_url)
SELECT
  d.id,
  f.name,
  f.email,
  f.designation,
  f.qualification,
  f.specialization,
  f.experience_years,
  f.research_interests,
  f.phone,
  f.office_location,
  f.joined_date::date,
  f.publications_count,
  f.patents_count,
  f.projects_count,
  f.is_hod,
  f.image_url
FROM (VALUES
  ('CSE', 'Dr. Rajesh Kumar', 'rajesh.kumar@set.edu.in', 'Professor & Head', 'Ph.D (IIT Delhi)', 'Machine Learning & AI', 20, ARRAY['Machine Learning', 'Deep Learning', 'Computer Vision'], '+91-9876543210', 'Room 301, CSE Block', '2004-07-01', 45, 2, 8, true, 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('CSE', 'Dr. Meera Patel', 'meera.patel@set.edu.in', 'Associate Professor', 'Ph.D (NIT Trichy)', 'Cybersecurity & Networks', 15, ARRAY['Network Security', 'Cryptography', 'IoT Security'], '+91-9876543211', 'Room 302, CSE Block', '2009-08-01', 32, 1, 5, false, 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('CSE', 'Dr. Arun Krishnan', 'arun.krishnan@set.edu.in', 'Assistant Professor', 'Ph.D (IIT Bombay)', 'Cloud Computing', 10, ARRAY['Cloud Computing', 'Distributed Systems', 'Big Data'], '+91-9876543212', 'Room 303, CSE Block', '2014-06-15', 18, 0, 3, false, 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('ECE', 'Dr. Sunita Sharma', 'sunita.sharma@set.edu.in', 'Professor & Head', 'Ph.D (IIT Madras)', 'VLSI Design', 22, ARRAY['VLSI Design', 'Embedded Systems', 'Low Power Design'], '+91-9876543213', 'Room 201, ECE Block', '2002-07-01', 52, 3, 10, true, 'https://images.pexels.com/photos/3767392/pexels-photo-3767392.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('ECE', 'Prof. Vivek Anand', 'vivek.anand@set.edu.in', 'Associate Professor', 'M.Tech (IIT Kharagpur)', 'Signal Processing', 18, ARRAY['Digital Signal Processing', 'Image Processing', 'Wireless Communications'], '+91-9876543214', 'Room 202, ECE Block', '2006-06-01', 24, 1, 4, false, 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('ME', 'Prof. Anil Verma', 'anil.verma@set.edu.in', 'Professor & Head', 'Ph.D (IISc Bangalore)', 'Thermal Sciences', 25, ARRAY['Heat Transfer', 'Computational Fluid Dynamics', 'Renewable Energy'], '+91-9876543215', 'Room 101, ME Block', '1999-07-01', 38, 2, 7, true, 'https://images.pexels.com/photos/837358/pexels-photo-837358.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('ME', 'Dr. Kavitha Rao', 'kavitha.rao@set.edu.in', 'Associate Professor', 'Ph.D (NIT Karnataka)', 'Manufacturing Processes', 14, ARRAY['CNC Machining', 'Additive Manufacturing', 'Lean Manufacturing'], '+91-9876543216', 'Room 102, ME Block', '2010-07-15', 22, 2, 4, false, 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('CE', 'Dr. Priya Nair', 'priya.nair@set.edu.in', 'Professor & Head', 'Ph.D (IIT Roorkee)', 'Structural Engineering', 19, ARRAY['Earthquake Engineering', 'FEM Analysis', 'Smart Structures'], '+91-9876543217', 'Room 401, CE Block', '2005-07-01', 30, 1, 6, true, 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('EEE', 'Dr. Ramesh Iyer', 'ramesh.iyer@set.edu.in', 'Professor & Head', 'Ph.D (BITS Pilani)', 'Power Systems', 21, ARRAY['Smart Grid', 'Renewable Energy Systems', 'Power Electronics'], '+91-9876543218', 'Room 501, EEE Block', '2003-07-01', 40, 2, 8, true, 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('EEE', 'Dr. Lakshmi Menon', 'lakshmi.menon@set.edu.in', 'Associate Professor', 'Ph.D (Anna University)', 'Control Systems', 16, ARRAY['Robust Control', 'Process Control', 'Industrial Automation'], '+91-9876543219', 'Room 502, EEE Block', '2008-06-01', 26, 1, 5, false, 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('CSE', 'Dr. Suresh Babu', 'suresh.babu@set.edu.in', 'Assistant Professor', 'Ph.D (VIT University)', 'Natural Language Processing', 8, ARRAY['NLP', 'Text Mining', 'Information Retrieval'], '+91-9876543220', 'Room 304, CSE Block', '2016-07-01', 12, 0, 2, false, 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('ECE', 'Dr. Rohini Das', 'rohini.das@set.edu.in', 'Assistant Professor', 'Ph.D (BITS Goa)', 'Microwave Engineering', 9, ARRAY['Antenna Design', 'RF Circuits', 'Microwave Filters'], '+91-9876543221', 'Room 203, ECE Block', '2015-08-01', 15, 1, 2, false, 'https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg?auto=compress&cs=tinysrgb&w=400')
) AS f(dept_code, name, email, designation, qualification, specialization, experience_years, research_interests, phone, office_location, joined_date, publications_count, patents_count, projects_count, is_hod, image_url)
JOIN departments d ON d.code = f.dept_code
ON CONFLICT (email) DO NOTHING;

-- PUBLICATIONS
INSERT INTO publications 
(faculty_id, department_id, title, authors, journal_conference, publication_type, year, volume, doi, impact_factor, is_scopus_indexed, is_scie_indexed, citations)
SELECT
  fac.id,
  dept.id,
  p.title,
  p.authors,
  p.journal_conference,
  p.pub_type,
  p.year,
  p.volume,
  p.doi,
  p.impact_factor,
  p.is_scopus,
  p.is_scie,
  p.citations
FROM (VALUES
  ('rajesh.kumar@set.edu.in', 'CSE', 'Deep Learning Approach for Traffic Sign Detection', 'Rajesh Kumar, Meera Patel', 'International Journal of Computer Applications', 'journal', 2023, '185(12)', '10.5120/ijca2023.001', 1.2, true, false, 12),

  ('meera.patel@set.edu.in', 'CSE', 'Machine Learning Based Intrusion Detection System', 'Meera Patel, Rajesh Kumar', 'Journal of Information Security', 'journal', 2022, '14(2)', '10.4236/jis.2022.002', 1.5, true, false, 18),

  ('suresh.babu@set.edu.in', 'CSE', 'Sentiment Analysis using BERT for Social Media Text', 'Suresh Babu, Meera Patel', 'International Conference on Data Science (ICDS)', 'conference', 2023, NULL, '10.1109/ICDS.2023.003', NULL, true, false, 10),

  ('sunita.sharma@set.edu.in', 'ECE', 'Design of Low Power VLSI Circuits for IoT Applications', 'Sunita Sharma, Vivek Anand', 'International Journal of Electronics and Communication', 'journal', 2023, '98', '10.1016/ijece.2023.004', 2.1, true, false, 14),

  ('vivek.anand@set.edu.in', 'ECE', 'Performance Analysis of 5G Communication Systems', 'Vivek Anand, Rohini Das', 'IEEE International Conference on Communication Systems', 'conference', 2022, NULL, '10.1109/ICCS.2022.005', NULL, true, false, 9),

  ('anil.verma@set.edu.in', 'ME', 'Heat Transfer Enhancement in Microchannels', 'Anil Verma, Kavitha Rao', 'International Journal of Thermal Sciences', 'journal', 2023, '175', '10.1016/j.ijts.2023.006', 2.5, true, false, 16),

  ('kavitha.rao@set.edu.in', 'ME', 'Optimization of Additive Manufacturing Parameters', 'Kavitha Rao, Anil Verma', 'Journal of Manufacturing Processes', 'journal', 2022, '70', '10.1016/j.jmapro.2022.007', 3.0, true, false, 20),

  ('priya.nair@set.edu.in', 'CE', 'Seismic Analysis of Multi-Storey Buildings', 'Priya Nair, S. Krishnamurthy', 'International Journal of Civil Engineering', 'journal', 2023, '21(4)', '10.1007/s40999-023-008', 1.8, true, false, 13),

  ('ramesh.iyer@set.edu.in', 'EEE', 'Renewable Energy Integration in Smart Grids', 'Ramesh Iyer, Lakshmi Menon', 'Energy Reports', 'journal', 2023, '9', '10.1016/j.egyr.2023.009', 3.2, true, false, 22),

  ('lakshmi.menon@set.edu.in', 'EEE', 'PID Controller Design for Non-Linear Systems', 'Lakshmi Menon, Ramesh Iyer', 'ISA International Conference', 'conference', 2022, NULL, '10.1016/isaconf.2022.010', NULL, true, false, 11)

) AS p(email, dept_code, title, authors, journal_conference, pub_type, year, volume, doi, impact_factor, is_scopus, is_scie, citations)
JOIN faculty fac ON fac.email = p.email
JOIN departments dept ON dept.code = p.dept_code;

-- FUNDED PROJECTS
INSERT INTO funded_projects 
(faculty_id, department_id, title, funding_agency, amount, start_date, end_date, project_type, status, description)
SELECT
  fac.id,
  dept.id,
  fp.title,
  fp.funding_agency,
  fp.amount,
  fp.start_date::date,
  fp.end_date::date,
  fp.project_type,
  fp.status,
  fp.description
FROM (VALUES
  ('rajesh.kumar@set.edu.in', 'CSE', 'AI-Based Medical Image Analysis for Early Disease Detection', 'KRMU Research Grant', 800000, '2023-01-01', '2025-12-31', 'research', 'ongoing', 'Development of machine learning models for assisting doctors in early diagnosis using medical imaging.'),

  ('sunita.sharma@set.edu.in', 'ECE', 'IoT-Based Smart Energy Monitoring System', 'Industry Collaboration (TechSolutions Pvt. Ltd.)', 600000, '2022-06-01', '2024-05-31', 'applied', 'ongoing', 'Design and implementation of IoT-based systems for monitoring and optimizing energy consumption in smart buildings.'),

  ('anil.verma@set.edu.in', 'ME', 'Design Optimization of Solar Thermal Systems', 'KRMU Internal Funding', 500000, '2021-04-01', '2023-03-31', 'research', 'completed', 'Study on improving efficiency of solar thermal collectors for sustainable energy applications.'),

  ('ramesh.iyer@set.edu.in', 'EEE', 'Smart Grid Simulation for Renewable Energy Integration', 'State Renewable Energy Agency', 900000, '2023-03-01', '2025-02-28', 'research', 'ongoing', 'Simulation and analysis of smart grid systems incorporating solar and wind energy sources.'),

  ('priya.nair@set.edu.in', 'CE', 'Sustainable Construction Materials Using Industrial Waste', 'KRMU Consultancy Project', 400000, '2022-01-01', '2023-12-31', 'consultancy', 'completed', 'Exploring eco-friendly construction materials by utilizing industrial by-products for sustainable development.')
) AS fp(email, dept_code, title, funding_agency, amount, start_date, end_date, project_type, status, description)
JOIN faculty fac ON fac.email = fp.email
JOIN departments dept ON dept.code = fp.dept_code;

-- LABS
INSERT INTO labs 
(department_id, name, description, area_sqft, capacity, established_year, equipment_list, in_charge_name, image_url)
SELECT
  d.id,
  l.name,
  l.description,
  l.area_sqft,
  l.capacity,
  l.established_year,
  l.equipment_list,
  l.in_charge_name,
  l.image_url
FROM (VALUES
  ('CSE', 'Artificial Intelligence & Data Science Lab', 'Modern computing lab for AI, Machine Learning, and Data Analytics experiments with high-performance systems.', 800, 35, 2019, ARRAY['High-End Workstations (30 units)', 'GPU Enabled Systems (RTX Series)', 'Python, TensorFlow & PyTorch Setup', 'Data Visualization Tools'], 'Dr. Rajesh Kumar', 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800'),

  ('CSE', 'Cybersecurity & Networking Lab', 'Lab focused on network security, ethical hacking, and system administration practices.', 700, 25, 2020, ARRAY['Linux-Based Systems (20 units)', 'Network Simulation Tools (Cisco Packet Tracer)', 'Firewall & Security Tools', 'Wireshark Analyzer'], 'Dr. Meera Patel', 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800'),

  ('ECE', 'Embedded Systems & VLSI Lab', 'Lab for embedded systems, microcontrollers, and basic VLSI design experiments.', 850, 30, 2018, ARRAY['Arduino & Raspberry Pi Kits', 'FPGA Boards', 'Digital Storage Oscilloscopes', 'Signal Generators', 'PCB Design Tools'], 'Dr. Sunita Sharma', 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=800'),

  ('ME', 'Manufacturing & CAD Lab', 'Lab equipped for mechanical design, simulation, and basic manufacturing processes.', 1000, 25, 2017, ARRAY['CAD Software (AutoCAD, SolidWorks)', 'Basic CNC Trainer', '3D Printer (FDM)', 'Material Testing Equipment'], 'Dr. Kavitha Rao', 'https://images.pexels.com/photos/3862365/pexels-photo-3862365.jpeg?auto=compress&cs=tinysrgb&w=800'),

  ('EEE', 'Electrical Machines & Power Lab', 'Lab for experiments on electrical machines, power systems, and renewable energy basics.', 900, 30, 2018, ARRAY['Transformer Test Bench', 'DC & AC Machines', 'Power Electronics Kits', 'Solar Panel Setup', 'Measurement Instruments'], 'Dr. Ramesh Iyer', 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=800'),

  ('CE', 'Civil Engineering Materials Lab', 'Lab for testing construction materials and basic structural analysis.', 1100, 30, 2016, ARRAY['Compression Testing Machine', 'Concrete Mixer', 'Soil Testing Equipment', 'Surveying Instruments'], 'Dr. Priya Nair', 'https://images.pexels.com/photos/93400/pexels-photo-93400.jpeg?auto=compress&cs=tinysrgb&w=800')
) AS l(dept_code, name, description, area_sqft, capacity, established_year, equipment_list, in_charge_name, image_url)
JOIN departments d ON d.code = l.dept_code;

-- EVENTS
INSERT INTO events 
(department_id, title, description, event_type, event_date, end_date, venue, image_url, is_published)
SELECT
  d.id,
  e.title,
  e.description,
  e.event_type,
  e.event_date::date,
  e.end_date::date,
  e.venue,
  e.image_url,
  true
FROM (VALUES
  ('CSE', 'Conference on Emerging Trends in AI & Data Science', 'Two-day conference featuring academic experts and industry professionals covering AI, Data Science, and emerging technologies.', 'conference', '2025-03-15', '2025-03-16', 'Auditorium, SET Campus', 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800'),

  ('ECE', 'Workshop on Embedded Systems Design', 'Three-day hands-on workshop on microcontrollers, FPGA basics, and real-time embedded applications.', 'workshop', '2025-02-20', '2025-02-22', 'ECE Lab, SET Block', 'https://images.pexels.com/photos/3912981/pexels-photo-3912981.jpeg?auto=compress&cs=tinysrgb&w=800'),

  ('ME', 'Guest Lecture on Additive Manufacturing', 'Expert talk by industry professional on modern manufacturing techniques and Industry 4.0 trends.', 'guest_lecture', '2025-01-25', '2025-01-25', 'Seminar Hall, SET Campus', 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=800'),

  (NULL, 'TECHVISTA - Annual Technical Fest', 'Annual technical festival including hackathons, coding competitions, project exhibitions, and robotics events.', 'fest', '2025-04-05', '2025-04-07', 'Main Campus Grounds', 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800'),

  ('EEE', 'Workshop on Renewable Energy Systems', 'Hands-on workshop covering basics of solar energy systems, power electronics, and energy management.', 'workshop', '2025-02-10', '2025-02-11', 'EEE Lab', 'https://images.pexels.com/photos/9875441/pexels-photo-9875441.jpeg?auto=compress&cs=tinysrgb&w=800'),

  ('CE', 'Seminar on Sustainable Infrastructure', 'Seminar focusing on green construction practices and sustainable infrastructure development.', 'symposium', '2025-03-08', '2025-03-08', 'Conference Room, SET', 'https://images.pexels.com/photos/159306/construction-site-build-construction-work-159306.jpeg?auto=compress&cs=tinysrgb&w=800'),

  (NULL, 'Campus Placement Drive 2025', 'Placement drive with leading recruiters including Infosys, TCS, Wipro, HCL, and other companies.', 'other', '2025-01-15', '2025-01-17', 'Placement Cell & Auditorium', 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800'),

  ('CSE', 'Faculty Development Program on Machine Learning', 'Five-day FDP covering machine learning concepts, practical sessions, and research methodologies.', 'workshop', '2025-05-12', '2025-05-16', 'CSE Lab', 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=800')
) AS e(dept_code, title, description, event_type, event_date, end_date, venue, image_url)
LEFT JOIN departments d ON d.code = e.dept_code;

-- ANNOUNCEMENTS
INSERT INTO announcements 
(department_id, title, content, priority, announcement_type, is_published)
SELECT
  d.id,
  a.title,
  a.content,
  a.priority,
  a.announcement_type,
  true
FROM (VALUES
  (NULL, 'Admissions Open 2025-26', 'Applications are open for B.Tech programs for the academic year 2025-26. Eligible candidates can apply through the university admission portal. Limited seats available.', 'high', 'academic'),

  (NULL, 'Academic Audit & Quality Review Notice', 'The institution will undergo an internal academic and quality review. All departments are requested to update academic records, course files, and supporting documents.', 'high', 'general'),

  ('CSE', 'End Semester Examination Schedule - CSE Department', 'End semester examinations for B.Tech (CSE) are scheduled from March 20-31, 2025. Detailed timetable will be shared on the student portal.', 'normal', 'exam'),

  (NULL, 'Campus Recruitment Training Program', 'Pre-placement training sessions for final year students will begin from February 3, 2025. The program includes aptitude, technical, and interview preparation.', 'high', 'placement'),

  ('ME', 'Inter-College Design Competition', 'Students are invited to participate in an inter-college design competition at a reputed institution. Interested students should contact the department coordinator.', 'normal', 'event'),

  (NULL, 'Research Proposal Submission Notice', 'Faculty members are encouraged to submit research proposals for internal funding and external agencies. The research cell will provide necessary support.', 'normal', 'research')
) AS a(dept_code, title, content, priority, announcement_type)
LEFT JOIN departments d ON d.code = a.dept_code;

-- STUDENT ACHIEVEMENTS
INSERT INTO student_achievements 
(department_id, program_id, student_name, batch_year, achievement_type, title, description, award_value, organizer, achievement_date)
SELECT
  d.id,
  prog.id,
  sa.student_name,
  sa.batch_year,
  sa.achievement_type,
  sa.title,
  sa.description,
  sa.award_value,
  sa.organizer,
  sa.achievement_date::date
FROM (VALUES
  ('CSE', 'BTCSE', 'Riya Sharma', 2024, 'competition', 'Winner - Smart India Hackathon (Internal Round)', 'Led a team to develop an AI-based crop disease detection system and secured first position at university-level hackathon.', 'Certificate & INR 20,000', 'University Innovation Cell', '2024-12-10'),

  ('ECE', 'BTECE', 'Karan Mehta', 2024, 'research', 'Best Paper Presentation', 'Presented a research paper on embedded systems at a national-level conference and received best paper presentation award.', 'Certificate', 'National Conference on Electronics', '2024-11-22'),

  ('ME', 'BTME', 'Anjali Gupta', 2023, 'placement', 'Placed at Leading MNC', 'Selected as Graduate Engineer Trainee in a reputed company with a competitive package.', 'INR 8 LPA', 'Campus Placement Drive', '2023-08-15'),

  ('CSE', 'BTCSE', 'Arjun Nair', 2024, 'competition', 'Top Performer - Coding Competition', 'Ranked among top participants in an inter-college coding competition with strong algorithmic performance.', 'Certificate', 'Inter-College Tech Fest', '2024-08-03'),

  (NULL, NULL, 'SET Basketball Team', 2024, 'sports', 'Winner - Inter-College Tournament', 'The SET basketball team secured first position in an inter-college sports tournament.', 'Gold Medal', 'University Sports Meet', '2024-09-20'),

  ('EEE', 'BTEEE', 'Neha Agarwal', 2023, 'academic', 'Department Topper - EEE', 'Achieved highest CGPA in the department and received academic excellence award.', 'Certificate & INR 10,000', 'University Convocation', '2023-11-15'),

  ('CE', 'BTCE', 'Mohammed Farhan', 2024, 'competition', 'Winner - Structural Design Competition', 'Designed an efficient structural model and secured first position in a national-level student competition.', 'Trophy & INR 15,000', 'Engineering College Fest', '2024-02-28')

) AS sa(dept_code, prog_code, student_name, batch_year, achievement_type, title, description, award_value, organizer, achievement_date)
LEFT JOIN departments d ON d.code = sa.dept_code
LEFT JOIN programs prog ON prog.code = sa.prog_code;