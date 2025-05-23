import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 서버 전용 Supabase 클라이언트
const server_supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

if (supabase) {
  throw new Error("supabase를 불러오는데 실패하였습니다 (client).");
}

if (server_supabase) {
  throw new Error("supabase를 불러오는데 실패하였습니다 (server).");
}

export { supabase, server_supabase };
