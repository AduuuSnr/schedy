import {UbuntuBold} from 'assets/fonts';
import {BlueNotification, Hamburger, Notification} from 'assets/icons';
import {wh, ww} from 'helpers';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

interface HeaderProps {
  title: string;
  iconName: '';
  onPress: () => {};
  navigation: any;
}

const HeaderHamburger = ({title, onPress, navigation}: HeaderProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.pressView}
        activeOpacity={0.7}
        onPress={onPress}>
        <Hamburger size={ww(0.06)} />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

export default HeaderHamburger;

const styles = StyleSheet.create({
  container: {
    height: wh(0.08),
    zIndex: 99,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  title: {
    fontFamily: UbuntuBold,
    fontSize: ww(0.06),
    marginLeft: ww(0.05),
    flex: 3,
  },
  pressView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: ww(0.2),
    height: wh(0.08),
  },
});
