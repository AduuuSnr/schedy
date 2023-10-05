import {UbuntuRegular} from 'assets/fonts';
import {SendButton} from 'assets/icons';
import {ww} from 'helpers';
import React, {useRef, useState} from 'react';
import {Image, StyleSheet, Text, View, Pressable} from 'react-native';
import {InputToolbar, Actions, Composer, Send} from 'react-native-gifted-chat';
import Video from 'react-native-video';

export const renderInputToolbar = props => (
  <InputToolbar
    {...props}
    containerStyle={
      {
        //   borderWidth: 0,
      }
    }
    primaryStyle={{alignItems: 'center'}}
  />
);

export const renderActions = props => (
  <Actions
    {...props}
    containerStyle={{
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 4,
      marginRight: 4,
      marginBottom: 0,
    }}
    icon={() => (
      <Image
        style={{width: 32, height: 32}}
        source={{
          uri: 'https://placeimg.com/32/32/any',
        }}
      />
    )}
    options={{
      'Choose From Library': () => {},
      Cancel: () => {},
    }}
    optionTintColor="#222B45"
  />
);

export const renderComposer = props => (
  <Composer
    {...props}
    textInputStyle={{
      color: 'rgba(0, 0, 0, 1)',
      fontFamily: UbuntuRegular,
      backgroundColor: 'rgba(0,0,0,0.1)',
      borderRadius: ww(0.05),
      paddingHorizontal: 24,
      alignSelf: 'center',
    }}
  />
);

export const renderSend = props => {
  //Add the extra styles via containerStyle

  return (
    <Send
      {...props}
      containerStyle={{justifyContent: 'center', alignItems: 'center'}}>
      <SendButton size={ww(0.11)} />
    </Send>
  );
};

export const renderMessageVideo = props => {
  const {currentMessage} = props;
  // const videoRef = useRef();

  return (
    <Video
      key={`${new Date().getTime()}-${Math.random() * 999}`}
      source={{
        uri: currentMessage.video,
      }}
      paused={true}
      style={{width: ww(0.5), height: ww(0.5)}}
      controls={true}
      audioOnly
    />
  );
};

const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
