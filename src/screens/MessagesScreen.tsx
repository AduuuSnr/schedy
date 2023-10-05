/* eslint-disable no-lone-blocks */
import {Gray, MainBlue, White} from '@constants/colors';
import {UbuntuBold, UbuntuMedium, UbuntuRegular} from 'assets/fonts';
import {AddIcon, PhoneIcon} from 'assets/icons';
import axios from 'axios';
import {ArrowHeader, Header} from 'components';
import {ww, wh} from 'helpers';
import React, {useEffect, useState} from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  ScrollView,
  RefreshControl,
  Modal,
} from 'react-native';

import {useSelector} from 'react-redux';

interface Props {
  navigation: any;
  route: any;
}

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

const MessagesScreen = ({navigation, route}: Props) => {
  const [people, setPeople] = useState([]);
  const user = useSelector(state => state.app.user);
  const lang = useSelector(state => state.lang);
  const [refreshing, setRefreshing] = React.useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [roomIdentity, setRoomIdentity] = useState('');

  const fetchPersonsToChat = () => {
    const options = {
      method: 'POST',
      url: 'https://api.businessagenda.org/chat/getConversations',
      headers: {'Content-Type': 'application/json'},
      data: {userId: user.id},
    };

    axios
      .request(options)
      .then(function (response) {
        setPeople(response.data.message.chatHistory);
        setRoomIdentity(response.data.message.chatHistory.roomIdentity);
      })
      .catch(function (error) {
        console.error(error);
      });
    setRefreshing(false);
  };

  useEffect(() => {
    fetchPersonsToChat();
  }, []);

  useEffect(() => {
    if (route?.params) {
    }
  });

  const lastMessage = messages => {
    let last;
    let short = messages.sort(function (a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    })[0];

    if (short?.text) {
      last = short?.text;
    } else if (short?.location) {
      last = 'Has sent you a location';
    } else if (
      short?.image ||
      short?.csv ||
      short?.pdf ||
      short?.docx ||
      short?.video
    ) {
      last = 'Has sent you a file';
    } else if (short?.audio) {
      last = 'Has sent you a sound';
    }

    return last;
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchPersonsToChat();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Messages"
        onPress={() => navigation.openDrawer()}
        onPressNotification={() => navigation.navigate('NotificationsScreen')}
      />
      <ScrollView
        style={{backgroundColor: White}}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.frequentlyChatted}>
          <View style={{flex: 1, justifyContent: 'flex-end'}}>
            <Text style={styles.frequentlyChattedText}>Frequently Chatted</Text>
          </View>
          <View style={[styles.row, {flex: 3}]}>
            {people?.map((person, index) => {
              const opponent = person.members.filter(
                member => member?.id !== user.id,
              )[0];

              return (
                index < 3 && (
                  <Pressable
                    style={styles.personView}
                    key={index}
                    onPress={() =>
                      navigation.navigate('ChatScreen', {
                        roomIdentity: person?.roomIdentity,
                        receiverId: opponent?.id,
                        person: opponent,
                        isGroup: person?.roomName,
                      })
                    }>
                    <View style={styles.avatarBackground}>
                      {opponent?.avatar && (
                        <Image
                          style={styles.avatar}
                          source={{
                            uri: opponent.avatar,
                          }}
                        />
                      )}
                    </View>
                    <Text style={styles.personName}>{opponent?.fullname}</Text>
                  </Pressable>
                )
              );
            })}
          </View>
        </View>
        <View>
          {people
            ?.sort((a, b) => a.messages.createdAt > b.messages.createdAt)
            .map((person, index) => {
              console.log('person: ', person.messages.createdAt);

              const opponent = person.members.filter(
                member => member?.id !== user.id,
              )[0];
              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.7}
                  onPress={() =>
                    navigation.navigate('ChatScreen', {
                      roomIdentity: person.roomIdentity,
                      receiverId: opponent?.id,
                      person: opponent,
                      isGroup: person.roomName,
                      banner: person.banner,
                    })
                  }
                  style={[
                    styles.row,
                    {
                      width: ww(1),
                      marginVertical: wh(0.015),
                      paddingHorizontal: ww(0.08),
                    },
                  ]}>
                  <View style={styles.avatarBackground}>
                    {opponent?.avatar && (
                      <Image
                        style={styles.avatar}
                        source={{
                          uri: person.banner || opponent?.avatar,
                        }}
                      />
                    )}
                  </View>
                  <View style={styles.messageArea}>
                    <Text style={styles.personFullName}>
                      {person.roomName || opponent?.fullname}
                    </Text>
                    <Text style={styles.personLastMessage} numberOfLines={1}>
                      {lastMessage(person.messages)}
                    </Text>
                  </View>

                  <View style={styles.timeInfo}>
                    <Text style={styles.timeText}>
                      {timeSince(
                        new Date(
                          person?.messages.sort(function (a, b) {
                            return (
                              new Date(b.createdAt) - new Date(a.createdAt)
                            );
                          })[0]?.createdAt,
                        ),
                      )}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
        </View>
      </ScrollView>
      <Pressable
        style={{position: 'absolute', bottom: wh(0.05), right: ww(0.1)}}
        onPress={() => navigation.navigate('NewChatCreate')}>
        <AddIcon size={ww(0.13)} />
      </Pressable>
    </SafeAreaView>
  );
};

export default MessagesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: White,
    alignItems: 'center',
  },
  messageArea: {
    flex: 7,
    paddingHorizontal: ww(0.05),
    justifyContent: 'center',
  },
  messageText: {
    fontFamily: UbuntuBold,
    fontSize: ww(0.06),
    marginLeft: ww(0.1),
    marginVertical: wh(0.03),
    alignSelf: 'flex-start',
  },
  timeInfo: {flex: 3, alignItems: 'flex-end'},
  personName: {
    fontFamily: UbuntuRegular,
    fontSize: ww(0.035),
    marginTop: wh(0.001),
    color: White,
  },
  personFullName: {
    fontFamily: UbuntuMedium,
    fontSize: ww(0.04),
    marginBottom: wh(0.007),
  },
  personLastMessage: {
    fontFamily: UbuntuRegular,
    fontSize: ww(0.035),
    color: '#5E5E5E',
  },
  timeText: {
    fontFamily: UbuntuMedium,
    fontSize: ww(0.035),
  },
  frequentlyChatted: {
    width: ww(0.9),
    height: wh(0.17),
    borderRadius: ww(0.03),
    elevation: 5,
    backgroundColor: MainBlue,
    alignSelf: 'center',
  },
  frequentlyChattedText: {
    fontFamily: UbuntuBold,
    fontSize: ww(0.038),
    marginLeft: ww(0.06),
    color: White,
  },
  personView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  avatarBackground: {
    width: ww(0.13),
    height: ww(0.13),
    borderRadius: ww(0.13),
    backgroundColor: White,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: '95%',
    height: '95%',
    borderRadius: ww(0.13),
  },
  owBack: {
    alignItems: 'center',
    backgroundColor: 'red',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
  },
  backTextWhite: {
    color: '#000',
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#CCC',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 50,
  },
  deleteModalContainer: {
    flex: 0.3,
    width: ww(0.5),
    marginTop: wh(0.5),
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    elevation: 10,
    shadowColor: '#58563D',
    shadowOffset: {
      width: 5,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  deleteModalButtonsContainer: {
    flexDirection: 'row',
    marginTop: wh(0.03),
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  yesButton: {
    backgroundColor: 'green',
    width: ww(0.15),
    height: wh(0.03),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    elevation: 10,
    shadowColor: '#58563D',
    shadowOffset: {
      width: 5,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  noButton: {
    backgroundColor: 'red',
    width: ww(0.15),
    height: wh(0.03),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    elevation: 10,
    shadowColor: '#58563D',
    shadowOffset: {
      width: 5,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  buttonText: {
    color: 'white',
    fontFamily: UbuntuMedium,
  },
  deleteChatText: {
    fontFamily: UbuntuMedium,
    textAlign: 'center',
  },
});
