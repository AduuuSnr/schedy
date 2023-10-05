import Geolocation from 'react-native-geolocation-service';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import React, {useEffect, useState} from 'react';

import {
  Alert,
  PermissionsAndroid,
  Linking,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  View,
  Platform,
  Pressable,
} from 'react-native';
import {ImagePicker} from 'helpers';
import {doStorageURL} from 'helpers/doStorage';
import DocumentPicker from 'react-native-document-picker';
import {ww} from 'helpers';
import {UbuntuRegular} from 'assets/fonts';
import {White} from '@constants/colors';
import {wh} from 'helpers';
import MapView from 'react-native-maps';
import Sound from 'react-native-sound';

export const renderCustomView = ({currentMessage}) => {
  return (
    <>
      {currentMessage?.pdf ? (
        <TouchableOpacity
          key={`${new Date().getTime()}-${Math.random() * 999}`}
          style={styles.customOuter}
          onPress={() => {
            Linking.openURL(`${currentMessage.pdf}`);
          }}>
          <View style={styles.iconSide}>
            <Image
              style={styles.image}
              resizeMode="contain"
              source={require('../../assets/images/pdfPreview.jpg')}
            />
          </View>
          <View style={styles.textSide}>
            <Text numberOfLines={1} style={styles.fileName}>
              {`${currentMessage?.pdf
                ?.split(' ')
                .slice(1, currentMessage?.pdf.split(' ').length - 1)
                .join()}`}
            </Text>
          </View>
          <View style={styles.downloadIconSide}>
            <Image
              style={styles.downloadIcon}
              resizeMode="contain"
              source={require('../../assets/images/download-button.png')}
            />
          </View>
        </TouchableOpacity>
      ) : currentMessage?.csv ? (
        <TouchableOpacity
          key={`${new Date().getTime()}-${Math.random() * 999}`}
          style={styles.customOuter}
          onPress={() => {
            Linking.openURL(`${currentMessage.csv}`);
          }}>
          <View style={styles.iconSide}>
            <Image
              style={styles.image}
              resizeMode="contain"
              source={require('../../assets/images/csv.jpg')}
            />
          </View>
          <View style={styles.textSide}>
            <Text numberOfLines={1} style={styles.fileName}>
              {`${currentMessage?.csv?.split('/undefined/')[1].split('-')[1]}`}
            </Text>
          </View>
          <View style={styles.downloadIconSide}>
            <Image
              style={styles.downloadIcon}
              resizeMode="contain"
              source={require('../../assets/images/download-button.png')}
            />
          </View>
        </TouchableOpacity>
      ) : currentMessage.docx ? (
        <TouchableOpacity
          key={`${new Date().getTime()}-${Math.random() * 999}`}
          style={styles.customOuter}
          onPress={() => {
            Linking.openURL(`${currentMessage.docx}`);
          }}>
          <View style={styles.iconSide}>
            <Image
              style={styles.image}
              resizeMode="contain"
              source={require('../../assets/images/docx.jpg')}
            />
          </View>
          <View style={styles.textSide}>
            <Text numberOfLines={1} style={styles.fileName}>
              {`${currentMessage?.docx?.split('/undefined/')[1].split('-')[1]}`}
            </Text>
          </View>
          <View style={styles.downloadIconSide}>
            <Image
              style={styles.downloadIcon}
              resizeMode="contain"
              source={require('../../assets/images/download-button.png')}
            />
          </View>
        </TouchableOpacity>
      ) : currentMessage.location ? (
        <Pressable
          key={`${new Date().getTime()}-${Math.random() * 999}`}
          style={{zIndex: 99, padding: ww(0.05)}}
          onPress={() => {
            if (Platform.OS === 'android') {
              Linking.openURL(
                `http://maps.google.com/?q=${currentMessage.location.latitude},${currentMessage.location.longitude}`,
              );
            } else {
              Linking.openURL(
                `maps://?q=${currentMessage.location.latitude},${currentMessage.location.longitude}`,
              );
            }
          }}>
          <MapView
            style={styles.mapView}
            region={{
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
          />
        </Pressable>
      ) : null}
    </>
  );
};

export const RenderAudio = props => {
  const [track, setTrack] = useState(null);
  const [error, setError] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const trk = new Sound(`${props.currentMessage.audio}`, null, e => {
      if (e) {
        setError(true);
      } else {
        setError(false);
        setDuration(getAudioTimeString(trk.getDuration()));
      }
    });
    setTrack(trk);
  }, []);

  const getAudioTimeString = seconds => {
    const h = parseInt(seconds / (60 * 60));
    const m = parseInt((seconds % (60 * 60)) / 60);
    const s = parseInt(seconds % 60);
    return (
      (h < 10 ? '0' + h : h) +
      ':' +
      (m < 10 ? '0' + m : m) +
      ':' +
      (s < 10 ? '0' + s : s)
    );
  };

  return (
    <Pressable
      style={{
        width: ww(0.2),
        height: ww(0.15),
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}
      key={new Date().getTime()}
      onPress={() => {
        setIsPlaying(!isPlaying);
        if (!error) {
          if (isPlaying) {
            track.stop(success => {
              if (success) {
              } else {
              }
            });
          } else {
            track.play(success => {
              if (success) {
              } else {
              }
            });
          }
        }
      }}>
      {!isPlaying ? (
        <Image
          source={require('assets/images/playButton.png')}
          resizeMode="contain"
          style={{width: ww(0.05), height: ww(0.05)}}
        />
      ) : (
        <Image
          source={require('assets/images/stopButton.png')}
          resizeMode="contain"
          style={{width: ww(0.05), height: ww(0.05), tintColor: White}}
        />
      )}
      <Text>{duration} </Text>
    </Pressable>
  );
};

export async function pickImageChat(user, onSend) {
  launchImageLibrary({mediaType: 'mixed'}, async res => {
    if (res.assets) {
      onSend([
        {
          user: {_id: user.id, name: user.fullname, avatar: user.avatar},
          image: await doStorageURL(
            `chatImages/${user._id}/`,
            res.assets[0].uri,
            `${new Date().getTime()}-${res.assets[0].fileName}`,
            res.assets[0].type,
          ),
        },
      ]);
    }
  });
}

export async function openCamera(user, onSend) {
  launchCamera({mediaType: 'mixed'}, async res => {
    if (res.assets) {
      onSend([
        {
          user: {_id: user.id, name: user.fullname, avatar: user.avatar},
          image: await doStorageURL(
            `chatImages/${user._id}/`,
            res.assets[0].uri,
            `${new Date().getTime()}-${res.assets[0].fileName}`,
            res.assets[0].type,
          ),
        },
      ]);
    }
  });
}

export async function openDocument(user, onSend) {
  try {
    const res = await DocumentPicker.pick({
      type: [DocumentPicker.types.allFiles],
    });

    const objectUrl = await doStorageURL(
      `chatFiles/${user._id}/`,
      res[0].fileCopyUri,
      `${new Date().getTime()}-${res[0].name}`,
      res[0].type,
    );

    const obj = {
      user: {_id: user.id, name: user.fullname, avatar: user.avatar},
    };
    if (res[0].type == 'application/pdf') {
      obj.pdf = objectUrl;
    } else if (res[0].type == 'text/comma-separated-values') {
      obj.csv = objectUrl;
    } else if (res[0].type == 'application/msword') {
      obj.docx = objectUrl;
    } else if (res[0].type.includes('video/')) {
      obj.video = objectUrl;
    } else if (res[0].name.includes('.doc') || res[0].name.includes('docx')) {
      obj.docx = objectUrl;
    }
    if (res[0]) {
      onSend([obj]);
    }
  } catch (error) {
    console.log('mevzu ne aq');
  }
}

export const sendLocation = async (user, onSend) => {
  Geolocation.getCurrentPosition(
    position => {
      onSend([
        {
          user: {_id: user.id, name: user.fullname, avatar: user.avatar},
          location: position.coords,
        },
      ]);
    },
    error => {
      // See error code charts below.
    },
    {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
  );
};

const styles = StyleSheet.create({
  downloadIcon: {
    width: ww(0.05),
    height: ww(0.05),
    marginRight: ww(0.03),
  },
  image: {
    width: ww(0.1),
    height: ww(0.1),
    borderRadius: ww(0.01),
  },
  downloadIconSide: {
    flex: 1,
  },
  fileName: {
    paddingHorizontal: ww(0.04),
    fontFamily: UbuntuRegular,
    fontSize: ww(0.032),
    color: White,
  },
  customOuter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: ww(0.5),
  },
  iconSide: {
    flex: 1,
    alignItems: 'center',
    marginLeft: ww(0.02),
    marginTop: wh(0.01),
  },
  textSide: {flex: 4},
  mapView: {
    width: ww(0.3),
    height: ww(0.3),
    margin: 3,
    zIndex: 0.5,
  },
});
