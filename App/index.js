import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import constants from 'expo-constants';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {createStore} from 'redux';
import {Provider} from 'react-redux';
import {reducer} from './reducers/reducer'; 

import Home from './screens/Home';
import CreateEmployee from './screens/CreateEmployee'
import Profile from './screens/Profile'

const Stack = createStackNavigator();
const store = createStore(reducer);

const headerOptions = {
  headerTintColor:"white",
  headerStyle:{
    backgroundColor:"#006aff"
  }
};


function App() {
  return (
    <View style={styles.container}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={{...headerOptions,title:"Home Page"}}/>
        <Stack.Screen name="Create" component={CreateEmployee} options={{...headerOptions,title:"Create Employee"}}/>
        <Stack.Screen name="Profile" component={Profile} options={{...headerOptions,title:"Profile"}}/>
      </Stack.Navigator>
      {/* <Home/> */}
      {/* <CreateEmployee/> */}
      {/* <Profile/> */}
      <StatusBar style="auto" />
    </View>
  );
}

export default ()=>{
  return (
    <Provider store={store}>
      <NavigationContainer>
        <App/>
      </NavigationContainer>
    </Provider> 
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    marginTop:constants.statusBarHeight,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
