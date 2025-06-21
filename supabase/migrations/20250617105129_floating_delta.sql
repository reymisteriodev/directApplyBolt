/*
  # Create cv-files storage bucket

  1. Storage Setup
    - Create `cv-files` bucket for CV file uploads
    - Set bucket to private (not publicly accessible)
    - Configure appropriate file size limits

  2. Security Policies
    - Allow authenticated users to upload files to their own folder
    - Allow authenticated users to read their own files
    - Prevent access to other users' files

  3. Configuration
    - Maximum file size: 5MB
    - Allowed file types: PDF, DOC, DOCX
*/

-- Create the cv-files bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cv-files',
  'cv-files',
  false,
  5242880, -- 5MB in bytes
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
) ON CONFLICT (id) DO NOTHING;

-- Policy to allow authenticated users to upload files to their own folder
CREATE POLICY "Users can upload their own CV files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'cv-files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy to allow authenticated users to read their own files
CREATE POLICY "Users can read their own CV files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'cv-files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy to allow authenticated users to update their own files
CREATE POLICY "Users can update their own CV files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'cv-files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy to allow authenticated users to delete their own files
CREATE POLICY "Users can delete their own CV files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'cv-files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);