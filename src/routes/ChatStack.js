import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  CameraChatScreen,
  ChatScreen,
  MessagesScreen,
  NewChatCreate,
  VoiceCallChat,
} from 'screens';

const Stack = createNativeStackNavigator();
function ChatStack({route}) {
  return (
    <Stack.Navigator
      initialRouteName="MessagesScreen"
      screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="MessagesScreen"
        component={MessagesScreen}
        initialParams={route?.params?.id}
      />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="CameraChatScreen" component={CameraChatScreen} />
      <Stack.Screen name="NewChatCreate" component={NewChatCreate} />
      <Stack.Screen name="VoiceCallChat" component={VoiceCallChat} />
    </Stack.Navigator>
  );
}

export default ChatStack;
