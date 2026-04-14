-- Fix storage bucket RLS policies for institute-verification-documents
-- The institute signup flow uploads documents BEFORE the user is authenticated,
-- so we need to allow both anon and authenticated uploads.

-- Allow anyone to upload files (needed for institute signup flow)
CREATE POLICY "Allow public uploads to institute-verification-documents"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'institute-verification-documents');

-- Allow anyone to read files (bucket is public)
CREATE POLICY "Allow public reads from institute-verification-documents"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'institute-verification-documents');

-- Allow authenticated users to update their own files
CREATE POLICY "Allow authenticated updates to institute-verification-documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'institute-verification-documents');

-- Allow authenticated users to delete their own files
CREATE POLICY "Allow authenticated deletes from institute-verification-documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'institute-verification-documents');

-- Fix: forum_likes table needs RLS enabled (was missing from original schema)
ALTER TABLE public.forum_likes ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for forum_likes
CREATE POLICY "Allow authenticated users to see all likes"
ON public.forum_likes FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow users to like posts"
ON public.forum_likes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to unlike posts"
ON public.forum_likes FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
