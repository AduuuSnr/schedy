import {apiUrl} from '@constants';
import {MainBlue, White} from '@constants/colors';
import {setBusinesses} from '@redux/app/actions';
import {UbuntuBold, UbuntuMedium, UbuntuRegular} from 'assets/fonts';
import {AddPicture, AlertIcon, CloseIcon} from 'assets/icons';
import axios, {AxiosRequestConfig} from 'axios';
import {
  Button,
  CustomAlert,
  HeaderBack,
  LoginInput,
  TaskView,
} from 'components';
import {ImagePicker} from 'helpers';
import {doStorage} from 'helpers';
import {wh, ww} from 'helpers';
import React, {useEffect, useState} from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  RefreshControl,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

interface Props {
  navigation: any;
  route: any;
}

const GroupsScreen = ({navigation, route}: Props) => {
  const groupId = route?.params?.group?.id;
  const companyOwnerId = route?.params?.companyOwnerId;
  const dispatch = useDispatch();
  const user = useSelector(state => state.app.user);
  const [tasks, setTasks] = useState([]);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [groupResponse, setGroupResponse] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [searchItems, setSearchItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [group, setGroup] = useState({});
  const [groupEditName, setGroupEditName] = useState('');
  const [groupEditImage, setGroupEditImage] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

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

  const fetchGroup = () => {
    const options = {
      method: 'POST',
      url: 'https://api.businessagenda.org/groups/getGroup',
      headers: {'Content-Type': 'application/json'},
      data: {groupId},
    };

    axios
      .request(options)
      .then(function (response) {
        setGroup(response?.data?.message[0]);
        fetchGroupTasks(response?.data?.message[0].id);
        setGroupEditImage(response?.data.message[0].banner);
        setGroupEditName(response?.data.message[0].groupName);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchGroupTasks(group.id);
  }, []);

  const deleteGroup = () => {
    const options = {
      method: 'POST',
      url: 'https://api.businessagenda.org/groups/delGroup',
      headers: {'Content-Type': 'application/json'},
      data: {groupId: group.id},
    };
    axios
      .request(options)
      .then(function (response) {
        // console.log(response.data);
        setShowModal(true);
        setGroupResponse({
          message: response.data.message,
          status: response.data.status,
        });

        if (response.data.status === 'success') {
          fetchCompanies(user.id);
          navigation.pop();
        } else {
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const fetchGroupTasks = id => {
    const options: AxiosRequestConfig = {
      method: 'POST',
      url: 'https://api.businessagenda.org/tasks/getTaskByGroup',
      headers: {'Content-Type': 'application/json'},
      data: {groupId: id},
    };

    axios
      .request(options)
      .then(function (response) {
        // console.log(response.data);
        setTasks(response.data.message);
      })
      .catch(function (error) {
        console.error(error);
      });
    setRefreshing(false);
  };

  const inviteToGroup = () => {
    const options = {
      method: 'POST',
      url: 'https://api.businessagenda.org/actions/doAction',
      headers: {'Content-Type': 'application/json'},
      data: {
        actionType: 'groupInvite',
        actionFrom: user.id,
        actionTo: inviteEmail,
        groupId: group.id,
      },
    };

    // console.log(options.data);

    axios
      .request(options)
      .then(function (response) {
        // console.log(response.data);
        setGroupResponse({
          message: response.data.message,
          status: response.data.status,
        });
        setShowModal(true);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const searchUser = () => {
    const options = {
      method: 'POST',
      url: 'https://api.businessagenda.org/users/searchUserInvite',
      headers: {'Content-Type': 'application/json'},
      data: {text: inviteEmail},
    };

    axios
      .request(options)
      .then(function (response) {
        // console.log(response.data.data);
        setSearchItems(response.data.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const editGroup = () => {
    var data = JSON.stringify({
      groupId: group.id,
      updateFields: {
        banner: groupEditImage,
        groupName: groupEditName,
      },
    });

    var config = {
      method: 'post',
      url: 'https://api.businessagenda.org/groups/update',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        if (response.data.status === 'success') {
          setShowSettings(false);
          fetchGroup();
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchGroup();
  }, []);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {/* ******************** INVITE MODAL ***************** */}
      <CustomAlert
        message={groupResponse.message}
        showModal={showModal}
        status={groupResponse.status}
        setShowModal={setShowModal}
      />

      <HeaderBack
        onPress={() => navigation.pop()}
        onSettingsPress={() => setShowSettings(true)}
        isAdmin={companyOwnerId === user.id}
        showTrash
        trashFunc={() => setDeleteModalVisible(true)}
      />
      {/* ******************** INVITE MODAL ***************** */}
      {/* ******************** INVITE MODAL ***************** */}
      <Modal animationType="fade" transparent={true} visible={showInviteModal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => setShowInviteModal(false)}
              activeOpacity={0.7}
              style={{position: 'absolute', top: ww(0.02), right: ww(0.02)}}>
              <CloseIcon size={ww(0.1)} />
            </TouchableOpacity>
            <Text style={styles.doYouWant}>
              Do You Want To Invite{'\n'} a Person To Your Company ?
            </Text>
            <Text style={styles.uniqueId}>Type his unique id down below </Text>

            <LoginInput
              placeholder="Ex: John#3224"
              iconName="profile"
              containerStyle={{width: '70%'}}
              value={inviteEmail}
              onChangeText={text => {
                setInviteEmail(text);
                if (text.length >= 3) {
                  searchUser(text);
                }
              }}
              onSubmitEditing={() => {
                setShowInviteModal(false);
                inviteToGroup();
              }}
            />

            <View>
              {searchItems?.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  activeIndex={0.7}
                  onPress={() => {
                    setInviteEmail(item.userId);
                    setSearchItems([]);
                    searchUser(item.userId);
                  }}
                  key={index}
                  style={{
                    flexDirection: 'row',
                    width: ww(0.4),
                    height: ww(0.1),
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: White,
                    borderRadius: ww(0.02),
                    elevation: 10,
                    paddingHorizontal: ww(0.02),
                    marginVertical: wh(0.001),
                  }}>
                  <Image
                    style={{
                      width: ww(0.08),
                      height: ww(0.08),
                      borderRadius: ww(0.08),
                    }}
                    source={{uri: item?.avatar}}
                  />
                  <Text style={styles.renderItemMoreText}>{item?.userId}</Text>
                </TouchableOpacity>
              ))}

              <Button
                title="Send Invite"
                onPress={() => {
                  setShowInviteModal(false);
                  inviteToGroup();
                }}
                style={{width: ww(0.4), marginTop: wh(0.01)}}
              />
            </View>
          </View>
        </View>
      </Modal>
      {/* ******************** INVITE MODAL ***************** */}

      {/* ******************** SETTINGS MODAL ***************** */}
      <Modal animationType="fade" transparent={true} visible={showSettings}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => setShowSettings(false)}
              activeOpacity={0.7}
              style={{position: 'absolute', top: ww(0.02), right: ww(0.02)}}>
              <CloseIcon size={ww(0.1)} />
            </TouchableOpacity>
            <View style={styles.imagesRow}>
              {groupEditImage && (
                <Image
                  style={styles.companyImages}
                  source={{uri: groupEditImage, cache: 'only-if-cached'}}
                />
              )}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  ImagePicker(res => {
                    doStorage(
                      'companyBanners/',
                      res[0].uri,
                      `${new Date().getTime()}-${res[0].fileName}`,
                      res[0].type,
                      setGroupEditImage,
                      groupEditImage,
                    );
                  }, false);
                }}>
                {!groupEditImage ? (
                  <AddPicture size={ww(0.14)} />
                ) : (
                  <Button
                    title="Edit"
                    style={{width: ww(0.14), height: ww(0.14)}}
                    onPress={() =>
                      ImagePicker(res => {
                        doStorage(
                          'companyBanners/',
                          res[0].uri,
                          `${new Date().getTime()}-${res[0].fileName}`,
                          res[0].type,
                          setGroupEditImage,
                          groupEditImage,
                        );
                      }, false)
                    }
                  />
                )}
              </TouchableOpacity>
            </View>

            <LoginInput
              iconName="profile"
              value={groupEditName}
              onChangeText={text => setGroupEditName(text)}
              containerStyle={{width: '80%'}}
            />

            <Button
              title="Edit Company"
              style={{marginTop: wh(0.01)}}
              onPress={editGroup}
            />
          </View>
        </View>
      </Modal>
      {/* ******************** SETTINGS MODAL ***************** */}

      {/* *************************** REMOVE ********************************** */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => setDeleteModalVisible(false)}
              activeOpacity={0.7}
              style={{position: 'absolute', top: ww(0.02), right: ww(0.02)}}>
              <CloseIcon size={ww(0.1)} />
            </TouchableOpacity>
            <Text style={styles.doYouWant}>
              Do You Want To Delete{'\n'} This Company ?
            </Text>
            <Button
              title="Delete"
              onPress={() => {
                setDeleteModalVisible(false);
                deleteGroup();
              }}
              style={{width: ww(0.4), marginTop: wh(0.01)}}
            />
          </View>
        </View>
      </Modal>
      {/* *************************** REMOVE ********************************** */}

      <View style={styles.container}>
        <ImageBackground
          resizeMode="cover"
          source={{uri: group.banner}}
          style={styles.imageBg}
        />

        <View style={styles.workersView}>
          {group?.teamMembers?.map(
            (member: any, index: number) =>
              index <= 2 && (
                <View
                  key={index}
                  style={[
                    styles.workerView,
                    {
                      zIndex: -index,
                      left: index != 0 ? -ww(0.015) * index : null,
                    },
                  ]}>
                  <Image
                    style={styles.workerAvatars}
                    source={{uri: member?.avatar}}
                  />
                </View>
              ),
          )}

          <View style={styles.workerActions}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate('SeeAllWorkers', {
                  workers: group?.teamMembers,
                  groupId,
                  canEdit: true,
                  fetchGroup,
                })
              }>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.inviteButton}
              onPress={() => setShowInviteModal(true)}>
              <Text style={styles.inviteText}>Invite</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.companyInfoArea}>
          <View>
            <Text style={styles.companyName}>{group.groupName}</Text>
            <Text style={styles.companyDescription}>
              {group.groupDescription}
            </Text>
          </View>
          <View>
            <View style={styles.groupsTextView}>
              <Text style={styles.groupsText}>Tasks</Text>
              <Text style={styles.seeAllGroups}>See All &gt;</Text>
            </View>
          </View>
        </View>

        {Array.isArray(tasks) &&
          tasks
            ?.sort(function (a, b) {
              return a.pinned - b.pinned;
            })
            ?.reverse()
            ?.map((task, index) => (
              <TaskView
                onPress={() => navigation.navigate('TaskPreview', {task: task})}
                onEditPress={() =>
                  navigation.navigate('AddEditTask', {
                    task: task,
                    edit: true,
                    groupId: group.id,
                  })
                }
                style={{marginVertical: wh(0.01)}}
                key={index}
                title={task.taskName}
                times={task.times}
                pinned={task.pinned}
                taskId={task.id}
                status={task.status}
                refreshFunc={() => fetchGroupTasks(group.id)}
              />
            ))}

        <Button
          title="ADD TASK"
          onPress={() =>
            navigation.navigate('AddEditTask', {groupId: group.id})
          }
          style={styles.addGroupButton}
        />
      </View>
    </ScrollView>
  );
};

export default GroupsScreen;

const styles = StyleSheet.create({
  doYouWant: {
    fontFamily: UbuntuBold,
    fontSize: ww(0.04),
    marginVertical: wh(0.03),
    textAlign: 'center',
  },
  imagesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  uniqueId: {
    marginVertical: wh(0.01),
    fontFamily: UbuntuRegular,
    fontSize: ww(0.035),
    textAlign: 'center',
    color: '#737373',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  companyImages: {
    width: ww(0.14),
    height: ww(0.14),
    borderRadius: ww(0.02),
    marginHorizontal: ww(0.01),
  },
  modalView: {
    width: '80%',
    height: wh(0.4),
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
  imageBg: {
    height: wh(0.25),
    width: ww(1),
  },
  addGroupButton: {
    marginTop: wh(0.05),
    alignSelf: 'center',
    marginBottom: wh(0.03),
  },
  seeAllText: {
    marginLeft: ww(0.01),
    fontFamily: UbuntuMedium,
    fontSize: ww(0.037),
    color: MainBlue,
  },
  companyInfoArea: {
    width: ww(1),
    paddingHorizontal: ww(0.08),
    marginBottom: wh(0.015),
  },
  companyName: {
    fontFamily: UbuntuBold,
    fontSize: ww(0.08),
    color: '#120D26',
  },
  groupsTextView: {
    marginTop: wh(0.05),
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  groupsText: {
    fontFamily: UbuntuMedium,
    fontSize: ww(0.04),
    color: '#120D26',
  },
  seeAllGroups: {
    fontFamily: UbuntuRegular,
    fontSize: ww(0.035),
    color: '#747688',
  },
  companyDescription: {
    fontFamily: UbuntuRegular,
    fontSize: ww(0.04),
    color: '#737373',
    marginTop: wh(0.015),
  },
  workerAvatars: {
    width: '95%',
    height: '95%',
    borderRadius: ww(0.04),
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  inviteButton: {
    width: ww(0.14),
    height: wh(0.035),
    borderRadius: ww(0.01),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: MainBlue,
    elevation: 10,
    shadowColor: '#58563D',
    shadowOffset: {
      width: 1,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  inviteText: {
    fontFamily: UbuntuRegular,
    fontSize: ww(0.03),
    color: White,
  },
  workersView: {
    top: -wh(0.03),
    flexDirection: 'row',
    backgroundColor: White,
    width: ww(0.8),
    paddingHorizontal: ww(0.05),
    paddingVertical: wh(0.02),
    borderRadius: ww(0.06),
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#58563D',
    shadowOffset: {
      width: 1,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  workerActions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workerView: {
    width: ww(0.08),
    height: ww(0.08),
    borderRadius: ww(0.04),
    elevation: 10,
    shadowColor: '#58563D',
    shadowOffset: {
      width: 1,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    backgroundColor: White,
  },
});
