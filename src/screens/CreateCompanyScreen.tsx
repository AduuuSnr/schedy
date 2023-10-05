import {apiUrl} from '@constants';
import {White} from '@constants/colors';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {UbuntuMedium, UbuntuRegular} from 'assets/fonts';
import {AddPicture, Picture, SearchIcon} from 'assets/icons';
import axios from 'axios';
import {ArrowHeader, Button, CustomAlert, Input} from 'components';
import {doStorage, ImagePicker, wh, ww} from 'helpers';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  SafeAreaView,
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

import {useSelector} from 'react-redux';

interface Props {
  navigation: any;
}

const CreateCompanyScreen = ({navigation}: Props) => {
  const user = useSelector(state => state.app.user);
  const lang = useSelector(state => state.lang);
  const [title, setTitle] = useState({text: null, error: false});
  const [description, setDescription] = useState({text: null, error: false});

  const [companyResponse, setCompanyResponse] = useState(null);
  const [image, setImage] = useState();
  const [showResponseModal, setShowResponseModal] = useState(false);

  const createCompany = () => {
    if (!title.text) {
      setTitle({text: null, error: true});
      setShowResponseModal(true);
      setCompanyResponse({
        message: 'Please Enter Company Title',
        status: 'fail',
      });
    } else if (!description.text) {
      setDescription({text: null, error: true});
      setShowResponseModal(true);
      setCompanyResponse({
        message: 'Please Enter Company Description',
        status: 'fail',
      });
    } else if (!image) {
      setShowResponseModal(true);
      setCompanyResponse({
        message: 'Please Enter Company Image',
        status: 'fail',
      });
    } else {
      const options = {
        method: 'POST',
        url: `${apiUrl}/companies`,
        headers: {'Content-Type': 'application/json'},
        data: {
          companyName: title.text,
          companyDescription: description.text,
          banner: image,
          ownerId: user.id,
        },
      };

      axios
        .request(options)
        .then(function (response) {
          setCompanyResponse({
            message: response.data.message,
            status: response.data.status,
          });
          setShowResponseModal(true);

          if (response.data.status == 'success') {
            navigation.pop();
          }
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{backgroundColor: White}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <CustomAlert
              message={companyResponse?.message}
              showModal={showResponseModal}
              status={companyResponse?.status}
              setShowModal={setShowResponseModal}
            />

            <ArrowHeader title="New Company" onPress={() => navigation.pop()} />
            <View style={{marginTop: wh(0.03)}}>
              <View style={styles.marginHorizontal}>
                <Input
                  value={title.text}
                  error={title.error}
                  onChangeText={(text: string) =>
                    setTitle({text, error: false})
                  }
                  iconName="title"
                  title="Company Name"
                  containerStyle={styles.singleInput}
                />
              </View>

              <View style={styles.marginHorizontal}>
                <Input
                  value={description.text}
                  error={description.error}
                  onChangeText={(text: string) =>
                    setDescription({text, error: false})
                  }
                  containerStyle={styles.multiline}
                  iconName="description"
                  title="Company Description"
                  multiline
                />
              </View>

              <View style={styles.marginHorizontal}>
                <View style={styles.row}>
                  <Picture size={ww(0.05)} />
                  <Text style={styles.addTexts}>Banner</Text>
                </View>
                <View style={styles.imagesRow}>
                  {image && (
                    <Image style={styles.companyImages} source={{uri: image}} />
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
                          setImage,
                          image,
                        );
                      }, false);
                    }}>
                    {!image ? (
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
                              setImage,
                              image,
                            );
                          }, false)
                        }
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              <Button
                title="Create Company"
                style={styles.createTaskButton}
                onPress={createCompany}
              />
            </View>
          </>
        </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateCompanyScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: White},
  row: {flexDirection: 'row', marginVertical: wh(0.03)},
  createTaskButton: {alignSelf: 'center', marginVertical: wh(0.05)},
  addTexts: {
    fontFamily: UbuntuRegular,
    fontSize: ww(0.033),
    color: '#6c6c6c',
    marginLeft: ww(0.015),
  },
  imagesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  marginHorizontal: {marginHorizontal: ww(0.1), marginVertical: wh(0.02)},
  companyImages: {
    width: ww(0.14),
    height: ww(0.14),
    borderRadius: ww(0.02),
    marginHorizontal: ww(0.01),
  },
  addPictureView: {
    zIndex: 99,
    alignSelf: 'flex-start',
  },
  responsibleAvatars: {
    width: ww(0.13),
    height: ww(0.13),
    borderRadius: ww(0.02),
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
