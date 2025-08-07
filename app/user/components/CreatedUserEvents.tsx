import CardHome from "@/app/home/components/CardHome";
import Loading from "@/components/ui/Loading";
import { useCreatedEvents } from "@/hooks/event/useCreatedEvents";
import { FlatList, View } from "react-native";

interface CreatedUserEventsProps {
  user_id: string;
}

export default function CreatedUserEvents({ user_id }: CreatedUserEventsProps) {
  const { data, isLoading } = useCreatedEvents(user_id);
  if (isLoading) return <Loading />;

  return (
    <View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CardHome event={item} />}
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
