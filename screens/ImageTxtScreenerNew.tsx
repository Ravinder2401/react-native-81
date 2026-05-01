import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  StatusBar,
  SafeAreaView,
  Dimensions,
  Platform,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import { useTheme } from '../ThemeContext';

const { width } = Dimensions.get('window');
const GEMINI_API_KEY = 'AIzaSyBcBy5SS4zwHJiLz6Vsw81btVrS61hh06I';
const API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

interface SelectedImage {
  uri: string;
  base64: string;
  type: string;
}

const ImageTxtScreenerNew = () => {
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);
  const [geminiResponse, setGeminiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { isDark } = useTheme();
  const styles = getStyles(isDark);

  const pickImage = (useCamera: boolean = false) => {
    const options = {
      mediaType: 'photo' as const,
      includeBase64: true,
      width: 1024,
      height: 1024,
      cropping: true,
      cropperToolbarTitle: 'Analyze This',
      cropperActiveWidgetColor: '#0ea5e9',
    };

    const action = useCamera ? ImagePicker.openCamera(options) : ImagePicker.openPicker(options);

    action
      .then(image => {
        if (image.data && image.mime) {
          setSelectedImage({
            uri: image.path,
            base64: image.data,
            type: image.mime,
          });
          setGeminiResponse(null);
          // Automatically trigger analysis
          analyzeImageDirectly(image.data, image.mime);
        }
      })
      .catch(err => {
        if (err.code !== 'E_PICKER_CANCELLED') {
          Alert.alert('Error', 'Failed to acquire image');
        }
      });
  };

  const analyzeImageDirectly = async (base64Data: string, mimeType: string) => {
    setLoading(true);
    setGeminiResponse(null);

    const prompt = `Analyze this image in detail. Identify objects, text, landmarks, or products. 
    Provide a comprehensive description, potential price if it's a product, and any interesting facts. 
    Format the response cleanly with headings.`;

    const payload = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Data,
              },
            },
          ],
        },
      ],
    };

    try {
      const response = await axios.post(API_ENDPOINT, payload);
      const apiText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      setGeminiResponse(apiText || 'Gemini couldn\'t find any specific details.');
    } catch (e: any) {
      console.error('Vision API Error:', e.response?.data || e.message);
      Alert.alert('Vision Error', 'Failed to analyze image with Gemini Vision.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={isDark ? "#0f172a" : "#f8fafc"} />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.visionBadgeContainer}>
            <Text style={styles.visionBadgeText}>VISION AI 2.5</Text>
          </View>
          <Text style={styles.title}>Visual Intelligence</Text>
          <Text style={styles.subtitle}>Directly analyze reality through AI eyes</Text>
        </View>

        {!selectedImage ? (
          <View style={styles.uploadCtn}>
            <TouchableOpacity style={styles.mainUploadBtn} onPress={() => pickImage(false)}>
              <Text style={styles.uploadIcon}>🖼️</Text>
              <Text style={styles.uploadBtnText}>Gallery</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.mainUploadBtn} onPress={() => pickImage(true)}>
              <Text style={styles.uploadIcon}>📸</Text>
              <Text style={styles.uploadBtnText}>Camera</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.activeVisionCard}>
            <Image source={{ uri: selectedImage.uri }} style={styles.fullPreview} />
            <View style={styles.scanLine} />
            <TouchableOpacity style={styles.resetBtn} onPress={() => setSelectedImage(null)}>
              <Text style={styles.resetBtnText}>New Scan</Text>
            </TouchableOpacity>
          </View>
        )}

        {loading && (
          <View style={styles.loadingArea}>
            <ActivityIndicator size="large" color="#0ea5e9" />
            <Text style={styles.loadingSub}>Decrypting Pixels...</Text>
          </View>
        )}

        {geminiResponse && (
          <View style={styles.aiResultCard}>
            <View style={styles.resultHeader}>
              <View style={styles.dot} />
              <Text style={styles.resultTitle}>Intelligence Report</Text>
            </View>
            <Text style={styles.resultBody}>{geminiResponse}</Text>
          </View>
        )}

        <View style={styles.footerPad} />
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (isDark: boolean) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  visionBadgeContainer: {
    backgroundColor: isDark ? 'rgba(14, 165, 233, 0.15)' : 'rgba(14, 165, 233, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(14, 165, 233, 0.3)' : 'rgba(14, 165, 233, 0.2)',
    marginBottom: 16,
  },
  visionBadgeText: {
    color: isDark ? '#38bdf8' : '#0284c7',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: isDark ? '#f8fafc' : '#0f172a',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: isDark ? '#94a3b8' : '#64748b',
    marginTop: 8,
    textAlign: 'center',
  },
  uploadCtn: {
    flexDirection: 'row',
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: isDark ? 0.3 : 0.05,
    shadowRadius: 20,
    borderWidth: 1,
    borderColor: isDark ? '#334155' : '#e2e8f0',
  },
  mainUploadBtn: {
    alignItems: 'center',
    flex: 1,
  },
  uploadIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  uploadBtnText: {
    color: isDark ? '#cbd5e1' : '#475569',
    fontWeight: '700',
    fontSize: 16,
  },
  divider: {
    width: 1,
    height: 60,
    backgroundColor: isDark ? '#334155' : '#e2e8f0',
  },
  activeVisionCard: {
    width: '100%',
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
    borderWidth: 1,
    borderColor: isDark ? '#334155' : '#e2e8f0',
    elevation: 8,
  },
  fullPreview: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
  },
  scanLine: {
    position: 'absolute',
    top: '20%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#0ea5e9',
    opacity: 0.5,
    shadowColor: '#0ea5e9',
    shadowRadius: 10,
    shadowOpacity: 1,
    elevation: 5,
  },
  resetBtn: {
    backgroundColor: isDark ? 'rgba(241, 245, 249, 0.1)' : '#f1f5f9',
    paddingVertical: 16,
    alignItems: 'center',
  },
  resetBtnText: {
    color: isDark ? '#f1f5f9' : '#334155',
    fontWeight: '700',
  },
  loadingArea: {
    padding: 40,
    alignItems: 'center',
  },
  loadingSub: {
    color: isDark ? '#38bdf8' : '#0284c7',
    marginTop: 16,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
  aiResultCard: {
    marginTop: 30,
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: isDark ? '#334155' : '#e2e8f0',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    marginRight: 10,
  },
  resultTitle: {
    color: isDark ? '#f1f5f9' : '#0f172a',
    fontSize: 18,
    fontWeight: '800',
  },
  resultBody: {
    color: isDark ? '#cbd5e1' : '#334155',
    fontSize: 16,
    lineHeight: 26,
  },
  footerPad: {
    height: 100,
  },
});

export default ImageTxtScreenerNew;
