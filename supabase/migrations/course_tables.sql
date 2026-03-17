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

INSERT INTO courses (course_code, course_name, faculty) VALUES

-- ============================================
-- COMPUTER SCIENCE (CSI)
-- ============================================
('CSI141', 'Programming Principles', 'Computer Science'),
('CSI142', 'Object-Oriented Programming', 'Computer Science'),
('CSI161', 'Introduction to Computing', 'Computer Science'),
('CSI247', 'Data Structures', 'Computer Science'),
('CSI262', 'Database Concepts', 'Computer Science'),
('CSI223', 'Systems Programming', 'Computer Science'),
('CSI332', 'Programming Languages', 'Computer Science'),
('CSI341', 'Software Engineering', 'Computer Science'),
('CSI323', 'Algorithms', 'Computer Science'),
('CSI354', 'Operating Systems', 'Computer Science'),
('CSI481', 'Database Systems', 'Computer Science'),
('CSI475', 'Social Informatics', 'Computer Science'),
('CSI413', 'Theory of Computation', 'Computer Science'),

-- ============================================
-- COMPUTER INFORMATION SYSTEMS (CIS)
-- ============================================
('CIS101', 'Introduction to Information Systems', 'Computer Information Systems'),
('CIS111', 'Fundamentals of Information Technology', 'Computer Information Systems'),
('CIS201', 'Systems Analysis and Design', 'Computer Information Systems'),
('CIS211', 'Business Information Systems', 'Computer Information Systems'),
('CIS221', 'Web Technologies', 'Computer Information Systems'),
('CIS231', 'Network Fundamentals', 'Computer Information Systems'),
('CIS301', 'Information Systems Management', 'Computer Information Systems'),
('CIS311', 'E-Commerce Systems', 'Computer Information Systems'),
('CIS321', 'IT Project Management', 'Computer Information Systems'),
('CIS331', 'Information Security', 'Computer Information Systems'),
('CIS401', 'Enterprise Systems', 'Computer Information Systems'),
('CIS411', 'IT Governance and Audit', 'Computer Information Systems'),
('CIS421', 'Knowledge Management Systems', 'Computer Information Systems'),

-- ============================================
-- COMPUTING WITH FINANCE (CIF/FIN)
-- ============================================
('CIF101', 'Introduction to Computing with Finance', 'Computing with Finance'),
('CIF111', 'Financial Mathematics', 'Computing with Finance'),
('CIF201', 'Financial Computing', 'Computing with Finance'),
('CIF211', 'Quantitative Methods in Finance', 'Computing with Finance'),
('CIF221', 'Financial Information Systems', 'Computing with Finance'),
('CIF301', 'Computational Finance', 'Computing with Finance'),
('CIF311', 'Financial Modelling', 'Computing with Finance'),
('CIF321', 'Risk Management Systems', 'Computing with Finance'),
('CIF401', 'Advanced Financial Computing', 'Computing with Finance'),
('FIN201', 'Principles of Finance', 'Computing with Finance'),
('FIN211', 'Corporate Finance', 'Computing with Finance'),
('FIN301', 'Investment Analysis', 'Computing with Finance'),
('FIN311', 'Financial Markets', 'Computing with Finance'),

-- ============================================
-- MATHEMATICS (MAT)
-- ============================================
('MAT111', 'Introductory Mathematics I', 'Mathematics'),
('MAT122', 'Introductory Mathematics II', 'Mathematics'),
('MAT221', 'Calculus I', 'Mathematics'),
('MAT222', 'Calculus II', 'Mathematics'),
('MAT212', 'Linear Algebra', 'Mathematics'),
('MAT311', 'Abstract Algebra I', 'Mathematics'),
('MAT271', 'Mathematical Statistics', 'Mathematics'),
('STA101', 'Mathematics for Business and Social Sciences', 'Mathematics'),

-- ============================================
-- PHYSICS (PHYS/PHY)
-- ============================================
('PHYS101', 'Physics I', 'Physics'),
('PHYS102', 'Physics II', 'Physics'),
('PHYS103', 'Physics for Life Sciences I', 'Physics'),
('PHYS104', 'Physics for Life Sciences II', 'Physics'),
('PHY231', 'Vibrations and Waves', 'Physics'),
('PHY242', 'Electronics', 'Physics'),
('PHY352', 'Quantum Mechanics', 'Physics'),

-- ============================================
-- BIOLOGY (BIO)
-- ============================================
('BIO111', 'Principles of Biology', 'Biology'),
('BIO112', 'Diversity of Life', 'Biology'),
('BIOL207', 'Evolution', 'Biology'),

-- ============================================
-- CHEMISTRY (CHEM)
-- ============================================
('CHEM101', 'General Chemistry I', 'Chemistry'),
('CHEM102', 'General Chemistry II', 'Chemistry')

ON CONFLICT (course_code) DO NOTHING;