import {ErrorRed, LightGray, White} from '@constants/colors';
import {UbuntuRegular} from 'assets/fonts';
import {HiddenEye, Lock, Mail, OpenEye, Profile} from 'assets/icons';
import {wh, ww} from 'helpers';
import React, {useEffect, useRef, useState} from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

interface LoginInputProps {
  value: string;
  error: boolean;
  onChangeText: () => {};
  containerStyle: ViewStyle;
  iconName: 'profile' | 'mail' | 'lock';
  placeholder: string;
  onSubmitEditing: () => any;
}

const LoginInput = ({
  value,
  error,
  onChangeText,
  containerStyle,
  iconName,
  placeholder,
  onSubmitEditing,
}: LoginInputProps) => {
  const inputRef = useRef<TextInput>();
  const cntStyle = [
    styles.outerView,
    containerStyle,
    {borderColor: error ? ErrorRed : styles.outerView.borderColor},
  ];

  const tinStyle = [
    styles.textInput,
    {color: error ? ErrorRed : styles.textInput.color},
  ];
  const [showPassword, setShowPassword] = useState(false);
  let svgIcon;
  switch (iconName) {
    case 'profile':
      svgIcon = <Profile color={error && ErrorRed} size={ww(0.045)} />;
      break;
    case 'mail':
      svgIcon = <Mail color={error && ErrorRed} size={ww(0.045)} />;
      break;
    case 'lock':
      svgIcon = <Lock color={error && ErrorRed} size={ww(0.045)} />;
      break;

    default:
  }

  return (
    <Pressable onPress={() => inputRef?.current?.focus()} style={cntStyle}>
      <View style={styles.innerView}>
        {iconName && svgIcon}
        <TextInput
          ref={inputRef}
          value={value}
          style={tinStyle}
          autoCapitalize={'none'}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={error ? ErrorRed : LightGray}
          secureTextEntry={iconName === 'lock' && !showPassword}
          onSubmitEditing={onSubmitEditing}
        />
        {iconName === 'lock' && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}>
            {!showPassword ? (
              <HiddenEye size={ww(0.043)} color={error && ErrorRed} />
            ) : (
              <OpenEye size={ww(0.043)} color={error && ErrorRed} />
            )}
          </TouchableOpacity>
        )}
      </View>
    </Pressable>
  );
};

export default LoginInput;

const styles = StyleSheet.create({
  outerView: {
    borderWidth: 1,
    borderColor: '#E4DFDF',
    borderRadius: ww(0.02),
    backgroundColor: White,
    elevation: 3,
    shadowColor: '#58563D',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    width: ww(0.8),
    height: wh(0.065),
    marginVertical: 10,
  },
  innerView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    marginHorizontal: ww(0.03),
  },
  textInput: {
    fontFamily: UbuntuRegular,
    fontSize: ww(0.03),
    marginLeft: ww(0.02),
    color: LightGray,
    width: '70%',
    paddingLeft: ww(0.02),
  },
  eyeIcon: {position: 'absolute', right: ww(0.1)},
});
