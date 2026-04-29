-- 1) Roles enum + table
CREATE TYPE public.app_role AS ENUM ('teacher', 'student');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own role on signup" ON public.user_roles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 2) Classrooms
CREATE TABLE public.classrooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT 'فصلي',
  invite_code text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;

-- Teacher manages own classrooms
CREATE POLICY "Teachers view own classrooms" ON public.classrooms
  FOR SELECT USING (auth.uid() = teacher_id);
CREATE POLICY "Teachers create classrooms" ON public.classrooms
  FOR INSERT WITH CHECK (auth.uid() = teacher_id AND public.has_role(auth.uid(), 'teacher'));
CREATE POLICY "Teachers update own classrooms" ON public.classrooms
  FOR UPDATE USING (auth.uid() = teacher_id);

-- Students can lookup classroom by invite code (read-only minimal)
CREATE POLICY "Anyone authenticated can lookup by code" ON public.classrooms
  FOR SELECT TO authenticated USING (true);

-- 3) Add classroom_id to profiles
ALTER TABLE public.profiles
  ADD COLUMN classroom_id uuid REFERENCES public.classrooms(id) ON DELETE SET NULL,
  ADD COLUMN role app_role;

-- 4) Allow teachers to view their students' progress + profiles
CREATE POLICY "Teachers view students profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.classrooms c
      WHERE c.id = profiles.classroom_id
        AND c.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers view students progress" ON public.lab_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      JOIN public.classrooms c ON c.id = p.classroom_id
      WHERE p.id = lab_progress.user_id
        AND c.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers view students badges" ON public.badges
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      JOIN public.classrooms c ON c.id = p.classroom_id
      WHERE p.id = badges.user_id
        AND c.teacher_id = auth.uid()
    )
  );

-- 5) Invite code generator
CREATE OR REPLACE FUNCTION public.generate_invite_code()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result text := '';
  i int;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, 1 + floor(random() * length(chars))::int, 1);
  END LOOP;
  RETURN result;
END;
$$;