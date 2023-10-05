import React from 'react';
import {StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {AddEditTask, CustomAddScreen} from 'screens';
import {
  AgendaScreenTabBarIcon,
  TaskScreenTabBarIcon,
  CustomTabBarButton,
  AddScreenTabBarIcon,
  BusinessScreenTabBarIcon,
  ProfileScreenTabBarIcon,
} from '../components/Routes/TabNavigation';
import {
  AddStack,
  AgendaStack,
  BusinessStack,
  ProfileStack,
  TasksStack,
} from 'routes';
import {useSelector} from 'react-redux';

const Tab = createBottomTabNavigator();

const screenOptions = {
  AgendaScreen: {
    tabBarIcon: AgendaScreenTabBarIcon,
    headerShown: false,
    tabBarShowLabel: false,
  },
  TaskScreen: {
    tabBarIcon: TaskScreenTabBarIcon,
    headerShown: false,
    tabBarShowLabel: false,
  },
  AddScreen: {
    tabBarIcon: AddScreenTabBarIcon,
    tabBarButton: CustomTabBarButton,
    headerShown: false,
    tabBarShowLabel: false,
  },
  BusinessScreen: {
    tabBarIcon: BusinessScreenTabBarIcon,
    headerShown: false,
    tabBarShowLabel: false,
  },
  ProfileScreen: {
    tabBarIcon: ProfileScreenTabBarIcon,
    headerShown: false,
    tabBarShowLabel: false,
  },
};

const TabNavigator = ({route, navigation}) => {
  const tabBarOptions = {
    style: {
      position: 'absolute',
      marginLeft: 20,
      marginRight: 20,
      elevation: 5,
      shadowColor: '#58563D',
      shadowOffset: {
        width: 1,
        height: 5,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.5,
      borderRadius: 15,

      ...styles.shadow,
    },
  };
  const lang = useSelector(state => state.lang);
  return (
    <Tab.Navigator initialRouteName="Agenda" screenOptions={tabBarOptions}>
      <Tab.Screen
        name="Agenda"
        component={AgendaStack}
        options={screenOptions.AgendaScreen}
      />
      <Tab.Screen
        name="Tasks"
        component={TasksStack}
        options={screenOptions.TaskScreen}
      />
      <Tab.Screen
        name="Add"
        component={AddStack}
        options={screenOptions.AddScreen}
      />
      <Tab.Screen
        name="Business"
        component={BusinessStack}
        options={screenOptions.BusinessScreen}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={screenOptions.ProfileScreen}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#58563D',
    shadowOffset: {
      width: 1,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});

export default TabNavigator;
