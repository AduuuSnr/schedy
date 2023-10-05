import {keyLang} from '@constants/@async-keys';
import {Gray, White} from '@constants/colors';
import {setLang} from '@redux/lang/action';
import {UbuntuRegular} from 'assets/fonts';
import {About, CloseIcon, Language} from 'assets/icons';
import {ArrowHeader, Button} from 'components';
import {setData, wh, ww} from 'helpers';
import React, {useState} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

interface Props {
  navigation: any;
}

const SettingsScreen = ({navigation}: Props) => {
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const lang = useSelector(state => state.lang);
  const dispatch = useDispatch();
  const options = [
    // {icon: <DarkMode size={ww(0.06)} />, text: lang.darkMode, rightSide: ''},
    // {
    //   icon: <Chat size={ww(0.06)} />,
    //   text: lang.chatSettings,
    //   rightSide: '',
    // },
    // {
    //   icon: <ProfileLock size={ww(0.06)} />,
    //   text: lang.privacyAndSecurity,
    //   rightSide: '',
    // },
    {
      icon: <Language size={ww(0.06)} />,
      text: lang.language,
      onPress: () => {
        setShowLanguageModal(true);
      },
      rightSide: '',
    },
    {icon: <About size={ww(0.06)} />, text: lang.about, rightSide: ''},
  ];
  return (
    <SafeAreaView style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={showLanguageModal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => setShowLanguageModal(false)}
              activeOpacity={0.7}
              style={{position: 'absolute', top: ww(0.02), right: ww(0.02)}}>
              <CloseIcon size={ww(0.1)} />
            </TouchableOpacity>
            <Button
              title="English"
              onPress={() => {
                setData(keyLang, 'en');
                dispatch(setLang('en'));
                setShowLanguageModal(false);
              }}
            />
            <Button
              title="Deutsch"
              style={{marginVertical: 20}}
              onPress={() => {
                setData(keyLang, 'de');
                dispatch(setLang('de'));
                setShowLanguageModal(false);
              }}
            />
          </View>
        </View>
      </Modal>
      <ArrowHeader title={lang.settings} onPress={() => navigation.pop()} />
      {options.map((option, index) => (
        <Pressable
          key={index}
          style={styles.optionView}
          onPress={option.onPress}>
          {option.icon}
          <Text style={styles.optionText}>{option.text}</Text>
        </Pressable>
      ))}
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: White,
  },
  optionView: {
    flexDirection: 'row',
    width: ww(1),
    alignItems: 'center',
    paddingHorizontal: ww(0.15),
    marginVertical: wh(0.02),
  },
  optionText: {
    fontFamily: UbuntuRegular,
    fontSize: ww(0.04),
    color: Gray,
    paddingLeft: ww(0.03),
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '80%',
    height: '50%',
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
});
