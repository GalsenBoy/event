import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Types pour les filtres
export interface EventFilters {
  eventTypes: string[];
  dateRange: {
    startDate?: Date;
    endDate?: Date;
  };
  cities: string[];
  priceRange: {
    min?: number;
    max?: number;
    isFree?: boolean;
  };
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: EventFilters) => void;
  onResetFilters: () => void;
  initialFilters: EventFilters;
  availableEventTypes: string[];
  availableCities: string[];
}

export default function EventFilterModal({
  visible,
  onClose,
  onApplyFilters,
  onResetFilters,
  initialFilters,
  availableEventTypes,
  availableCities,
}: FilterModalProps) {
  const [filters, setFilters] = useState<EventFilters>(initialFilters);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const toggleEventType = (eventType: string) => {
    setFilters((prev) => ({
      ...prev,
      eventTypes: prev.eventTypes.includes(eventType)
        ? prev.eventTypes.filter((type) => type !== eventType)
        : [...prev.eventTypes, eventType],
    }));
  };

  const toggleCity = (city: string) => {
    setFilters((prev) => ({
      ...prev,
      cities: prev.cities.includes(city)
        ? prev.cities.filter((c) => c !== city)
        : [...prev.cities, city],
    }));
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setFilters((prev) => ({
        ...prev,
        dateRange: { ...prev.dateRange, startDate: selectedDate },
      }));
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setFilters((prev) => ({
        ...prev,
        dateRange: { ...prev.dateRange, endDate: selectedDate },
      }));
    }
  };

  const updatePriceRange = (field: "min" | "max", value: string) => {
    const numValue = value === "" ? undefined : parseFloat(value);
    setFilters((prev) => ({
      ...prev,
      priceRange: { ...prev.priceRange, [field]: numValue },
    }));
  };

  const toggleFreeEvents = (value: boolean) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: { ...prev.priceRange, isFree: value },
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: EventFilters = {
      eventTypes: [],
      dateRange: {},
      cities: [],
      priceRange: {},
    };
    setFilters(resetFilters);
    onResetFilters();
  };

  const formatDate = (date?: Date) => {
    return date ? date.toLocaleDateString("fr-FR") : "Sélectionner";
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Filtres</Text>
          <TouchableOpacity onPress={handleReset}>
            <Text style={styles.resetButton}>Reset</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Type d'événement</Text>
            <View style={styles.chipContainer}>
              {availableEventTypes.map((eventType) => (
                <TouchableOpacity
                  key={eventType}
                  style={[
                    styles.chip,
                    filters.eventTypes.includes(eventType) &&
                      styles.chipSelected,
                  ]}
                  onPress={() => toggleEventType(eventType)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      filters.eventTypes.includes(eventType) &&
                        styles.chipTextSelected,
                    ]}
                  >
                    {eventType}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Période</Text>
            <View style={styles.dateContainer}>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Text style={styles.dateLabel}>Du</Text>
                <Text style={styles.dateText}>
                  {formatDate(filters.dateRange.startDate)}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#666" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Text style={styles.dateLabel}>Au</Text>
                <Text style={styles.dateText}>
                  {formatDate(filters.dateRange.endDate)}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            {(filters.dateRange.startDate || filters.dateRange.endDate) && (
              <TouchableOpacity
                style={styles.clearDatesButton}
                onPress={() =>
                  setFilters((prev) => ({
                    ...prev,
                    dateRange: {},
                  }))
                }
              >
                <Text style={styles.clearDatesText}>Effacer les dates</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ville</Text>
            <View style={styles.chipContainer}>
              {availableCities.map((city) => (
                <TouchableOpacity
                  key={city}
                  style={[
                    styles.chip,
                    filters.cities.includes(city) && styles.chipSelected,
                  ]}
                  onPress={() => toggleCity(city)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      filters.cities.includes(city) && styles.chipTextSelected,
                    ]}
                  >
                    {city}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tarif</Text>
            <View style={styles.freeEventsContainer}>
              <Text style={styles.freeEventsLabel}>
                Événements gratuits uniquement
              </Text>
              <Switch
                value={filters.priceRange.isFree || false}
                onValueChange={toggleFreeEvents}
                trackColor={{ false: "#e0e0e0", true: "#007AFF" }}
                thumbColor={filters.priceRange.isFree ? "#fff" : "#f4f3f4"}
              />
            </View>

            {!filters.priceRange.isFree && (
              <View style={styles.priceRangeContainer}>
                <View style={styles.priceInputContainer}>
                  <Text style={styles.priceLabel}>Prix min (€)</Text>
                  <TextInput
                    style={styles.priceInput}
                    placeholder="0"
                    value={filters.priceRange.min?.toString() || ""}
                    onChangeText={(value) => updatePriceRange("min", value)}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.priceInputContainer}>
                  <Text style={styles.priceLabel}>Prix max (€)</Text>
                  <TextInput
                    style={styles.priceInput}
                    placeholder="999"
                    value={filters.priceRange.max?.toString() || ""}
                    onChangeText={(value) => updatePriceRange("max", value)}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Appliquer les filtres</Text>
          </TouchableOpacity>
        </View>
        {showStartDatePicker && (
          <DateTimePicker
            value={filters.dateRange.startDate || new Date()}
            mode="date"
            display="default"
            onChange={handleStartDateChange}
            minimumDate={new Date()}
          />
        )}

        {showEndDatePicker && (
          <DateTimePicker
            value={filters.dateRange.endDate || new Date()}
            mode="date"
            display="default"
            onChange={handleEndDateChange}
            minimumDate={filters.dateRange.startDate || new Date()}
          />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  resetButton: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#f8f9fa",
  },
  chipSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  chipText: {
    fontSize: 14,
    color: "#666",
  },
  chipTextSelected: {
    color: "#fff",
    fontWeight: "500",
  },
  dateContainer: {
    gap: 10,
  },
  dateButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
  },
  dateLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  dateText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  clearDatesButton: {
    alignSelf: "flex-start",
    marginTop: 10,
  },
  clearDatesText: {
    fontSize: 14,
    color: "#007AFF",
    textDecorationLine: "underline",
  },
  freeEventsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    marginBottom: 15,
  },
  freeEventsLabel: {
    fontSize: 16,
    color: "#333",
  },
  priceRangeContainer: {
    flexDirection: "row",
    gap: 15,
  },
  priceInputContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    fontWeight: "500",
  },
  priceInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#f8f9fa",
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  applyButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
