/* eslint-disable react-native/no-inline-styles */
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  TextInput,
  NativeModules,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import styles from './contactScreenStyles';

interface contactIconType {
  iconName: string;
  isRotated?: boolean;
}
interface lineSepratorType {
  color?: string;
}
interface contactInfoTypes {
  iconName: string;
  data?: string;
}

const DetailScreen = ({route}: any) => {
  const {itemName, itemNumber} = route.params;
  const [myUpdatedNumber, setMyUpdateNumber] = React.useState('');
  const [isUpdateContactNumberVisible, setIsUpdateContactNumberVisible] =
    React.useState(false);
  const [updatedNumber, setUpdatedNumber] = React.useState(itemNumber);

  const LineSeperator = ({color}: lineSepratorType) => {
    return (
      <View
        style={{
          height: 1,
          backgroundColor: color,
          marginTop: 30,
          marginHorizontal: 10,
        }}
      />
    );
  };

  const ContactIcons = ({iconName, isRotated = false}: contactIconType) => {
    return (
      <View style={{alignItems: 'center', flex: 1}}>
        <TouchableOpacity
          style={{
            margin: 15,
            padding: 20,
            backgroundColor: '#1a1b1e',
            top: 20,
            borderRadius: 15,
            flexDirection: 'row',
          }}>
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

  const ContactInfo = ({iconName, data = ''}: contactInfoTypes) => {
    return (
      <View
        style={{
          backgroundColor: '#1a1b1e',
          height: '20%',
          margin: 20,
          borderRadius: 20,
          flexDirection: 'row',
          flex: 1,
          padding: 20,
        }}>
        <Icon
          name={iconName}
          size={30}
          color="white"
          style={{alignSelf: 'center', width: 30}}
        />
        <Text
          style={{
            color: 'white',
            fontSize: 15,
            alignSelf: 'center',
            marginHorizontal: 20,
            maxWidth: '75%',
          }}>
          {data}
        </Text>
      </View>
    );
  };

  const onPressUpdateButton = () => {
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

  return (
    <SafeAreaView style={{backgroundColor: '#404040', flex: 1}}>
      <View>
        <View
          style={{
            backgroundColor: 'black',
            height: 100,
            width: 100,
            alignSelf: 'center',
            marginTop: '10%',
            borderRadius: 50,
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 60,
              alignSelf: 'center',
            }}>
            {itemName[0].toUpperCase()}
          </Text>
        </View>

        <View>
          <Text
            style={{
              color: 'white',
              fontSize: 30,
              alignSelf: 'center',
              top: 10,
            }}>
            {itemName}
          </Text>
          <View style={{flexDirection: 'row', alignSelf: 'center'}}>
            <Text
              style={{
                color: 'white',
                fontSize: 30,
                alignSelf: 'center',
                top: 10,
              }}>
              +91 {updatedNumber}
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (Platform.OS === 'ios') {
                  onPressUpdateButton();
                } else {
                  onPressUpdateButton();
                }
              }}>
              <Icon
                name={'edit'}
                size={30}
                color="white"
                style={{alignSelf: 'center', top: 10, left: 10}}
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

      <View style={{flexDirection: 'row'}}>
        <ContactIcons iconName={'phone'} isRotated={true} />
        <ContactIcons iconName={'message1'} />
        <ContactIcons iconName={'videocamera'} />
      </View>

      <LineSeperator color={'white'} />
      <ScrollView>
        <ContactInfo
          iconName={'enviromento'}
          data={'Nr. Telephone Exchange, Nr. Telephone Exchange, Karelibaug'}
        />
        <ContactInfo
          iconName={'idcard'}
          data={
            '212, 5th Floor, Shiv Krupa Commercial Com, Nav Pada, Off Gokhale Road, Thane (west) Behind Indian Bank, Fatehgunj Main Road, Fatehgunj Main Road'
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailScreen;
