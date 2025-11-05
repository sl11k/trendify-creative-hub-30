-- Create partners_logos bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('partners_logos', 'partners_logos', true)
ON CONFLICT (id) DO NOTHING;