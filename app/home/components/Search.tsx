import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

interface SearchProps {
  query: string;
  onQueryChange: (query: string) => void;
}

export default function Search({ query, onQueryChange }: SearchProps) {
  return (
    <View style={searchStyles.container}>
      <TextInput
        style={searchStyles.input}
        placeholder="Rechercher..."
        value={query}
        onChangeText={onQueryChange}
        clearButtonMode="always"
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}

const searchStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f2f5',
  },
  input: {
    height: 44,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 22,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
});
