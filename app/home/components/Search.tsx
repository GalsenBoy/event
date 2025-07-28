import { GlobalStyle } from "@/constants/GlobalStyle";
import { Feather } from '@expo/vector-icons'; // ou Ionicons, FontAwesome etc.
import { StyleSheet, TextInput, View } from "react-native";

export default function Search() {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="gray" style={styles.icon} />
        <TextInput
          placeholder="Chercher un événement, un groupe, un utilisateur..."
          style={styles.input}
          placeholderTextColor="#999"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: GlobalStyle.borderRadius.borderRadius,
    paddingHorizontal: 10,
    height: 40,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
  },
});
