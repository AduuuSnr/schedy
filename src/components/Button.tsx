import {MainBlue, White} from '@constants/colors';
import {UbuntuMedium} from 'assets/fonts';
import {ArrowRight} from 'assets/icons';
import {wh, ww} from 'helpers';
import React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

interface ButtonProps {
  style?: ViewStyle;
  textStyle?: TextStyle;
  title: string;
  onPress: () => void;
  arrow?: boolean;
}

const Button = ({style, textStyle, title, onPress, arrow}: ButtonProps) => {
  const buttonStyle = [styles.button, style];
  const txtStyle = [styles.text, textStyle];

  return (
    <TouchableOpacity activeOpacity={0.9} style={buttonStyle} onPress={onPress}>
      <Text style={txtStyle}> {title} </Text>
      {arrow && (
        <View style={styles.absoluteArrow}>
          <ArrowRight size={ww(0.07)} />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    width: ww(0.63),
    height: wh(0.07),
    borderRadius: ww(0.03),
    backgroundColor: MainBlue,
    justifyContent: 'center',
    alignItems: 'center',
    // elevation: 5,
    // shadowColor: '#58563D',
    // shadowOffset: {
    //   width: 1,
    //   height: 10,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.5,
  },
  text: {
    fontSize: ww(0.036),
    lineHeight: ww(0.036),
    color: White,
    letterSpacing: ww(0.003),
    textTransform: 'uppercase',
    fontFamily: UbuntuMedium,
  },
  absoluteArrow: {
    position: 'absolute',
    right: ww(0.04),
  },
});
