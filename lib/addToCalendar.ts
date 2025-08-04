import * as Calendar from "expo-calendar";
import { Alert } from "react-native";

export async function addEventToCalendar({
  title,
  notes,
  startDate,
  endDate,
  location,
}: {
  title: string;
  notes?: string;
  startDate: Date;
  endDate: Date;
  location?: string;
}) {
  const { status } = await Calendar.requestCalendarPermissionsAsync();

  if (status !== "granted") {
    Alert.alert("Permission refusée", "Impossible d'accéder au calendrier.");
    return;
  }

  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  const defaultCalendar = calendars.find((cal) => cal.allowsModifications);

  const calendarId = defaultCalendar?.id;

  if (!calendarId) {
    Alert.alert("Erreur", "Aucun calendrier modifiable trouvé.");
    return;
  }

  const eventId = await Calendar.createEventAsync(calendarId, {
    title,
    notes,
    startDate,
    endDate,
    timeZone: "Europe/Paris", // adapte à ton besoin
    location,
  });

  Alert.alert("Événement ajouté", "L'événement a été ajouté à votre calendrier.");
  return eventId;
}
