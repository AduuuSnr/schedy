import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  CameraChatScreen,
  ChatScreen,
  MessagesScreen,
  ProfileScreen,
  SettingsScreen,
} from 'screens';

const Stack = createNativeStackNavigator();
function ProfileStack() {
  return (
    <Stack.Navigator
      initialRouteName="ProfileScreen"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

export default ProfileStack;
