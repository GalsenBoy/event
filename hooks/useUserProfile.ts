import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import useAuthenticated from "./useAuthenticated";

export default function useUserProfile() {
    const session = useAuthenticated();

    // Récupérer le profil de l'utilisateur
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
        enabled: !!session?.user?.id, // Active la requête uniquement si l'utilisateur est connecté
    });

    // Télécharger l'image de l'avatar
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
        enabled: !!profile?.avatar_url, // Active la requête uniquement si l'URL de l'avatar existe
    });

    return {
        loading: loadingProfile || loadingImage,
        username: profile?.username || "",
        avatarUrl: profile?.avatar_url || "",
        pathImage: pathImage || "",
    };
}