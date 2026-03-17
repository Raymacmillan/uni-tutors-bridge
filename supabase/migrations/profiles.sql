CREATE TABLE profiles (
  id uuid references auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  full_name text NOT NULL,
  student_id text UNIQUE NOT NULL,
  role text check(role in('student', 'tutor', 'admin')) default 'student',
  avatar_url text,
  is_verified boolean default false,
  whatsapp_number text,
  created_at timestamp with time zone default timezone('utc'::text, now()), 
  updated_at timestamp with time zone default timezone('utc'::text, now())
);
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- POLICY 1: Everyone can view profiles (So students can find tutors!)
CREATE POLICY "Profile are viewable by everyone" ON 
    profiles FOR SELECT USING (true);
  
-- POLICY 2: Users can only update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- POLICY 3: System can insert a profile on signup
CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile" 
ON profiles FOR DELETE USING (auth.uid() = id);

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS bio text;

-- 1. Add onboarding tracking and academic info to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS major text,
ADD COLUMN IF NOT EXISTS year_of_study int,
ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;

-- 2. Create the specialized Tutor Profile table
CREATE TABLE tutor_profiles (
  tutor_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  hourly_rate numeric DEFAULT 0,
  availability_text text,
  average_rating numeric DEFAULT 5.0,
  bio_long text -- For more detailed tutor descriptions
);

-- 3. Create a table for student needs
CREATE TABLE student_interests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
  UNIQUE(student_id, course_id)
);

-- Enable RLS for the new tables
ALTER TABLE tutor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_interests ENABLE ROW LEVEL SECURITY;

-- Policies: Everyone can see tutor details, but only the tutor can edit them
CREATE POLICY "Tutor profiles are viewable by everyone" ON tutor_profiles FOR SELECT USING (true);
CREATE POLICY "Tutors can update their own tutor profile" ON tutor_profiles FOR ALL USING (auth.uid() = tutor_id);

-- Policies: Students can manage their own interests
CREATE POLICY "Students can manage their own interests" ON student_interests FOR ALL USING (auth.uid() = student_id);

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS transcript_url text,
ADD COLUMN IF NOT EXISTS approval_status text CHECK (approval_status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending';