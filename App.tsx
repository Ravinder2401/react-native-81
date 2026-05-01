import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider, useTheme } from './ThemeContext';

import HomeScreen from './screens/HomeScreen';
import PromptImageScreener from './screens/PromptImageScreener';
import ImageTxtScreener from './screens/ImageTxtScreener';
import ImageTxtScreenerNew from './screens/ImageTxtScreenerNew';

export type RootStackParamList = {
  Home: undefined;
  PromptImageScreener: undefined;
  ImageTxtScreener: undefined;
  ImageTxtScreenerNew: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const NavigationWrapper = () => {
  const { isDark } = useTheme();

  return (
    <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: isDark ? '#0f172a' : '#ffffff',
          },
          headerTintColor: isDark ? '#f8fafc' : '#0f172a',
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen options={{headerShown:false}} name="Home" component={HomeScreen} />
        <Stack.Screen options={{ title: 'Creative Mind' }} name="PromptImageScreener" component={PromptImageScreener} />
        <Stack.Screen options={{ title: 'Text Intel' }} name="ImageTxtScreener" component={ImageTxtScreener} />
        <Stack.Screen options={{ title: 'Visual Intelligence' }} name="ImageTxtScreenerNew" component={ImageTxtScreenerNew} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <NavigationWrapper />
    </ThemeProvider>
  );
};

export default App;
