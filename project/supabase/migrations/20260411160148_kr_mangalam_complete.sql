
UPDATE departments SET 
  description = CONCAT('Department of ', name, ' at K.R Mangalam University, Gurgaon - a premier engineering school offering NBA Accredited programs.'),
  mission = CONCAT('To impart comprehensive education in ', name, ' with emphasis on research, innovation, and industry collaboration at K.R Mangalam University, Gurgaon.'),
  vision = 'To be recognized as a center of excellence in engineering education and research, contributing to societal development.'
WHERE is_active = true;

-- Verify update
SELECT 'Departments Updated' as status, COUNT(*) as count FROM departments WHERE is_active = true;
