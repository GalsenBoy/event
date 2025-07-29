import { Colors } from "@/constants/Colors";
import { GlobalStyle } from "@/constants/GlobalStyle";
import { Feather } from '@expo/vector-icons';
import { StyleSheet, TextInput, View } from "react-native";

export default function Search() {
  return (
    <View style={styles.container}>
     <View style={styles.flexRow}>
       <View style={styles.searchContainer}>
        <Feather name="search" size={20} color={Colors.light.icon} style={styles.icon} />
        <TextInput
          placeholder="Chercher un événement, un groupe, un utilisateur..."
          style={styles.input}
        />
      </View>
       <Feather
          name="filter"
          size={20}
          color={Colors.light.icon}
          style={[styles.icon, styles.iconFilter]}
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
    flex: 1,
    marginRight: 15,
  },
  icon: {
    marginRight: 8,
  },
  iconFilter:{
    backgroundColor: '#dcdcdc',
    padding: 10,
    borderRadius: 25,
  },
  input: {
    flex: 1,
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
