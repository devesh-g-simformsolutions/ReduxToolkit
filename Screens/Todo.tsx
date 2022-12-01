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
import {useDispatch, useSelector} from 'react-redux';
import {
  // addTask,
  // deleteTask,
  updateName,
  updateNumber,
} from '../redux/taskSlice';
// import {nanoid} from '@reduxjs/toolkit';
// import ReactNativeModuleAddContact from '../ReactNativeModuleAddContact';
import {NativeModules} from 'react-native';
import ReactNativeModuleContacts from '../ReactNativeModuleContacts';

const Todo = () => {
  const dispatch = useDispatch();

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

  const onUpdateName = (id: string) => {
    setEditableInput(true);

    if (myName.trim().length === 0 && myNumber.trim().length === 0) {
      setEditableInput(false);
      return;
    }
    dispatch(
      updateName({
        id: id,
        name: editedContactName,
      }),
    );
    setEditableInput(false);
  };
  const onUpdateNumber = (id: string) => {
    setEditableInput(true);
    if (myName.trim().length === 0 && myNumber.trim().length === 0) {
      setEditableInput(false);
      return;
    }
    dispatch(
      updateNumber({
        id: id,
        number: editedContactNumber,
      }),
    );
    setEditableInput(false);
  };

  // const itemDelete = (id: string) => {
  //   dispatch(deleteTask({id: id}));
  // };

  const [myName, setMyName] = React.useState('');
  const [myNumber, setMyNumber] = React.useState('');
  const [editedContactName, setEditedContactName] = React.useState('');
  const [editedContactNumber, setEditedContactNumber] = React.useState('');
  const [editableInput, setEditableInput] = React.useState(false);
  const [isAddContactVisible, setIsContactVisible] = React.useState(false);
  const [isAddContactUpdateVisible, setIsContactUpdateVisible] =
    React.useState(false);
  const [contactsFromIos, setContactFromIos] = React.useState([]);

  const contacts = useSelector((state: any) => state.tasks);

  // const onPressIos = (value: any) => {
  //   console.log('contact value>>>>> ', value);
  // };

  NativeModules?.EditContacts?.fetchContacts((value: any) =>
    setContactFromIos(value),
  );

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
        <View style={{flexDirection: 'row'}}>
          {Platform.OS === 'android' && (
            <TouchableOpacity
              style={{marginRight: 10}}
              onPress={() => {
                ReactNativeModuleContacts.editContact();
              }}>
              <Icon name="edit" size={30} color="white" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            // onPress={
            //   Platform.OS === 'android'
            //     ? ReactNativeModuleAddContact.addContact()
            //     : setIsAddContactVisible(true)
            // }
            onPress={() => setIsContactVisible(true)}>
            <Icon name="adduser" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const [selectedId, setSelectedId] = React.useState(null);

  const reanderItem = ({item}: any) => {
    const onPress = () => {
      setSelectedId(item.id);
      setEditableInput(true);
    };
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
              // editable={item.id === selectedId && editableInput}
              editable={false}
              onSubmitEditing={() => onUpdateName(item.id)}
              onChangeText={text => setEditedContactName(text)}
            />
            <TextInput
              style={{width: '100%', fontWeight: '600', fontSize: 20}}
              defaultValue={item?.number}
              // editable={item.id === selectedId && editableInput}
              editable={false}
              onSubmitEditing={() => onUpdateNumber(item.id)}
              onChangeText={text => setEditedContactNumber(text)}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity style={{marginRight: 10}} onPress={onPress}>
              <Icon name="edit" size={30} color="#ff4081" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                NativeModules?.EditContacts?.deleteContacts(
                  item?.name,
                  (value: any) => {
                    if (value) {
                      console.log('DELTED');
                    } else {
                      console.log('NOT DELETED');
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
        }}>
        <TouchableOpacity
          style={{paddingHorizontal: 20}}
          activeOpacity={0.5}
          onPress={() =>
            isAddContactVisible
              ? setIsContactVisible(false)
              : setIsContactVisible(true)
          }>
          <Icon name="edit" size={30} color="#ff4081" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{paddingHorizontal: 20}}
          activeOpacity={0.5}
          onPress={() =>
            //edit this accouding to need of update and add
            isAddContactUpdateVisible
              ? setIsContactUpdateVisible(false)
              : setIsContactUpdateVisible(true)
          }>
          <Icon name="adduser" size={30} color="#ff4081" />
        </TouchableOpacity>
      </View>
      {isAddContactVisible && (
        <>
          <TextInput
            value={myName}
            placeholder={'Contact Name'}
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
            placeholder={'Contact Number'}
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
              onPress={() =>
                NativeModules.EditContacts.addUserToContact(
                  myName,
                  myNumber,
                  (value: any) => {
                    if (value) {
                      console.log('User Added Successfully');
                    } else {
                      console.log('User Not Added');
                    }
                  },
                )
              }
            />
          </View>
        </>
      )}
      {isAddContactUpdateVisible && (
        <>
          <TextInput
            value={myName}
            placeholder={'Contact Name'}
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
            placeholder={'Contact Number'}
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
              title={'Update Contact'}
              // onPress={onSubmitTask}
              onPress={() => {}} /// update contact onpress
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
      <FlatList
        scrollEnabled
        showsVerticalScrollIndicator={false}
        data={Platform.OS === 'ios' ? contactsFromIos : contacts}
        renderItem={reanderItem}
        keyExtractor={(_item, index) => String(index)}
        extraData={selectedId}
      />
    </View>
  );
};

export default Todo;
