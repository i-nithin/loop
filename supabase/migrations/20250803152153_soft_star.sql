/*
  # Authentication Setup

  1. Security
    - Enable RLS on auth.users (handled by Supabase automatically)
    - Create policies for user data access
  
  2. Notes
    - Email confirmation is enabled by default in Supabase
    - Users must confirm their email before they can sign in
    - Auth tables are managed by Supabase automatically
*/

-- Enable RLS on existing tables if any
-- (Auth tables are automatically secured by Supabase)

-- Create any additional user profile tables if needed in the future
-- For now, we'll use the built-in auth.users table