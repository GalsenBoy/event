import { supabase } from "@/lib/supabaseClient";
import { Event } from "@/types/evenType";
import { useQuery } from "@tanstack/react-query";

export const useAllEvents = () => {
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
        .select("name") 
        .order("start_datetime", { ascending: true });
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
