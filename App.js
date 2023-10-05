import React, {useEffect, useState} from 'react';
import {PermissionsAndroid, Platform, LogBox} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import OneSignal from 'react-native-onesignal';
import BackgroundTimer from 'react-native-background-timer';
import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';

import {SplashScreen} from 'screens';
import {keyLang, keyUser} from '@constants/@async-keys';
import {
  setBusinesses,
  setTwilioToken,
  setUser,
  setAdvertisement,
} from '@redux/app/actions';
import {getData} from 'helpers';
import {apiUrl} from '@constants';
import {RootNavigator} from 'routes';
import {setLang} from '@redux/lang/action';

LogBox.ignoreLogs(['Reanimated 2']);

const App = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const user = useSelector(state => state.app.user);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);
    } else {
      Geolocation.requestAuthorization('whenInUse');
    }
  };

  const backgroundLocation = res => {
    Geolocation.getCurrentPosition(
      position => {
        const latitude = position?.coords?.latitude;
        const longitude = position?.coords?.longitude;
        BackgroundTimer.runBackgroundTimer(() => {
          const options = {
            method: 'POST',
            url: 'https://api.businessagenda.org/users/getLocation',
            headers: {'Content-Type': 'application/json'},
            data: {
              lat: latitude,
              long: longitude,
              userId: res.id,
            },
          };

          axios
            .request(options)
            .then(function (response) {
              // console.log(response.data);
            })
            .catch(function (error) {
              console.error(error);
            });
        }, 15000);
      },
      error => {},
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );

    //rest of code will be performing for iOS on background too
  };

  const oneSignalInit = (email, id) => {
    OneSignal.setLogLevel(6, 0);
    OneSignal.setAppId('2546f458-f4fb-49cb-b0e4-d79d3d7c5c6e');
    if (Platform.OS !== 'android') {
      OneSignal.promptForPushNotificationsWithUserResponse(response => {});
    }
    //Method for handling notifications received while app in foreground
    OneSignal.setNotificationWillShowInForegroundHandler(
      notificationReceivedEvent => {
        let notification = notificationReceivedEvent.getNotification();
        const data = notification.additionalData;
        notificationReceivedEvent.complete(notification);
      },
    );

    //Method for handling notifications opened
    OneSignal.setNotificationOpenedHandler(notification => {});
    OneSignal.sendTag('email', email);
    OneSignal.setExternalUserId(id?.toString(), results => {});
  };

  const fetchCompanies = id => {
    const options = {
      method: 'POST',
      url: `${apiUrl}/companies/getCompanyTeams`,
      headers: {'Content-Type': 'application/json'},
      data: {userId: id},
    };

    axios
      .request(options)
      .then(function (response) {
        // console.log(response.data.message);
        dispatch(setBusinesses(response.data.message));
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const fetchTwilioToken = user => {
    const options = {
      method: 'POST',
      url: 'https://api.businessagenda.org/users/getRTCToken',
      headers: {'Content-Type': 'application/json'},
      data: {query: {userName: user.userId}},
    };

    axios
      .request(options)
      .then(function (response) {
        dispatch(setTwilioToken(response.data.data));
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  // LOCATION BACKGROUND İŞLEMLERİ

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, []);

  useEffect(() => {
    requestPermissions();
    // CHECK IF USER EXISTS ON PHONE LOCALE DATA
    getData(keyUser, res => {
      if (res) {
        dispatch(setUser(res));
        oneSignalInit(res.email, res.id);
        backgroundLocation(res);
        fetchTwilioToken(res);
        fetchCompanies(res.id);
      }
    });
    // LANGUAGE
    getData(keyLang, res => {
      if (res) {
        dispatch(setLang(res));
      }
    });

    inCallManagerPermission();
  }, []);

  useEffect(() => {
    console.log(user?.tier);
    if (user?.tier === 0) {
      axios
        .post(`${apiUrl}/users/adsForUsers`, {
          userId: user?.id,
          date: new Date().toISOString(),
        })
        .then(res => dispatch(setAdvertisement(res?.data?.data?.url)))

        .catch(error => console.log(error));
    }
  }, []);

  const inCallManagerPermission = () => {};

  return loading ? <SplashScreen /> : <RootNavigator />;
};

export default App;
