import React, {SetStateAction} from 'react';
import {
  Button,
  FlatList,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {NativeModules} from 'react-native';
import styles from './todoScreenStyle';

const Todo = () => {
  const [myName, setMyName] = React.useState('');
  const [myUpdatedName, setMyUpdatedName] = React.useState('');
  const [myNumber, setMyNumber] = React.useState('');
  const [myUpdatedNumber, setMyUpdateNumber] = React.useState('');
  const [isAddContactVisible, setIsContactVisible] = React.useState(false);
  const [isAddContactUpdateVisible, setIsContactUpdateVisible] =
    React.useState(false);
  const [contactsFromIos, setContactFromIos] = React.useState([]);
  const [contactsFromAndroid, setContactFromAndroid] = React.useState({});

  React.useEffect(() => {
    updateAndroidContactList();
    updateIosContactList();
  }, [myName, myNumber, myUpdatedName, myUpdatedNumber]);

  const ContactHeader = () => {
    return (
      <View style={styles.contentHeaderContainer}>
        <Text style={styles.contactHeaderTextStyle}>Contact List</Text>
      </View>
    );
  };

  const onPressAddContactAndroid = () => {
    if (isAddContactVisible) {
      setIsContactVisible(false);
    } else {
      setIsContactVisible(true);
    }

    if (isAddContactUpdateVisible) {
      setIsContactUpdateVisible(false);
    }
  };

  const onPressAddButtonIos = () => {
    if (isAddContactVisible) {
      setIsContactVisible(false);
    } else {
      setIsContactVisible(true);
    }

    if (isAddContactUpdateVisible) {
      setIsContactUpdateVisible(false);
    }
  };

  const onPressUpdateButtonIos = () => {
    if (isAddContactUpdateVisible) {
      setIsContactUpdateVisible(false);
    } else {
      setIsContactUpdateVisible(true);
    }

    if (isAddContactVisible) {
      setIsContactVisible(false);
    }
  };

  const onPressUpdateContactAndroid = () => {
    if (isAddContactUpdateVisible) {
      setIsContactUpdateVisible(false);
    } else {
      setIsContactUpdateVisible(true);
    }

    if (isAddContactVisible) {
      setIsContactVisible(false);
    }
  };

  const updateIosContactList = () => {
    NativeModules?.EditContacts?.fetchContacts(
      (value: SetStateAction<never[]>) => setContactFromIos(value),
    );
  };

  const updateAndroidContactList = () => {
    NativeModules?.FetchContacts?.fetchContactsAndroid(
      (value: SetStateAction<never[]>) => {
        setContactFromAndroid(value);
      },
    );
  };

  const reanderItem = ({item}: any) => {
    const ContactData = Platform.OS === 'android' && JSON.parse(item);

    const onPressDeleteAndroid = () => {
      if (Platform.OS === 'android') {
        let contactShare = {
          name: ContactData.name,
          mobile: ContactData.mobile,
        };
        NativeModules.FetchContacts.buttonDeletecontact(contactShare);
      }
      updateAndroidContactList();
    };

    const onPressDeleteButton = () => {
      if (Platform.OS === 'android') {
        onPressDeleteAndroid();
      } else {
        NativeModules?.EditContacts?.deleteContacts(item?.name, (value: []) => {
          if (value) {
            console.log('DELTED');
            updateIosContactList();
          } else {
            console.log('NOT DELETED');
            updateIosContactList();
          }
        });
      }
    };

    return (
      <View style={styles.renderItemContainerStyle}>
        <View style={styles.renderItemTopViewStyle}>
          <View pointerEvents="none">
            <TextInput
              style={styles.renderItemNameInputStyle}
              defaultValue={
                Platform.OS === 'ios' ? item?.name : ContactData.name
              }
            />
            <TextInput
              // eslint-disable-next-line react-native/no-inline-styles
              style={[styles.renderItemNameInputStyle, {fontWeight: '600'}]}
              defaultValue={
                Platform.OS === 'ios' ? item?.number : ContactData.mobile
              }
            />
          </View>
          <View>
            <TouchableOpacity
              onPress={() => {
                onPressDeleteButton();
              }}>
              <Icon name="delete" size={30} color="#ff4081" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const OnPressAndroidAddContact = () => {
    if (Platform.OS === 'android') {
      let contactShare = {
        name: myName.length === 0 ? 'No Name' : myName,
        mobile: myNumber.length === 0 ? 'No Number' : myNumber,
      };
      NativeModules.FetchContacts.buttonAddContact(contactShare);
    }
  };

  const OnPressAndroidUpdateContact = () => {
    if (Platform.OS === 'android') {
      let updateContactShare = {
        name: myUpdatedName.length === 0 ? 'No Name' : myUpdatedName,
        mobile: myUpdatedNumber.length === 0 ? 'No Number' : myUpdatedNumber,
      };
      NativeModules.FetchContacts.buttonUpdateContact(updateContactShare);
    }
    updateAndroidContactList();
  };

  const onPressAddContactButton = () => {
    if (Platform.OS === 'android') {
      OnPressAndroidAddContact();
      updateAndroidContactList();
    } else {
      NativeModules.EditContacts.addUserToContact(
        myName.length === 0 ? 'No name' : myName,
        myNumber.length === 0 ? 'No Number' : myNumber,
        (value: []) => {
          if (value) {
            console.log('User Added Successfully');
            updateIosContactList();
          } else {
            console.log('User Not Added');
            updateIosContactList();
          }
        },
      );
    }
  };

  const onPresUpdateContactButton = () => {
    if (Platform.OS === 'android') {
      OnPressAndroidUpdateContact();
    } else {
      NativeModules.EditContacts.updateContacts(
        myUpdatedName.length === 0 ? 'No name' : myUpdatedName,
        myUpdatedNumber.length === 0 ? 'No Number' : myUpdatedNumber,
        (value: boolean) => {
          if (value) {
            console.log('User Updated Successfully');
            updateIosContactList();
          } else {
            console.log('User Not UPdated');
            updateIosContactList();
          }
        },
      );
    }
  };

  return (
    <View style={styles.topViewStyles}>
      <View>
        <ContactHeader />
        <View style={styles.topButtonsEditAdd}>
          <TouchableOpacity
            // eslint-disable-next-line react-native/no-inline-styles
            style={{paddingHorizontal: 20}}
            activeOpacity={0.5}
            onPress={() => {
              Platform.OS === 'ios'
                ? onPressUpdateButtonIos()
                : onPressUpdateContactAndroid();
            }}>
            <Icon name="edit" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            // eslint-disable-next-line react-native/no-inline-styles
            style={{paddingHorizontal: 20}}
            activeOpacity={0.5}
            onPress={() => {
              Platform.OS === 'ios'
                ? onPressAddButtonIos()
                : onPressAddContactAndroid();
            }}>
            <Icon name="adduser" size={30} color="white" />
          </TouchableOpacity>
        </View>

        {isAddContactVisible && (
          <>
            <TextInput
              value={myName}
              placeholder={'New Contact Name'}
              onChangeText={text => {
                setMyName(text);
              }}
              style={styles.addContactTextInputStyles}
            />
            <TextInput
              value={myNumber}
              keyboardType={'number-pad'}
              placeholder={'New Contact Number'}
              onChangeText={text => {
                setMyNumber(text);
              }}
              style={styles.addContactTextInputNumberStyle}
            />
            <View style={styles.buttonStyleAddContactUpdateContact}>
              <Button
                color={'#ff4081'}
                title={'Add Contact'}
                onPress={() => onPressAddContactButton()}
              />
            </View>
          </>
        )}
        {isAddContactUpdateVisible && (
          <>
            <TextInput
              value={myUpdatedName}
              placeholder={'Contact Name'}
              onChangeText={text => {
                setMyUpdatedName(text);
              }}
              style={styles.addContactTextInputStyles}
            />
            <TextInput
              value={myUpdatedNumber}
              keyboardType={'number-pad'}
              placeholder={'Add new Contact Number'}
              onChangeText={text => {
                setMyUpdateNumber(text);
              }}
              style={styles.addContactTextInputNumberStyle}
            />
            <View style={styles.buttonStyleAddContactUpdateContact}>
              <Button
                color={'#ff4081'}
                title={'Update Contact'}
                onPress={() => {
                  onPresUpdateContactButton();
                }}
              />
            </View>
          </>
        )}
        {(Platform.OS === 'ios'
          ? contactsFromIos.length === 0
            ? true
            : false
          : Object.keys(contactsFromAndroid).length === 0) && (
          <Text style={styles.textStyleEmptyContact}>
            Empty! Add Contact first
          </Text>
        )}
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={
          Platform.OS === 'ios' ? contactsFromIos : (contactsFromAndroid as [])
        }
        renderItem={reanderItem}
        keyExtractor={(_item, index) => String(index)}
      />
    </View>
  );
};

export default Todo;
