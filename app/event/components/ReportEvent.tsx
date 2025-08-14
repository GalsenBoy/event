import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { GlobalStyle } from "@/constants/GlobalStyle";
import { useAuth } from "@/context/AuthContext";
import { useReportEvent } from "@/hooks/event/useReportEvent";
import { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function ReportEvent({ eventId }: { eventId: string }) {
  const { user } = useAuth();
  const reportEvent = useReportEvent();
  const [reason, setReason] = useState("");

  const handleReport = () => {
    if (!reason.trim()) {
      Alert.alert("Erreur", "Veuillez indiquer une raison.");
      return;
    }

    reportEvent.mutate(
      {
        event_id: eventId,
        reporter_id: user?.id ?? "",
        reason,
      },
      {
        onSuccess: () => {
          Alert.alert("Merci", "Votre signalement a été envoyé.");
          setReason("");
        },
        onError: (err) => {
          Alert.alert("Erreur", err.message);
        },
      }
    );
  };

  return (
    <View style={{ marginTop: 20 }}>
      <Text style={{ marginBottom: 8 }}>Raison du signalement :</Text>
      <TextInput
        value={reason}
        onChangeText={setReason}
        placeholder="Décrivez le problème"
        style={styles.input}
      />
      <TouchableOpacity
        disabled={!reason}
        style={reason ? styles.buttonContainer : styles.reason}
        onPress={handleReport}
      >
        <ThemedText type="defaultSemiBold">
          Signaler cet événement ⚠️
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginHorizontal: "auto",
    backgroundColor: Colors.light.tint,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: GlobalStyle.borderRadius.borderRadius,
    marginBottom: 10,
  },
  reason: {
    padding: 12,
    borderRadius: 6,
    marginHorizontal: "auto",
    marginBottom: 15,
    opacity:0.4
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 6,
    marginHorizontal: 25,
    marginBottom: 15,
    color: "#999",
    //marginHorizontal: "auto",
  },
});
