-- Alternative: Create an RPC function to bypass RLS for storage operations
-- This function runs with elevated privileges

-- First, create a function to handle storage uploads with security definer
CREATE OR REPLACE FUNCTION public.upload_badge_file(
    p_bucket_id text,
    p_name text,
    p_file_data bytea
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = storage, public
AS $$
DECLARE
    v_result json;
BEGIN
    -- Insert into storage.objects with explicit values
    INSERT INTO storage.objects (
        bucket_id,
        name,
        owner,
        created_at,
        updated_at,
        last_accessed_at,
        metadata,
        version
    ) VALUES (
        p_bucket_id,
        p_name,
        auth.uid(),
        now(),
        now(),
        now(),
        jsonb_build_object('mimetype', 'application/pdf'),
        '1'
    )
    RETURNING id::text INTO v_result;
    
    RETURN jsonb_build_object('id', v_result, 'path', p_bucket_id || '/' || p_name);
END;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.upload_badge_file(text, text, bytea) TO authenticated;
GRANT EXECUTE ON FUNCTION public.upload_badge_file(text, text, bytea) TO anon;

-- Alternative simpler approach: Disable RLS for authenticated users on storage.objects
-- (Only do this if you trust all authenticated users)
-- ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
