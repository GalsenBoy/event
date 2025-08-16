import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export function useEventReports(page: number, pageSize: number = 10) {
  return useQuery({
    queryKey: ["eventReports", page],
    queryFn: async () => {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await supabase
        .from("event_reports")
        .select(
          `
            id,
            reason,
            created_at,
            event ( id, name, address_city ),
            reporter:profiles ( id, username )
          `,
          { count: "exact" }
        )
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;
      return { data, total: count ?? 0 };
    },
  });
}
