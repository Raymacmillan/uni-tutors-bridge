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