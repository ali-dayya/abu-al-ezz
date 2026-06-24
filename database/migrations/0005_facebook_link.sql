-- Add facebook_link column to store_info
ALTER TABLE public.store_info ADD COLUMN IF NOT EXISTS facebook_link text NOT NULL DEFAULT '';
