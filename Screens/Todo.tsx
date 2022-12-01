/* eslint-disable react-native/no-inline-styles */
import {
  View,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import {useSelector} from 'react-redux';
import // addTask,
// deleteTask,
// updateName,
// updateNumber,
'../redux/taskSlice';
// import {nanoid} from '@reduxjs/toolkit';
// import ReactNativeModuleAddContact from '../ReactNativeModuleAddContact';
import {NativeModules} from 'react-native';
import ReactNativeModuleContacts from '../ReactNativeModuleContacts';

const Todo = () => {
  // const dispatch = useDispatch();

  // const onSubmitTask = () => {
  //   if (myName.trim().length === 0) {
  //     console.log('please enter a task');
  //     setMyName('');
  //     return;
  //   }

  //   dispatch(
  //     addTask({
  //       id: nanoid(),
  //       name: myName,
  //       number: myNumber,
  //     }),
  //   );

  //   setMyName('');
  //   setIsContactVisible(false);
  // };

  // const onUpdateName = (id: string) => {
  //   setEditableInput(true);

  //   if (myName.trim().length === 0 && myNumber.trim().length === 0) {
  //     setEditableInput(false);
  //     return;
  //   }
  //   dispatch(
  //     updateName({
  //       id: id,
  //       name: editedContactName,
  //     }),
  //   );
  //   setEditableInput(false);
  // };
  // const onUpdateNumber = (id: string) => {
  //   setEditableInput(true);
  //   if (myName.trim().length === 0 && myNumber.trim().length === 0) {
  //     setEditableInput(false);
  //     return;
  //   }
  //   dispatch(
  //     updateNumber({
  //       id: id,
  //       number: editedContactNumber,
  //     }),
  //   );
  //   setEditableInput(false);
  // };

  // const itemDelete = (id: string) => {
  //   dispatch(deleteTask({id: id}));
  // };

  const [myName, setMyName] = React.useState('');
  const [myUpdatedName, setMyUpdatedName] = React.useState('');
  const [myNumber, setMyNumber] = React.useState('');
  const [myUpdatedNumber, setMyUpdateNumber] = React.useState('');
  // const [editedContactName, setEditedContactName] = React.useState('');
  // const [editedContactNumber, setEditedContactNumber] = React.useState('');
  // const [editableInput, setEditableInput] = React.useState(false);
  const [isAddContactVisible, setIsContactVisible] = React.useState(false);
  const [isAddContactUpdateVisible, setIsContactUpdateVisible] =
    React.useState(false);
  const [contactsFromIos, setContactFromIos] = React.useState([]);

  const contacts = useSelector((state: any) => state.tasks);

  const ContactHeader = () => {
    return (
      <View
        style={{
          backgroundColor: '#ff4081',
          width: '100%',
          height: 50,
          justifyContent: 'space-between',
          flexDirection: 'row',
          paddingHorizontal: 10,
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontWeight: '600',
            fontSize: 20,
            color: 'white',
          }}>
          Contact List
        </Text>
      </View>
    );
  };

  // const [selectedId, setSelectedId] = React.useState(null);

  const onPressAddContactAndroid = () => {
    NativeModules.AddContact.addContact();
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
    ReactNativeModuleContacts.editContact();
  };

  const updateIosContactList = () => {
    NativeModules?.EditContacts?.fetchContacts(
      (value: any) => setContactFromIos(value), ///here need to be add reload
    );
  };

  React.useEffect(() => {
    updateIosContactList();
  }, [myName, myNumber]);

  const reanderItem = ({item}: any) => {
    // const onPress = () => {
    //   setSelectedId(item.id);
    //   setEditableInput(true);
    // };
    return (
      <View
        style={{
          flexDirection: 'column',
        }}>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 20,
            paddingVertical: 10,
            borderBottomWidth: 1,
          }}>
          <View>
            <TextInput
              style={{width: '100%', fontWeight: '900', fontSize: 20}}
              defaultValue={item?.name}
              editable={false}
              // onSubmitEditing={() => onUpdateName(item.id)}
              // onChangeText={text => setEditedContactName(text)}
            />
            <TextInput
              style={{width: '100%', fontWeight: '600', fontSize: 20}}
              defaultValue={item?.number}
              editable={false}
              // onSubmitEditing={() => onUpdateNumber(item.id)}
              // onChangeText={text => setEditedContactNumber(text)}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() =>
                NativeModules?.EditContacts?.deleteContacts(
                  item?.name,
                  (value: any) => {
                    if (value) {
                      console.log('DELTED');
                      updateIosContactList();
                    } else {
                      console.log('NOT DELETED');
                      updateIosContactList();
                    }
                  },
                )
              }>
              <Icon name="delete" size={30} color="#ff4081" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{height: '100%'}}>
      <View>
        <ContactHeader />

        <View
          style={{
            flexDirection: 'row',
            borderWidth: 2,
            alignItems: 'center',
            alignSelf: 'center',
            alignContent: 'space-between',
            justifyContent: 'space-between',
            marginTop: 20,
            marginBottom: 20,
            borderRadius: 10,
            backgroundColor: '#ff4081',
            shadowOpacity: 0.5,
            shadowRadius: 4,
            height: 40,
          }}>
          <TouchableOpacity
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
            style={{paddingHorizontal: 20}}
            activeOpacity={0.5}
            onPress={() => {
              Platform.OS === 'ios'
                ? onPressAddButtonIos()
                : onPressAddContactAndroid();
            }}
            //edit this accouding to need of update and add
          >
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
              style={{
                borderColor: 'black',
                borderBottomWidth: 2,
                borderRadius: 10,
                margin: 20,
                marginBottom: 0,
                paddingHorizontal: 20,
                paddingBottom: 10,
                fontWeight: '800',
                fontSize: 20,
              }}
            />
            <TextInput
              value={myNumber}
              keyboardType={'number-pad'}
              placeholder={'New Contact Number'}
              onChangeText={text => {
                setMyNumber(text);
              }}
              style={{
                borderColor: 'black',
                borderBottomWidth: 2,
                borderRadius: 10,
                margin: 20,
                paddingHorizontal: 20,
                paddingBottom: 10,
                fontWeight: '800',
                fontSize: 20,
              }}
            />
            <View style={{padding: 20}}>
              <Button
                color={'#ff4081'}
                title={'Add Contact'}
                // onPress={onSubmitTask}
                onPress={() => {
                  NativeModules.EditContacts.addUserToContact(
                    myName.length === 0 ? 'No name' : myName,
                    myNumber.length === 0 ? 'No Number' : myNumber,
                    (value: any) => {
                      if (value) {
                        console.log('User Added Successfully');
                        updateIosContactList();
                      } else {
                        console.log('User Not Added');
                        updateIosContactList();
                      }
                    },
                  );
                }}
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
              style={{
                borderColor: 'black',
                borderBottomWidth: 2,
                borderRadius: 10,
                margin: 20,
                marginBottom: 0,
                paddingHorizontal: 20,
                paddingBottom: 10,
                fontWeight: '800',
                fontSize: 20,
              }}
            />
            <TextInput
              value={myUpdatedNumber}
              keyboardType={'number-pad'}
              placeholder={'Add new Contact Number'}
              onChangeText={text => {
                setMyUpdateNumber(text);
              }}
              style={{
                borderColor: 'black',
                borderBottomWidth: 2,
                borderRadius: 10,
                margin: 20,
                paddingHorizontal: 20,
                paddingBottom: 10,
                fontWeight: '800',
                fontSize: 20,
              }}
            />
            <View style={{padding: 20}}>
              <Button
                color={'#ff4081'}
                title={'Update Contact'}
                // onPress={onSubmitTask}
                onPress={() => {
                  NativeModules.EditContacts.updateContacts(
                    myUpdatedName.length === 0 ? 'No name' : myUpdatedName,
                    myUpdatedNumber.length === 0
                      ? 'No Number'
                      : myUpdatedNumber,
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
                }}
              />
            </View>
          </>
        )}
        {contactsFromIos.length === 0 && (
          <Text
            style={{
              alignSelf: 'center',
              fontWeight: '600',
              fontSize: 20,
              paddingTop: 20,
            }}>
            Empty! Add Contact first
          </Text>
        )}
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={Platform.OS === 'ios' ? contactsFromIos : contacts}
        renderItem={reanderItem}
        keyExtractor={(_item, index) => String(index)}
        // extraData={selectedId}
      />
    </View>
  );
};

export default Todo;
