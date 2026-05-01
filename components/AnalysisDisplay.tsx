import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const AnalysisDisplay = ({ data }: { data: Array<{ key: string; value: string }> }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Image Analysis:</Text>
    {data.map(({ key, value }) => (
      <View key={key} style={styles.item}>
        <Text style={styles.label}>{key}:</Text>
        {value.includes('\n') ? (
          value.split('\n').map((line, i) => (
            <Text key={i} style={styles.value}>• {line}</Text>
          ))
        ) : (
          <Text style={styles.value}>{value}</Text>
        )}
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginTop: 20, borderWidth: 1, borderColor: '#ccc' },
  title: { fontWeight: 'bold', fontSize: 18, marginBottom: 10 },
  item: { marginBottom: 10 },
  label: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  value: { fontSize: 15, color: '#555' },
});
