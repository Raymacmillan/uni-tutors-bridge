CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, student_id, role, whatsapp_number, bio)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'User_' || substring(new.id::text, 1, 5)), 
    COALESCE(new.raw_user_meta_data->>'student_id', 'TMP_' || substring(new.id::text, 1, 8)),
    COALESCE(new.raw_user_meta_data->>'role', 'student'),
    new.raw_user_meta_data->>'whatsapp_number',
    'Student at University of Botswana'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;