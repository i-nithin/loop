import { useState, useEffect } from 'react';
import { User, AuthError as SupabaseAuthError } from '@supabase/supabase-js';
import { supabase, AuthError } from '../lib/supabase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return { data, needsConfirmation: !data.session };
    } catch (err) {
      const authError: AuthError = {
        message: (err as SupabaseAuthError).message || 'An error occurred during sign up',
        status: (err as SupabaseAuthError).status
      };
      setError(authError);
      throw authError;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (err) {
      const authError: AuthError = {
        message: (err as SupabaseAuthError).message || 'An error occurred during sign in',
        status: (err as SupabaseAuthError).status
      };
      setError(authError);
      throw authError;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setError(null);
    const { error } = await supabase.auth.signOut();
    if (error) {
      const authError: AuthError = {
        message: error.message || 'An error occurred during sign out'
      };
      setError(authError);
      throw authError;
    }
  };

  const resendConfirmation = async (email: string) => {
    setError(null);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        throw error;
      }
    } catch (err) {
      const authError: AuthError = {
        message: (err as SupabaseAuthError).message || 'Failed to resend confirmation email'
      };
      setError(authError);
      throw authError;
    }
  };

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resendConfirmation,
    clearError: () => setError(null)
  };
};