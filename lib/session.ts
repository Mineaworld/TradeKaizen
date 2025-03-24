import { supabase } from "./supabase";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

/**
 * Get the current user session
 * This function should be used in server components/routes
 */
export async function getSession() {
  // For server components and API routes
  try {
    const cookieStore = cookies();
    const serverSupabase = createServerComponentClient({
      cookies: () => cookieStore,
    });
    const {
      data: { session },
    } = await serverSupabase.auth.getSession();
    return session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

/**
 * Get the current user
 * This function should be used in server components/routes
 */
export async function getUser() {
  const session = await getSession();
  return session?.user || null;
}
