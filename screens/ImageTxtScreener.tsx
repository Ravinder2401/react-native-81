import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  StatusBar,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import ImageViewing from 'react-native-image-viewing';
import { useTheme } from '../ThemeContext';

const { width } = Dimensions.get('window');
const GEMINI_API_KEY = 'AIzaSyBcBy5SS4zwHJiLz6Vsw81btVrS61hh06I';
const API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

interface SelectedImage {
  uri: string;
  base64: string;
  type: string;
}

const ImageTxtScreener = () => {
  const [ocrText, setOcrText] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);

  const { isDark } = useTheme();
  const styles = getStyles(isDark);

  const pickAndCropImage = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      includeBase64: true,
      cropping: true,
      cropperToolbarTitle: 'Focus on Text',
      cropperActiveWidgetColor: '#6366f1',
      cropperStatusBarColor: isDark ? '#0f172a' : '#6366f1',
      cropperToolbarColor: isDark ? '#1e293b' : '#6366f1',
      cropperSelectionColor: '#6366f1',
    })
      .then(image => {
        if (image.data && image.mime) {
          const newImage: SelectedImage = {
            uri: image.path,
            base64: image.data,
            type: image.mime,
          };
          setSelectedImage(newImage);
          setResponse('');
          extractTextFromImage(image.path);
        }
      })
      .catch(err => {
        if (err.code !== 'E_PICKER_CANCELLED') {
          Alert.alert('Error', 'Failed to pick image');
        }
      });
  };

  const extractTextFromImage = async (imagePath: string) => {
    try {
      setLoading(true);
      const result = await TextRecognition.recognize(imagePath);
      if (result && result.text) {
        setOcrText(result.text.trim());
      } else {
        Alert.alert('No Text Found', 'We couldn\'t find any text in that image.');
      }
    } catch (err) {
      Alert.alert('OCR Error', 'Failed to read text from image.');
    } finally {
      setLoading(false);
    }
  };

  const analyzeWithGemini = async () => {
    if (!ocrText.trim()) return;
    try {
      setParsing(true);
      const prompt = `I extracted this text from an image: "${ocrText}". 
      Please explain what this is, summarize it, and providing any key takeaways or actions if applicable.`;
      
      const result = await axios.post(API_ENDPOINT, {
        contents: [{ parts: [{ text: prompt }] }],
      });
      
      const text = result.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No insights found.';
      setResponse(text);
    } catch (err) {
      Alert.alert('Gemini Error', 'Failed to get insights from Gemini.');
    } finally {
      setParsing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={isDark ? "#0f172a" : "#f8fafc"} />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.badge}>OCR & AI</Text>
          <Text style={styles.title}>Text Intel</Text>
          <Text style={styles.subtitle}>Extract text and get AI insights instantly</Text>
        </View>

        {!selectedImage ? (
          <TouchableOpacity style={styles.uploadPlaceholder} onPress={pickAndCropImage}>
            <View style={styles.uploadIconContainer}>
              <Text style={styles.uploadIcon}>📸</Text>
            </View>
            <Text style={styles.uploadText}>Tap to Scan Image</Text>
            <Text style={styles.uploadSubtext}>JPG, PNG supported</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.imageCard}>
            <TouchableOpacity onPress={() => setIsImageViewVisible(true)}>
              <Image source={{ uri: selectedImage.uri }} style={styles.previewImage} />
              <View style={styles.zoomBadge}>
                <Text style={styles.zoomText}>🔍 Tap to zoom</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.retakeButton} onPress={pickAndCropImage}>
              <Text style={styles.retakeText}>Retake Image</Text>
            </TouchableOpacity>
          </View>
        )}

        {loading && (
          <View style={styles.loaderFull}>
            <ActivityIndicator size="large" color="#6366f1" />
            <Text style={styles.loaderText}>Reading text...</Text>
          </View>
        )}

        {ocrText && !loading && (
          <View style={styles.resultCard}>
            <Text style={styles.cardHeader}>Extracted Text</Text>
            <TextInput
              multiline
              style={styles.ocrInput}
              value={ocrText}
              onChangeText={setOcrText}
            />
            {!response && (
              <TouchableOpacity 
                style={[styles.primaryButton, parsing && styles.disabledButton]} 
                onPress={analyzeWithGemini}
                disabled={parsing}
              >
                {parsing ? (
                  <ActivityIndicator color={isDark ? "#0f172a" : "#fff"} />
                ) : (
                  <Text style={styles.primaryButtonText}>Get AI Insights</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        )}

        {response && (
          <View style={[styles.resultCard, styles.geminiCard]}>
            <View style={styles.geminiHeader}>
              <Text style={styles.geminiBadge}>Gemini AI</Text>
              <Text style={styles.cardHeader}>Insights</Text>
            </View>
            <Text style={styles.responseText}>{response}</Text>
          </View>
        )}

        <View style={styles.footerSpacer} />
      </ScrollView>

      <ImageViewing
        images={[{ uri: selectedImage?.uri ?? '' }]}
        imageIndex={0}
        visible={isImageViewVisible}
        onRequestClose={() => setIsImageViewVisible(false)}
      />
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
    paddingTop: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  badge: {
    backgroundColor: isDark ? 'rgba(99, 102, 241, 0.2)' : '#e0e7ff',
    color: isDark ? '#818cf8' : '#4338ca',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 10,
    overflow: 'hidden',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: isDark ? '#f8fafc' : '#1e293b',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: isDark ? '#cbd5e1' : '#64748b',
    marginTop: 4,
    textAlign: 'center',
  },
  uploadPlaceholder: {
    height: 250,
    backgroundColor: isDark ? '#1e293b' : '#fff',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: isDark ? '#334155' : '#e2e8f0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: isDark ? '#0f172a' : '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadIcon: {
    fontSize: 32,
  },
  uploadText: {
    fontSize: 18,
    fontWeight: '600',
    color: isDark ? '#f8fafc' : '#334155',
  },
  uploadSubtext: {
    fontSize: 14,
    color: isDark ? '#94a3b8' : '#94a3b8',
    marginTop: 4,
  },
  imageCard: {
    backgroundColor: isDark ? '#1e293b' : '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 12,
  },
  previewImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  zoomBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  zoomText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  retakeButton: {
    backgroundColor: isDark ? '#1e293b' : '#fff',
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: isDark ? '#334155' : '#f1f5f9',
  },
  retakeText: {
    color: isDark ? '#f87171' : '#ef4444',
    fontWeight: '600',
    fontSize: 14,
  },
  loaderFull: {
    alignItems: 'center',
    marginVertical: 40,
  },
  loaderText: {
    marginTop: 12,
    color: isDark ? '#94a3b8' : '#64748b',
    fontSize: 16,
    fontWeight: '500',
  },
  resultCard: {
    backgroundColor: isDark ? '#1e293b' : '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.2 : 0.05,
    shadowRadius: 8,
  },
  geminiCard: {
    backgroundColor: isDark ? '#2e254d' : '#f5f3ff',
    borderWidth: 1,
    borderColor: isDark ? '#4c1d95' : '#ddd6fe',
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: isDark ? '#f8fafc' : '#1e293b',
    marginBottom: 16,
  },
  geminiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  geminiBadge: {
    backgroundColor: isDark ? '#7c3aed' : '#8b5cf6',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 10,
    fontWeight: '800',
    marginRight: 10,
    overflow: 'hidden',
  },
  ocrInput: {
    fontSize: 16,
    color: isDark ? '#f8fafc' : '#334155',
    lineHeight: 24,
    minHeight: 120,
    textAlignVertical: 'top',
    backgroundColor: isDark ? '#0f172a' : '#fbfcfd',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: isDark ? '#334155' : '#f1f5f9',
  },
  primaryButton: {
    backgroundColor: isDark ? '#818cf8' : '#6366f1',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: isDark ? 'transparent' : '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: isDark ? '#0f172a' : '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  responseText: {
    fontSize: 16,
    color: isDark ? '#ddd6fe' : '#4c1d95',
    lineHeight: 24,
  },
  footerSpacer: {
    height: 40,
  },
});

export default ImageTxtScreener;
