import { Colors } from "@/constants/Colors";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./ThemedText";
import Avatar from "./auth/Avatar";

export default function UserProfileHeader({
  avatarUrl,
  username,
  bio,
  followers,
  following,
  groupCount,
  action,
  onEdit,
  onShare,
}: {
  avatarUrl: string;
  username: string;
  bio: string;
  followers: number;
  following: number;
  groupCount: number;
  action:boolean
  onEdit?: () => void;
  onShare?: () => void;
}) {
  return (
    <View>
      <View style={styles.container}>
        <Avatar size={110} url={avatarUrl} onUpload={() => {}} />
        <View style={styles.infoContainer}>
          <ThemedText type="subtitle">{username}</ThemedText>
          <View style={styles.topRow}>
            <View style={styles.stats}>
              <View>
                <ThemedText type="subtitle" style={styles.statNumber}>
                  {followers}{" "}
                </ThemedText>
                <ThemedText style={styles.stat}>followers</ThemedText>
              </View>
              <View>
                <ThemedText type="subtitle" style={styles.statNumber}>
                  {following}{" "}
                </ThemedText>
                <ThemedText style={styles.stat}>suivi(e)s</ThemedText>
              </View>
            </View>
            {action ? <View style={styles.topRow}>
              <View style={styles.buttonGroup}>
                <TouchableOpacity style={styles.button} onPress={onEdit}>
                  <ThemedText style={styles.buttonText}>Modifier</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={onShare}>
                  <ThemedText style={styles.buttonText}>Partager</ThemedText>
                </TouchableOpacity>
              </View>
            </View>:""}
          </View>
        </View>
      </View>
      <ThemedText style={styles.bio}>{bio}</ThemedText>
      <ThemedText type="defaultSemiBold">
        Membre de{" "}
        <ThemedText type="defaultSemiBold" style={styles.groupCount}>
          {groupCount} groupes
        </ThemedText>
      </ThemedText>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-around",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonGroup: {
    gap: 8,
  },
  button: {
    backgroundColor: Colors.customColor.btnColor,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#000",
  },
  stats: {
    flexDirection: "row",
    gap: 16,
  },
  stat: {
    fontSize: 14,
    color: "#444",
  },
  statNumber: {
    textAlign: "center",
  },
  bio: {
   marginLeft:7
  },
  groupCount: {
    color: "blue",
  },
});
