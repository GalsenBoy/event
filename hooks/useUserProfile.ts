import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import useAuthenticated from "./useAuthenticated";

export default function useUserProfile() {
    const session = useAuthenticated();
    const { data: profile, isLoading: loadingProfile } = useQuery({
        queryKey: ["userProfile", session?.user?.id],
        queryFn: async () => {
            if (!session?.user) throw new Error("No user on the session!");

            const { data, error, status } = await supabase
                .from("profiles")
                .select(`username, avatar_url`)
                .eq("id", session.user.id)
                .single();

            if (error && status !== 406) {
                throw new Error(error.message);
            }

            return data || { username: "", avatar_url: "" };
        },
        enabled: !!session?.user?.id, 
    });

    const { data: pathImage, isLoading: loadingImage } = useQuery({
        queryKey: ["avatarImage", profile?.avatar_url],
        queryFn: async () => {
            if (!profile?.avatar_url) return "";

            const { data, error } = await supabase.storage
                .from("avatars")
                .download(profile.avatar_url);

            if (error) {
                console.error("Error downloading image: ", error.message);
                return "";
            }

            const fr = new FileReader();
            return new Promise<string>((resolve, reject) => {
                fr.readAsDataURL(data);
                fr.onload = () => resolve(fr.result as string);
                fr.onerror = () => reject("Failed to read image data");
            });
        },
        enabled: !!profile?.avatar_url, 
    });

    return {
        loading: loadingProfile || loadingImage,
        username: profile?.username || "",
        avatarUrl: profile?.avatar_url || "",
        pathImage: pathImage || "",
    };
}