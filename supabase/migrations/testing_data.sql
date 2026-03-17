-- 1. Insert 10 Real UB Modules
INSERT INTO courses (course_code, course_name, faculty)
VALUES 
  ('CSI332', 'Programming Languages', 'Science'),
  ('CSI341', 'Introduction to Software Engineering', 'Science'),
  ('CSI382', 'Geographic Information Systems', 'Science'),
  ('MAT101', 'Mathematics for Business & Social Sciences', 'Science'),
  ('ECO101', 'Introduction to Economics', 'Social Sciences'),
  ('LAW101', 'Introduction to Law', 'Humanities'),
  ('ENG101', 'English for Academic Purposes', 'Humanities'),
  ('ACC101', 'Introduction to Accounting', 'Business'),
  ('MGT101', 'Introduction to Management', 'Business'),
  ('PHY101', 'General Physics I', 'Science')
ON CONFLICT (course_code) DO NOTHING;

-- 2. Link YOUR Profile to 3 Courses
-- This uses a subquery to find your ID based on the logic we set up earlier
INSERT INTO tutor_courses (tutor_id, course_id)
SELECT 
  (SELECT id FROM profiles LIMIT 1), -- This picks your profile
  id 
FROM courses 
WHERE course_code IN ('CSI332', 'CSI341', 'CSI382')
ON CONFLICT DO NOTHING;

-- 1. Create a profile for the user (The "Parent" record)
-- This takes your existing User ID from Supabase Auth and moves it to your public profiles table
INSERT INTO public.profiles (id, full_name, bio, avatar_url)
SELECT 
    id, 
    'Ray Mcmillan Gumbo', -- You can change this to your actual name
    'Third-year Computer Science student at UB. GIS specialist and Software Engineering enthusiast.',
    'https://via.placeholder.com/150'
FROM auth.users
LIMIT 1
ON CONFLICT (id) DO NOTHING;

-- 2. Ensure those 3 Course links are officially connected to that profile
INSERT INTO public.tutor_courses (tutor_id, course_id)
SELECT 
  (SELECT id FROM public.profiles LIMIT 1), 
  id 
FROM public.courses 
WHERE course_code IN ('CSI332', 'CSI341', 'CSI382')
ON CONFLICT DO NOTHING;