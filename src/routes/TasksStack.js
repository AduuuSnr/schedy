import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  AddComment,
  AddEditTask,
  NotificationsScreen,
  TaskPreview,
  TasksScreen,
  CommentDetail,
} from 'screens';

const Stack = createNativeStackNavigator();

function TasksStack() {
  return (
    <Stack.Navigator
      initialRouteName="TasksScreen"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="TasksScreen" component={TasksScreen} />
      <Stack.Screen name="TaskPreview" component={TaskPreview} />
      <Stack.Screen name="AddEditTask" component={AddEditTask} />
      <Stack.Screen name="AddComment" component={AddComment} />
      <Stack.Screen name="CommentDetail" component={CommentDetail} />
      <Stack.Screen
        name="NotificationsScreen"
        component={NotificationsScreen}
      />
    </Stack.Navigator>
  );
}

export default TasksStack;
