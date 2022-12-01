import React from 'react';
import {PermissionsAndroid, SafeAreaView} from 'react-native';
import TodoScreen from './Screens/Todo';
import store from './redux/store';
import {Provider} from 'react-redux';

const requestContactReadPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        title: 'Redux Toolkit App contacts Permission',
        message: 'Redux Toolkit App needs access to your contacts ',
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
        title: 'Redux Toolkit App contacts Permission',
        message: 'Redux Toolkit App needs access to your contacts ',
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

const App = () => {
  const RootApp = () => {
    requestContactReadPermission();
    requestContactWritePermission();
    return (
      <SafeAreaView>
        <TodoScreen />
      </SafeAreaView>
    );
  };

  return (
    <Provider store={store}>
      <RootApp />
    </Provider>
  );
};

export default App;
