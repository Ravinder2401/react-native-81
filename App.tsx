import * as React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

// Define types (optional but recommended)
type DrawerParamList = {
  Home: undefined;
  Details: { message: string };
};

const Drawer = createDrawerNavigator<DrawerParamList>();

// Home Screen
function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>

      <Button
        title="Open Drawer"
        onPress={() => navigation.openDrawer()}
      />

      <View style={{ height: 10 }} />

      <Button
        title="Go to Details"
        onPress={() =>
          navigation.navigate('Details', { message: 'Hello from Home!' })
        }
      />
    </View>
  );
}

// Details Screen
function DetailsScreen({ route, navigation }: any) {
  const { message } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Details Screen</Text>
      <Text style={styles.text}>{message}</Text>

      <Button title="Open Drawer" onPress={() => navigation.openDrawer()} />
    </View>
  );
}

// App Component
export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Details" component={DetailsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});