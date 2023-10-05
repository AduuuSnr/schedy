import React from 'react';
import {StyleSheet, Text, View, TextInput, ViewStyle} from 'react-native';
import {Black, LightGray} from '@constants/colors';
import {
  Description,
  EndDate,
  InputLocation,
  Location,
  Picture,
  Profile,
  StartDate,
  Title,
} from 'assets/icons';
import {wh, ww} from 'helpers';

interface InputProps {
  value: string;
  title: string;
  iconName:
    | 'title'
    | 'start-date'
    | 'end-date'
    | 'description'
    | 'location'
    | 'profile'
    | 'picture';
  onChangeText: (string) => void;
  containerStyle?: ViewStyle;
  multiline?: boolean;
  error: boolean;
  disabled: boolean;
}

const Input = ({
  title,
  iconName,
  value,
  onChangeText,
  containerStyle,
  multiline,
  error,
  disabled,
}: InputProps) => {
  let svgIcon;
  switch (iconName) {
    case 'title':
      svgIcon = <Title size={ww(0.04)} />;
      break;
    case 'start-date':
      svgIcon = <StartDate size={ww(0.04)} />;
      break;
    case 'end-date':
      svgIcon = <EndDate size={ww(0.04)} />;
      break;
    case 'description':
      svgIcon = <Description size={ww(0.04)} />;
      break;
    case 'location':
      svgIcon = <InputLocation size={ww(0.05)} />;
      break;
    case 'profile':
      svgIcon = <Profile size={ww(0.04)} />;
      break;
    case 'picture':
      svgIcon = <Picture size={ww(0.04)} />;
      break;
    default:
  }

  const titleStyle = [
    styles.titleText,
    {color: error ? 'red' : styles.titleText.color},
  ];

  const inputStyle = [
    styles.input,
    {borderColor: error ? 'red' : styles.input.borderColor},
  ];

  return (
    <View style={containerStyle}>
      <View style={styles.topSide}>
        {iconName && svgIcon}
        <Text style={titleStyle}>{title}</Text>
      </View>
      <TextInput
        editable={!disabled}
        style={inputStyle}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    fontSize: ww(0.04),
    paddingLeft: ww(0.04),
    marginVertical: wh(0.02),
    borderColor: Black,
  },
  topSide: {
    flexDirection: 'row',
  },
  titleText: {
    color: LightGray,
    fontSize: ww(0.03),
    marginLeft: ww(0.03),
  },
});
