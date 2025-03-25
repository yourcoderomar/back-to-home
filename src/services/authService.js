import { supabase } from "src/boot/supabase";

/**
 * ✅ Sign Up User (Waits for Email Verification)
 * @param {string} email 
 * @param {string} password 
 * @returns {Object} success or error message
 */
export async function signUpUser(email, password) {
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    console.error("Signup Error:", error.message);
    return { error: error.message };
  }

  console.log("Signup successful! Please verify your email.");
  return { success: true };
}

/**
 * ✅ Log In User
 * @param {string} email 
 * @param {string} password 
 * @returns {Object} success, user, or error message
 */
export async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error("Login Error:", error.message);
    return { error: error.message };
  }

  console.log("Login successful!");
  return { success: true, user: data.user };
}

/**
 * ✅ Log Out User
 * @returns {Object} success or error message
 */
export async function logoutUser() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Logout Error:", error.message);
    return { error: error.message };
  }

  console.log("User logged out successfully.");
  return { success: true };
}

/**
 * ✅ Get Currently Logged-in User
 * @returns {Object} user or null
 */
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    console.error("Get User Error:", error?.message || "No user found.");
    return null;
  }

  return data.user;
}

/**
 * ✅ Get User Data from 'users' Table
 * @returns {Object} user data or null
 */
export async function getUserData() {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Database Error:", error.message);
    return null;
  }

  return data;
}

/**
 * ✅ Insert Additional User Data (Runs After First Login)
 * @param {Object} additionalData
 * @returns {Object} success or error message
 */
export async function insertUserData(additionalData) {
  const user = await getCurrentUser();
  if (!user) return { error: "User not authenticated." };

  // Check if user data already exists
  const { data: existingUser } = await supabase
    .from("users")
    .select("user_id")
    .eq("user_id", user.id)
    .single();

  if (!existingUser) {
    const { error } = await supabase.from("users").insert([
      {
        user_id: user.id,
        user_national_id: additionalData.nationalId,
        user_first_name: additionalData.firstName,
        user_last_name: additionalData.lastName,
        user_dob: additionalData.dob,
        phone_number: additionalData.phoneNumber,
        profile_picture: additionalData.profilePicture,
      },
    ]);

    if (error) {
      console.error("Database Insert Error:", error.message);
      return { error: error.message };
    }

    console.log("User data saved successfully!");
    return { success: true };
  } else {
    console.log("User data already exists.");
    return { success: true };
  }
}

/**
 * ✅ Check User Session and Store in Local Storage
 */
export async function checkUserSession() {
  const user = await getCurrentUser();
  if (user) {
    localStorage.setItem("session", JSON.stringify(user));
    return true;
  }
  return false;
}
