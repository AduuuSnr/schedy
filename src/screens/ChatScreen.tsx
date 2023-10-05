/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useCallback, useEffect, useState, useRef, useMemo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Modal,
  Keyboard,
  Alert,
  Image,
  TouchableOpacity,
  TextInput,
  Pressable,
  Platform,
} from 'react-native';
import axios from 'axios';
import {useSelector} from 'react-redux';

import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';

import {Black, Gray, MainBlue, White} from '@constants/colors';
import {
  ArrowHeader,
  Button,
  GiftedChat,
  HeaderBack,
  renderBubble,
  renderComposer,
  renderSend,
} from 'components';
import {
  openCamera,
  openDocument,
  RenderAudio,
  renderCustomView,
  sendLocation,
} from 'components/MessageContainer/mediaUtils';
import {renderMessageVideo} from 'components/MessageContainer/inputToolbar';
import {
  Attach,
  BackIcon,
  Camera,
  CameraIcon,
  Delete,
  Edit,
  FileIcon,
  GoBack,
  Location,
  PhoneIcon,
} from 'assets/icons';
import {ww, wh} from 'helpers';
import {UbuntuMedium} from 'assets/fonts';
import {socket} from '@constants/socket';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import {ScrollView} from 'react-native-gesture-handler';
import CheckBox from '@react-native-community/checkbox';
import {BlurView, VibrancyView} from '@react-native-community/blur';

import {ImagePicker, doStorage} from 'helpers';
import {doStorageURL} from 'helpers/doStorage';

interface Props {
  navigation: any;
  route: any;
}

