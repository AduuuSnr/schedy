/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef, useState} from 'react';
import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
  TwilioVideo,
} from 'react-native-twilio-video-webrtc';
import {View, TouchableOpacity, StyleSheet, SafeAreaView} from 'react-native';
import {useSelector} from 'react-redux';
import {ww} from 'helpers';
import {ArrowHeader} from 'components';
import {wh} from 'helpers';
import {socket} from '@constants/socket';
import {White} from '@constants/colors';
import {FlipCamera, Hangup, MicUnmuted, MutedMic} from 'assets/icons';
import RNCallKeep from 'react-native-callkeep';
import {Stopwatch} from 'react-native-stopwatch-timer';

const CameraChatScreen = ({route, navigation}) => {
  const roomIdentity = route?.params?.roomIdentity;
  const person = route?.params?.person;

  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [status, setStatus] = useState('disconnected');
  const [stopwatchStart, setStopwatchStart] = useState(false);

  const [videoTracks, setVideoTracks] = useState(new Map());
  const twilioToken = useSelector(state => state.app.twilioToken);
  const twilioRef = useRef(null);
  const user = useSelector(state => state.app.user);

  useEffect(() => {
    _onConnectButtonPress();
  }, []);

  useEffect(() => {
    socket.on('give rooms', data => {
      setStopwatchStart(true);
      console.log('DATA: ', data);
      Object.values(data).map(val => {
        if (val[0].status === 'active') {
          RNCallKeep.rejectCall(user.uuid);
        }
        console.log('Status: ', val[0].status);
      });
    });
  }, []);

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
        data[roomIdentity][0].type === 'video'
      ) {
        /********* MISSED CALL FOR CALLER *********/
        socket.emit('leave room', {
          roomID: roomIdentity,
        });
        console.log('arama gelmemeli camerachat screen');
        if (twilioRef.current) {
          twilioRef.current.disconnect();
        }
        navigation.pop();
        RNCallKeep.endAllCalls();
        /********* MISSED CALL *********/
      }
    });
  }, []);

  useEffect(() => {
    socket.emit('join room', {
      roomID: roomIdentity,
      members: {caller: user?.id, target: person?.id, type: 'video'},
    });
  }, []);

  const _onConnectButtonPress = () => {
    twilioRef.current.connect({
      accessToken: twilioToken,
      roomName: roomIdentity,
    });
    setStatus('connecting');
    // setStopwatchStart(true);
  };

  const _onEndButtonPress = () => {
    RNCallKeep.endAllCalls();
    socket.emit('leave room', {
      roomID: roomIdentity,
    });
    navigation.pop();
  };

  const _onMuteButtonPress = () => {
    twilioRef.current
      .setLocalAudioEnabled(!isAudioEnabled)
      .then(isEnabled => setIsAudioEnabled(isEnabled));
  };

  const _onFlipButtonPress = () => {
    twilioRef.current.flipCamera();
  };

  const _onRoomDidConnect = ({roomName, error}) => {
    // console.log('onRoomDidConnect: ', roomName);

    setStatus('connected');
  };

  const _onRoomDidDisconnect = ({roomName, error}) => {
    // console.log('[Disconnect]ERROR: ', error);
    setStopwatchStart(false);
    setStatus('disconnected');
  };

  const _onRoomDidFailToConnect = error => {
    // console.log('[FailToConnect]ERROR: ', error);

    setStatus('disconnected');
  };

  const _onParticipantAddedVideoTrack = ({participant, track}) => {
    // console.log('onParticipantAddedVideoTrack: ', participant, track);

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
    const videoTracksLocal = videoTracks;
    videoTracksLocal.delete(track.trackSid);

    setVideoTracks(videoTracksLocal);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ArrowHeader title={person?.fullname} onPress={() => navigation.pop()} />
      {(status === 'connected' || status === 'connecting') && (
        <View style={styles.callContainer}>
          {status === 'connected' && (
            <View style={styles.remoteGrid}>
              {Array.from(videoTracks, ([trackSid, trackIdentifier]) => {
                return (
                  <TwilioVideoParticipantView
                    style={styles.remoteVideo}
                    key={trackSid}
                    trackIdentifier={trackIdentifier}
                  />
                );
              })}
            </View>
          )}
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={_onEndButtonPress}>
              <Hangup size={ww(0.07)} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={_onMuteButtonPress}>
              {isAudioEnabled ? (
                <MicUnmuted size={ww(0.07)} />
              ) : (
                <MutedMic size={ww(0.07)} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={_onFlipButtonPress}>
              <FlipCamera size={ww(0.07)} />
            </TouchableOpacity>
            <Stopwatch start={stopwatchStart} options={options} />
            <TwilioVideoLocalView enabled={true} style={styles.localVideo} />
          </View>
        </View>
      )}

      <TwilioVideo
        ref={twilioRef}
        onRoomDidConnect={_onRoomDidConnect}
        onRoomDidDisconnect={_onRoomDidDisconnect}
        onRoomDidFailToConnect={_onRoomDidFailToConnect}
        onParticipantAddedVideoTrack={_onParticipantAddedVideoTrack}
        onParticipantRemovedVideoTrack={_onParticipantRemovedVideoTrack}
      />
    </SafeAreaView>
  );
};

export default CameraChatScreen;

const options = {
  container: {
    padding: 5,
    borderRadius: 5,
    width: 220,
  },
  text: {
    fontSize: ww(0.05),
    color: 'black',
  },
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
    width: 100,
    height: 150,
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
    width: ww(1),
    height: wh(1),
  },
  optionsContainer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionButton: {
    width: 60,
    height: 60,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 100 / 2,
    backgroundColor: White,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
