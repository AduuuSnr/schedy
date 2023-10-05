import {UbuntuRegular} from 'assets/fonts';
import {ww} from 'helpers';
import React from 'react';
import {View, Text, Image} from 'react-native';
import {
  Avatar,
  Bubble,
  SystemMessage,
  Message,
  MessageText,
} from 'react-native-gifted-chat';

export const renderAvatar = props => (
  <Avatar
    {...props}
    containerStyle={{left: {borderWidth: 3, borderColor: 'red'}, right: {}}}
    imageStyle={{left: {borderWidth: 3, borderColor: 'blue'}, right: {}}}
  />
);

export const renderBubble = props => (
  <Bubble
    {...props}
    // renderTime={() => <Text>Time</Text>}
    renderTicks={() => (
      <Image
        resizeMode="contain"
        source={require('assets/icons/tick.png')}
        style={{width: 15, height: 15}}
      />
    )}
    // containerStyle={{
    //   left: {backgroundColor: '#FFF'},
    //   right: {},
    // }}
    wrapperStyle={{
      right: {backgroundColor: '#5669FF', borderRadius: 10},
      left: {backgroundColor: 'rgba(86, 105, 255, 0.15);'},
    }}
    // bottomContainerStyle={{
    //   left: {borderColor: '#5669FF', borderWidth: 4},
    //   right: {borderColor: 'rgba(86, 105, 255, 0.15);', borderWidth: 4},
    // }}
    tickStyle={{}}
    // usernameStyle={{color: '#5669FF', fontWeight: '100'}}
    // containerToNextStyle={{
    //   left: {borderColor: '#5669FF', borderWidth: 4},
    //   right: {borderColor: 'rgba(86, 105, 255, 0.15);', borderWidth: 4},
    // }}
    // containerToPreviousStyle={{
    //   left: {borderColor: '#5669FF', borderWidth: 4},
    //   right: {borderColor: 'rgba(86, 105, 255, 0.15);', borderWidth: 4},
    // }}
  />
);

export const renderSystemMessage = props => (
  <SystemMessage
    {...props}
    containerStyle={{backgroundColor: 'pink'}}
    wrapperStyle={{borderWidth: 10, borderColor: 'white'}}
    textStyle={{color: 'crimson', fontWeight: '900'}}
  />
);

export const renderMessage = props => (
  <Message
    {...props}
    // renderDay={() => <Text>Date</Text>}
    containerStyle={{
      left: {backgroundColor: 'lime'},
      right: {backgroundColor: 'gold'},
    }}
  />
);

export const renderMessageText = props => (
  <MessageText
    {...props}
    // containerStyle={{
    //   right: {backgroundColor: '#5669FF'},
    //   left: {backgroundColor: 'rgba(86, 105, 255, 0.15);'},
    // }}
    textStyle={{
      left: {fontFamily: UbuntuRegular, fontSize: ww(0.04), color: 'black'},
      right: {fontFamily: UbuntuRegular, fontSize: ww(0.04), color: 'white'},
    }}
    // linkStyle={{
    //   left: {color: 'orange'},
    //   right: {color: 'orange'},
    // }}
    // customTextStyle={{fontSize: 24, lineHeight: 24}}
  />
);

export const renderCustomView = ({user}) => (
  <View style={{minHeight: 20, alignItems: 'center'}}>
    <Text>
      Current user:
      {user.name}
    </Text>
    <Text>From CustomView</Text>
  </View>
);