const ChatScreen = ({navigation, route}: Props) => {
  const receiverId = route?.params?.receiverId;
  const roomIdentity = route?.params?.roomIdentity;

  const isGroup = route?.params?.isGroup;
  const person = route?.params?.person;
  const roomName = route?.params?.roomName;
  const banner = route?.params?.banner;
  const fromPhoneCall = route?.params?.fromPhoneCall;
  const user = useSelector(state => state.app.user);
  const lang = useSelector(state => state.lang);

  const [messages, setMessages] = useState([]);
  const [modal, setModal] = useState(false);
  const [personModal, setPersonModal] = useState(false);
  const [personEditModal, setPersonEditModal] = useState(false);
  const [users, setUsers] = useState('');
  const [editModal, setEditModal] = useState(false);
  const [startAudio, setStartAudio] = useState();
  const [members, setMembers] = useState([]);
  const [showVoiceRecord, setShowVoiceRecord] = useState(true);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const [audioPath, setAudioPath] = useState(
    `${AudioUtils.DocumentDirectoryPath}/${new Date().getTime()}test.aac`,
  );
  const [editImage, setEditImage] = useState(banner);
  const [editGroupName, setEditGroupName] = useState(isGroup);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const imagePickerModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['15%', '20%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    Keyboard.dismiss();
    bottomSheetModalRef.current?.present();
  }, []);

  const imagePickerModal = useCallback(() => {
    Keyboard.dismiss();
    imagePickerModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {}, []);

  useEffect(() => {
    console.log('ChatScreen Room Identity: ', roomIdentity);
  }, []);

  const getMessages = () => {
    if (!isGroup) {
      const options = {
        method: 'POST',
        url: 'https://api.businessagenda.org/chat/get',
        headers: {'Content-Type': 'application/json'},
        data: {roomIdentity},
      };

      axios
        .request(options)
        .then(function (response) {
          setMessages(response?.data?.data[0].messages.reverse());
        })
        .catch(function (error) {
          console.error(error);
        });
    } else {
      const options = {
        method: 'POST',
        url: 'https://api.businessagenda.org/chat/getConversationGroup',
        headers: {'Content-Type': 'application/json'},
        data: {group: roomIdentity},
      };

      axios
        .request(options)
        .then(function (response) {
          setMessages(response?.data?.data[0]?.messages?.reverse());
          setMembers(response?.data?.data[0]?.members);
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  };

  useEffect(() => {
    if (fromPhoneCall == 'video') {
      navigation.navigate('CameraChatScreen', {
        person,
        roomIdentity,
      });
    } else if (fromPhoneCall == 'voice') {
      navigation.navigate('VoiceCallChat', {
        person,
        roomIdentity,
      });
    }
    getMessages();
    socket?.on('incommingMessage', () => {
      getMessages();
    });
  }, []);

  const deleteChat = () => {
    console.log('delete Room: ', roomIdentity);
    console.log('delete ID: ', user.id);
    let data = JSON.stringify({
      roomIdentity: roomIdentity,
      sender: user.id,
    });

    let config = {
      method: 'post',
      url: 'https://api.businessagenda.org/chat/deleteChat',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios(config)
      .then(response => {
        console.log(JSON.stringify(response.data));
        if (response.data.status === 'success') {
          setDeleteModalVisible(false);
        } else {
          Alert.alert('Error', response.data.message);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const onSend = useCallback((messages = []) => {
    const text = messages[0]?.text;
    const location = messages[0]?.location;
    const image = messages[0]?.image;
    const pdf = messages[0]?.pdf;
    const video = messages[0]?.video;
    const csv = messages[0]?.csv;
    const docx = messages[0]?.docx;
    const audio = messages[0]?.audio;

    // console.log(messages[0]);

    if (!isGroup) {
      const options = {
        method: 'POST',
        url: 'https://api.businessagenda.org/chat/send',
        headers: {'Content-Type': 'application/json'},
        data: {
          sender: user.id,
          reciever: receiverId,
          message: {
            text,
            location,
            image,
            video,
            pdf,
            csv,
            docx,
            audio,
            createdAt: new Date(),
            user: {_id: user.id, name: user.fullname, avatar: user.avatar},
          },
        },
      };

      axios
        .request(options)
        .then(function (response) {
          if (socket?.connected) {
            socket?.emit('newMessage', 'sent');

            setMessages(previousMessages =>
              GiftedChat.append(previousMessages, messages),
            );
          } else {
            Alert.alert('Connection Problem');
          }
        })
        .catch(function (error) {
          console.error(error);
        });
    } else {
      const options = {
        method: 'POST',
        url: 'https://api.businessagenda.org/chat/sendGroup',
        headers: {'Content-Type': 'application/json'},
        data: {
          sender: user.id,
          group: roomIdentity,
          message: {
            text,
            location,
            image,
            video,
            pdf,
            csv,
            audio,
            docx,
            createdAt: new Date(),
            user: {_id: user.id, name: user.fullname, avatar: user.avatar},
          },
        },
      };

      axios
        .request(options)
        .then(function (response) {
          if (socket?.connected) {
            socket?.emit('newMessage', 'sent');

            setMessages(previousMessages =>
              GiftedChat.append(previousMessages, messages),
            );
          } else {
            Alert.alert('Connecting Problem');
          }
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  }, []);

  const getUsers = () => {
    var data = JSON.stringify({
      companyId: 1,
    });
    var config = {
      method: 'post',
      url: 'https://api.businessagenda.org/companies/getCompanyMembers',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        setUsers(response.data.message);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleAudio = async onSend => {
    if (!startAudio) {
      try {
        await prepareAudio(audioPath);
        setStartAudio(true);
        const filePath = await AudioRecorder.startRecording();
      } catch (error) {
        console.error(error);
      }
    } else {
      bottomSheetModalRef?.current?.close();

      setStartAudio(false);
      const filePath = await AudioRecorder.stopRecording();

      const fileName = `${user.id}-${new Date().getTime()}.aac`;

      onSend([
        {
          user: {_id: user.id, name: user.fullname, avatar: user.avatar},
          audio: await doStorageURL(
            'groupBanners/',
            Platform.OS === 'ios' ? audioPath : `file://${audioPath}`,
            `${fileName}`,
            'audio/aac',
          ),
        },
      ]);
    }
  };

  const prepareAudio = async () => {
    const isAuthorised = await AudioRecorder.requestAuthorization();
    if (!isAuthorised) return;

    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: 'Low',
      AudioEncoding: 'aac',
      AudioEncodingBitRate: 32000,
    });

    AudioRecorder.onProgress = data => {};

    AudioRecorder.onFinished = data => {};
  };

  const editGroup = () => {
    var data = JSON.stringify({
      roomIdentity,
      userId: user.id,
      banner: editImage,
      roomName: editGroupName,
    });

    var config = {
      method: 'post',
      url: 'https://api.businessagenda.org/chat/editChatGroup',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        if (response.data.status === 'success') {
          setEditModal(false);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    getUsers();
    prepareAudio();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* VOICE ŞEYSİ BURDA ABİ */}

      {/* {showVoiceRecord && (
        <TouchableOpacity
          onPress={async () => {
            await handleAudio(onSend);
          }}
          style={{
            zIndex: 999999999999,
            position: 'absolute',
            top: wh(0.855),
            right: ww(0.05),
            backgroundColor: White,
            width: ww(0.12),
            height: ww(0.12),
            borderRadius: ww(0.12),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('assets/images/microphone.png')}
            style={{
              tintColor: startAudio ? 'red' : MainBlue,
            }}
          />
        </TouchableOpacity>
      )} */}

      {/* VOICE ŞEYSİ BURDA ABİ */}

      <View style={styles.chatHeader}>
        <TouchableOpacity
          onPress={() => navigation.pop()}
          style={{flex: 1, marginLeft: ww(0.1)}}>
          <GoBack size={ww(0.05)} />
        </TouchableOpacity>
        <Pressable
          onPress={() => (isGroup ? setModal(true) : setPersonModal(true))}
          style={{flex: 3, paddingRight: ww(0.1)}}>
          <Text style={styles.chattedPerson}>
            {isGroup || person?.fullname}
          </Text>
        </Pressable>
        {console.log(isGroup)}
        {isGroup !== undefined ? (
          <></>
        ) : (
          <View style={styles.chatActions}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.cameraIcon}
              onPress={() =>
                navigation.navigate('CameraChatScreen', {
                  person,
                  roomIdentity,
                })
              }>
              <CameraIcon size={ww(0.06)} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate('VoiceCallChat', {
                  person,
                  roomIdentity,
                })
              }
              style={{marginTop: wh(0.005)}}>
              <PhoneIcon size={ww(0.06)} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <SafeAreaView style={{flex: 25}}>
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          scrollToBottom
          showUserAvatar
          onInputTextChanged={text => {
            if (text) {
              setShowVoiceRecord(false);
            } else {
              setShowVoiceRecord(true);
            }
          }}
          renderSend={renderSend}
          renderComposer={renderComposer}
          renderBubble={renderBubble}
          renderMessageVideo={renderMessageVideo}
          alwaysShowSend={false}
          renderMessageAudio={props => <RenderAudio {...props} />}
          renderCustomView={renderCustomView}
          renderActions={() => (
            <TouchableOpacity
              style={styles.attachIcon}
              onPress={handlePresentModalPress}>
              <Attach />
            </TouchableOpacity>
          )}
          user={{
            _id: Number(user?.id),
            name: user?.fullName,
            avatar: user?.avatar,
          }}
        />

        {/* --------------------------- GROUP MODAL --------------------------- */}
        <Modal animationType="slide" transparent={true} visible={personModal}>
          {/* ----------------------------------------------------------------------------------- PERSON MODAL ------------------------------------------------------------------------- */}
          <View style={styles.modalCenteredView}>
            <BlurView
              style={styles.absolute}
              blurType="light"
              blurAmount={10}
              reducedTransparencyFallbackColor="white"
            />
            <SafeAreaView style={styles.personModalView}>
              <Modal
                animationType="fade"
                visible={deleteModalVisible}
                transparent={true}>
                <BlurView
                  style={styles.absolute}
                  blurType="light"
                  blurAmount={10}
                  reducedTransparencyFallbackColor="white"
                />
                <View style={styles.deleteModalContainer}>
                  <Text style={styles.deleteChatText}>
                    {lang.deleteChatText}
                  </Text>
                  <View style={styles.deleteModalButtonsContainer}>
                    <TouchableOpacity
                      style={styles.yesButton}
                      onPress={deleteChat}>
                      <Text style={styles.buttonText}>{lang.yes}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.noButton}
                      onPress={() => setDeleteModalVisible(false)}>
                      <Text style={styles.buttonText}>{lang.no}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

              <TouchableOpacity
                style={styles.goBack}
                onPress={() => setPersonModal(false)}>
                <GoBack color={'#5A63FA'} />
              </TouchableOpacity>
              <View style={{marginTop: wh(0.05)}}>
                <Image
                  source={{uri: person?.avatar}}
                  style={styles.personImage}
                />
              </View>
              <TouchableOpacity
                style={styles.personDelete}
                onPress={() => setDeleteModalVisible(true)}>
                <Delete size={ww(0.07)} color={'#5A63FA'} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.groupNameView}>
                <Text style={styles.groupNameText}>{person?.fullname}</Text>
              </TouchableOpacity>
            </SafeAreaView>
          </View>
        </Modal>
        <Modal animationType="fade" transparent={true} visible={modal}>
          {/* ----------------------------------------------------------------------------------- GROUP MODAL ------------------------------------------------------------------------- */}
          <Modal
            animationType="fade"
            transparent={false}
            visible={personEditModal}>
            <SafeAreaView style={styles.centeredView}>
              <ArrowHeader
                title="Edit Group"
                onPress={() => setEditModal(false)}
              />
              <View style={styles.modalView}>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                  }}>
                  <Pressable
                    onPress={() =>
                      ImagePicker(res => {
                        doStorage(
                          'groupBanners/',
                          res[0].uri,
                          `${new Date().getTime()}-${res[0].fileName}`,
                          res[0].type,
                          setEditImage,
                          editImage,
                        );
                      }, false)
                    }>
                    {editImage ? (
                      <Image
                        source={{uri: editImage}}
                        style={styles.groupImage}
                      />
                    ) : (
                      <Image source={{uri: banner}} style={styles.groupImage} />
                    )}
                  </Pressable>

                  <TextInput
                    value={editGroupName}
                    onChangeText={text => setEditGroupName(text)}
                    style={styles.editGroupName}
                  />
                  <Button
                    title="edit"
                    onPress={editGroup}
                    style={{marginTop: wh(0.02)}}
                  />
                </View>
              </View>
            </SafeAreaView>
          </Modal>
          {/* ----------------------------------------------------------------------------------- GROUP MODAL ------------------------------------------------------------------------- */}
          <SafeAreaView style={styles.centeredView}>
            <SafeAreaView style={styles.modalView}>
              <Modal
                animationType="fade"
                visible={deleteModalVisible}
                transparent={true}>
                <View style={styles.deleteModalContainer}>
                  <Text style={styles.deleteChatText}>
                    {lang.deleteChatText}
                  </Text>
                  <View style={styles.deleteModalButtonsContainer}>
                    <TouchableOpacity
                      style={styles.yesButton}
                      onPress={deleteChat}>
                      <Text style={styles.buttonText}>{lang.yes}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.noButton}
                      onPress={() => setDeleteModalVisible(false)}>
                      <Text style={styles.buttonText}>{lang.no}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
              <TouchableOpacity
                style={styles.goBack}
                onPress={() => setModal(!modal)}>
                <GoBack color={Gray} />
              </TouchableOpacity>
              <Image source={{uri: editImage}} style={styles.groupImage} />

              <TouchableOpacity
                style={styles.edit}
                onPress={() => setEditModal(true)}>
                <Edit size={ww(0.07)} color={Gray} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.delete}
                onPress={() => setDeleteModalVisible(true)}>
                <Delete size={ww(0.07)} color={Gray} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.groupNameView}>
                <Text style={styles.groupNameText}>{editGroupName}</Text>
              </TouchableOpacity>
              <ScrollView style={{width: '100%'}}>
                {Array.isArray(users) &&
                  users?.map(i => (
                    <View key={i.id} style={styles.avatarView}>
                      <View style={{left: ww(0.05)}}>
                        <Image source={{uri: i.avatar}} style={styles.avatar} />
                      </View>
                      <View>
                        <Text
                          style={{
                            fontFamily: UbuntuMedium,
                            fontSize: ww(0.04),
                          }}>
                          {i.fullname}
                        </Text>
                      </View>

                      <CheckBox style={{right: ww(0.03)}} />
                    </View>
                  ))}
              </ScrollView>
              <View style={styles.editUserButtonView}>
                <Button title="Edit Users" />
              </View>
            </SafeAreaView>
          </SafeAreaView>
        </Modal>
        {/* ------------------------- GROUP MODAL -------------------------- */}
      </SafeAreaView>
      {/* --------------------------- Attach MODAL --------------------------- */}
      <BottomSheetModalProvider>
        <View style={styles.container}>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            style={styles.shadow}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}>
            <View style={styles.contentContainer}>
              <Text style={styles.sendTitle}>Send</Text>
              <View style={styles.iconsView}>
                <TouchableOpacity
                  onPress={async () => {
                    await openCamera(user, onSend);
                    bottomSheetModalRef?.current?.close();
                  }}
                  style={styles.cameraView}>
                  <Camera color={White} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    await sendLocation(user, onSend);
                    bottomSheetModalRef?.current?.close();
                  }}
                  style={styles.locationView}>
                  <Location color={White} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    await openDocument(user, onSend);
                    bottomSheetModalRef?.current?.close();
                  }}
                  style={styles.fileView}>
                  <FileIcon />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    await handleAudio(onSend);
                  }}
                  style={styles.fileView}>
                  <Image
                    source={require('assets/images/microphone.png')}
                    style={{tintColor: startAudio ? 'red' : 'white'}}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </BottomSheetModal>
        </View>
      </BottomSheetModalProvider>
      {/* --------------------------- Attach MODAL --------------------------- */}
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: White,
  },
  attachIcon: {
    alignSelf: 'center',
    width: ww(0.1),
    height: ww(0.1),
    borderRadius: ww(0.1),
    backgroundColor: White,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    marginLeft: ww(0.02),
  },
  cameraIcon: {
    position: 'absolute',
    right: ww(0.2),
    top: wh(0.005),
  },
  chatHeader: {
    flexDirection: 'row',
    paddingVertical: wh(0.02),
    backgroundColor: White,
    alignItems: 'center',
  },
  chattedPerson: {
    fontFamily: UbuntuMedium,
    fontSize: ww(0.05),
  },
  chatActions: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  cameraView: {
    backgroundColor: '#5059F9',
    width: ww(0.15),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: wh(0.07),
  },
  locationView: {
    backgroundColor: '#5059F9',
    width: ww(0.15),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: wh(0.07),
    marginLeft: ww(0.05),
  },
  editGroupName: {
    borderWidth: 1,
    borderRadius: ww(0.02),
    borderColor: MainBlue,
    width: ww(0.8),
    height: wh(0.05),
    paddingHorizontal: ww(0.05),
    marginVertical: wh(0.03),
  },
  recordAudio: {
    position: 'absolute',
    zIndex: 99,
    right: ww(0.5),
    bottom: wh(0.06),
  },
  fileView: {
    backgroundColor: '#5059F9',
    width: ww(0.15),
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
    height: wh(0.07),
    marginLeft: ww(0.05),
  },
  iconsView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    elevation: 10,
    shadowColor: '#58563D',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  groupNameView: {
    flexDirection: 'row',
    position: 'absolute',
    top: wh(0.01),
  },
  groupNameText: {
    fontFamily: UbuntuMedium,
    color: MainBlue,
    fontSize: ww(0.05),
  },
  sendTitle: {
    fontFamily: UbuntuMedium,
    fontSize: ww(0.05),
    left: ww(0.1),
    marginBottom: wh(0.02),
  },
  groupImage: {
    height: wh(0.3),
    width: ww(0.8),
    resizeMode: 'contain',
  },
  personImage: {
    height: wh(0.25),
    width: ww(0.5),
    borderRadius: ww(0.1),
    borderWidth: 1,
    borderColor: MainBlue,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCenteredView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalView: {
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    width: ww(1),
    flex: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  personModalView: {
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    flex: 0.5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  goBack: {
    position: 'absolute',
    zIndex: 99,
    alignSelf: 'flex-start',
    left: ww(0.05),
    top: wh(0.01),
    shadowColor: '#111',
    shadowOffset: {
      width: -3,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  edit: {
    position: 'absolute',
    zIndex: 99,
    alignSelf: 'flex-start',
    right: ww(0.05),
    top: wh(0.01),
  },
  delete: {
    position: 'absolute',
    zIndex: 99,
    alignSelf: 'flex-start',
    right: ww(0.15),
    top: wh(0.01),
  },
  personDelete: {
    position: 'absolute',
    zIndex: 99,
    alignSelf: 'flex-start',
    right: ww(0.05),
    top: wh(0.01),
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  editUserButtonView: {
    alignItems: 'center',
    width: ww(1),
    height: wh(0.1),
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  avatarView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: wh(0.03),
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
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
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
