import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import axios from 'axios';
import { useTheme } from '../ThemeContext';

const GEMINI_API_KEY = 'AIzaSyBcBy5SS4zwHJiLz6Vsw81btVrS61hh06I';
const API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const PromptImageScreener = () => {
  const [inputText, setInputText] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const { isDark } = useTheme();
  const styles = getStyles(isDark);

  const askGemini = async () => {
    if (!inputText.trim()) return;
    Keyboard.dismiss();
    setLoading(true);
    setResponse(null);

    try {
      const result = await axios.post(API_ENDPOINT, {
        contents: [{ parts: [{ text: inputText.trim() }] }],
      });

      const text = result.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'I couldn\'t find an answer for that.';
      setResponse(text);
      // Auto scroll to response
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (err: any) {
      Alert.alert('AI Error', 'Something went wrong while talking to Gemini.');
      console.log('err---', err);

    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setInputText('');
    setResponse(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={isDark ? "#0f172a" : "#ffffff"} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.emoji}>✨</Text>
            <Text style={styles.title}>Creative Mind</Text>
            <Text style={styles.subtitle}>Ask anything, explore everything</Text>
          </View>

          <View style={styles.inputCard}>
            <TextInput
              style={styles.promptInput}
              placeholder="What's on your mind?..."
              placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
              value={inputText}
              onChangeText={setInputText}
              multiline
            />

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.clearBtn}
                onPress={clearChat}
              >
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.sendBtn, !inputText.trim() && styles.disabledBtn]}
                onPress={askGemini}
                disabled={loading || !inputText.trim()}
              >
                {loading ? (
                  <ActivityIndicator color={isDark ? "#0f172a" : "#fff"} size="small" />
                ) : (
                  <Text style={styles.sendText}>Ask Gemini</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {response && (
            <View style={styles.responseArea}>
              <View style={styles.respHeader}>
                <Text style={styles.respTitle}>Response</Text>
                <TouchableOpacity onPress={() => Alert.alert('Copied', 'Response copied to clipboard')}>
                  <Text style={styles.copyText}>Copy</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.respBody}>{response}</Text>
            </View>
          )}

          <View style={styles.bottomSpace} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const getStyles = (isDark: boolean) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: isDark ? '#0f172a' : '#ffffff',
  },
  flex: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: isDark ? '#f8fafc' : '#0f172a',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: isDark ? '#cbd5e1' : '#64748b',
    marginTop: 6,
  },
  inputCard: {
    backgroundColor: isDark ? '#1e293b' : '#f8fafc',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: isDark ? '#334155' : '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDark ? 0.2 : 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  promptInput: {
    fontSize: 18,
    color: isDark ? '#f8fafc' : '#1e293b',
    minHeight: 120,
    textAlignVertical: 'top',
    padding: 0,
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clearBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  clearText: {
    color: isDark ? '#94a3b8' : '#94a3b8',
    fontWeight: '600',
  },
  sendBtn: {
    backgroundColor: isDark ? '#34d399' : '#10b981',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: isDark ? 'transparent' : '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledBtn: {
    opacity: 0.5,
    backgroundColor: isDark ? '#475569' : '#94a3b8',
  },
  sendText: {
    color: isDark ? '#0f172a' : '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  responseArea: {
    marginTop: 30,
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: isDark ? '#334155' : '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: isDark ? 0.3 : 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  respHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#334155' : '#f1f5f9',
    paddingBottom: 12,
  },
  respTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: isDark ? '#818cf8' : '#6366f1',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  copyText: {
    fontSize: 12,
    color: isDark ? '#94a3b8' : '#94a3b8',
    fontWeight: '600',
  },
  respBody: {
    fontSize: 17,
    color: isDark ? '#cbd5e1' : '#334155',
    lineHeight: 28,
  },
  bottomSpace: {
    height: 60,
  },
});

export default PromptImageScreener;
