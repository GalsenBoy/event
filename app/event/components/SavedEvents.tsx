import CardHome from "@/app/home/components/CardHome";
import Loading from "@/components/ui/Loading";
import { useSavedEvents } from "@/hooks/event/useSavedEvents";
import { View } from "react-native";

export default function SavedEvents() {
  const { data, isLoading } = useSavedEvents();

  if (isLoading) return <Loading />;
  return (
    <View style={{ flex: 1 }}>
      {data?.map((event) => (
        <CardHome key={event.id} event={event} />
      ))}
    </View>
  );
}
