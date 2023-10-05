import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AddEditTask, AddSelectScreen, CreateCompanyScreen} from 'screens';

const Stack = createNativeStackNavigator();
function AddStack() {
  return (
    <Stack.Navigator
      initialRouteName="AddSelectScreen"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="AddSelectScreen" component={AddSelectScreen} />
      <Stack.Screen name="AddEditTask" component={AddEditTask} />
      <Stack.Screen
        name="CreateCompanyScreen"
        component={CreateCompanyScreen}
      />
    </Stack.Navigator>
  );
}

export default AddStack;
