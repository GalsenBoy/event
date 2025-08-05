import { useAllEvents } from "@/hooks/event/useAllEvents";
import { useAllUsers } from "@/hooks/useAllUsers";
import { useMemo, useState } from "react";
import { SectionList, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EventSearchResultCard } from "../event/components/EventSearchResults";
import EventsVisibilityTabs from "../event/components/EventVisibilityTabs";
import Search from "../home/components/Search";
import { UserSearchResultCard } from "../user/components/UserSearchResult";

export default function HomeScreen() {
  const { events } = useAllEvents();
  const { users } = useAllUsers();
  const [searchQuery, setSearchQuery] = useState("");

  // Calculer les résultats de recherche avec useMemo
  const filteredResults = useMemo(() => {
    if (searchQuery.trim() === '') {
      return { events: [], users: [] };
    }

    const lowercasedQuery = searchQuery.toLowerCase();

    const filteredEvents = (events ?? []).filter(event =>
      event.name?.toLowerCase().includes(lowercasedQuery)
    );
    const filteredUsers = (users ?? []).filter(user =>
      user.username?.toLowerCase().includes(lowercasedQuery)
    );

    return { events: filteredEvents, users: filteredUsers };
  }, [searchQuery, events, users]);

  const searchSections = useMemo(() => {
    const sections = [];
    if (filteredResults.users.length > 0) {
      sections.push({
        title: "Utilisateurs",
        data: filteredResults.users,
        renderItem: ({ item }: { item: any }) => <UserSearchResultCard user={item} />,
      });
    }
    if (filteredResults.events.length > 0) {
      sections.push({
        title: "Événements",
        data: filteredResults.events,
        renderItem: ({ item }: { item: any }) => <EventSearchResultCard event={item} />,
      });
    }
    return sections;
  }, [filteredResults]);

  const hasSearchResults = searchQuery.length > 0;

  const SearchResults = () => (
    <SectionList
      sections={searchSections}
      keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
      renderItem={({ item, section }) => section.renderItem({ item })}
      renderSectionHeader={({ section: { title } }) => (
        <Text style={styles.sectionTitle}>{title}</Text>
      )}
      contentContainerStyle={styles.resultsContainer}
      showsVerticalScrollIndicator={false}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Search
        query={searchQuery}
        onQueryChange={setSearchQuery}
      />

      {hasSearchResults ? <SearchResults /> : <EventsVisibilityTabs />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  resultsContainer: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 20,
    color: "#333",
    backgroundColor: "#f0f2f5",
    paddingTop: 8,
  },
});