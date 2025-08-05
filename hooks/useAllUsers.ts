import { supabase } from "@/lib/supabaseClient";
import { Event } from "@/types/evenType";
import { useQuery } from "@tanstack/react-query";

export const useAllUsers = () => {
  const {
    data: users,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Event[], Error>({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("username") 
      if (error) throw error;
      return data as Event[];
    },
  });


  return {
    users,
    isLoading,
    isError,
    error,
    refetch,
  };
};
