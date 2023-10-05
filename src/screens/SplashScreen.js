import React, {useEffect} from 'react';
import {StyleSheet, Image, ImageBackground} from 'react-native';

const SplashScreen = () => {
  return (
    <ImageBackground
      style={styles.container}
      source={require('../assets/images/splash.png')}>
      <Image source={require('../assets/images/splashLogo.png')} />
    </ImageBackground>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
