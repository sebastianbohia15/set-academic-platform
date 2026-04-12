


UPDATE departments 
SET 
  description = 'Department of ' || name || ' at K.R Mangalam University, Gurgaon - a premier engineering institution.',
  mission = 'To impart quality education in ' || name || ' through cutting-edge curriculum, research, and industry collaboration at K.R Mangalam University.'
WHERE is_active = true;

-- Log for verification
SELECT COUNT(*) as updated_departments FROM departments WHERE is_active = true;
