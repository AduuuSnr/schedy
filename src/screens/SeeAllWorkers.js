import {apiUrl} from '@constants';
import {MainBlue, White} from '@constants/colors';
import {setBusinesses} from '@redux/app/actions';
import {UbuntuBold, UbuntuMedium, UbuntuRegular} from 'assets/fonts';
import {CloseIcon, Edit} from 'assets/icons';
import axios from 'axios';
import {ArrowHeader, Button, CustomAlert, Searchbar} from 'components';
import {wh} from 'helpers';
import {ww} from 'helpers';
import React, {useState} from 'react';
import {
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

const SeeAllWorkers = ({route, navigation}) => {
  const workers = route?.params?.workers;
  const canEdit = route?.params?.canEdit;
  const groupId = route?.params?.groupId;
  const companyId = route?.params?.companyId;

  const user = useSelector(state => state.app.user);
  const [searchText, setSearchText] = useState('');
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [responseModal, setResponseModal] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [workersState, setWorkers] = useState(workers);

  const dispatch = useDispatch();

  const removeFromCompany = () => {
    const options = {
      method: 'DELETE',
      url: 'https://api.businessagenda.org/companies/deleteCompanyMember',
      headers: {'Content-Type': 'application/json'},
      data: {companyId, userId: user.id, memberId: selectedWorker},
    };
    console.log(options.data);
    axios
      .request(options)
      .then(function (response) {
        setShowRemoveModal(false);
        setShowAlert(true);
        setResponseModal({
          message: response?.data?.message,
          status: response?.data?.status,
        });
        if (response.data.status === 'success') {
          let newWorkers = [...workersState].filter(
            worker => worker.id !== selectedWorker,
          );
          setWorkers(newWorkers);
          fetchCompanies();
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const removeWorker = () => {
    const options = {
      method: 'DELETE',
      url: 'https://api.businessagenda.org/groups/deleteTeamMember',
      headers: {'Content-Type': 'application/json'},
      data: {groupId, userId: user.id, memberId: selectedWorker},
    };

    axios
      .request(options)
      .then(function (response) {
        // console.log(response.data);
        setShowRemoveModal(false);
        setShowAlert(true);
        setResponseModal({
          message: response?.data?.message,
          status: response?.data?.status,
        });
        if (response.data.status === 'success') {
          let newWorkers = [...workersState].filter(
            worker => worker.id !== selectedWorker,
          );
          setWorkers(newWorkers);
          fetchCompanies();
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const fetchCompanies = id => {
    const options = {
      method: 'POST',
      url: `${apiUrl}/companies/getCompanyTeams`,
      headers: {'Content-Type': 'application/json'},
      data: {userId: id},
    };

    axios
      .request(options)
      .then(function (response) {
        dispatch(setBusinesses(response.data.message));
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  return (
    <ScrollView style={{backgroundColor: White}}>
      {/* MODAL */}
      <Modal animationType="fade" transparent={true} visible={showRemoveModal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => setShowRemoveModal(false)}
              activeOpacity={0.7}
              style={{position: 'absolute', top: ww(0.02), right: ww(0.02)}}>
              <CloseIcon size={ww(0.1)} />
            </TouchableOpacity>
            <Text style={styles.doYouWant}>
              {companyId
                ? 'Do You Want To Remove This Worker From Company ?'
                : 'Do You Want To Remove This Worker From Group ? '}
            </Text>
            <Button
              title="Delete"
              style={{marginTop: wh(0.01)}}
              onPress={() => {
                if (groupId) {
                  removeWorker();
                } else {
                  removeFromCompany();
                }
              }}
            />
          </View>
        </View>
      </Modal>
      {/* MODAL */}

      {/* CUSTOM ALERT */}
      <CustomAlert
        showModal={showAlert}
        setShowModal={setShowAlert}
        message={responseModal?.message}
        status={responseModal?.status}
      />
      {/* CUSTOM ALERT */}

      <SafeAreaView style={styles.container}>
        <ArrowHeader title="People" onPress={() => navigation.pop()} />
        <Searchbar
          value={searchText}
          onChangeText={text => setSearchText}
          containerStyle={styles.searchBar}
        />
        {workersState?.map((worker, index) => (
          <View style={styles.workerView} key={index}>
            <Image style={styles.avatar} source={{uri: worker.avatar}} />
            <Text style={styles.workerName}>{worker.fullname}</Text>
            <View style={styles.iconArea}>
              {canEdit && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    navigation.navigate('EditUserAuth', {worker, groupId});
                  }}
                  style={{marginRight: ww(0.05)}}>
                  <Edit color={MainBlue} size={ww(0.08)} />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setShowRemoveModal(true);
                  setSelectedWorker(worker.id);
                }}>
                <CloseIcon size={ww(0.08)} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </SafeAreaView>
    </ScrollView>
  );
};

export default SeeAllWorkers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: White,
    alignItems: 'center',
  },
  searchBar: {
    width: ww(0.8),
    marginVertical: wh(0.02),
  },
  workerView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: wh(0.01),
    width: '80%',
  },
  doYouWant: {
    marginVertical: wh(0.01),
    fontFamily: UbuntuBold,
    fontSize: ww(0.04),
    textAlign: 'center',
  },
  avatar: {
    width: ww(0.13),
    height: ww(0.13),
    borderRadius: ww(0.13),
    marginRight: ww(0.05),
  },
  workerName: {
    fontFamily: UbuntuMedium,
    fontSize: ww(0.04),
  },
  iconArea: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '80%',
    height: wh(0.3),
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
