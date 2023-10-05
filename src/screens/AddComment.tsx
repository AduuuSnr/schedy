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
import BottomSheet from '@gorhom/bottom-sheet';
import axios from 'axios';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import CheckBox from '@react-native-community/checkbox';

import {White} from '@constants/colors';
import {UbuntuMedium, UbuntuRegular} from 'assets/fonts';
import {
  AddPicture,
  AddResponsible,
  Camera,
  Gallery,
  Picture,
  Responsibles,
  SearchIcon,
} from 'assets/icons';
import {Button, Input, ArrowHeader, CustomAlert} from 'components';
import {ImagePicker, doStorage, wh, ww} from 'helpers';
import {launchCamera} from 'react-native-image-picker';
import DropdownAlert from 'react-native-dropdownalert';

interface Props {
  navigation: any;
  route: any;
}

const AddComment = ({navigation, route}: Props) => {
  const user = useSelector(state => state.app.user);
  // const task = route?.params?.task;
  const lang = useSelector(state => state.lang);

  const [showModal, setShowModal] = useState(false);
  const [responseModal, setResponseModal] = useState(null);
  const [description, setDescription] = useState([]);
  const [images, setImages] = useState([]);

  const [isFinished, setIsFinished] = useState('');

  const bottomSheetModalRef2 = useRef<BottomSheetModal>(null);
  const dropDownAlertRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ['40%', '40%'], []);

  // callbacks
  const handlePresentModalPress2 = useCallback(() => {
    bottomSheetModalRef2.current?.present();
  }, []);

  const handleSheetChanges2 = useCallback((index: number) => {}, []);

  const sendComment = () => {
    var data = JSON.stringify({
      taskId: route.params?.taskId,
      userId: user.id,
      comment: description,
      gallery: images,
      finish: isFinished,
    });

    var config = {
      method: 'post',
      url: 'https://api.businessagenda.org/tasks/addComment',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        if (response.data.status === 'success') {
          dropDownAlertRef.current.alertWithType(
            'success',
            'Success',
            'Task Added',
          );
        } else {
          dropDownAlertRef.current.alertWithType(
            'error',
            'Somethings went wrong',
            'Task not added!',
          );
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: White}}>
      <ArrowHeader title={lang.addComment} onPress={() => navigation.pop()} />
      <DropdownAlert ref={dropDownAlertRef} />
      <ScrollView
        style={{backgroundColor: White, flex: 1}}
        showsVerticalScrollIndicator={false}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView style={{flex: 1}}>
            <CustomAlert
              showModal={showModal}
              setShowModal={setShowModal}
              message={responseModal?.message}
              status={responseModal?.status}
            />

            <DropdownAlert ref={dropDownAlertRef} />
            <View style={[styles.marginHorizontal, {marginTop: wh(0.05)}]}>
              <Input
                value={description}
                onChangeText={(text: string) => setDescription(text)}
                containerStyle={styles.multiline}
                iconName="description"
                title={lang.jobDone}
                multiline
              />
            </View>

            <View style={styles.marginHorizontal}>
              <View style={styles.row}>
                <Picture size={ww(0.05)} />
                <Text style={styles.addTexts}>{lang.pictures}</Text>
              </View>

              <View style={styles.imagesRow}>
                {images &&
                  images?.map((image, index) => (
                    <Image
                      style={styles.companyImages}
                      source={{uri: image}}
                      key={index}
                    />
                  ))}
                {/* {console.log(images)} */}

                <Pressable
                  activeOpacity={0.7}
                  onPress={handlePresentModalPress2}>
                  {!images ? (
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
            <View style={styles.finishArea}>
              <Text style={[styles.addTexts, {marginRight: ww(0.05)}]}>
                {lang.isFinish}
              </Text>
              <CheckBox
                value={isFinished}
                onValueChange={val =>
                  val == true ? setIsFinished('1') : setIsFinished('0')
                }
              />
            </View>
            <Button
              title={lang.save}
              style={styles.createTaskButton}
              onPress={sendComment}
            />
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </ScrollView>

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
                        res.map(el => {
                          doStorage(
                            'companyBanners/',
                            el.uri,
                            `${new Date().getTime()}-${el.fileName}`,
                            el.type,
                            setImages,
                            images,
                          );
                        });
                      }, true);
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
                            setImages,
                            images,
                          );
                        }
                      });
                      bottomSheetModalRef2?.current?.close();
                    }}
                    style={styles.cameraIconContainer}>
                    <Camera />
                  </TouchableOpacity>
                  <Text style={styles.takePhotoText}>{lang.takePhoto}</Text>
                </View>
              </View>
            </View>
          </BottomSheetModal>
        </View>
      </BottomSheetModalProvider>
      {/* ------------------------------------------------------------ IMAGE PICKER SHEET ------------------------------------------------------------ */}
    </SafeAreaView>
  );
};

export default AddComment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 24,
    justifyContent: 'center',
    backgroundColor: White,
    zIndex: 99,
    position: 'absolute',
  },
  addPictureView: {
    zIndex: 99,
    alignSelf: 'flex-start',
  },
  finishArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: ww(0.1),
    marginTop: wh(0.05),
  },
  responsibleAvatars: {
    width: ww(0.13),
    height: ww(0.13),
    borderRadius: ww(0.02),
    marginHorizontal: ww(0.014),
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

  dualInput: {
    flex: 1,
    marginVertical: wh(0.05),
  },

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
          borderRadius: 10,
          width: ww(0.9),
          alignSelf: 'center',
          zIndex: 999,
          backgroundColor: 'white',
        }
      : {
          borderWidth: 0.5,
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
    paddingLeft: ww(0.09),

    color: '#747688',
    fontSize: ww(0.04),
    fontFamily: UbuntuRegular,
  },
  predefinedPlacesDescription: {
    color: '#1faadb',
  },
  placesContainer: {
    position: 'absolute',
    zIndex: 1,
  },
  searchIconView: {
    top: wh(0.015),
    left: ww(0.03),
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
  usersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    height: wh(0.1),
    alignItems: 'center',
    justifyContent: 'center',
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
});
