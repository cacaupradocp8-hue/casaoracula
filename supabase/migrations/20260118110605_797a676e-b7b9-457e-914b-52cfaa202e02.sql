-- Add onboarding fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS entry_archetype TEXT CHECK (entry_archetype IN ('therapist', 'mentor', 'seeker')),
ADD COLUMN IF NOT EXISTS entry_symbol TEXT,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT false;

-- Add index for faster onboarding status checks
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding ON public.profiles(id) WHERE onboarding_completed = false;