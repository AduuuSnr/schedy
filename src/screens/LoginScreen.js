import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  StatusBar,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import {LoginInput, Button, CustomAlert} from 'components';
import {setData, wh, ww} from 'helpers';
import {UbuntuMedium, UbuntuRegular} from 'assets/fonts';
import axios from 'axios';
import {White} from '@constants/colors';

import {keyUser} from '@constants/@async-keys';
import {useDispatch, useSelector} from 'react-redux';
import {setUser} from '@redux/app/actions';
import OneSignal from 'react-native-onesignal';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState({text: '', error: false});
  const [password, setPassword] = useState({text: '', error: false});
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const [responseModalContent, setResponseModalContent] = useState();
  const [showResponseModal, setShowResponseModal] = useState(false);
  const lang = useSelector(state => state.lang);

  const oneSignalInit = (email, id) => {
    OneSignal.setLogLevel(6, 0);
    OneSignal.setAppId('2546f458-f4fb-49cb-b0e4-d79d3d7c5c6e');
    OneSignal.promptForPushNotificationsWithUserResponse(response => {});

    //Method for handling notifications received while app in foreground
    OneSignal.setNotificationWillShowInForegroundHandler(
      notificationReceivedEvent => {
        let notification = notificationReceivedEvent.getNotification();
        const data = notification.additionalData;
        // Complete with null means don't show a notification.
        notificationReceivedEvent.complete(notification);
      },
    );

    //Method for handling notifications opened
    OneSignal.setNotificationOpenedHandler(notification => {});
    OneSignal.sendTag('email', email);

    OneSignal.setExternalUserId(id?.toString(), results => {});
  };

  const validateEmail = email => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const login = () => {
    const options = {
      method: 'POST',
      url: 'https://api.businessagenda.org/users/login',
      headers: {'Content-Type': 'application/json'},
      data: {email: email.text, password: password.text},
    };

    axios
      .request(options)
      .then(function (response) {
        console.log('userdata: ', response.data.data);
        if (response.data.status === 'success') {
          setTimeout(() => {
            setData(keyUser, response.data.data, res => {
              if (res) {
                dispatch(setUser(response.data.data));
                oneSignalInit(response.data.data.email, response.data.data.id);
                // connectyInit(response.data.data);
              }
            });
          }, 1000);
        } else if (!validateEmail(email.text)) {
          setEmail({text: email.text, error: true});
          setPassword({text: password.text, error: true});

          setShowResponseModal(true);
          setResponseModalContent({
            message: 'Please Enter a Valid Email !',
            status: 'fail',
          });
        } else {
          setEmail({text: email.text, error: true});
          setPassword({text: password.text, error: true});

          setShowResponseModal(true);
          setResponseModalContent({
            message: 'Check your Email/Password !',
            status: 'fail',
          });
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const forgotPassword = () => {
    setModalVisible(true);
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <CustomAlert
          showModal={showResponseModal}
          setShowModal={setShowResponseModal}
          message={responseModalContent?.message}
          status={responseModalContent?.status}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={styles.modalContainer}>
              <TouchableOpacity
                onPress={() => setModalVisible(!modalVisible)}
                style={styles.backIconView}>
                <Icon name="chevron-left" size={25} />
              </TouchableOpacity>
              <View style={styles.resetPasswordView}>
                <Text style={styles.resetPasswordTitle}>
                  {lang.resetPassword}
                </Text>
              </View>
              <View style={styles.resetPasswordSubTitleView}>
                <Text style={styles.resetPasswordSubTitle}>
                  {lang.pleaseEnterYourEmaiAddressTo}
                </Text>
              </View>
              <View style={styles.modalInput}>
                <LoginInput
                  value={email.text}
                  error={email.error}
                  iconName="mail"
                  placeholder="mail@mail.com"
                  onChangeText={text => setEmail({text, error: false})}
                />
              </View>
              <View style={styles.modalButton}>
                <Button title={lang.reset} arrow onPress={login} />
              </View>
            </SafeAreaView>
          </TouchableWithoutFeedback>
        </Modal>
        <View style={styles.logoView}>
          <Image source={require('../assets/images/logo.png')} />
        </View>

        <View style={styles.inputs}>
          <Text style={styles.loginText}>{lang.login}</Text>

          <LoginInput
            value={email.text}
            error={email.error}
            iconName="mail"
            placeholder="mail@mail.com"
            onChangeText={text => setEmail({text, error: false})}
          />
          <LoginInput
            value={password.text}
            error={password.error}
            iconName="lock"
            placeholder="**************"
            onChangeText={text => setPassword({text, error: false})}
          />
        </View>
        <TouchableOpacity
          style={styles.forgotPasswordView}
          onPress={forgotPassword}>
          <Text style={styles.forgotPasswordText}>{lang.forgotPassword}</Text>
        </TouchableOpacity>

        <View style={styles.buttonView}>
          <Button title="Login" arrow onPress={login} />
        </View>
        <View style={styles.registerView}>
          <Text style={styles.registerText1}>
            {lang.dontHaveAnAccountRegister}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('RegisterScreen')}>
            <Text style={styles.registerText2}>{lang.register}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: White,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: White,
  },
  backIconView: {
    left: ww(0.05),
    top: wh(0.02),
    width: ww(0.06),
  },
  resetPasswordView: {
    left: ww(0.06),
    top: wh(0.05),
  },
  resetPasswordTitle: {
    fontSize: ww(0.05),
    fontFamily: UbuntuMedium,
  },
  resetPasswordSubTitleView: {
    width: ww(0.7),
    left: ww(0.06),
    top: wh(0.07),
  },
  resetPasswordSubTitle: {
    fontFamily: UbuntuRegular,
    fontSize: ww(0.04),
  },
  modalInput: {
    alignSelf: 'center',
    top: wh(0.11),
  },
  modalButton: {
    alignSelf: 'center',
    top: wh(0.15),
  },
  logoView: {
    top: wh(-0.05),
  },
  loginText: {
    left: ww(0.03),
    fontSize: ww(0.07),
    fontFamily: UbuntuMedium,
  },
  inputs: {
    alignSelf: 'center',
  },

  forgotPasswordView: {
    top: wh(0.02),
    alignSelf: 'center',
  },
  forgotPasswordText: {
    fontFamily: UbuntuMedium,
    color: '#3d50df',
    fontSize: ww(0.04),
  },
  buttonView: {
    alignSelf: 'center',
    top: wh(0.05),
  },
  registerView: {
    flexDirection: 'row',
    alignSelf: 'center',
    top: wh(0.1),
  },
  registerText1: {
    fontFamily: UbuntuRegular,
    fontSize: ww(0.04),
  },
  registerText2: {
    fontFamily: UbuntuRegular,
    fontSize: ww(0.04),
    color: '#5669FF',
  },
});
