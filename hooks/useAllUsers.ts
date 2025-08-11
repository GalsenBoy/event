import { supabase } from "@/lib/supabaseClient";
import { Profiles } from "@/types/eventType";
import { useQuery } from "@tanstack/react-query";

export const useAllUsers = () => {
  const {
    data: users,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Profiles[], Error>({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*") 
      if (error) throw error;
      return data as Profiles[];
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
