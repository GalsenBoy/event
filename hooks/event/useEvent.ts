import { supabase } from "@/lib/supabaseClient";
import { Event } from "@/types/eventType";
import { useQuery } from "@tanstack/react-query";

export const useEvents = (visibility: "public" | "private") => {
  const {
    data: events,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Event[], Error>({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event")
        .select(
          "name,price,start_datetime,photo_url,user_id,id,profiles(username)"
        )
        .eq("visibility", visibility)
        .order("start_datetime", { ascending: true })
        .limit(7);
      if (error) throw error;
      return data as Event[];
    },
  });




  return {
    events,
    isLoading,
    isError,
    error,
    refetch,
  };
};
