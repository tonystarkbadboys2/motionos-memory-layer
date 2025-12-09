-- Add confidence score and audit fields to memories table
ALTER TABLE public.memories ADD COLUMN IF NOT EXISTS confidence NUMERIC DEFAULT 1.0;
ALTER TABLE public.memories ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE public.memories ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES auth.users(id);
ALTER TABLE public.memories ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.memories ADD COLUMN IF NOT EXISTS is_redacted BOOLEAN DEFAULT FALSE;
ALTER TABLE public.memories ADD COLUMN IF NOT EXISTS redacted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.memories ADD COLUMN IF NOT EXISTS redacted_by UUID REFERENCES auth.users(id);
ALTER TABLE public.memories ADD COLUMN IF NOT EXISTS parent_memory_id UUID REFERENCES public.memories(id);
ALTER TABLE public.memories ADD COLUMN IF NOT EXISTS linked_ticket_id TEXT;
ALTER TABLE public.memories ADD COLUMN IF NOT EXISTS importance NUMERIC DEFAULT 0.5;

-- Create memory_audit_logs table for full audit trail
CREATE TABLE IF NOT EXISTS public.memory_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memory_id UUID NOT NULL REFERENCES public.memories(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('create', 'read', 'update', 'delete', 'verify', 'redact', 'unredact')),
  previous_content TEXT,
  new_content TEXT,
  reason TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE public.memory_audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view audit logs for their own memories
CREATE POLICY "Users can view their own audit logs" ON public.memory_audit_logs
FOR SELECT USING (user_id = auth.uid());

-- Policy: Admins can view all audit logs  
CREATE POLICY "Admins can view all audit logs" ON public.memory_audit_logs
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Policy: Users can insert audit logs for their actions
CREATE POLICY "Users can insert their own audit logs" ON public.memory_audit_logs
FOR INSERT WITH CHECK (user_id = auth.uid());

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_memory_audit_logs_memory_id ON public.memory_audit_logs(memory_id);
CREATE INDEX IF NOT EXISTS idx_memory_audit_logs_user_id ON public.memory_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_memory_audit_logs_action ON public.memory_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_memories_parent_id ON public.memories(parent_memory_id);
CREATE INDEX IF NOT EXISTS idx_memories_confidence ON public.memories(confidence);
CREATE INDEX IF NOT EXISTS idx_memories_importance ON public.memories(importance);

-- Add DELETE policy for memory_sessions (drop first if exists, then create)
DROP POLICY IF EXISTS "Users can delete their own sessions" ON public.memory_sessions;
CREATE POLICY "Users can delete their own sessions" ON public.memory_sessions
FOR DELETE USING (auth.uid() = user_id);

-- Force RLS on remaining tables
ALTER TABLE public.memories FORCE ROW LEVEL SECURITY;
ALTER TABLE public.memory_sessions FORCE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs FORCE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles FORCE ROW LEVEL SECURITY;
ALTER TABLE public.memory_audit_logs FORCE ROW LEVEL SECURITY;