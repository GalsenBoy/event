import Loading from "@/components/ui/Loading";
import { useEvents } from "@/hooks/event/useEvent";
import { FlatList, View } from "react-native";
import CardHome from "./CardHome";

export default function DisplayPrivateEvents() {
  const { events, isLoading } = useEvents("private");
  if (isLoading) return <Loading />;
  return (
    <View style={{ flex: 1}}>
      <FlatList
        data={events}
        renderItem={({ item }) => <CardHome event={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
