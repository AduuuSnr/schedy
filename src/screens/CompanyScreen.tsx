import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Modal,
  Pressable,
  RefreshControl,
} from 'react-native';

import {MainBlue, White} from '@constants/colors';
import {UbuntuBold, UbuntuMedium, UbuntuRegular} from 'assets/fonts';
import {AddPicture, CloseIcon} from 'assets/icons';
import axios from 'axios';
import {Button, CustomAlert, HeaderBack, Input, LoginInput} from 'components';
import {wh, ww} from 'helpers';
import {useDispatch, useSelector} from 'react-redux';
import {setBusinesses} from '@redux/app/actions';
import {apiUrl} from '@constants';
import {ImagePicker} from 'helpers';
import {doStorage} from 'helpers';

interface CompanyScreenProps {
  navigation: any;
  route: any;
}

const CompanyScreen = ({navigation, route}: CompanyScreenProps) => {
  const companyId = route?.params?.companyId;
  const user = useSelector(state => state.app.user);
  const lang = useSelector(state => state.lang);

  const dispatch = useDispatch();
  const businesses = useSelector(state => state.app.businesses);
  const [groups, setGroups] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [responseMessage, setResponseMessage] = useState({});
  const [groupResponse, setGroupResponse] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchItems, setSearchItems] = useState([]);
  const [company, setCompany] = useState();
  const [companyEditName, setCompanyEditName] = useState('');
  const [companyEditImage, setCompanyEditImage] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchCompany();
  }, []);

  const renderItem = ({item}) => (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.item}
      onPress={() =>
        navigation.navigate('GroupsScreen', {
          group: item,
          companyOwnerId: company?.ownerId,
        })
      }>
      <View style={{flex: 1.5}}>
        <Image source={{uri: item.banner}} style={styles.renderImage} />
      </View>
      <View style={{flex: 1}}>
        <Text style={styles.renderTitle}>{item.groupName}</Text>
        <View style={styles.renderItemRow}>
          {item?.teamMembers?.map(
            (member, index) =>
              index < 3 && (
                <View
                  key={index}
                  style={{
                    right: ww(0.02) * index,
                    zIndex: -index,
                  }}>
                  <Image
                    source={{uri: member.avatar}}
                    style={styles.renderItemAvatar}
                  />
                </View>
              ),
          )}
          {item?.teamMembers?.length > 3 && (
            <Text style={styles.renderItemMoreText}>
              +{item?.teamMembers?.length - 3} More
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const fetchCompanyGroups = id => {
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

  const deleteCompany = () => {
    const options = {
      method: 'POST',
      url: 'https://api.businessagenda.org/companies/delCompany',
      headers: {'Content-Type': 'application/json'},
      data: {companyId},
    };

    axios
      .request(options)
      .then(function (response) {
        setShowModal(true);
        setGroupResponse({
          message: response.data.message,
          status: response.data.status,
        });

        if (response.data.status === 'success') {
          fetchCompanyGroups(user.id);
          navigation.pop();
        } else {
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const fetchGroupsOfCompany = () => {
    const options = {
      method: 'POST',
      url: 'https://api.businessagenda.org/groups/getCompanyTeams',
      headers: {'Content-Type': 'application/json'},
      data: {companyId},
    };

    axios
      .request(options)
      .then(function (response) {
        setGroups(response.data.message);
      })
      .catch(function (error) {
        console.error(error);
      });
    setRefreshing(false);
  };

  const fetchGroupsByUser = () => {
    const options = {
      method: 'POST',
      url: 'https://api.businessagenda.org/groups/getUserGroups',
      headers: {'Content-Type': 'application/json'},
      data: {userId: user.id, companyId},
    };

    axios
      .request(options)
      .then(function (response) {
        // console.log(response.data);
        setGroups(response?.data?.data);
      })
      .catch(function (error) {
        console.error(error);
      });
    setRefreshing(false);
  };

  const fetchCompany = () => {
    const options = {
      method: 'POST',
      url: 'https://api.businessagenda.org/companies/getCompany',
      headers: {'Content-Type': 'application/json'},
      data: {companyId},
    };

    axios
      .request(options)
      .then(function (response) {
        setCompany(response.data.data[0]);
        setCompanyEditName(response.data.data[0].companyName);
        setCompanyEditImage(response.data.data[0].banner);

        if (response?.data?.data[0]?.ownerId === user.id) {
          fetchGroupsOfCompany();
        } else {
          fetchGroupsByUser();
        }
      })
      .catch(function (error) {
        console.error(error);
      });
    setRefreshing(false);
  };

  const inviteToCompany = () => {
    const options = {
      method: 'POST',
      url: 'https://api.businessagenda.org/actions/doAction',
      headers: {'Content-Type': 'application/json'},
      data: {
        actionType: 'companyInvite',
        actionFrom: user.id,
        actionTo: inviteEmail,
        companyId,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        // console.log(response.data);
        setResponseMessage({
          message: response.data.message,
          status: response.data.status,
        });
        setShowResponseModal(true);
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

  const editCompany = () => {
    var data = JSON.stringify({
      companyId: company.id,
      updateFields: {
        companyName: companyEditName,
        banner: companyEditImage,
      },
    });

    var config = {
      method: 'post',
      url: 'https://api.businessagenda.org/companies/update',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        if (response.data.status === 'success') {
          setShowModal(false);
          fetchCompany();
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchCompany();
  }, [businesses]);
  return (
    <ScrollView
      style={{backgroundColor: White}}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <HeaderBack
        onPress={() => navigation.pop()}
        onSettingsPress={() => setShowModal(true)}
        isAdmin={company?.ownerId === user.id}
        showTrash
        trashFunc={() => setDeleteModalVisible(true)}
      />

      {/* ******************** SETTINGS MODAL ***************** */}
      <Modal animationType="fade" transparent={true} visible={showModal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => setShowModal(false)}
              activeOpacity={0.7}
              style={{position: 'absolute', top: ww(0.02), right: ww(0.02)}}>
              <CloseIcon size={ww(0.1)} />
            </TouchableOpacity>
            <View style={styles.imagesRow}>
              {companyEditImage && (
                <Image
                  style={styles.companyImages}
                  source={{uri: companyEditImage}}
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
                      setCompanyEditImage,
                      companyEditImage,
                    );
                  }, false);
                }}>
                {!companyEditImage ? (
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
                          setCompanyEditImage,
                          companyEditImage,
                        );
                      }, false)
                    }
                  />
                )}
              </TouchableOpacity>
            </View>

            <LoginInput
              iconName="profile"
              value={companyEditName}
              onChangeText={text => setCompanyEditName(text)}
              containerStyle={{width: '80%'}}
            />

            <Button
              title="Edit Company"
              style={{marginTop: wh(0.01)}}
              onPress={editCompany}
            />
          </View>
        </View>
      </Modal>
      {/* ******************** SETTINGS MODAL ***************** */}

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
                deleteCompany();
              }}
              style={{width: ww(0.4), marginTop: wh(0.01)}}
            />
          </View>
        </View>
      </Modal>

      {/* ******************INVITE MODAL**************** */}
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
                inviteToCompany();
              }}
            />

            <View>
              {searchItems?.map((item, index) => (
                <TouchableOpacity
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
                  inviteToCompany();
                }}
                style={{width: ww(0.4), marginTop: wh(0.01)}}
              />
            </View>
          </View>
        </View>
      </Modal>
      {/* ******************INVITE MODAL**************** */}

      {/* ******************RESPONSE MODAL**************** */}
      <CustomAlert
        showModal={showResponseModal}
        setShowModal={setShowResponseModal}
        status={responseMessage?.status}
        message={responseMessage.message}
      />
      {/* ******************RESPONSE MODAL**************** */}

      <View style={styles.container}>
        <ImageBackground
          resizeMode="cover"
          source={{uri: company?.banner}}
          style={styles.imageBg}
        />

        <View style={styles.workersView}>
          {company?.companyMembers?.map(
            (member: any, index: number) =>
              index <= 2 && (
                <View
                  key={index}
                  style={[
                    styles.workerView,
                    {
                      zIndex: -index,
                      left: index != 0 ? -ww(0.02) * index : null,
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
                  workers: company?.companyMembers,
                  canEdit: false,
                  companyId: company?.id,
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
            <Text style={styles.companyName}>{company?.companyName}</Text>
            <Text style={styles.companyDescription}>
              {company?.companyDescription}
            </Text>
          </View>
          <View>
            <View style={styles.groupsTextView}>
              <Text style={styles.groupsText}>Groups</Text>
              <Text style={styles.seeAllGroups}>See All &gt;</Text>
            </View>
          </View>
        </View>

        <View>
          <FlatList
            data={groups}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </View>
      </View>
      <Button
        title="ADD GROUP"
        onPress={() => {
          navigation.navigate('AddGroupScreen', {companyId: company?.id});
        }}
        style={styles.addGroupButton}
      />
    </ScrollView>
  );
};

export default CompanyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  imagesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  doYouWant: {
    fontFamily: UbuntuBold,
    fontSize: ww(0.04),
    textAlign: 'center',
  },
  companyImages: {
    width: ww(0.14),
    height: ww(0.14),
    borderRadius: ww(0.02),
    marginHorizontal: ww(0.01),
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
  renderItemRow: {
    flexDirection: 'row',
    marginTop: wh(0.01),
    paddingHorizontal: ww(0.012),
    backgroundColor: White,
    alignItems: 'center',
  },
  renderItemAvatar: {
    width: ww(0.06),
    height: ww(0.06),
    borderRadius: ww(0.03),
  },
  renderItemMoreText: {
    fontFamily: UbuntuMedium,
    fontSize: ww(0.03),
    color: MainBlue,
  },
  item: {
    height: wh(0.25),
    width: ww(0.6),
    backgroundColor: White,
    elevation: 12,
    shadowColor: '#58563D',
    shadowOffset: {
      width: 1,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,

    borderRadius: ww(0.03),
    paddingHorizontal: ww(0.01),
    paddingVertical: wh(0.01),
    marginTop: wh(0.02),
    marginHorizontal: ww(0.02),
  },
  imageBg: {
    height: wh(0.25),
    width: ww(1),
  },
  renderImage: {
    width: '100%',
    height: '100%',
    borderRadius: ww(0.02),
  },
  seeAllText: {
    marginLeft: ww(0.01),
    fontFamily: UbuntuMedium,
    fontSize: ww(0.037),
    color: MainBlue,
  },
  workersView: {
    top: -wh(0.03),
    flexDirection: 'row',
    backgroundColor: White,
    height: wh(0.07),
    width: ww(0.8),
    paddingHorizontal: ww(0.05),
    paddingVertical: wh(0.01),
    borderRadius: ww(0.08),
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
  workerView: {
    width: ww(0.08),
    height: ww(0.08),
    borderRadius: ww(0.04),
    elevation: 10,
    shadowColor: '#58563D',
    shadowOffset: {
      width: 1,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: White,
  },
  workerAvatars: {
    width: '95%',

    height: '95%',
    borderRadius: ww(0.04),
  },
  inviteButton: {
    width: ww(0.14),
    height: wh(0.035),
    borderRadius: ww(0.01),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: MainBlue,
  },
  inviteText: {
    fontFamily: UbuntuRegular,
    fontSize: ww(0.03),
    color: White,
  },
  workerActions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  companyName: {
    fontFamily: UbuntuBold,
    fontSize: ww(0.08),
    color: '#120D26',
  },
  companyDescription: {
    fontFamily: UbuntuRegular,
    lineHeight: wh(0.032),
    fontSize: ww(0.04),
    color: '#737373',
    marginTop: wh(0.015),
  },
  companyInfoArea: {width: ww(1), paddingHorizontal: ww(0.08)},
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
  addGroupButton: {
    borderRadius: 15,
    marginTop: wh(0.03),
    alignSelf: 'center',
    marginBottom: wh(0.03),
  },
  renderTitle: {
    marginTop: wh(0.01),
    paddingHorizontal: ww(0.02),
    fontFamily: UbuntuMedium,
    fontSize: ww(0.046),
  },
});
