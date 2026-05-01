
-- Public function to validate an invite code BEFORE signup (callable by anon)
CREATE OR REPLACE FUNCTION public.validate_invite_code(_code text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.classrooms
    WHERE invite_code = UPPER(TRIM(_code))
  );
$$;

GRANT EXECUTE ON FUNCTION public.validate_invite_code(text) TO anon, authenticated;

-- Update handle_new_user to RAISE if student provided an invalid code,
-- so the signup fails loudly instead of silently creating an unlinked student.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role public.app_role;
  v_invite_code text;
  v_classroom_id uuid;
  v_new_code text;
  v_display_name text;
BEGIN
  v_display_name := COALESCE(NEW.raw_user_meta_data->>'display_name', 'طالبة');

  INSERT INTO public.profiles (id, display_name, scientist_name, avatar_emoji)
  VALUES (
    NEW.id,
    v_display_name,
    COALESCE(NEW.raw_user_meta_data->>'scientist_name', 'العالِمة ' || v_display_name),
    COALESCE(NEW.raw_user_meta_data->>'avatar_emoji', '👩‍🔬')
  );

  BEGIN
    v_role := COALESCE((NEW.raw_user_meta_data->>'role')::public.app_role, 'student');
  EXCEPTION WHEN OTHERS THEN
    v_role := 'student';
  END;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, v_role)
  ON CONFLICT DO NOTHING;

  UPDATE public.profiles SET role = v_role WHERE id = NEW.id;

  IF v_role = 'teacher' THEN
    LOOP
      v_new_code := public.generate_invite_code();
      EXIT WHEN NOT EXISTS (SELECT 1 FROM public.classrooms WHERE invite_code = v_new_code);
    END LOOP;
    INSERT INTO public.classrooms (teacher_id, name, invite_code)
    VALUES (NEW.id, 'فصل ' || v_display_name, v_new_code);

  ELSIF v_role = 'student' THEN
    v_invite_code := UPPER(TRIM(COALESCE(NEW.raw_user_meta_data->>'invite_code', '')));
    IF v_invite_code <> '' THEN
      SELECT id INTO v_classroom_id
      FROM public.classrooms
      WHERE invite_code = v_invite_code
      LIMIT 1;

      IF v_classroom_id IS NULL THEN
        RAISE EXCEPTION 'INVALID_INVITE_CODE: %', v_invite_code
          USING HINT = 'كود المعلمة غير صحيح';
      END IF;

      UPDATE public.profiles
      SET classroom_id = v_classroom_id
      WHERE id = NEW.id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Make sure the trigger is attached to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add a function students can call to JOIN a classroom AFTER signup
-- (covers the case of a student who signed up without a code, or whose code failed)
CREATE OR REPLACE FUNCTION public.join_classroom_by_code(_code text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_classroom_id uuid;
  v_user_id uuid := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'NOT_AUTHENTICATED';
  END IF;

  SELECT id INTO v_classroom_id
  FROM public.classrooms
  WHERE invite_code = UPPER(TRIM(_code))
  LIMIT 1;

  IF v_classroom_id IS NULL THEN
    RAISE EXCEPTION 'INVALID_INVITE_CODE';
  END IF;

  UPDATE public.profiles
  SET classroom_id = v_classroom_id
  WHERE id = v_user_id;

  RETURN v_classroom_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.join_classroom_by_code(text) TO authenticated;
