import { useContext, useState, createContext, useEffect, useMemo } from "react"; 
import { supabaseClient } from "../config/supabaseClient";

const AuthContext = createContext({
  session: null,
  loading: true,
  signInUser: async () => {},
  signUpNewUser: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  updatePassword: async () => {}, 
});

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/-]).{8,}$/;
    return regex.test(password);
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const signUpNewUser = async (email, password, metadata) => {
    if (!validateEmail(email)) return { success: false, error: "Invalid email." };
    if (!validatePassword(password)) return { success: false, error: "Weak password." };

    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/welcome`,
      },
    });

    return error ? { success: false, error: error.message } : { success: true, data };
  };

  const signInUser = async (email, password) => {
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

    if (!error && data.session) {
      setSession(data.session);
    }

    return error ? { success: false, error: error.message } : { success: true, data };
  };

  const resetPassword = async (email) => {
  const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/update-password`,
  });
  return error ? { success: false, error: error.message } : { success: true, data };
};


const updatePassword = async (newPassword) => {
  if (!validatePassword(newPassword)) return { success: false, error: "Weak password." };

  const { data, error } = await supabaseClient.auth.updateUser({
    password: newPassword
  });
  return error ? { success: false, error: error.message } : { success: true, data };
};


const signOut = async () => {
  try {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error("Sign out error:", error.message);
    throw error; 
  }
};

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    getInitialSession();

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = useMemo(
    () => ({
      session,
      loading,
      signInUser,
      signUpNewUser,
      resetPassword,
      updatePassword,
      signOut,
    }),
    [session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const UserAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("UserAuth must be used within an AuthContextProvider");
  }
  return context;
};