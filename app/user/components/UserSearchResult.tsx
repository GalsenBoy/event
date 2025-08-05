
import { router } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Assurez-vous que ce type correspond à la structure de vos données utilisateur
type User = {
  id: string;
  username: string;
  avatar_url: string | null;
  full_name?: string;
};

export function UserSearchResultCard({ user }: { user: User }) {
  return (
    <TouchableOpacity 
      style={userCardStyles.container}
      onPress={() => router.push(`/user/${user.id}`)} // Navigue vers le profil de l'utilisateur
    >
      <Image 
        source={user.avatar_url ? { uri: user.avatar_url } : require('@/assets/images/biblio.jpg')}
        style={userCardStyles.avatar}
      />
      <View style={userCardStyles.info}>
        <Text style={userCardStyles.username}>{user.username}</Text>
        {user.full_name && <Text style={userCardStyles.fullName}>{user.full_name}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const userCardStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  fullName: {
    color: '#666',
    fontSize: 14,
  },
});
