-- Force RLS on profiles table to prevent unauthenticated access
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;

-- Force RLS on api_keys table to prevent unauthenticated access
ALTER TABLE public.api_keys FORCE ROW LEVEL SECURITY;