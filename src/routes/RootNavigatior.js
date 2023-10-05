import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {LoginStack} from 'routes';
import {useSelector} from 'react-redux';
import DrawerNavigator from './DrawerNavigator';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CameraChatScreen, ChatScreen, VoiceCallChat} from 'screens';
// import HomeScreen from 'screens/HomeScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const user = useSelector(state => state.app.user);

  const config = {
    screens: {
      ChatStack: {
        path: 'chat/:id?',
        parse: {
          id: id => `${id}`,
        },
      },
    },
  };

  const linking = {
    prefixes: ['https://businessagenda.org', 'businessagenda://app'],
    config,
  };

  return (
    <NavigationContainer linking={linking}>
      {!user ? (
        <LoginStack />
      ) : (
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Home" component={DrawerNavigator} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
          <Stack.Screen name="CameraChatScreen" component={CameraChatScreen} />
          <Stack.Screen name="VoiceCallChat" component={VoiceCallChat} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;
