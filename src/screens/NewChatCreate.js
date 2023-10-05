import {MainBlue, White} from '@constants/colors';
import {UbuntuBold, UbuntuMedium, UbuntuRegular} from 'assets/fonts';
import {AddIcon, AlertIcon, CheckIcon, CloseIcon} from 'assets/icons';
import axios from 'axios';
import {ArrowHeader, Button, CustomAlert, Header, Searchbar} from 'components';
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
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';

const NewChatCreate = ({navigation}) => {
  const [people, setPeople] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [responseMessage, setResponseMessage] = useState();
  //   const [isMultiSelect, setsetIsMultiSelect] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const user = useSelector(state => state.app.user);

  const fetchPeopleToChat = () => {
    const options = {
      method: 'POST',
      url: `https://api.businessagenda.org/companies/getCompanyTeams`,
      headers: {'Content-Type': 'application/json'},
      data: {userId: user.id},
    };
    axios
      .request(options)
      .then(function (response) {
        console.log('fasdfas', response.data.message[0]);
        console.log('users: ', user.id);

        let people = [];
        response.data.message.map(company =>
          people.push(company.companyMembers),
        );
        console.log('fetchPeople: ', people);
        setPeople(people[0]);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const searchPersons = () => {
    const options = {
      method: 'POST',
      url: 'https://api.businessagenda.org/users/searchUser',
      headers: {'Content-Type': 'application/json'},
      data: {text: searchValue},
    };

    axios
      .request(options)
      .then(function (response) {
        console.log('search: ', response.data.data);
        setPeople(response.data.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const createMessageGroup = () => {
    if (people.filter(person => person.selected)?.length > 1) {
      const options = {
        method: 'POST',
        url: 'https://api.businessagenda.org/chat/createGroup',
        headers: {'Content-Type': 'application/json'},
        data: {
          sender: user.id,
          members: [
            ...people
              .filter(person => person.selected)
              .map(person => person.id),
            user.id,
          ],

          roomName: 'Untitled Group',
          banner:
            'https://bagenda-space.fra1.cdn.digitaloceanspaces.com/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg',
          message: {
            text: 'Hi !',
            createdAt: new Date(),
            user: {
              _id: user.id,
              name: user.fullname,
              avatar: user.avatar,
            },
          },
        },
      };

      axios
        .request(options)
        .then(function (response) {
          if (response.data.status === 'success') {
            navigation.navigate('ChatScreen', {
              roomIdentity: response.data.data.roomIdentity,
              receiverId: response.data.data.members.filter(
                member => member != user.id,
              )[0],
              isGroup: response.data.data.roomName,
            });
          }
        })
        .catch(function (error) {
          console.error(error);
        });
    } else {
      const options = {
        method: 'POST',
        url: 'https://api.businessagenda.org/chat/send',
        headers: {'Content-Type': 'application/json'},
        data: {
          sender: user.id,
          reciever: people.filter(person => person.selected)[0]?.id,
          message: {
            text: 'Hi !',
            createdAt: new Date(),
            user: {
              _id: user.id,
              name: user.fullname,
              avatar: user.avatar,
            },
          },
        },
      };
      axios
        .request(options)
        .then(function (response) {
          console.log(response.data);

          if (response.data.status === 'success') {
            navigation.navigate('ChatScreen', {
              roomIdentity: response.data.message.roomIdentity,
              receiverId: response.data.message.members.filter(
                member => member != user.id,
              )[0],
              person: response.data.message.messages.filter(
                message => message.user.id != user.id,
              )[0]?.user,
            });
          }
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  };

  useEffect(() => {
    fetchPeopleToChat();
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: White}}>
      <ScrollView style={{backgroundColor: White, flex: 1}}>
        <SafeAreaView style={styles.container}>
          <ArrowHeader title="New Chat" onPress={() => navigation.pop()} />
          <Searchbar
            value={searchValue}
            onChangeText={text => setSearchValue(text)}
            onSubmitEditing={searchPersons}
          />
          <CustomAlert
            message={responseMessage?.message}
            status={responseMessage?.status}
            showModal={showModal}
            setShowModal={setShowModal}
          />

          {people?.map(
            (person, index) =>
              person.id !== user.id && (
                <Pressable
                  key={index}
                  activeOpacity={0.7}
                  onLongPress={({nativeEvent}) => {
                    //   setsetIsMultiSelect(true);
                    const newPeople = people.map((person, id) => {
                      if (id === index) {
                        person.selected = !person?.selected;
                        return person;
                      } else {
                        return person;
                      }
                    });
                    setPeople(newPeople);
                  }}
                  onPress={() => {
                    const newPeople = people.map((person, id) => {
                      if (id === index) {
                        person.selected = !person?.selected;
                        return person;
                      } else {
                        return person;
                      }
                    });
                    setPeople(newPeople);
                  }}
                  style={[
                    styles.row,
                    {
                      width: ww(1),
                      marginVertical: wh(0.015),
                      paddingHorizontal: ww(0.08),
                    },
                  ]}>
                  <View style={styles.avatarBackground}>
                    <Image
                      style={styles.avatar}
                      source={{
                        uri: person?.avatar,
                      }}
                    />
                  </View>
                  <View style={styles.messageArea}>
                    <Text style={styles.personFullName}>
                      {person?.fullname}
                    </Text>
                  </View>
                  {person?.selected && (
                    <View>
                      <CheckIcon size={ww(0.05)} />
                    </View>
                  )}
                </Pressable>
              ),
          )}
        </SafeAreaView>
      </ScrollView>
      <Button
        title={
          people?.filter(person => person.selected)?.length > 1
            ? 'Create Group'
            : 'Create Chat'
        }
        onPress={createMessageGroup}
        style={{
          position: 'absolute',
          bottom: wh(0.09),
          alignSelf: 'center',
        }}
      />
    </SafeAreaView>
  );
};

export default NewChatCreate;

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
  timeInfo: {flex: 1, justifyContent: 'center'},
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
});
