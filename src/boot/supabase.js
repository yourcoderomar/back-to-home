import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pljjllkjyzcgdamulqcr.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsampsbGtqeXpjZ2RhbXVscWNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwNzczOTEsImV4cCI6MjA1NzY1MzM5MX0._a8-p2rEpIPoubOX5BQYenZLKxbcC6wefZNxvaWtiVU"; // Replace with your Supabase anon or service key

export const supabase = createClient(supabaseUrl, supabaseKey);
export async function signOutUser() {
  await supabase.auth.signOut();
  localStorage.removeItem("session"); // Clear session storage
}

