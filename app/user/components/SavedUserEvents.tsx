import CardHome from "@/app/home/components/CardHome";
import Loading from "@/components/ui/Loading";
import { useSavedEvents } from "@/hooks/event/useSavedEvents";
import React from "react";
import { FlatList, View } from "react-native";

interface SavedUserEventsProps {
  user_id: string;
}

export default function SavedUserEvents({ user_id }: SavedUserEventsProps) {
  const { data, isLoading } = useSavedEvents(user_id);

  if (isLoading) return <Loading />;

  return (
    <View style={{ flex: 1 }}>
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
