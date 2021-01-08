import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../pages/Login';
import Forgot from '../pages/Forgot';
import DrawNavigator from './DrawNavigator';

const Stack = createStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Forgot"
        component={Forgot}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Home"
        component={DrawNavigator}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
