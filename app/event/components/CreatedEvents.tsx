import CardHome from "@/app/home/components/CardHome";
import Loading from "@/components/ui/Loading";
import { useAuth } from "@/context/AuthContext";
import { useCreatedEvents } from "@/hooks/event/useCreatedEvents";
import { View } from "react-native";

export default function CreatedEvents() {
  const { user } = useAuth();
  const { data, isLoading } = useCreatedEvents(user?.id ?? "");

  if (isLoading) return <Loading />;

  return (
    <View>
      {data?.map((event) => (
        <CardHome key={event.id} event={event} />
      ))}
    </View>
  );
}
