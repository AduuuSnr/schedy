import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
  Modal,
  ImageBackground,
} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {
  MapsScreen,
  AddEditTask,
  Timer,
  HomeScreen,
  MessagesScreen,
} from 'screens';

import {ChatStack, TabNavigator} from 'routes';
import {
  CallEndIcon,
  CallIcon,
  DrawerLogo,
  MapLine,
  MessageCircle,
  OnTheAgendaIcon,
} from 'assets/icons';
import {UbuntuBold, UbuntuMedium, UbuntuRegular} from 'assets/fonts';
import {ww, wh} from 'helpers';

import {White} from '@constants/colors';
import UpgradePlans from 'screens/UpgradePlans';
import {socket} from '@constants/socket';
import {useSelector} from 'react-redux';
import RNCallKeep from 'react-native-callkeep';
import axios from 'axios';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({navigation}) => {
  const [companies, setCompanies] = useState([]);
  const user = useSelector(state => state.app.user);
  const lang = useSelector(state => state.lang);
  const [ifOwner, setIfOwner] = useState(false);

  useEffect(() => {
    const options = {
      method: 'POST',
      url: 'https://api.businessagenda.org/companies/getCompanyTeams',
      headers: {'Content-Type': 'application/json'},
      data: {userId: user.id},
    };

    axios
      .request(options)
      .then(function (response) {
        setCompanies(response.data.message);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <Pressable
          style={styles.logoView}
          onPress={() => navigation.navigate('AgendaScreen')}>
          <DrawerLogo />
        </Pressable>
        <View style={styles.iconsView}>
          <TouchableOpacity
            style={styles.iconView}
            onPress={() => navigation.navigate('TabNavigator')}>
            <OnTheAgendaIcon />
            <View>
              <Text style={styles.iconText}>{lang.onTheAgenda}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconView2}
            onPress={() => navigation.navigate('ChatStack')}>
            <MessageCircle color={White} />
            <View>
              <Text style={styles.iconText}>{lang.messages}</Text>
            </View>
          </TouchableOpacity>

          {companies.map(comp => {
            if (ifOwner === false) {
              if (comp.ownerId === user.id) {
                setIfOwner(true);
              }
            }
          })}

          {ifOwner ? (
            <TouchableOpacity
              style={styles.iconView3}
              onPress={() => navigation.navigate('MapsScreen')}>
              <MapLine />
              <View>
                <Text style={styles.iconText}>{lang.map}</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <></>
          )}
          <TouchableOpacity
            style={styles.iconView4}
            onPress={() => navigation.navigate('Timer')}>
            <Image source={require('assets/images/time.png')} />
            <View>
              <Text style={styles.iconText}>{lang.timer}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('UpgradePlans', {free: true})}
          style={{marginTop: ww(0.01)}}>
          <Image source={require('assets/images/freePlan.png')} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.premiumView}
          onPress={() => navigation.navigate('UpgradePlans')}>
          <View style={styles.premiumShadow}>
            <Image source={require('assets/images/premium.png')} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const DrawerNavigator = ({navigation}) => {
  const user = useSelector(state => state.app.user);
  const lang = useSelector(state => state.lang);
  const [callerInfo, setCallerInfo] = useState();
  const [showCallModal, setShowCallModal] = useState(false);
  const [roomIdentity, setRoomIdentity] = useState();
  const [callType, setCallType] = useState();
  const callUUID = user.uuid;

  RNCallKeep.setup({
    ios: {
      appName: 'Business Agenda',
    },
    android: {
      alertTitle: 'Permissions required',
      alertDescription: 'This application needs to access your phone accounts',
      cancelButton: 'Cancel',
      okButton: 'ok',
    },
  });

  useEffect(() => {
    socket?.on('give rooms', data => {
      Object.values(data).map(val => {
        if (val[0].target.id === user.id && val[0].status === 'calling') {
          setCallerInfo(val[0].caller);
          setRoomIdentity(val[0].roomIdentity);
          setCallType(val[0].type);
          setShowCallModal(true);

          RNCallKeep.displayIncomingCall(
            callUUID.trim(),
            val[0].caller.email,
            val[0].caller.fullname,
            'email',
            true,
          );
        } else if (val[0].target.id === user.id && val[0].status === 'missed') {
          /********* MISSED CALL FOR TARGET *********/

          setCallerInfo('');
          setRoomIdentity('');
          setCallType('');
          setShowCallModal(false);
          RNCallKeep.rejectCall(callUUID.trim());
          /********* MISSED CALL *********/
        }
      });
    });
  }, []);

  return (
    <>
      <Modal visible={showCallModal}>
        <ImageBackground
          source={require('../assets/images/Mask.png')}
          style={styles.callView}>
          <View style={styles.callAvatarStyle}>
            <Image
              style={styles.callAvatar}
              source={{uri: callerInfo?.avatar}}
            />
            <View>
              <Text style={styles.callFullNameTextStyle}>
                {callerInfo?.fullname}
              </Text>
              <Text style={styles.incomingTextStyle}>
                {lang.incoming} {callType} {lang.call}...
              </Text>
            </View>
          </View>

          <View style={styles.phoneActions}>
            <View style={styles.alignItems}>
              <TouchableOpacity
                style={{
                  ...styles.phoneActionBackgrounds,
                  backgroundColor: '#EB5545',
                }}
                activeOpacity={0.7}
                onPress={() => {
                  setShowCallModal(false);
                  socket.emit('leave room', {
                    roomID: roomIdentity,
                  });
                }}>
                <CallEndIcon color={'white'} />
              </TouchableOpacity>
              <Text style={styles.actionButton}>{lang.decline}</Text>
            </View>
            <View style={styles.alignItems}>
              <TouchableOpacity
                style={[
                  styles.phoneActionBackgrounds,
                  {backgroundColor: '#67CE67'},
                ]}
                activeOpacity={0.7}
                onPress={() => {
                  setShowCallModal(false);
                  console.log('calltype: ', callType);
                  navigation.navigate('ChatScreen', {
                    roomIdentity,
                    receiverId: callerInfo?.id,
                    person: callerInfo,
                    fromPhoneCall: callType,
                    callUUID: callUUID,
                  });
                }}>
                <CallIcon color={'white'} />
              </TouchableOpacity>
              <Text style={styles.actionButton}>{lang.accept}</Text>
            </View>
          </View>
        </ImageBackground>
      </Modal>
      <Drawer.Navigator
        initialRouteName="TabNavigator"
        screenOptions={{
          overlayColor: 'transparent',
          headerShown: false,
          drawerType: 'slide',
          drawerStyle: {
            width: ww(0.6),
            shadowColor: '#58563D',
            shadowOffset: {
              width: 10,
              height: 0,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.5,
            elevation: 10,
          },
          sceneContainerStyle: {
            transform: [{scale: 1}],
          },
        }}
        drawerContent={props => <CustomDrawerContent {...props} />}>
        <Drawer.Screen name="TabNavigator" component={TabNavigator} />
        <Drawer.Screen name="ChatStack" component={ChatStack} />
        <Drawer.Screen name="MapsScreen" component={MapsScreen} />
        <Drawer.Screen name="UpgradePlans" component={UpgradePlans} />
        <Drawer.Screen name="AddEditTask" component={AddEditTask} />
        <Drawer.Screen name="Timer" component={Timer} />
        <Drawer.Screen name="HomeScreen" component={HomeScreen} />
        <Drawer.Screen name="MessagesScreen" component={MessagesScreen} />
      </Drawer.Navigator>
    </>
  );
};

export default DrawerNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconsView: {
    alignSelf: 'flex-start',
  },
  iconView: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginTop: wh(0.03),
    width: ww(0.4),
    height: wh(0.06),
    left: ww(0.12),
  },
  iconView2: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginTop: wh(0.01),
    width: ww(0.4),
    height: wh(0.06),
    left: ww(0.12),
  },
  iconView3: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginTop: wh(0.01),
    width: ww(0.4),
    height: wh(0.06),
    left: ww(0.11),
  },
  iconView4: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginTop: wh(0.01),
    width: ww(0.4),
    height: wh(0.06),
    marginLeft: ww(0.11),
  },
  actionButton: {
    fontFamily: UbuntuMedium,
    marginTop: wh(0.01),
  },
  callFullNameTextStyle: {
    fontFamily: UbuntuBold,
    fontSize: ww(0.07),
    marginLeft: ww(0.05),
  },
  iconText: {
    fontFamily: UbuntuRegular,
    fontSize: ww(0.035),
    left: ww(0.03),
  },
  subContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: wh(0.2),
  },
  callAvatarStyle: {
    marginTop: wh(0.1),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumView: {
    alignItems: 'center',
    width: ww(0.6),
    marginBottom: wh(0.2),
    shadowColor: '#F2A516',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  incomingTextStyle: {
    fontFamily: UbuntuRegular,
    fontSize: ww(0.03),
    marginTop: wh(0.01),
    marginLeft: ww(0.05),
  },
  premiumShadow: {
    shadowColor: '#F2A516',
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },

  phoneCallText: {
    fontFamily: UbuntuBold,
    fontSize: ww(0.03),
    color: 'black',
    textAlign: 'center',
    marginVertical: wh(0.05),
  },
  callAvatar: {
    width: ww(0.2),
    height: ww(0.2),
    marginLeft: ww(0.1),
    borderRadius: ww(0.3),
  },
  phoneActionBackgrounds: {
    width: ww(0.15),
    height: ww(0.15),
    borderRadius: ww(0.15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneActions: {
    flexDirection: 'row',
    marginLeft: ww(0.25),
    marginTop: wh(0.6),
    width: '50%',
    justifyContent: 'space-between',
  },
  callView: {
    flex: 1,
    alignItems: 'flex-start',
    backgroundColor: White,
  },
  alignItems: {
    alignItems: 'center',
  },
});
