import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { colors, fonts, windowWidth, windowHeight } from '../../utils';

export default function Splash({ navigation }) {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  const titleTranslateY = useRef(new Animated.Value(30)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;

  const subtitleTranslateY = useRef(new Animated.Value(30)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;

  const containerTranslateY = useRef(new Animated.Value(0)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;

  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    // CEPAT: Muncul
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(150),
      Animated.parallel([
        Animated.timing(titleTranslateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(subtitleTranslateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Tampilkan loading setelah semua elemen muncul
      setShowLoading(true);

      // Delay sebentar sebelum FADE OUT (keluar pelan)
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(containerOpacity, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(containerTranslateY, {
            toValue: -50,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start(() => {
          navigation.replace('Home'); // Ganti ke MainApp setelah animasi selesai
        });
      }, 1200); // tampil loading dulu 1.2 detik
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.absoluteCenter,
          {
            opacity: containerOpacity,
            transform: [{ translateY: containerTranslateY }],
          },
        ]}
      >
        <Animated.Image
          source={require('../../assets/logosplash.png')}
          resizeMode="contain"
          style={{
            width: windowWidth / 1.5,
            height: windowWidth / 1.5,
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          }}
        />

        <Animated.Text
          style={{
            fontSize: 36,
            fontFamily: fonts.primary[700],
            color: colors.secondary,
            marginTop: 20,
            opacity: titleOpacity,
            transform: [{ translateY: titleTranslateY }],
          }}
        >
          MIKACER
        </Animated.Text>

        <Animated.Text
          style={{
            fontSize: 18,
            fontFamily: fonts.primary[500],
            color: colors.secondary,
            marginTop: 8,
            opacity: subtitleOpacity,
            transform: [{ translateY: subtitleTranslateY }],
          }}
        >
          Mini Kasir Cerdas
        </Animated.Text>

        {showLoading && (
          <ActivityIndicator
            style={{ marginTop: 40 }}
            color={colors.secondary}
            size="small"
          />
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  absoluteCenter: {
    position: 'absolute',
    top: windowHeight / 2 - 180,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
