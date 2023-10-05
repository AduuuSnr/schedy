import {White} from '@constants/colors';
import {UbuntuBold} from 'assets/fonts';
import {GoBack} from 'assets/icons';
import {wh} from 'helpers';
import {ww} from 'helpers';
import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

interface Props {
  title: string;
  onPress: () => any;
}

const ArrowHeader = ({title, onPress}: Props) => {
  return (
    <View style={styles.header}>
      <Pressable style={styles.pressable} onPress={onPress}>
        <GoBack size={ww(0.05)} />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

export default ArrowHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: ww(0.1),
    marginVertical: wh(0.025),
    width: '100%',
    backgroundColor: White,
  },
  title: {
    fontFamily: UbuntuBold,
    fontSize: ww(0.06),
    marginLeft: ww(0.04),
  },
  pressable: {
    width: ww(0.06),
    height: ww(0.06),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
