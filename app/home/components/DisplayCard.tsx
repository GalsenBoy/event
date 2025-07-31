import Loading from "@/components/ui/Loading";
import { useEvents } from "@/hooks/useEvent";
import { FlatList, View } from "react-native";
import CardHome from "./CardHome";

export default function DisplayCard() {
  const { events, isLoading } = useEvents();
  if (isLoading) return <Loading />;
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={events}
        renderItem={({ item }) => <CardHome event={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
