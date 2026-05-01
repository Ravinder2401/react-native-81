import React from 'react';
import { View, Button, Image, StyleSheet, Alert } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

export const ImageSelector = ({ loading, selectedImage, onImageSelected, onAnalyze }:any) => {
  const handlePick = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      includeBase64: true,
      cropping: true,
      width: 800,
      height: 800,
    })
      .then(image => {
        if (image.data && image.mime) {
          onImageSelected({
            uri: image.path,
            base64: image.data,
            type: image.mime,
            width: image.width,
            height: image.height,
          });
        }
      })
      .catch(err => {
        if (err.code !== 'E_PICKER_CANCELLED') {
          Alert.alert('Error', 'Failed to pick image');
        }
      });
  };

  const handleCamera = () => {
    ImagePicker.openCamera({
      mediaType: 'photo',
      includeBase64: true,
      cropping: true,
      width: 800,
      height: 800,
    })
      .then(image => {
        if (image.data && image.mime) {
          onImageSelected({
            uri: image.path,
            base64: image.data,
            type: image.mime,
            width: image.width,
            height: image.height,
          });
        }
      })
      .catch(err => {
        if (err.code !== 'E_PICKER_CANCELLED') {
          Alert.alert('Error', 'Failed to take photo');
        }
      });
  };

  return (
    <View>
      <View style={styles.buttonRow}>
        <Button title="Pick from Gallery" onPress={handlePick} disabled={loading} />
        <Button title="Take Photo" onPress={handleCamera} disabled={loading} />
      </View>

      {selectedImage && (
        <View style={styles.preview}>
          <Image source={{ uri: selectedImage.uri }} style={styles.image} />
          <Button title="Analyze Image" onPress={() => onAnalyze(selectedImage)} disabled={loading} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
  preview: { alignItems: 'center', marginVertical: 20 },
  image: { width: 200, height: 200, resizeMode: 'contain', borderRadius: 8, borderWidth: 1, borderColor: '#aaa', marginBottom: 10 },
});
