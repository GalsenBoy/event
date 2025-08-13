import { useAllEvents } from "@/hooks/event/useAllEvents";
import { useAllUsers } from "@/hooks/useAllUsers";
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from "react";
import { SectionList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EventFilterModal, { EventFilters } from "../event/components/EventFilterModal";
import EventSearchResultCard from "../event/components/EventSearchResults";
import EventsVisibilityTabs from "../event/components/EventVisibilityTabs";
import Search from "../home/components/Search";
import UserSearchResultCard from "../user/components/UserSearchResult";

export default function HomeScreen() {
  const { events } = useAllEvents();
  const { users } = useAllUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState<EventFilters>({
    eventTypes: [],
    dateRange: {},
    cities: [],
    priceRange: {}
  });

  // Extraire les types d'événements et villes disponibles
  const availableEventTypes = useMemo(() => {
    const types = new Set<string>();
    events?.forEach(event => {
      if (event.event_type) types.add(event.event_type);
    });
    return Array.from(types).sort();
  }, [events]);

  const availableCities = useMemo(() => {
    const cities = new Set<string>();
    events?.forEach(event => {
      if (event.address_city) cities.add(event.address_city);
    });
    return Array.from(cities).sort();
  }, [events]);

  // Fonction pour appliquer les filtres
  const applyFiltersToEvents = (eventsList: any[], filters: EventFilters) => {
    return eventsList.filter(event => {
      // Filtre par type d'événement
      if (filters.eventTypes.length > 0 && !filters.eventTypes.includes(event.event_type)) {
        return false;
      }

      // Filtre par ville
      if (filters.cities.length > 0 && !filters.cities.includes(event.address_city)) {
        return false;
      }

      // Filtre par date (on utilise start_datetime pour le filtrage)
      if (filters.dateRange.startDate || filters.dateRange.endDate) {
        const eventStartDate = new Date(event.start_datetime);
        const eventEndDate = event.end_datetime ? new Date(event.end_datetime) : eventStartDate;
        
        if (filters.dateRange.startDate) {
          // L'événement doit finir après ou à la date de début du filtre
          if (eventEndDate < filters.dateRange.startDate) {
            return false;
          }
        }
        
        if (filters.dateRange.endDate) {
          // L'événement doit commencer avant ou à la date de fin du filtre
          const filterEndDate = new Date(filters.dateRange.endDate);
          // On met la date de fin du filtre à 23:59:59 pour inclure toute la journée
          filterEndDate.setHours(23, 59, 59, 999);
          if (eventStartDate > filterEndDate) {
            return false;
          }
        }
      }

      // Filtre par prix
      if (filters.priceRange.isFree && event.price > 0) {
        return false;
      }
      if (filters.priceRange.min !== undefined && event.price < filters.priceRange.min) {
        return false;
      }
      if (filters.priceRange.max !== undefined && event.price > filters.priceRange.max) {
        return false;
      }

      return true;
    });
  };

  // Calculer les résultats de recherche avec filtres
  const filteredResults = useMemo(() => {
    let eventsToFilter = events ?? [];
    
    // Appliquer d'abord les filtres
    eventsToFilter = applyFiltersToEvents(eventsToFilter, activeFilters);

    // Puis appliquer la recherche textuelle
    if (searchQuery.trim() === '') {
      return { events: eventsToFilter, users: [] };
    }

    const lowercasedQuery = searchQuery.toLowerCase();

    const filteredEvents = eventsToFilter.filter(event =>
      event.name?.toLowerCase().includes(lowercasedQuery)
    );
    const filteredUsers = (users ?? []).filter(user =>
      user.username?.toLowerCase().includes(lowercasedQuery)
    );

    return { events: filteredEvents, users: filteredUsers };
  }, [searchQuery, events, users, activeFilters]);

  // Compter le nombre de filtres actifs
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (activeFilters.eventTypes.length > 0) count++;
    if (activeFilters.cities.length > 0) count++;
    if (activeFilters.dateRange.startDate || activeFilters.dateRange.endDate) count++;
    if (activeFilters.priceRange.isFree || 
        activeFilters.priceRange.min !== undefined || 
        activeFilters.priceRange.max !== undefined) count++;
    return count;
  }, [activeFilters]);

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
  const hasActiveFilters = activeFiltersCount > 0;

  const handleApplyFilters = (filters: EventFilters) => {
    setActiveFilters(filters);
  };

  const handleResetFilters = () => {
    setActiveFilters({
      eventTypes: [],
      dateRange: {},
      cities: [],
      priceRange: {}
    });
  };

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

  const FilteredEvents = () => (
    <SectionList
      sections={[{
        title: "Événements",
        data: filteredResults.events,
        renderItem: ({ item }: { item: any }) => <EventSearchResultCard event={item} />,
      }]}
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
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Search
            query={searchQuery}
            onQueryChange={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={[styles.filterButton, hasActiveFilters && styles.filterButtonActive]}
          onPress={() => setShowFilterModal(true)}
        >
          <Ionicons 
            name="filter" 
            size={20} 
            color={hasActiveFilters ? "#fff" : "#666"} 
          />
          {activeFiltersCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {hasSearchResults ? (
        <SearchResults />
      ) : hasActiveFilters ? (
        <FilteredEvents />
      ) : (
        <EventsVisibilityTabs />
      )}
      <EventFilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
        initialFilters={activeFilters}
        availableEventTypes={availableEventTypes}
        availableCities={availableCities}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  searchWrapper: {
    flex: 1,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    position: 'relative',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
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