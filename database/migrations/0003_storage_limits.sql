-- ============================================================
-- Abu Al-Ezz Store — enforce upload limits on existing buckets
-- Run this if you already ran 0001_schema.sql before it included
-- file_size_limit / allowed_mime_types on the product-images bucket.
-- Safe to run multiple times.
-- ============================================================

update storage.buckets
set file_size_limit = 5242880, -- 5MB
    allowed_mime_types = array['image/jpeg','image/png','image/webp','image/gif']
where id = 'product-images';
