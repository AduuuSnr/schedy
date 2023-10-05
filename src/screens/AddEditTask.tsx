/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useCallback, useMemo, useRef} from 'react';

import {
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  Image,
  Platform,
  TouchableOpacity,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {useSelector} from 'react-redux';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import axios from 'axios';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import CheckBox from '@react-native-community/checkbox';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';

import {White} from '@constants/colors';
import {UbuntuMedium, UbuntuRegular} from 'assets/fonts';
import {
  AddPicture,
  AddResponsible,
  Camera,
  CurrentLocation,
  Gallery,
  Picture,
  Responsibles,
  SearchIcon,
} from 'assets/icons';
import {Button, Input, ArrowHeader, CustomAlert, Searchbar} from 'components';
import {ImagePicker, doStorage, wh, ww} from 'helpers';
import {launchCamera} from 'react-native-image-picker';
import {dateFormatter} from 'helpers';

interface Props {
  navigation: any;
  route: any;
}

const AddEditTask = ({navigation, route}: Props) => {
  const user = useSelector(state => state.app.user);
  const lang = useSelector(state => state.lang);

  const task = route?.params?.task;
  const edit = route?.params?.edit;
  const groupId = route?.params?.groupId;

  const [title, setTitle] = useState(task?.taskName || null);
  const [startDate, setStartDate] = useState<null | Date>(
    task?.times?.start || null,
  );

  const [endDate, setEndDate] = useState<null | Date>(task?.times?.end || null);
  const [description, setDescription] = useState(task?.description);
  const [searchText, setSearchText] = useState('');
  const [location, setLocation] = useState('');
  const [people, setPeople] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [address, setAddress] = useState(
    task?.address ? JSON.parse(task?.address) : null,
  );

  const [image, setImage] = useState(task?.banner);
  const [showStartDateModal, setShowStartDateModal] = useState(false);
  const [showEndDateModal, setShowEndDateModal] = useState(false);
  const [isOpen, setIsOpen] = useState('');
  const [allUsers, setAllUsers] = useState(task?.users);

  const [responseModal, setResponseModal] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const bottomSheetModalRef2 = useRef<BottomSheetModal>(null);
  const allUsersModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['30%', '45%'], []);
  const snapPointsResponsible = useMemo(() => ['30%', '75%'], []);
  const snapPointsAddress = useMemo(() => ['15%', '70%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handlePresentModalPress2 = useCallback(() => {
    bottomSheetModalRef2.current?.present();
  }, []);
  const allUsersModal = useCallback(() => {
    allUsersModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {}, []);
  const handleSheetChanges2 = useCallback((index: number) => {}, []);
  const handleAllUsersChange = useCallback((index: number) => {}, []);

  const createTask = () => {
    if (
      !title ||
      !description ||
      !startDate ||
      !endDate ||
      !address ||
      !image ||
      allUsers.filter(user => user.selected).length == 0
    ) {
      setShowModal(true);
      setResponseModal({
        message: 'Please Fill All The Necessary Fields',
        status: 'fail',
      });

      return;
    }
    const options = {
      method: 'POST',
      url: 'https://api.businessagenda.org/tasks',
      headers: {'Content-Type': 'application/json'},
      data: {
        taskName: title,
        description,
        startDate: dateFormatter(startDate),
        endDate: dateFormatter(endDate),
        address: address,
        banner: image,
        type: 'personal',
        groupId: task?.groupId || groupId,
        userId: user.id,
        users: allUsers.filter(user => user.selected).map(user => user.id),
      },
    };

    axios
      .request(options)
      .then(function (response) {
        setShowModal(true);
        setResponseModal({
          message: response.data.message,
          status: response.data.status,
        });
        if (response.data.status === 'success') {
          setTimeout(() => {
            setShowModal(false);
            navigation.pop();
          }, 1000);
        }
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

  const editTask = () => {
    if (
      !title ||
      !description ||
      !startDate ||
      !endDate ||
      !address ||
      !image ||
      allUsers.filter(user => user.selected).length == 0
    ) {
      setShowModal(true);
      setResponseModal({
        message: 'Please Fill All The Necessary Fields',
        status: 'fail',
      });

      return;
    }
    const options = {
      method: 'POST',
      url: 'https://api.businessagenda.org/tasks/update',
      headers: {'Content-Type': 'application/json'},
      data: {
        taskId: task.id,
        updateFields: {
          taskName: title,
          description,
          startDate: dateFormatter(new Date(startDate)),
          endDate: dateFormatter(new Date(endDate)),
          address: address,
          banner: image,
          type: 'personal',
          groupId: task?.groupId || groupId,
          userId: user.id,
        },
        users: allUsers.filter(user => user.selected).map(user => user.id),
      },
    };
    console.log(options.data);
    axios
      .request(options)
      .then(function (response) {
        setShowModal(true);
        setResponseModal({
          message: response.data.message,
          status: response.data.status,
        });
        if (response.data.status === 'success') {
          setTimeout(() => {
            setShowModal(false);
            navigation.pop();
          }, 1000);
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const getUsers = () => {
    const options = {
      method: 'POST',

      url: 'https://api.businessagenda.org/groups/getTeamMembers',
      headers: {'Content-Type': 'application/json'},
      data: {groupId: task?.groupId || groupId},
    };

    axios
      .request(options)
      .then(function (response) {
        if (edit) {
          setAllUsers(
            allUsers?.map(user => {
              if (task?.users?.map(user => user.id)?.includes(user.id)) {
                return {...user, selected: true};
              } else {
                return user;
              }
            }),
          );
        } else {
          console.log(response.data.data);
          setAllUsers(response.data.data);
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  useEffect(() => {
    getUsers();
  }, []);

  Geocoder.init('AIzaSyDEOpPGlOVOw7blMgrJJF6PC2aJWqVmudM');

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        console.log(position);
        const {latitude, longitude} = position.coords;
        setLocation({
          latitude,
          longitude,
        });
      },
      error => {
        console.log(error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );

    console.log(location);
  }, []);

  const getCurrentLocation = () => {
    if (location.latitude && location.longitude !== null) {
      Geocoder.from(location.latitude, location.longitude).then(json => {
        var addressComponent = json.results[0].formatted_address;
        setAddress({address: addressComponent});
        bottomSheetModalRef?.current?.close();
      });
    } else {
    }
  };

  return (
    <>
      <ScrollView
        style={{backgroundColor: White, flex: 1}}
        showsVerticalScrollIndicator={false}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView style={{flex: 1}}>
            <ArrowHeader
              title={lang.newTask}
              onPress={() => navigation.pop()}
            />
            <CustomAlert
              message={responseModal?.message}
              status={responseModal?.status}
              setShowModal={setShowModal}
              showModal={showModal}
            />
            {/* ********  *************MODALS ******************* */}

            {isOpen == 'start' ? (
              <DatePicker
                modal
                open={showStartDateModal}
                date={new Date()}
                onConfirm={date => {
                  setShowStartDateModal(false);
                  setStartDate(date);
                  setIsOpen('');
                }}
                onCancel={() => {
                  setShowStartDateModal(false);
                  setIsOpen('');
                }}
              />
            ) : isOpen == 'end' ? (
              <DatePicker
                modal
                open={showEndDateModal}
                date={new Date()}
                onConfirm={date => {
                  setShowEndDateModal(false);
                  setEndDate(date);
                  setIsOpen('');
                }}
                onCancel={() => {
                  setShowEndDateModal(false);
                  setIsOpen('');
                }}
              />
            ) : null}

            {/* *********************MODALS ******************* */}

            <View style={[styles.marginHorizontal, {marginTop: wh(0.01)}]}>
              <Input
                value={title}
                onChangeText={(text: string) => setTitle(text)}
                iconName="title"
                title={lang.title}
                containerStyle={styles.singleInput}
              />
            </View>
            <View style={[styles.marginHorizontal, {flexDirection: 'row'}]}>
              <Pressable
                style={styles.dualInput}
                onPress={() => {
                  setIsOpen('start');
                  setShowStartDateModal(true);
                }}>
                <Input
                  iconName="start-date"
                  title={lang.startDate}
                  containerStyle={{marginRight: ww(0.04)}}
                  value={
                    startDate &&
                    dateFormatter(new Date(startDate))
                      .split('T')[0]
                      .slice(0, 10)
                  }
                  disabled
                />
              </Pressable>
              <Pressable
                style={styles.dualInput}
                onPress={() => {
                  setIsOpen('end');
                  setShowEndDateModal(true);
                }}>
                <Input
                  iconName="end-date"
                  title={lang.endDate}
                  disabled
                  value={
                    endDate &&
                    dateFormatter(new Date(endDate)).split('T')[0].slice(0, 10)
                  }
                />
              </Pressable>
            </View>
            <View style={styles.marginHorizontal}>
              <Input
                value={description}
                onChangeText={(text: string) => setDescription(text)}
                containerStyle={styles.multiline}
                iconName="description"
                title={lang.description}
                multiline
              />
            </View>
            {/* ------------------------------------------------------------------------------------ Address --------------------------------------------------------------------------------------------------*/}
            <Pressable
              onPress={handlePresentModalPress}
              style={styles.marginHorizontal}>
              <Input
                disabled
                iconName="location"
                title={lang.address}
                containerStyle={[styles.singleInput, {marginTop: wh(0.05)}]}
                value={address?.address}
              />
            </Pressable>
            {/* ------------------------------------------------------------------------------------ Address --------------------------------------------------------------------------------------------------*/}

            <View style={styles.marginHorizontal}>
              <View style={styles.row}>
                <Responsibles size={ww(0.04)} />
                <Text style={styles.addTexts}> {lang.responsiblePerson} </Text>
              </View>
              <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                {Array.isArray(allUsers) &&
                  allUsers?.map(
                    (responsible, index) =>
                      responsible?.selected && (
                        <Image
                          key={index}
                          style={styles.responsibleAvatars}
                          source={{uri: responsible.avatar}}
                        />
                      ),
                  )}
                {Array.isArray(allUsers) &&
                allUsers?.filter(user => user.selected).length == 0 ? (
                  <Pressable onPress={allUsersModal}>
                    <AddResponsible size={ww(0.14)} />
                  </Pressable>
                ) : (
                  <Button
                    title="Edit"
                    style={{width: ww(0.14), height: ww(0.14)}}
                    onPress={allUsersModal}
                  />
                )}
              </View>
              <View style={styles.row}>
                <Picture size={ww(0.05)} />
                <Text style={styles.addTexts}> {lang.taskBanner}</Text>
              </View>

              <View style={styles.imagesRow}>
                {image && (
                  <Image style={styles.companyImages} source={{uri: image}} />
                )}

                <Pressable
                  activeOpacity={0.7}
                  onPress={handlePresentModalPress2}>
                  {!image ? (
                    <AddPicture size={ww(0.14)} />
                  ) : (
                    <Button
                      title={lang.edit}
                      style={{width: ww(0.14), height: ww(0.14)}}
                      onPress={handlePresentModalPress2}
                    />
                  )}
                </Pressable>
              </View>
            </View>
            <Button
              title={!edit ? lang.createTask : lang.edit}
              arrow
              style={styles.createTaskButton}
              onPress={!edit ? createTask : editTask}
            />
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </ScrollView>
      <TouchableWithoutFeedback>
        <BottomSheetModalProvider>
          <View style={styles.container}>
            <BottomSheetModal
              ref={bottomSheetModalRef}
              index={1}
              handleStyle={{
                borderRadius: 10,
                shadowColor: '#E4E8FF',
                shadowOffset: {
                  width: 0,
                  height: -15,
                },
                shadowOpacity: 3,
                shadowRadius: 5,
                elevation: 10,
              }}
              style={styles.shadow}
              snapPoints={snapPointsAddress}
              onChange={handleSheetChanges}>
              <View style={styles.contentContainer}>
                <View
                  style={{
                    zIndex: 99,
                    alignSelf: 'flex-start',
                  }}>
                  <Text style={styles.addPicture}>{lang.address}</Text>
                </View>

                <View
                  style={{
                    height: wh(0.1),
                    alignItems: 'center',
                  }}>
                  <GooglePlacesAutocomplete
                    placeholder={lang.searchForAddress}
                    renderLeftButton={() => (
                      <View style={styles.searchIconView}>
                        <SearchIcon />
                      </View>
                    )}
                    fetchDetails
                    onPress={(data, details = null) => {
                      bottomSheetModalRef?.current?.close();
                      const {lat, lng} = details.geometry.location;
                      setAddress({lat, long: lng, address: data.description});
                      // 'details' is provided when fetchDetails = true
                    }}
                    filterReverseGeocodingByTypes={[
                      'locality',
                      'administrative_area_level_3',
                    ]}
                    GooglePlacesDetailsQuery={{
                      type: 'geocode',
                      fields: 'geometry',
                    }}
                    query={{
                      key: 'AIzaSyCMFNjZ-GKf2qqRcGlx9YU8RsWzcv-05CA',
                      language: 'tr',
                    }}
                    styles={{
                      poweredContainer: styles.placesPoweredContainer,

                      listView: styles.placesListView,
                      powered: styles.placesPowered,
                      container: styles.placesContainer,
                      textInputContainer: styles.placesTextInputContainer,
                      textInput: styles.placesTextInput,
                      predefinedPlacesDescription:
                        styles.predefinedPlacesDescription,
                    }}
                  />
                  <TouchableOpacity
                    style={styles.useCurrentLocation}
                    onPress={getCurrentLocation}>
                    <View style={{marginLeft: ww(0.04)}}>
                      <CurrentLocation />
                    </View>
                    <Text style={styles.currentLocationButtonText}>
                      Use Current Location
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </BottomSheetModal>
          </View>
        </BottomSheetModalProvider>
      </TouchableWithoutFeedback>

      {/* ------------------------------------------------------------ IMAGE PICKER SHEET ------------------------------------------------------------ */}
      <BottomSheetModalProvider>
        <View style={styles.container}>
          <BottomSheetModal
            ref={bottomSheetModalRef2}
            index={1}
            style={styles.shadow}
            snapPoints={snapPoints}
            onChange={handleSheetChanges2}>
            <View style={styles.contentContainer2}>
              <Text style={styles.addPicture}>{lang.addPicture}</Text>
              <View style={styles.iconsView}>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <TouchableOpacity
                    style={styles.galleryIconContainer}
                    onPress={() => {
                      ImagePicker(res => {
                        doStorage(
                          'companyBanners/',
                          res[0].uri,
                          `${new Date().getTime()}-${res[0].fileName}`,
                          res[0].type,
                          setImage,
                          image,
                        );
                      }, false);
                      bottomSheetModalRef2?.current?.close();
                    }}>
                    <Gallery />
                  </TouchableOpacity>
                  <Text style={styles.galeryText}>
                    {lang.selectFromGallery}
                  </Text>
                </View>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <TouchableOpacity
                    onPress={() => {
                      launchCamera({mediaType: 'mixed'}, async res => {
                        if (res.assets) {
                          doStorage(
                            'companyBanners/',
                            res.assets[0].uri,
                            `${new Date().getTime()}-${res.assets[0].fileName}`,
                            res.assets[0].type,
                            setImage,
                            image,
                          );
                        }
                      });
                      bottomSheetModalRef2?.current?.close();
                    }}
                    style={styles.cameraIconContainer}>
                    <Camera />
                  </TouchableOpacity>
                  <Text style={styles.takePhotoText}>{lang.takePhoto} </Text>
                </View>
              </View>
            </View>
          </BottomSheetModal>
        </View>
      </BottomSheetModalProvider>
      {/* ------------------------------------------------------------ IMAGE PICKER SHEET ------------------------------------------------------------ */}

      {/* ------------------------------------------------------------ Responsible ------------------------------------------------------------ */}
      <BottomSheetModalProvider>
        <View style={styles.responsibleContainer}>
          <BottomSheetModal
            ref={allUsersModalRef}
            handleIndicatorStyle={{backgroundColor: 'red'}}
            index={1}
            style={styles.shadow}
            snapPoints={snapPointsResponsible}
            onChange={handleAllUsersChange}>
            <Text style={styles.addPicture}>{lang.addResponsible}</Text>

            <ScrollView style={styles.contentContainer2}>
              <View style={{alignSelf: 'center'}}>
                <Searchbar
                  containerStyle={styles.seacrhbarContainer}
                  value={searchValue}
                  onChangeText={text => setSearchValue(text)}
                  onSubmitEditing={searchPersons}
                />
              </View>
            </ScrollView>
            <View style={styles.buttonStyle}>
              <Button
                title={lang.addPeople}
                onPress={() => {
                  allUsersModalRef?.current?.close();
                }}
              />
            </View>
          </BottomSheetModal>
        </View>
      </BottomSheetModalProvider>
      {/* ------------------------------------------------------------ Responsible ------------------------------------------------------------ */}
    </>
  );
};

export default AddEditTask;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: White,
    zIndex: 99,
    position: 'absolute',
  },
  addPictureView: {
    zIndex: 99,
    alignSelf: 'flex-start',
  },
  responsibleAvatars: {
    width: ww(0.13),
    height: ww(0.13),
    borderRadius: ww(0.03),
    marginHorizontal: ww(0.014),
    marginVertical: wh(0.005),
  },
  responsibleBottom: {
    elevation: 10,
    borderRadius: 20,
    backgroundColor: '#fbfbfb',
    shadowColor: '#58563D',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  locationBottom: {
    elevation: 10,
    shadowColor: '#58563D',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  contentContainer: {
    flex: 1,
  },
  contentContainer2: {
    flex: 1,
  },
  singleInput: {},
  dualInput: {
    flex: 1,
    marginVertical: wh(0.05),
  },
  multiline: {},
  row: {
    flexDirection: 'row',
    marginVertical: wh(0.03),
  },
  createTaskButton: {
    alignSelf: 'center',
    marginVertical: wh(0.05),
  },
  addTexts: {
    fontFamily: UbuntuRegular,
    fontSize: ww(0.033),
    color: '#6c6c6c',
    marginLeft: ww(0.015),
  },
  marginHorizontal: {marginHorizontal: ww(0.1)},
  companyImages: {
    width: ww(0.14),
    height: ww(0.14),
    borderRadius: ww(0.02),
    marginHorizontal: ww(0.01),
  },
  imagesRow: {
    flexDirection: 'row',
  },
  placesTextInputContainer:
    Platform.OS === 'android'
      ? {
          borderWidth: 0.5,
          borderColor: '#E4DFDF',
          borderRadius: 10,
          width: ww(0.9),
          alignSelf: 'center',
          zIndex: 999,
          backgroundColor: 'white',
        }
      : {
          borderWidth: 0.5,
          borderColor: '#E4DFDF',
          borderRadius: 10,
          width: ww(0.9),
          alignSelf: 'center',
          position: 'absolute',
          zIndex: 999,
        },
  placesPowered: {
    display: 'none',
  },
  placesPoweredContainer: {
    backgroundColor: 'transparent',
    position: 'absolute',
  },
  placesListView:
    Platform.OS === 'android'
      ? {
          // top: 45,
          width: ww(1),
          height: wh(1),
        }
      : {
          top: wh(0.05),
          width: ww(1),
          height: wh(1),
        },
  placesTextInput: {
    height: wh(0.05),
    borderRadius: 10,
    marginLeft: ww(0.12),
    color: '#747688',
    fontSize: ww(0.04),
    fontFamily: UbuntuRegular,
  },
  predefinedPlacesDescription: {
    color: '#1faadb',
  },
  placesContainer: {
    position: 'absolute',

    zIndex: 99,
  },
  searchIconView: {
    top: wh(0.015),
    marginLeft: ww(0.05),
    width: ww(0.05),
    position: 'absolute',
    zIndex: 99,
  },
  iconsView: {
    flexDirection: 'row',
    width: ww(0.8),
    justifyContent: 'space-around',
    alignSelf: 'center',
  },
  galleryIconContainer: {
    backgroundColor: '#3D50DF',
    width: ww(0.3),
    height: wh(0.13),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  cameraIconContainer: {
    backgroundColor: White,
    width: ww(0.3),
    height: wh(0.13),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    // left: ww(0.1),
    elevation: 10,
    shadowColor: '#58563D',
    shadowOffset: {
      width: 1,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  addPicture: {
    fontFamily: UbuntuMedium,
    fontSize: ww(0.06),
    left: ww(0.15),
    paddingBottom: ww(0.1),
    paddingTop: ww(0.05),
  },
  galeryText: {
    fontFamily: UbuntuMedium,
    fontSize: ww(0.04),
    top: wh(0.008),
  },
  takePhotoText: {
    fontFamily: UbuntuMedium,
    fontSize: ww(0.04),
    top: wh(0.008),
  },
  shadow: {
    elevation: 10,
    alignSelf: 'center',
    borderRadius: 30,
    width: ww(1),
    backgroundColor: 'red',
    shadowColor: '#E4E8FF',
    shadowOffset: {
      width: 5,
      height: 0,
    },
    shadowOpacity: 3,
    shadowRadius: 5,
  },
  usersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    padding: ww(0.02),
    paddingRight: ww(0.06),
  },
  avatarView: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  avatar: {
    width: ww(0.13),
    height: ww(0.13),
    borderRadius: 50,
  },
  avatarName: {
    fontFamily: UbuntuMedium,
    fontSize: ww(0.035),
    left: ww(0.05),
  },
  buttonStyle: {
    backgroundColor: White,
    height: wh(0.2),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    borderRadius: 10,
    shadowColor: '#E4E8FF',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 1,
    shadowRadius: 3.5,
  },
  seacrhbarContainer: {
    width: ww(0.9),
    backgroundColor: White,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  useCurrentLocation: {
    backgroundColor: '#3D50DF',
    width: ww(0.9),
    marginTop: ww(0.2),
    alignSelf: 'center',
    height: wh(0.06),
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  currentLocationButtonText: {
    marginLeft: ww(0.03),
    fontFamily: UbuntuRegular,
    color: White,
  },
});
