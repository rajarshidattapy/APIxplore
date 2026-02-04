"use client";

import { User, Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { supabase } from './supabase';

export interface AuthState {
    user: User | null;
    session: Session | null;
    loading: boolean;
}

export function useAuth() {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        session: null,
        loading: true,
    });

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession()
            .then(({ data: { session } }) => {
                setAuthState({
                    user: session?.user ?? null,
                    session,
                    loading: false,
                });
            })
            .catch((error) => {
                console.error('Error getting session:', error);
                setAuthState({
                    user: null,
                    session: null,
                    loading: false,
                });
            });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setAuthState({
                    user: session?.user ?? null,
                    session,
                    loading: false,
                });
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
    };

    const signUp = async (email: string, password: string) => {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };

    return {
        ...authState,
        signIn,
        signUp,
        signOut,
        isAuthenticated: !!authState.user,
    };
}
