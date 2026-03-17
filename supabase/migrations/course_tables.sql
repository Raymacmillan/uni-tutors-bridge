CREATE TABLE courses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  course_code text UNIQUE NOT NULL,
  course_name text NOT NULL,
  faculty text
);

CREATE TABLE tutor_courses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tutor_id uuid references public.profiles(id) ON DELETE CASCADE,
  course_id uuid references public.courses(id) ON DELETE CASCADE,

  UNIQUE(tutor_id, course_id)
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Courses are viewable by everyone" 
ON courses FOR SELECT USING (true);

ALTER TABLE tutor_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tutor courses are viewable by everyone" 
ON tutor_courses FOR SELECT USING (true);

CREATE POLICY "Tutors can manage their own course links" 
ON tutor_courses FOR ALL 
USING (auth.uid() = tutor_id);