import { createClient } from "@supabase/supabase-js";

// 서버 전용 Supabase 클라이언트
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

if (!supabase) {
  throw new Error("supabase를 불러오는데 실패하였습니다 (server).");
}

export { supabase };
