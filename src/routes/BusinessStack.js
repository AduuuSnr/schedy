import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  BusinessesScreen,
  CompanyScreen,
  GroupsScreen,
  MapsScreen,
  TaskPreview,
  AddEditTask,
  CreateCompanyScreen,
  AddGroupScreen,
  NotificationsScreen,
  AddComment,
  SeeAllWorkers,
  EditUserAuth,
  CommentDetail,
} from 'screens';

const Stack = createNativeStackNavigator();
function BusinessStack() {
  return (
    <Stack.Navigator
      initialRouteName="BusinessScreen"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="BusinessesScreen" component={BusinessesScreen} />
      <Stack.Screen name="CompanyScreen" component={CompanyScreen} />
      <Stack.Screen name="GroupsScreen" component={GroupsScreen} />
      <Stack.Screen name="MapsScreen" component={MapsScreen} />
      <Stack.Screen name="TaskPreview" component={TaskPreview} />
      <Stack.Screen name="AddEditTask" component={AddEditTask} />
      <Stack.Screen name="AddGroupScreen" component={AddGroupScreen} />
      <Stack.Screen name="CommentDetail" component={CommentDetail} />
      <Stack.Screen name="AddComment" component={AddComment} />
      <Stack.Screen name="EditUserAuth" component={EditUserAuth} />
      <Stack.Screen name="SeeAllWorkers" component={SeeAllWorkers} />
      <Stack.Screen
        name="NotificationsScreen"
        component={NotificationsScreen}
      />
      <Stack.Screen
        name="CreateCompanyScreen"
        component={CreateCompanyScreen}
      />
    </Stack.Navigator>
  );
}

export default BusinessStack;
