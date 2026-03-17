import { useContext, useState, createContext, useEffect } from "react";
import { supabaseClient } from "../config/supabaseClient";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/-]).{8,}$/;
    return regex.test(password);
  };

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const signUpNewUser = async (email, password, metadata) => {
    if (!validateEmail(email)) {
      return { success: false, error: "Please enter a valid email address." };
    }

    if (!validatePassword(password)) {
      return {
        success: false,
        error:
          "Password must be 8+ chars, have an uppercase, a number, and a symbol.",
      };
    }
    const { data, error } = await supabaseClient.auth.signUp({
      email: email,
      password: password,
      options: { 
        data: metadata,
        emailRedirectTo: `${window.location.origin}/welcome` },
    });

    return error
      ? { success: false, error: error.message }
      : { success: true, data };
  };

  const signInWithSocial = async (provider) => {
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: window.location.origin,
      },
    });
    return error
      ? { success: false, error: error.message }
      : { success: true, data };
  };

  const resetPassword = async (email) => {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    return error ? { success: false, error: error.message } : { success: true };
  };

  const signInUser = async (email, password) => {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    return error
      ? { success: false, error: error.message }
      : { success: true, data };
  };

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = () => {
    const { error } = supabaseClient.auth.signOut();

    if (error) {
      console.error("An error occured: ", error);
    }
  };

  const value = {
    session,
    loading,
    signInUser,
    signUpNewUser,
    signInWithSocial,
    resetPassword,
    signOut,
  };

  return <AuthContext value={value}>{!loading && children}</AuthContext>;
};

export const UserAuth = () => useContext(AuthContext);
