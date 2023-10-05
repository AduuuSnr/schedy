import React, {useRef, useEffect, Children} from 'react';
import {Animated} from 'react-native';
import {useDrawerStatus} from '@react-navigation/drawer';

const withSok = (Component, props) => {
  return props => {
    const drawerStatus = useDrawerStatus();
    const scaleRef = useRef(new Animated.Value(0)).current;
    const scale = scaleRef.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.75],
    });
    useEffect(() => {
      if (drawerStatus == 'open') {
        Animated.timing(scaleRef, {
          useNativeDriver: false,
          duration: 250,
          toValue: 1,
        }).start();
      } else {
        Animated.timing(scaleRef, {
          useNativeDriver: false,
          duration: 250,
          toValue: 0,
        }).start();
      }
    }, [drawerStatus]);

    return (
      <Animated.View
        style={{flex: 1, transform: [{scaleX: scale}], paddingTop: 100}}>
        <Component {...props} />
      </Animated.View>
    );
  };
};

export default withSok;
