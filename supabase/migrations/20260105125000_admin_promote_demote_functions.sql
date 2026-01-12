-- Promote/Demote RPCs for admins
-- These functions are SECURITY DEFINER and check that the caller is an existing admin
-- so they can be called by authenticated admins and executed with function owner's privileges.

BEGIN;

-- Promote by email
CREATE OR REPLACE FUNCTION public.promote_user_by_email(target_email text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  target uuid;
BEGIN
  -- ensure caller is an admin
  IF NOT EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()::uuid) THEN
    RAISE EXCEPTION 'not allowed';
  END IF;

  SELECT id INTO target FROM auth.users WHERE email = target_email LIMIT 1;
  IF target IS NULL THEN
    RAISE EXCEPTION 'user not found';
  END IF;

  INSERT INTO public.admins (user_id, role, created_by)
    VALUES (target, 'admin', auth.uid()::uuid)
    ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role, created_by = EXCLUDED.created_by;

  INSERT INTO public.admin_logs (actor, action, target, details) VALUES (
    auth.uid()::uuid,
    'promote_user_by_email',
    target::text,
    jsonb_build_object('email', target_email)
  );
END;
$$;

-- Demote by email
CREATE OR REPLACE FUNCTION public.demote_user_by_email(target_email text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  target uuid;
BEGIN
  -- ensure caller is an admin
  IF NOT EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()::uuid) THEN
    RAISE EXCEPTION 'not allowed';
  END IF;

  SELECT id INTO target FROM auth.users WHERE email = target_email LIMIT 1;
  IF target IS NULL THEN
    RAISE EXCEPTION 'user not found';
  END IF;

  DELETE FROM public.admins WHERE user_id = target;

  INSERT INTO public.admin_logs (actor, action, target, details) VALUES (
    auth.uid()::uuid,
    'demote_user_by_email',
    target::text,
    jsonb_build_object('email', target_email)
  );
END;
$$;

COMMIT;