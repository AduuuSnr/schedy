import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {useSelector} from 'react-redux';
import {WebView} from 'react-native-webview';
import {Icon} from 'components';
import {ww, wh} from 'helpers';
import {CloseIcon} from 'assets/icons';

const WebviewComponent = ({visible, onClose}) => {
  const {lang, advertisement} = useSelector(state => ({
    lang: state.lang,
    advertisement: state.app.advertisement,
  }));

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      {/* {console.log(advertisement)} */}
      <View style={styles.webViewArea}>
        <View style={styles.webViewInnerArea}>
          <View style={styles.adMenu}>
            <Text style={styles.adText}>{lang.advertisement}</Text>
            <TouchableOpacity style={styles.adCloseButton} onPress={onClose}>
              <CloseIcon color={'#000'} />
            </TouchableOpacity>
          </View>
          <WebView
            containerStyle={styles.webViewContainerStyle}
            source={{uri: advertisement}}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  adText: {
    fontSize: 22,
    textAlign: 'center',
    width: '100%',
  },
  adCloseButton: {
    position: 'absolute',
    right: ww(0.016),
  },
  adMenu: {
    zIndex: 99,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderTopLeftRadius: ww(0.16),
    borderTopRightRadius: ww(0.16),
    height: wh(0.1),
    elevation: 2,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  webViewArea: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.5)',
    paddingHorizontal: ww(0.032),
    paddingBottom: wh(0.052),
    paddingTop: wh(0.052),
  },
  webViewInnerArea: {
    flex: 1,
  },
  webViewContainerStyle: {
    borderBottomLeftRadius: ww(0.16),
    borderBottomRightRadius: ww(0.16),
  },
});

export default WebviewComponent;
