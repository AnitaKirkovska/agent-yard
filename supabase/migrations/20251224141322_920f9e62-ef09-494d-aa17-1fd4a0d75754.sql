-- Create a public storage bucket for assets
INSERT INTO storage.buckets (id, name, public) VALUES ('assets', 'assets', true);

-- Create policy for public read access
CREATE POLICY "Public read access for assets"
ON storage.objects
FOR SELECT
USING (bucket_id = 'assets');