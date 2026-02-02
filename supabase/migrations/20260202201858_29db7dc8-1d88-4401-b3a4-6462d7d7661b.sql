-- Create table for video playback logs
CREATE TABLE public.video_playback_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  video_id TEXT NOT NULL,
  context_type TEXT NOT NULL, -- 'portal', 'travessia', 'activation', 'lesson', etc.
  context_id UUID,
  portal_level TEXT NOT NULL, -- 'visitante', 'pre_iniciada', 'iniciada', 'oracula', 'admin'
  action TEXT NOT NULL DEFAULT 'play_attempt', -- 'play_attempt', 'play_started', 'play_completed', 'blocked'
  ip_address TEXT,
  user_agent TEXT,
  token_used TEXT, -- hash of the token used
  success BOOLEAN NOT NULL DEFAULT false,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.video_playback_logs ENABLE ROW LEVEL SECURITY;

-- Admin can read all logs (using user_roles table)
CREATE POLICY "Admin can read all video playback logs"
ON public.video_playback_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.portal = 'admin'
  )
);

-- Users can see their own logs
CREATE POLICY "Users can view their own playback logs"
ON public.video_playback_logs
FOR SELECT
USING (auth.uid() = user_id);

-- Service role can insert logs (from edge function)
CREATE POLICY "Service can insert playback logs"
ON public.video_playback_logs
FOR INSERT
WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_video_playback_logs_user_id ON public.video_playback_logs(user_id);
CREATE INDEX idx_video_playback_logs_video_id ON public.video_playback_logs(video_id);
CREATE INDEX idx_video_playback_logs_created_at ON public.video_playback_logs(created_at DESC);

-- Add cloudflare_video_id column to content blocks for storing Cloudflare Stream video IDs
ALTER TABLE public.content_blocks ADD COLUMN IF NOT EXISTS cloudflare_video_id TEXT;