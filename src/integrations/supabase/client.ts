// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xaxpuybsbounzgzpxffw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhheHB1eWJzYm91bnpnenB4ZmZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMTU2NzQsImV4cCI6MjA1Nzg5MTY3NH0._-0HqG2mQqWKDlCzje_9pAwBhIShheLMJ2sGJtIGgMw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);