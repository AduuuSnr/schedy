import {UbuntuBold} from 'assets/fonts';
import {AlertIcon, CheckIcon, CloseIcon} from 'assets/icons';
import {wh} from 'helpers';
import {ww} from 'helpers';
import React from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

interface Props {
  showModal: boolean;
  setShowModal: (param: boolean) => any;
  status: boolean;
  message: string;
}

const CustomAlert = ({showModal, setShowModal, status, message}: Props) => {
  return (
    <Modal animationType="fade" transparent={true} visible={showModal}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity
            onPress={() => setShowModal(false)}
            activeOpacity={0.7}
            style={{position: 'absolute', top: ww(0.02), right: ww(0.02)}}>
            <CloseIcon size={ww(0.1)} />
          </TouchableOpacity>
          {status === 'success' ? (
            <CheckIcon size={ww(0.2)} />
          ) : (
            <AlertIcon size={ww(0.2)} />
          )}
          <Text style={styles.doYouWant}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doYouWant: {
    fontFamily: UbuntuBold,
    fontSize: ww(0.04),
    textAlign: 'center',
    marginVertical: wh(0.02),
    color: '#5e5e5e',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
