ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS section smallint;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_role public.app_role;
  v_invite_code text;
  v_classroom_id uuid;
  v_new_code text;
  v_display_name text;
  v_section smallint;
BEGIN
  v_display_name := COALESCE(NEW.raw_user_meta_data->>'display_name', 'طالبة');

  BEGIN
    v_section := NULLIF(NEW.raw_user_meta_data->>'section','')::smallint;
  EXCEPTION WHEN OTHERS THEN
    v_section := NULL;
  END;

  INSERT INTO public.profiles (id, display_name, scientist_name, avatar_emoji, section)
  VALUES (
    NEW.id,
    v_display_name,
    COALESCE(NEW.raw_user_meta_data->>'scientist_name', 'العالِمة ' || v_display_name),
    COALESCE(NEW.raw_user_meta_data->>'avatar_emoji', '👩‍🔬'),
    v_section
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
$function$;