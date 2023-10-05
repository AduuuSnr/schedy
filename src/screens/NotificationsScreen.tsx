import {LightGray, White} from '@constants/colors';
import {UbuntuBold, UbuntuMedium, UbuntuRegular} from 'assets/fonts';
import axios from 'axios';
import {ArrowHeader, Button, CustomAlert, Header} from 'components';
import {wh, ww} from 'helpers';
import React, {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';

interface Props {
  navigation: any;
}

const NotificationsScreen = ({navigation}: Props) => {
  const user = useSelector(state => state.app.user);
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [alertContent, setAlertContent] = useState({});
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = () => {
    const options = {
      method: 'POST',
      url: 'https://api.businessagenda.org/actions/getNotificationHistory',
      headers: {'Content-Type': 'application/json'},
      data: {userId: user.id},
    };

    axios
      .request(options)
      .then(function (response) {
        // console.log(response.data);
        setNotifications(response.data.data);
      })
      .catch(function (error) {
        console.error(error);
      });
    setRefreshing(false);
  };

  const acceptInvite = token => {
    const options = {
      method: 'POST',
      url: 'https://api.businessagenda.org/actions/doAction',
      headers: {'Content-Type': 'application/json'},
      data: {token},
    };

    axios
      .request(options)
      .then(function (response) {
        // console.log(response.data);
        setAlertContent({
          status: response.data.status,
          message: response.data.message,
        });
      })
      .catch(function (error) {
        console.error(error);
      });
    fetchNotifications();
  };
  const declineInvite = token => {
    const options = {
      method: 'POST',
      url: 'https://api.businessagenda.org/actions/doAction',
      headers: {'Content-Type': 'application/json'},
      data: {token, accept: 'deny'},
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        setAlertContent({
          status: response.data.status,
          message: response.data.message,
        });
      })
      .catch(function (error) {
        console.error(error);
      });
    fetchNotifications();
  };

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchNotifications();
  }, []);

  const timeSince = date => {
    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + ' years';
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + ' months';
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + ' days';
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + ' hours';
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + ' minutes';
    }
    return Math.floor(seconds) + ' seconds';
  };

  return (
    <ScrollView
      style={{flex: 1, backgroundColor: White}}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <CustomAlert
        showModal={showModal}
        setShowModal={setShowModal}
        status={alertContent.status}
        message={alertContent.message}
      />
      <SafeAreaView style={styles.container}>
        <ArrowHeader title="Notifications" onPress={() => navigation.pop()} />
        {Array.isArray(notifications) ? (
          notifications?.map((notification, index) => (
            <View key={index}>
              <View style={styles.notificationView}>
                <View style={{flex: 1}}>
                  <Image
                    style={styles.avatar}
                    source={{uri: notification?.actionDetails?.from?.avatar}}
                  />
                </View>

                <View style={{flex: 4}}>
                  <Text style={styles.fromText}>
                    {(notification?.actionDetails?.type == 'companyInvite' ||
                      notification?.actionDetails?.type == 'groupInvite') &&
                      notification?.actionDetails?.from?.fullname + `, `}
                    <Text
                      style={
                        styles.contentText
                      }>{`${notification.content}`}</Text>
                  </Text>
                </View>
                <View style={{flex: 2, alignItems: 'center'}}>
                  <View
                    style={{
                      alignSelf: 'flex-end',
                      justifyContent: 'flex-end',
                      width: '100%',
                    }}>
                    <Text
                      style={{
                        fontFamily: UbuntuMedium,
                        fontSize: ww(0.04),
                      }}>{` ${timeSince(
                      new Date(notification.date),
                    )} ago`}</Text>
                  </View>
                </View>
              </View>
              {(notification?.actionDetails?.type == 'companyInvite' ||
                notification?.actionDetails?.type == 'groupInvite') &&
                notification?.actionDetails?.status == 0 && (
                  <View
                    style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <Button
                      title="Reject"
                      style={{
                        ...styles.notificationActionButton,
                        backgroundColor: White,
                      }}
                      textStyle={{color: LightGray}}
                      onPress={() =>
                        declineInvite(notification?.actionDetails?.token)
                      }
                    />
                    <Button
                      title="Accept"
                      onPress={() => {
                        setShowModal(true);
                        acceptInvite(notification?.actionDetails?.token);
                      }}
                      style={styles.notificationActionButton}
                    />
                  </View>
                )}
            </View>
          ))
        ) : (
          <Text
            style={{
              fontSize: ww(0.05),
              alignSelf: 'center',
              fontFamily: UbuntuBold,
            }}>
            You don't have any notifications yet
          </Text>
        )}
      </SafeAreaView>
    </ScrollView>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: White,
    flex: 1,
  },
  notificationView: {
    flexDirection: 'row',
    marginVertical: wh(0.02),
    paddingLeft: ww(0.08),
  },
  notificationActionButton: {
    width: ww(0.35),
    height: wh(0.055),
    marginHorizontal: ww(0.02),
    marginVertical: wh(0.01),
  },
  avatar: {
    width: ww(0.1),
    height: ww(0.1),
    borderRadius: ww(0.05),
  },
  contentText: {
    fontSize: ww(0.037),
    fontFamily: UbuntuRegular,
  },
  fromText: {
    fontFamily: UbuntuMedium,
    color: '#060518',
    fontSize: ww(0.037),
  },
  when: {
    fontFamily: UbuntuRegular,
    fontSize: ww(0.033),
    color: '#3C3E56',
  },
});
