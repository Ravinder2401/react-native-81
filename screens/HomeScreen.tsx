import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { useTheme } from '../ThemeContext';

const { width } = Dimensions.get('window');

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { isDark, toggleTheme } = useTheme();
  const styles = getStyles(isDark);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={isDark ? "#0f172a" : "#ffffff"} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeToggleBtn}>
            <Text style={styles.themeToggleText}>{isDark ? '☀️ Light' : '🌙 Dark'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello Developer,</Text>

          <Text style={styles.title}>AI Vision Hub</Text>
          <Text style={styles.subtitle}>Supercharge your apps with Gemini Intelligence</Text>
        </View>

        <View style={styles.grid}>
          <TouchableOpacity
            style={[styles.card, isDark ? styles.cardDark1 : styles.cardLight1]}
            onPress={() => navigation.navigate('PromptImageScreener')}
          >
            <View style={[styles.iconCtn, isDark ? styles.iconDark1 : styles.iconLight1]}>
              <Text style={styles.icon}>✨</Text>
            </View>
            <Text style={styles.cardTitle}>Creative Mind</Text>
            <Text style={styles.cardDesc}>Ask Gemini anything with text-based prompts.</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, isDark ? styles.cardDark2 : styles.cardLight2]}
            onPress={() => navigation.navigate('ImageTxtScreener')}
          >
            <View style={[styles.iconCtn, isDark ? styles.iconDark2 : styles.iconLight2]}>
              <Text style={styles.icon}>🔍</Text>
            </View>
            <Text style={styles.cardTitle}>Text Intel</Text>
            <Text style={styles.cardDesc}>Extract OCR text and get deep AI insights.</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, isDark ? styles.cardDark3 : styles.cardLight3, { width: '100%' }]}
            onPress={() => navigation.navigate('ImageTxtScreenerNew')}
          >
            <View style={[styles.iconCtn, isDark ? styles.iconDark3 : styles.iconLight3]}>
              <Text style={styles.icon}>👁️</Text>
            </View>
            <View>
              <Text style={styles.cardTitle}>Visual Intelligence</Text>
              <Text style={styles.cardDesc}>Directly analyze reality using Gemini Vision 2.5.</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Powered by Google Gemini</Text>
          <Text style={styles.statsSubtitle}>Latest 2.5 Flash Model Integration</Text>
          <View style={styles.statusIndicator}>
            <View style={styles.pulse} />
            <Text style={styles.statusText}>System Ready</Text>
          </View>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (isDark: boolean) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: isDark ? '#0f172a' : '#ffffff',
  },
  container: {
    padding: 24,
  },
  headerTop: {
    alignItems: 'flex-end',
  },
  themeToggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: isDark ? '#334155' : '#f1f5f9',
    borderWidth: 1,
    borderColor: isDark ? '#475569' : '#e2e8f0',
  },
  themeToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: isDark ? '#f8fafc' : '#0f172a',
  },
  header: {
    marginTop: 20,
    marginBottom: 40,
  },
  greeting: {
    fontSize: 16,
    color: isDark ? '#94a3b8' : '#64748b',
    fontWeight: '500',
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: isDark ? '#f8fafc' : '#0f172a',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: isDark ? '#cbd5e1' : '#94a3b8',
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: (width - 64) / 2,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
  },
  cardLight1: { backgroundColor: '#fdf2f8' },
  cardDark1: { backgroundColor: '#331b2c' },
  iconLight1: { backgroundColor: '#fbcfe8' },
  iconDark1: { backgroundColor: '#831843' },

  cardLight2: { backgroundColor: '#f0f9ff' },
  cardDark2: { backgroundColor: '#162b3a' },
  iconLight2: { backgroundColor: '#bae6fd' },
  iconDark2: { backgroundColor: '#075985' },

  cardLight3: { backgroundColor: '#f5f3ff' },
  cardDark3: { backgroundColor: '#2e254d' },
  iconLight3: { backgroundColor: '#ddd6fe' },
  iconDark3: { backgroundColor: '#4c1d95' },

  iconCtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: isDark ? '#f8fafc' : '#1e293b',
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 13,
    color: isDark ? '#cbd5e1' : '#64748b',
    lineHeight: 18,
  },
  statsCard: {
    marginTop: 20,
    backgroundColor: isDark ? '#1e293b' : '#0f172a',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: isDark ? 1 : 0,
    borderColor: '#334155',
  },
  statsTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '700',
  },
  statsSubtitle: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 4,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 16,
  },
  pulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    marginRight: 8,
  },
  statusText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  bottomSpace: {
    height: 40,
  },
});

export default HomeScreen;
