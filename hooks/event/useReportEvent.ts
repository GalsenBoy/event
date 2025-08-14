import { supabase } from "@/lib/supabaseClient";
import { useMutation } from "@tanstack/react-query";

type ReportPayload = {
  event_id: string;
  reporter_id: string;
  reason: string;
};

export function useReportEvent() {
  return useMutation({
    mutationFn: async (payload: ReportPayload) => {
      const { error } = await supabase
        .from("event_reports")
        .insert([payload]);

      if (error) throw error;
    }
  });
}
