import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {White} from '@constants/colors';
import {BackIcon, Settings} from 'assets/icons';
import {ww, wh} from 'helpers';

const HeaderBack = ({onPress, onSettingsPress, showTrash, trashFunc}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.backIcon}
        onPress={onPress}>
        <BackIcon />
      </TouchableOpacity>

      <View style={{justifyContent: 'flex-end', flexDirection: 'row'}}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.settingsView, {marginRight: ww(0.02)}]}
          onPress={onSettingsPress}>
          <Settings color={White} />
        </TouchableOpacity>
        {showTrash && (
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.settingsView}
            onPress={trashFunc}>
            <Image source={require('assets/icons/trash.png')} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default HeaderBack;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    zIndex: 99,
    top: wh(0.05),
    alignItems: 'center',
    width: ww(1),
  },
  backIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#979797',
    width: ww(0.09),
    height: wh(0.04),
    borderRadius: 10,
    left: ww(0.05),
  },
  settingsView: {
    backgroundColor: '#979797',
    justifyContent: 'center',
    alignItems: 'center',
    width: ww(0.09),
    height: wh(0.04),
    borderRadius: 10,
    right: ww(0.05),
  },
});
