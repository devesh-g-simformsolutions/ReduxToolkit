import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {Provider} from 'react-redux';
import store from './redux/store';
import ContactScreen from './Screens/ContactScreen';
import DetailScreen from './Screens/DetailScreen';

const requestContactReadPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        title: 'Contact App contacts Permission',
        message: 'Contact App needs access to your contacts ',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the contacts');
    } else {
      console.log('contacts permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};
const requestCallPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CALL_PHONE,
      {
        title: 'Contact App call Permission',
        message: 'Contact App needs access to your calling ',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the contacts');
    } else {
      console.log('contacts permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};
const requestContactWritePermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
      {
        title: 'Contact App contacts Permission',
        message: 'Contact App needs access to your contacts ',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the contacts');
    } else {
      console.log('contacts permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};

const Stack = createNativeStackNavigator();

const App = () => {
  if (Platform.OS === 'android') {
    requestContactReadPermission();
    requestContactWritePermission();
    requestCallPermission();
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="ContactScreen">
          <Stack.Screen
            name="ContactScreen"
            component={ContactScreen as any}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="DetailScreen"
            component={DetailScreen}
            options={{
              headerBackTitle: 'Back',
              headerTintColor: 'white',
              headerStyle: {backgroundColor: '#1a1b1e'},
              title: 'Contact Details',
              headerTitleStyle: {
                color: 'white',
                fontWeight: '800',
                fontSize: 20,
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
