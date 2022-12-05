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
  const [myNumber, setMyNumber] = React.useState('');
  const [myUpdatedNumber, setMyUpdateNumber] = React.useState('');
  const [isAddContactVisible, setIsContactVisible] = React.useState(false);
  const [isAddContactUpdateVisible, setIsContactUpdateVisible] =
    React.useState(false);
  const [contactsFromIos, setContactFromIos] = React.useState([]);
  const [contactsFromAndroid, setContactFromAndroid] = React.useState({});
  const [selectedId, setSelectedId] = React.useState(null);
  const [search, setSearch] = React.useState('');
  const [clicked, setClicked] = React.useState(false);
  const [dummyAndroidData, setDummyAndroidData] = React.useState([]);
  const [dummyIosData, setDummyIosData] = React.useState([]);

  React.useEffect(() => {
    updateAndroidContactList();
    updateIosContactList();
  }, [myName, myNumber]);

  const searchFilter = (text: string) => {
    if (text) {
      const newData =
        Platform.OS === 'ios'
          ? dummyIosData.filter((item: any) => {
              const itemDataIos = item?.name
                ? item.name.toUpperCase()
                : ''.toUpperCase();
              const textData = text.toUpperCase();
              return itemDataIos.indexOf(textData) > -1;
            })
          : dummyAndroidData.filter((item: any) => {
              const ContactData = Platform.OS === 'android' && JSON.parse(item);
              const itemDataAndroid = ContactData?.name
                ? ContactData?.name.toUpperCase()
                : ''.toUpperCase();
              const textData = text.toUpperCase();
              return itemDataAndroid.indexOf(textData) > -1;
            });

      setSearch(text);
      Platform.OS === 'ios'
        ? setContactFromIos(newData as SetStateAction<never[]>)
        : setContactFromAndroid(newData);
    } else {
      Platform.OS === 'ios'
        ? setContactFromIos(dummyIosData)
        : setContactFromAndroid(dummyAndroidData);

      setSearch(text);
    }
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
      (value: SetStateAction<never[]>) => {
        setContactFromIos(value);
        setDummyIosData(value);
      },
    );
  };

  const updateAndroidContactList = () => {
    NativeModules?.FetchContacts?.fetchContactsAndroid(
      (value: SetStateAction<never[]>) => {
        setContactFromAndroid(value);
        setDummyAndroidData(value);
      },
    );
  };

  const reanderItem = ({item}: any) => {
    const ContactData = Platform.OS === 'android' && JSON.parse(item);

    const OnPressAndroidUpdateContact = () => {
      if (Platform.OS === 'android') {
        let updateContactShare = {
          name: ContactData.name,
          mobile:
            myUpdatedNumber.length === 0 ? ContactData.mobile : myUpdatedNumber,
        };
        NativeModules.FetchContacts.buttonUpdateContact(updateContactShare);
      }
      updateAndroidContactList();
      setIsContactUpdateVisible(false);
    };

    const onPresUpdateContactButton = () => {
      if (Platform.OS === 'android') {
        OnPressAndroidUpdateContact();
      } else {
        NativeModules.EditContacts.updateContacts(
          item?.name,
          myUpdatedNumber.length === 0 ? item?.number : myUpdatedNumber,
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
        setIsContactUpdateVisible(false);
      }
      setSearch('');
    };

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
              style={[styles.renderItemNameInputStyle]}
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
          <View style={styles.deleteEditContainer}>
            <TouchableOpacity
              // eslint-disable-next-line react-native/no-inline-styles
              style={{paddingHorizontal: 20}}
              activeOpacity={0.5}
              onPress={() => {
                if (Platform.OS === 'ios') {
                  setSelectedId(item.name);
                  onPressUpdateButtonIos();
                } else {
                  setSelectedId(ContactData.name);
                  onPressUpdateContactAndroid();
                }
              }}>
              <Icon name="edit" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onPressDeleteButton();
              }}>
              <Icon name="delete" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {Platform.OS === 'android'
          ? isAddContactUpdateVisible &&
            ContactData.name === selectedId && (
              <View>
                <View style={styles.updateNumberStyle}>
                  <TextInput
                    value={myUpdatedNumber}
                    keyboardType={'number-pad'}
                    placeholder={'Add new Contact Number'}
                    placeholderTextColor={'white'}
                    onChangeText={text => {
                      setMyUpdateNumber(text);
                    }}
                    style={styles.addButtonTextInputStyle}
                  />
                  <TouchableOpacity
                    onPress={() => onPresUpdateContactButton()}
                    style={styles.checkIconStyle}>
                    <Icon name="check" size={25} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            )
          : isAddContactUpdateVisible &&
            item.name === selectedId && (
              <View>
                <View style={styles.updateNumberStyle}>
                  <TextInput
                    value={myUpdatedNumber}
                    keyboardType={'number-pad'}
                    placeholder={'Add new Contact Number'}
                    placeholderTextColor={'white'}
                    onChangeText={text => {
                      setMyUpdateNumber(text);
                    }}
                    style={styles.addButtonTextInputStyle}
                  />
                  <TouchableOpacity
                    onPress={() => onPresUpdateContactButton()}
                    style={styles.checkIconStyle}>
                    <Icon name="check" size={25} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
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

  const onPressAddContactButton = () => {
    if (Platform.OS === 'android') {
      OnPressAndroidAddContact();
      updateAndroidContactList();
      setIsContactVisible(false);
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
      setIsContactVisible(false);
    }
  };

  return (
    <View style={styles.topViewStyles}>
      <View>
        <View style={styles.contentHeaderContainer}>
          <View style={styles.headerContainerContactList}>
            <Text style={styles.contactHeaderTextStyle}>Contact List</Text>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                Platform.OS === 'ios'
                  ? onPressAddButtonIos()
                  : onPressAddContactAndroid();
              }}>
              <Icon name="adduser" size={25} color="white" />
            </TouchableOpacity>
          </View>
          <View
            style={
              clicked ? styles.container : [styles.container, {width: '100%'}]
            }>
            <View
              style={
                clicked
                  ? styles.searchBar__clicked
                  : styles.searchBar__unclicked
              }>
              <Icon
                name="search1"
                size={20}
                color="black"
                // eslint-disable-next-line react-native/no-inline-styles
                style={{marginLeft: 1}}
              />
              <TextInput
                style={styles.input}
                placeholder="Search"
                value={search}
                onChangeText={text => searchFilter(text)}
                onFocus={() => {
                  setClicked(true);
                }}
              />
            </View>
            {clicked && (
              // eslint-disable-next-line react-native/no-inline-styles
              <View style={{marginLeft: 10}}>
                <Button
                  title="Cancel"
                  color={Platform.OS === 'android' ? '#404040' : 'white'}
                  onPress={() => {
                    setClicked(false);
                    Platform.OS === 'ios'
                      ? setContactFromIos(contactsFromIos)
                      : setContactFromAndroid(contactsFromAndroid);
                    updateIosContactList();
                    updateAndroidContactList();
                    setSearch('');
                  }}
                />
              </View>
            )}
          </View>
        </View>
        {isAddContactVisible && (
          <View style={styles.addContactStyle}>
            <TextInput
              value={myName}
              placeholder={'New Contact Name'}
              onChangeText={text => {
                setMyName(text);
              }}
              style={styles.addContactTextInputStyles}
              placeholderTextColor={'white'}
            />
            <TextInput
              value={myNumber}
              keyboardType={'number-pad'}
              placeholder={'New Contact Number'}
              onChangeText={text => {
                setMyNumber(text);
              }}
              style={styles.addContactTextInputNumberStyle}
              placeholderTextColor={'white'}
            />
            <View style={styles.buttonStyleAddContactUpdateContact}>
              <Button
                color={Platform.OS === 'ios' ? 'white' : 'black'}
                title={'Add Contact'}
                onPress={() => onPressAddContactButton()}
              />
              <Button
                color={Platform.OS === 'ios' ? 'white' : 'black'}
                title={'Cancel'}
                onPress={() => setIsContactVisible(false)}
              />
            </View>
          </View>
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
