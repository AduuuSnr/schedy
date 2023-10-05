import {LightBlue} from '@constants/colors';
import {SearchIcon} from 'assets/icons';
import {wh, ww} from 'helpers';
import React, {useRef} from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  ViewStyle,
} from 'react-native';

interface SearchbarProps {
  containerStyle?: ViewStyle;
  value: string;
  onChangeText: (text: string) => void;
  onSubmitEditing: (text: string) => any;
}

const Searchbar = ({
  containerStyle,
  value,
  onChangeText,
  onSubmitEditing,
}: SearchbarProps) => {
  const inputRef = useRef<TextInput>();
  return (
    <Pressable
      style={[styles.outerView, containerStyle]}
      onPress={() => inputRef?.current?.focus()}>
      <TextInput
        ref={inputRef}
        placeholder="Search"
        style={{
          fontSize: ww(0.04),
          color: '#8193AE',
        }}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
      />
      <SearchIcon size={ww(0.04)} color="#5669FF" />
    </Pressable>
  );
};

export default Searchbar;

const styles = StyleSheet.create({
  outerView: {
    flexDirection: 'row',
    width: ww(0.5),
    height: Platform.OS === 'android' ? wh(0.07) : wh(0.06),
    borderRadius: ww(0.05),
    backgroundColor: LightBlue,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ww(0.07),
  },
});
