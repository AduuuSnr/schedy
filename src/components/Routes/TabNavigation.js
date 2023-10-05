import React from 'react';
import {TouchableOpacity, View, StyleSheet, Image, Text} from 'react-native';
import {
  AgendaIcon,
  BusinessIcon,
  Profile,
  TasksIcon,
  AddIcon,
  BottomProfile,
} from 'assets/icons';
import {ww} from 'helpers';
import {UbuntuRegular} from 'assets/fonts';
import {useSelector} from 'react-redux';
import {wh} from 'helpers';

export const CustomTabBarButton = ({children, onPress}) => (
  <TouchableOpacity onPress={onPress} style={[styles.button, styles.shadow]}>
    <View style={styles.buttonInner}>{children}</View>
  </TouchableOpacity>
);

export const AgendaScreenTabBarIcon = ({focused}) => {
  const tintColor = focused ? '#5669FF' : '#748c94';
  const lang = useSelector(state => state.lang);

  return (
    <View style={styles.agendaScreenTabBarIconWrapper}>
      <AgendaIcon color={tintColor} size={ww(0.04)} />
      <Text
        style={{
          color: tintColor,
          fontSize: ww(0.03),
          fontFamily: UbuntuRegular,
        }}>
        {lang.agenda}{' '}
      </Text>
    </View>
  );
};
export const TaskScreenTabBarIcon = ({focused}) => {
  const tintColor = focused ? '#5669FF' : '#748c94';
  const lang = useSelector(state => state.lang);

  return (
    <View style={styles.agendaScreenTabBarIconWrapper}>
      <TasksIcon color={tintColor} size={ww(0.04)} />
      <Text
        style={{
          color: tintColor,
          fontFamily: UbuntuRegular,
          fontSize: ww(0.03),
        }}>
        {lang.tasks}
      </Text>
    </View>
  );
};

export const AddScreenTabBarIcon = () => {
  return (
    <View style={styles.mapScreenTabBarIcon}>
      <AddIcon size={ww(0.1)} />
    </View>
  );
};

export const BusinessScreenTabBarIcon = ({focused}) => {
  const tintColor = focused ? '#5669FF' : '#748c94';
  const lang = useSelector(state => state.lang);
  return (
    <View style={styles.agendaScreenTabBarIconWrapper}>
      <BusinessIcon color={tintColor} size={ww(0.04)} />
      <Text
        style={{
          color: tintColor,
          fontFamily: UbuntuRegular,
          fontSize: ww(0.03),
        }}>
        {lang.business}
      </Text>
    </View>
  );
};

export const ProfileScreenTabBarIcon = ({focused}) => {
  const tintColor = focused ? '#5669FF' : '#748c94';
  const lang = useSelector(state => state.lang);

  return (
    <View style={styles.agendaScreenTabBarIconWrapper}>
      <BottomProfile color={tintColor} size={ww(0.04)} />
      <Text
        style={{
          color: tintColor,
          fontFamily: UbuntuRegular,
          fontSize: ww(0.03),
        }}>
        {lang.profile}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#58563D',
    shadowOffset: {
      width: 1,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  button: {
    top: -30,
    justifyContent: 'center',
    alignItems: 'center',
    width: ww(0.12),
  },
  // buttonInner: {
  //   width: ww(0.03r),
  //   borderRadius: 50,
  //   backgroundColor: '#5669FF',
  // },
  agendaScreenTabBarIconWrapper: {
    alignItems: 'center',
    width: ww(0.15),
    justifyContent: 'center',
  },
  homeScreenTabBarIcon: {
    width: ww(0.032),
    height: wh(0.032),
  },
  mapScreenTabBarIcon: {
    width: ww(0.032),
    height: wh(0.032),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
