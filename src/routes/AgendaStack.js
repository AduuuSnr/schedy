import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  TaskPreview,
  AddEditTask,
  AgendaScreen,
  NotificationsScreen,
  AddComment,
  TaskComments,
  CommentDetail,
} from 'screens';

const Stack = createNativeStackNavigator();

function AgendaStack() {
  return (
    <Stack.Navigator
      initialRouteName="AgendaScreen"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="AgendaScreen" component={AgendaScreen} />
      <Stack.Screen name="TaskPreview" component={TaskPreview} />
      <Stack.Screen name="AddEditTask" component={AddEditTask} />
      <Stack.Screen name="TaskComments" component={TaskComments} />
      <Stack.Screen name="CommentDetail" component={CommentDetail} />
      <Stack.Screen name="AddComment" component={AddComment} />
      <Stack.Screen
        name="NotificationsScreen"
        component={NotificationsScreen}
      />
    </Stack.Navigator>
  );
}

export default AgendaStack;
