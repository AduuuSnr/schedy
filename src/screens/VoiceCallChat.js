import React, {Component, useEffect, useRef, useState} from 'react';
import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
  TwilioVideo,
} from 'react-native-twilio-video-webrtc';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  StyleSheet,
  Image,
  ImageBackground,
} from 'react-native';
import {useSelector} from 'react-redux';
import {socket} from '@constants/socket';
import {ww} from 'helpers';
import {wh} from 'helpers';
import {UbuntuBold, UbuntuMedium, UbuntuRegular} from 'assets/fonts';
import {MainBlue, White} from '@constants/colors';
import {Decline, Hangup, MicUnmuted, MutedMic, Speaker} from 'assets/icons';
import RNCallKeep from 'react-native-callkeep';
import {SafeAreaView} from 'react-native-safe-area-context';

const VoiceCallChat = ({route, navigation}) => {
  const {roomIdentity, person} = route?.params;
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [status, setStatus] = useState('disconnected');

  const [videoTracks, setVideoTracks] = useState(new Map());
  const twilioToken = useSelector(state => state.app.twilioToken);
  const twilioRef = useRef(null);
  const user = useSelector(state => state.app.user);

  console.log(person);

  useEffect(() => {
    _onConnectButtonPress();
  }, []);

  const _onConnectButtonPress = () => {
    twilioRef.current.connect({
      accessToken: twilioToken,
      roomName: roomIdentity,
      isVideoEnabled: false,
      dominantSpeakerEnabled: false,
    });
    setStatus('connecting');
  };

  const _onEndButtonPress = () => {
    twilioRef.current.disconnect();
    navigation.pop();
    RNCallKeep.endAllCalls();
    socket.emit('leave room', {
      roomID: roomIdentity,
    });
  };

  useEffect(() => {
    socket.on('give rooms', data => {
      if (!data[roomIdentity]) {
        if (twilioRef.current) {
          twilioRef.current.disconnect();
          navigation.pop();
          RNCallKeep.endAllCalls();
        }
      } else if (
        data[roomIdentity][0].caller.id === user.id &&
        data[roomIdentity][0].status === 'missed' &&
        data[roomIdentity][0].type === 'voice'
      ) {
        /********* MISSED CALL FOR CALLER *********/
        socket.emit('leave room', {
          roomID: roomIdentity,
        });
        console.log('arama gelmemeli voicechat screen');

        navigation.pop();
        RNCallKeep.endAllCalls();
        /********* MISSED CALL *********/
      }
    });
  }, []);

  const _onMuteButtonPress = () => {
    twilioRef.current
      .setLocalAudioEnabled(!isAudioEnabled)
      .then(isEnabled => setIsAudioEnabled(isEnabled));
  };

  const _onRoomDidConnect = ({roomName, error}) => {
    console.log('onRoomDidConnect: ', roomName);

    setStatus('connected');
  };

  const _onRoomDidDisconnect = ({roomName, error}) => {
    console.log('[Disconnect]ERROR: ', error);
    setStatus('disconnected');
  };

  const _onRoomDidFailToConnect = error => {
    console.log('[FailToConnect]ERROR: ', error);

    setStatus('disconnected');
  };

  const _onParticipantAddedVideoTrack = ({participant, track}) => {
    console.log('onParticipantAddedVideoTrack: ', participant, track);

    setVideoTracks(
      new Map([
        ...videoTracks,
        [
          track.trackSid,
          {participantSid: participant.sid, videoTrackSid: track.trackSid},
        ],
      ]),
    );
  };

  const _onParticipantRemovedVideoTrack = ({participant, track}) => {
    console.log('onParticipantRemovedVideoTrack: ', participant, track);

    const videoTracksLocal = videoTracks;
    videoTracksLocal.delete(track.trackSid);

    setVideoTracks(videoTracksLocal);
  };

  useEffect(() => {
    socket.emit('join room', {
      roomID: roomIdentity,
      members: {caller: user.id, target: person.id, type: 'voice'},
    });
  }, []);

  return (
    <ImageBackground
      style={styles.container}
      source={require('../assets/images/Mask.png')}>
      {(status === 'connected' || status === 'connecting') && (
        <SafeAreaView style={styles.container}>
          <View
            style={styles.callContainer}
            source={require('../assets/images/Mask.png')}>
            {status === 'connected' && (
              <View style={styles.remoteGrid}>
                {Array.from(videoTracks, ([trackSid, trackIdentifier]) => {
                  return <View />;
                })}
              </View>
            )}
            <View style={styles.callerContainer}>
              <Image
                source={{uri: person?.avatar}}
                style={styles.otherPersonAvatar}
              />
              <Text style={styles.callerName}>{person?.fullname}</Text>
              <Text
                style={{
                  fontFamily: UbuntuRegular,
                  fontSize: ww(0.03),
                  color: 'black',
                  marginTop: wh(0.01),
                }}>
                Voice Call
              </Text>
            </View>
            <View style={styles.optionsContainer}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: ww(0.33),
                }}>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => {}}>
                  {/* <Hangup size={ww(0.07)} /> */}
                  <Speaker />
                </TouchableOpacity>
                <Text style={{fontFamily: UbuntuMedium}}>Speaker</Text>
              </View>
              <View style={{alignItems: 'center', marginBottom: wh(0.05)}}>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={_onEndButtonPress}>
                  <Decline size={wh(0.12)} />
                </TouchableOpacity>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: ww(0.33),
                  }}>
                  <Text style={{fontFamily: UbuntuMedium, marginTop: wh(0.03)}}>
                    End
                  </Text>
                </View>
              </View>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: ww(0.33),
                }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.optionButton}
                  onPress={_onMuteButtonPress}>
                  {isAudioEnabled ? (
                    <MicUnmuted color={'white'} size={ww(0.07)} />
                  ) : (
                    <MutedMic color={'white'} size={ww(0.07)} />
                  )}
                </TouchableOpacity>
                <Text style={{fontFamily: UbuntuMedium}}>Mute</Text>
              </View>
              <TwilioVideoLocalView enabled={true} style={styles.localVideo} />
            </View>
          </View>
        </SafeAreaView>
      )}

      <TwilioVideo
        ref={twilioRef}
        onRoomDidConnect={_onRoomDidConnect}
        onRoomDidDisconnect={_onRoomDidDisconnect}
        onRoomDidFailToConnect={_onRoomDidFailToConnect}
        onParticipantAddedVideoTrack={_onParticipantAddedVideoTrack}
        onParticipantRemovedVideoTrack={_onParticipantRemovedVideoTrack}
      />
    </ImageBackground>
  );
};

export default VoiceCallChat;

const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: 'transparent',
  },
  callerName: {
    fontFamily: UbuntuBold,
    fontSize: ww(0.07),
    color: 'black',
    marginTop: wh(0.02),
  },
  callerContainer: {
    position: 'absolute',
    top: wh(0.3),
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  otherPersonAvatar: {
    width: ww(0.4),
    height: ww(0.4),
    borderRadius: ww(0.4),
  },
  callContainer: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
  },
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    paddingTop: 40,
  },
  input: {
    height: 50,
    borderWidth: 1,
    marginRight: 70,
    marginLeft: 70,
    marginTop: 50,
    textAlign: 'center',
    backgroundColor: 'white',
  },
  button: {
    marginTop: 100,
  },
  localVideo: {
    flex: 1,
    // width: 150,
    // height: 250,
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
  remoteGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  remoteVideo: {
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    // width: 100,
    // height: 120,
  },
  optionsContainer: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 0,
    width: ww(1),
    height: 100,
    marginBottom: wh(0.02),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionButton: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: '#C4C4C4',
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
