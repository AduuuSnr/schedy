import React, {useState, useEffect} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Modal,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import OneSignal from 'react-native-onesignal';
import {Button} from 'components';
import {keyUser, keyLang} from '@constants/@async-keys';
import {Gray, MainBlue, White} from '@constants/colors';
import {setUser} from '@redux/app/actions';

import {UbuntuBold, UbuntuMedium, UbuntuRegular} from 'assets/fonts';

import {Notification, SignOut, CloseIcon, Language} from 'assets/icons';
import {delData, wh, ww, setData} from 'helpers';
import {setLang} from '@redux/lang/action';
import axios from 'axios';

interface Props {
  navigation: any;
}

const ProfileScreen = ({navigation}: Props) => {
  const user = useSelector((state: any) => state.app.user);
  const lang = useSelector(state => state.lang);
  const twilioToken = useSelector(state => state.app.twilioToken);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [activeTasks, setActiveTasks] = useState('');

  const [allTasks, setAllTasks] = useState([]);

  const dispatch = useDispatch();

  const counts = {};

  const options = [
    // {
    //   icon: <Settings size={ww(0.05)} />,
    //   text: lang.settings,
    //   onPress: () => {
    //     navigation.navigate('SettingsScreen');
    //   },
    // },
    {
      icon: <Language size={ww(0.05)} />,
      text: lang.language,
      onPress: () => {
        setShowLanguageModal(true);
      },
      rightSide: '',
    },
    {
      icon: <Notification size={ww(0.05)} />,
      text: lang.notifications,
      onPress: () => navigation.navigate('NotificationsScreen'),
    },
    {
      icon: <SignOut size={ww(0.05)} />,
      text: lang.logout,
      onPress: () => {
        setShowLogoutModal(true);
      },
    },
  ];

  useEffect(() => {
    let data = JSON.stringify({
      userId: user.id,
    });

    let config = {
      method: 'post',
      url: 'https://api.businessagenda.org/tasks/getTaskByUser',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios(config)
      .then(response => {
        setAllTasks(response.data.message);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    console.log('TaskCount: ', allTasks.length);
    allTasks.map(i => {
      console.log(i.status);
    });
    console.log('ACTIVE: ', activeTasks.length);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={showLanguageModal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => setShowLanguageModal(false)}
              activeOpacity={0.7}
              style={{position: 'absolute', top: ww(0.02), right: ww(0.02)}}>
              <CloseIcon size={ww(0.1)} />
            </TouchableOpacity>
            <Button
              title="English"
              onPress={() => {
                setData(keyLang, 'en', () => {
                  dispatch(setLang('en'));
                  setShowLanguageModal(false);
                });
              }}
            />
            <Button
              title="Deutsch"
              style={{marginVertical: 20}}
              onPress={() => {
                setData(keyLang, 'de', () => {
                  dispatch(setLang('de'));
                  setShowLanguageModal(false);
                });
              }}
            />
          </View>
        </View>
      </Modal>

      <Modal animationType="fade" transparent={true} visible={showLogoutModal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => setShowLogoutModal(false)}
              activeOpacity={0.7}
              style={{position: 'absolute', top: ww(0.02), right: ww(0.02)}}>
              <CloseIcon size={ww(0.1)} />
            </TouchableOpacity>
            <Text style={styles.arUSureLogOut}>{lang.arUSureLoguot}</Text>
            <Button
              title="Yes"
              onPress={() =>
                delData(keyUser, res => {
                  dispatch(setUser(null));
                  OneSignal.removeExternalUserId(res => console.log(res));
                  OneSignal.deleteTag('email');
                })
              }
            />
          </View>
        </View>
      </Modal>

      <View style={styles.moreButtonArea}>
        {/* <More size={ww(0.05)} /> */}
      </View>
      <Image
        style={styles.avatar}
        source={{
          uri: user.avatar,
        }}
      />
      <Text style={styles.userName}> {user.userId} </Text>
      <View style={styles.activeNumbersArea}>
        <View style={[styles.innerInfo, {borderRightWidth: ww(0.003)}]}>
          <Text style={styles.numberText}>{allTasks.length}</Text>
          <Text style={styles.infoText}>{lang.totalTasks}</Text>
        </View>
        <View style={styles.innerInfo}>
          <Text style={styles.numberText}>{activeTasks.length}</Text>
          <Text style={styles.infoText}>{lang.activeTasks}</Text>
        </View>
      </View>

      <View style={styles.settingsArea}>
        {options.map((option, index) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={option.onPress}
            key={index}
            style={styles.profileActions}>
            {option.icon}
            <Text
              style={[
                styles.actionText,
                {color: index == options.length - 1 ? 'red' : '#2B2B2B'},
              ]}>
              {option.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: White,
  },
  moreButtonArea: {
    marginTop: wh(0.02),
    marginBottom: wh(0.06),
    alignItems: 'flex-end',
    width: ww(0.9),
  },
  userName: {
    fontFamily: UbuntuMedium,
    fontSize: ww(0.06),
    color: '#120D26',
    marginVertical: wh(0.015),
  },
  avatar: {
    width: ww(0.25),
    height: ww(0.25),
    borderRadius: ww(0.125),
  },
  activeNumbersArea: {
    flexDirection: 'row',
    backgroundColor: MainBlue,
    width: ww(0.6),
    height: wh(0.1),
    borderRadius: ww(0.025),
    elevation: 10,
    shadowColor: '#58563D',
    shadowOffset: {
      width: 1,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  innerInfo: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    height: '50%',
    borderColor: White,
  },
  numberText: {
    fontFamily: UbuntuMedium,
    fontSize: ww(0.05),
    color: White,
  },
  infoText: {
    fontFamily: UbuntuRegular,
    fontSize: ww(0.032),
    color: White,
    marginTop: ww(0.008),
  },
  profileActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: wh(0.08),
    width: ww(0.5),
  },
  actionText: {
    marginLeft: ww(0.04),
    fontFamily: UbuntuMedium,
    fontSize: ww(0.04),
  },
  settingsArea: {
    marginTop: wh(0.02),
  },
  optionView: {
    flexDirection: 'row',
    width: ww(1),
    alignItems: 'center',
    paddingHorizontal: ww(0.15),
    marginVertical: wh(0.02),
  },
  optionText: {
    fontFamily: UbuntuRegular,
    fontSize: ww(0.04),
    color: Gray,
    paddingLeft: ww(0.03),
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '80%',
    height: '30%',
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center',
  },
  arUSureLogOut: {
    fontFamily: UbuntuBold,
    fontSize: ww(0.05),
    textAlign: 'center',
    marginBottom: wh(0.01),
  },
});
