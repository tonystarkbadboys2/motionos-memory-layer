-- Fix search_path for calculate_memory_strength function
CREATE OR REPLACE FUNCTION public.calculate_memory_strength(
  original_strength DECIMAL,
  decay_rate DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE
)
RETURNS DECIMAL
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT GREATEST(0, original_strength - (decay_rate * EXTRACT(EPOCH FROM (now() - created_at)) / 3600))
$$;