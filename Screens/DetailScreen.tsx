import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  TextInput,
  NativeModules,
  KeyboardAvoidingView,
  Button,
  TextInputProps,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import styles from './detailScreenStyles';

interface contactIconType {
  iconName: string;
  isRotated?: boolean;
  onPress?: () => void;
}
interface lineSepratorType {
  color?: string;
}
interface contactInfoTypes {
  iconName: string;
  data?: string;
  onPressEditIcon?: () => void;
}

const PlatformIOS = Platform.OS === 'ios';

const AddressContainer = (props: TextInputProps) => {
  return (
    <View>
      <TextInput
        {...props}
        style={styles.addressContainerTextInputStyle}
        placeholderTextColor={'white'}
        multiline={true}
        editable={true}
        keyboardType="default"
      />
    </View>
  );
};

const DetailScreen = ({route}: any) => {
  const {
    itemName,
    itemNumber,
    itemCity,
    itemCountry,
    itemState,
    itemStreet,
    itemZip,
  } = route.params;

  let FullAddress = itemStreet?.concat(
    ' ',
    itemCity === undefined ? '' : itemCity,
    ' ',
    itemState === undefined ? '' : itemState,
    ' ',
    itemZip === undefined ? '' : itemZip,
    ' ',
    itemCountry === undefined ? '' : itemCountry,
  );

  const [myUpdatedNumber, setMyUpdateNumber] = React.useState('');
  const [isUpdateContactNumberVisible, setIsUpdateContactNumberVisible] =
    React.useState(false);
  const [updatedNumber, setUpdatedNumber] = React.useState(itemNumber);
  const [updatedAddress, setUpdatedAddress] = React.useState(FullAddress);
  const [street, setStreet] = React.useState(itemStreet ?? '');
  const [city, setCity] = React.useState(itemCity ?? '');
  const [state, setState] = React.useState(itemState ?? '');
  const [zip, setZip] = React.useState(itemZip ?? '');
  const [country, setCountry] = React.useState(itemCountry ?? '');
  const [messageValue, setMessageValue] = React.useState('');
  const [isVisibleMessageContainer, setIsVisibleMessageContainer] =
    React.useState(false);
  const [isVisibleAddressContainer, setIsVisibleAddressContainer] =
    React.useState(false);

  const LineSeperator = ({color = 'white'}: lineSepratorType) => {
    return (
      <View style={[styles.lineSeperatorStyles, {backgroundColor: color}]} />
    );
  };

  const ContactIcons = ({
    iconName,
    isRotated = false,
    onPress,
  }: contactIconType) => {
    return (
      <View style={styles.contactIconContainerStyle}>
        <TouchableOpacity onPress={onPress} style={styles.contactIconStyle}>
          <Icon
            name={iconName}
            size={30}
            color="white"
            style={isRotated && {transform: [{rotateY: '180deg'}]}}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const ContactInfo = ({
    iconName,
    data = '',
    onPressEditIcon,
  }: contactInfoTypes) => {
    return (
      <View style={styles.contactInfoContainerStyle}>
        <Icon
          name={iconName}
          size={30}
          color="white"
          style={styles.addressLeftIconStyle}
        />
        <Text style={styles.addressTextStyle}>{data}</Text>
        <TouchableOpacity onPress={onPressEditIcon}>
          <Icon
            name={'edit'}
            size={30}
            color="white"
            style={styles.addressRightIconStyle}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const onPressUpdateIcon = () => {
    if (isUpdateContactNumberVisible) {
      setIsUpdateContactNumberVisible(false);
    } else {
      setIsUpdateContactNumberVisible(true);
    }
  };

  const onPresUpdateContactButton = () => {
    if (Platform.OS === 'android') {
      let updateContactShare = {
        name: itemName,
        mobile: myUpdatedNumber.length === 0 ? itemNumber : myUpdatedNumber,
      };
      NativeModules.FetchContacts.buttonUpdateContact(updateContactShare);
      setIsUpdateContactNumberVisible(false);
      myUpdatedNumber.length === 0
        ? setUpdatedNumber(itemNumber)
        : setUpdatedNumber(myUpdatedNumber);
    } else {
      NativeModules.EditContacts.updateContacts(
        itemName,
        myUpdatedNumber.length === 0 ? itemNumber : myUpdatedNumber,
        (value: boolean) => {
          if (value) {
            console.log('User Updated Successfully');
            NativeModules?.EditContacts?.fetchContacts((list: []) => {
              list.map((item: {name: any}) => {
                if (item.name === itemName) {
                  if (myUpdatedNumber.length === 0) {
                    setUpdatedNumber(itemNumber);
                  } else {
                    setUpdatedNumber(myUpdatedNumber);
                  }
                }
              }) as [];
            });
          } else {
            console.log('User Not UPdated');
          }
        },
      );
      setIsUpdateContactNumberVisible(false);
    }
  };

  const onPressCallButton = () => {
    if (PlatformIOS) {
      NativeModules?.EditContacts?.dialNumber(updatedNumber);
    } else {
      let contactShare = {
        mobile: updatedNumber,
      };
      NativeModules.FetchContacts.callContact(contactShare);
    }
  };

  const onPressMessageIcon = () => {
    if (isVisibleMessageContainer) {
      setIsVisibleMessageContainer(false);
    } else {
      setIsVisibleMessageContainer(true);
    }
  };

  const sendMessage = () => {
    if (PlatformIOS) {
      NativeModules?.EditContacts?.messageToNumber(
        updatedNumber,
        messageValue.length === 0 ? ' ' : messageValue,
      );
    } else {
      let contactShare = {
        message: messageValue.length === 0 ? '' : messageValue,
        mobile: updatedNumber,
      };
      NativeModules.FetchContacts.messageContact(contactShare);
    }
    setIsVisibleMessageContainer(false);
  };

  const onPressVideoCall = () => {
    if (PlatformIOS) {
      NativeModules?.EditContacts?.videoCall(updatedNumber);
    } else {
      let contactShare = {
        mobile: updatedNumber,
      };
      NativeModules.FetchContacts.videoCall(contactShare);
    }
    setIsVisibleMessageContainer(false);
  };

  const onPressAddAddressIcon = () => {
    if (isVisibleAddressContainer) {
      setIsVisibleAddressContainer(false);
    } else {
      setIsVisibleAddressContainer(true);
    }
  };

  const OnPressAndroidUpdateAddress = () => {
    let updateAddressAndroid = {
      name: itemName,
      mobile: updatedNumber,
      street: street,
      city: city,
      state: state,
      country: country,
      postalCode: zip,
    };
    let contactShare = {
      name: itemName,
      mobile: updatedNumber,
    };
    NativeModules.FetchContacts.buttonDeletecontact(contactShare);
    NativeModules?.FetchContacts?.updateAddress(updateAddressAndroid);
    setUpdatedAddress(
      street + ' ' + city + ' ' + state + ' ' + zip + ' ' + country,
    );
    setIsVisibleAddressContainer(false);
  };

  return (
    <SafeAreaView style={styles.containerStyle}>
      <ScrollView>
        <KeyboardAvoidingView>
          <View>
            <View style={styles.circleContainerStyle}>
              <Text style={styles.circleTextStyles}>
                {itemName[0].toUpperCase()}
              </Text>
            </View>

            <View>
              <Text style={styles.userNameStyles}>{itemName}</Text>
              <View style={styles.userNumberContainer}>
                <Text style={styles.userNumberStyles}>{updatedNumber}</Text>
                <TouchableOpacity
                  onPress={() => {
                    if (PlatformIOS) {
                      onPressUpdateIcon();
                    } else {
                      onPressUpdateIcon();
                    }
                  }}>
                  <Icon
                    name={'edit'}
                    size={30}
                    color="white"
                    style={styles.editNumberIconStyle}
                  />
                </TouchableOpacity>
              </View>
              {Platform.OS === 'android'
                ? isUpdateContactNumberVisible && (
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
                : isUpdateContactNumberVisible && (
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
          </View>

          <View style={styles.contactIconContainer}>
            <ContactIcons
              iconName={'phone'}
              isRotated={true}
              onPress={() => onPressCallButton()}
            />
            <ContactIcons
              iconName={'message1'}
              onPress={() => onPressMessageIcon()}
            />
            <ContactIcons
              iconName={'videocamera'}
              onPress={() => onPressVideoCall()}
            />
          </View>
          {isVisibleMessageContainer && (
            <KeyboardAvoidingView style={styles.visibleMessageContainerStyle}>
              <View>
                <TextInput
                  style={styles.visibleContainerTextInputStyle}
                  placeholder="Message"
                  placeholderTextColor={'white'}
                  multiline={true}
                  editable={true}
                  numberOfLines={5}
                  keyboardType="default"
                  value={messageValue}
                  onChangeText={text => setMessageValue(text)}
                />
              </View>
              <TouchableOpacity
                style={styles.sendMessageIconStyle}
                onPress={() => sendMessage()}>
                <Icon name={'upcircle'} size={30} color="orange" />
              </TouchableOpacity>
            </KeyboardAvoidingView>
          )}
          <LineSeperator color={'white'} />
          <ContactInfo
            iconName={'idcard'}
            data={
              updatedAddress?.trim()?.length === 0 ||
              updatedAddress === undefined
                ? 'Add Address'
                : updatedAddress
            }
            onPressEditIcon={() => onPressAddAddressIcon()}
          />
          {isVisibleAddressContainer && (
            <KeyboardAvoidingView style={styles.visibleAddressContainerStyle}>
              <AddressContainer
                placeholder={'Street Name'}
                value={street}
                onChangeText={(text: string) => setStreet(text)}
              />
              <AddressContainer
                placeholder={'City Name'}
                value={city}
                onChangeText={(text: string) => setCity(text)}
              />
              <AddressContainer
                placeholder={'State Name'}
                value={state}
                onChangeText={(text: string) => setState(text)}
              />
              <AddressContainer
                placeholder={'Zip Code'}
                value={zip}
                onChangeText={(text: string) => setZip(text)}
              />
              <AddressContainer
                placeholder={'Country Name'}
                value={country}
                onChangeText={(text: string) => setCountry(text)}
              />

              <View style={styles.updateAddressButtonStyle}>
                <Button
                  onPress={() =>
                    // PlatformIOS
                    //   ? [
                    // NativeModules.EditContacts.addAddress(
                    //   itemName,
                    //   street,
                    //   city,
                    //   state,
                    //   zip,
                    //   country,
                    //   (text: boolean) => {
                    //     console.log(text);
                    //   },
                    // ),
                    //       setUpdatedAddress(
                    //         street +
                    //           ' ' +
                    //           city +
                    //           ' ' +
                    //           state +
                    //           ' ' +
                    //           zip +
                    //           ' ' +
                    //           country,
                    //       ),
                    //       setIsVisibleAddressContainer(false),
                    //     ]
                    OnPressAndroidUpdateAddress()
                  }
                  title={
                    updatedAddress?.trim()?.length === 0 ||
                    updatedAddress === undefined
                      ? 'Add Address'
                      : 'Update Address'
                  }
                />
              </View>
            </KeyboardAvoidingView>
          )}
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailScreen;
