-- Update handle_new_user trigger to set role, create classroom for teachers, and join classroom for students
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_role public.app_role;
  v_invite_code text;
  v_classroom_id uuid;
  v_new_code text;
  v_display_name text;
BEGIN
  v_display_name := COALESCE(NEW.raw_user_meta_data->>'display_name', 'طالبة');

  -- Insert profile
  INSERT INTO public.profiles (id, display_name, scientist_name, avatar_emoji)
  VALUES (
    NEW.id,
    v_display_name,
    COALESCE(NEW.raw_user_meta_data->>'scientist_name', 'العالِمة ' || v_display_name),
    COALESCE(NEW.raw_user_meta_data->>'avatar_emoji', '👩‍🔬')
  );

  -- Determine role from metadata (default student)
  BEGIN
    v_role := COALESCE((NEW.raw_user_meta_data->>'role')::public.app_role, 'student');
  EXCEPTION WHEN OTHERS THEN
    v_role := 'student';
  END;

  -- Insert role
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, v_role)
  ON CONFLICT DO NOTHING;

  -- Update profile with role
  UPDATE public.profiles SET role = v_role WHERE id = NEW.id;

  IF v_role = 'teacher' THEN
    -- Create a classroom with a unique invite code
    LOOP
      v_new_code := public.generate_invite_code();
      EXIT WHEN NOT EXISTS (SELECT 1 FROM public.classrooms WHERE invite_code = v_new_code);
    END LOOP;
    INSERT INTO public.classrooms (teacher_id, name, invite_code)
    VALUES (NEW.id, 'فصل ' || v_display_name, v_new_code);
  ELSIF v_role = 'student' THEN
    v_invite_code := UPPER(TRIM(COALESCE(NEW.raw_user_meta_data->>'invite_code', '')));
    IF v_invite_code <> '' THEN
      SELECT id INTO v_classroom_id FROM public.classrooms WHERE invite_code = v_invite_code LIMIT 1;
      IF v_classroom_id IS NOT NULL THEN
        UPDATE public.profiles SET classroom_id = v_classroom_id WHERE id = NEW.id;
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Ensure trigger exists on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add unique constraint on invite_code if not exists
DO $$ BEGIN
  ALTER TABLE public.classrooms ADD CONSTRAINT classrooms_invite_code_key UNIQUE (invite_code);
EXCEPTION WHEN duplicate_table OR duplicate_object THEN NULL;
END $$;