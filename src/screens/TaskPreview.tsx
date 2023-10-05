import React, {useState, useEffect} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Linking,
  Platform,
} from 'react-native';
import {useSelector} from 'react-redux';
import {White} from '@constants/colors';

import {UbuntuBold, UbuntuRegular} from 'assets/fonts';
import {CloseIcon, EndDate, Location, Responsibles} from 'assets/icons';
import axios from 'axios';
import {Button, ArrowHeader} from 'components';
import {dateFormatter, wh, ww} from 'helpers';

interface Props {
  navigation: any;
  route: any;
}

interface TaskProps {
  address: string;
  description: string;
  taskName: string;
  times: {startDate: string; endDate: string};
  pinned: boolean;
}

const TaskPreview = ({navigation, route}: Props) => {
  const task = route?.params?.task;
  const lang = useSelector(state => state.lang);

  // console.log(route.params?.task);

  const [showModal, setShowModal] = useState(false);
  const [taskResponse, setTaskResponse] = useState({});
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const createGoogleMapsRoute = () => {
    Linking.openURL(`http://maps.google.com/?daddr=${latitude},${longitude}`);
  };

  const openGps = () => {
    var scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
    var url = scheme + `${latitude},${longitude}`;
    Linking.openURL(url);
  };

  const deleteTask = () => {
    const options = {
      method: 'POST',
      url: 'https://api.businessagenda.org/tasks/deleteTask',
      headers: {'Content-Type': 'application/json'},
      data: {taskId: route?.params?.task?.id},
    };

    axios
      .request(options)
      .then(function (response) {
        setShowModal(true);
        setTaskResponse({
          message: response.data.message,
          status: response.data.status,
        });

        if (response.data.status === 'success') {
          navigation.pop();
        } else {
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  useEffect(() => {
    console.log(JSON.parse(task?.address).lat);
    setLatitude(JSON.parse(task?.address).lat);
    setLongitude(JSON.parse(task?.address).long);
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: White}}>
      <ArrowHeader title={lang.tasks} onPress={() => navigation.pop()} />

      <ScrollView style={{backgroundColor: White}}>
        <SafeAreaView>
          {/* SETTINGS MODAL */}

          <Modal animationType="fade" transparent={true} visible={showModal}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <TouchableOpacity
                  onPress={() => setShowModal(false)}
                  activeOpacity={0.7}
                  style={{
                    position: 'absolute',
                    top: ww(0.02),
                    right: ww(0.02),
                  }}>
                  <CloseIcon size={ww(0.1)} />
                </TouchableOpacity>
                <Text style={styles.doYouWant}>{lang.arUSureDeleteTask}</Text>
                <Button
                  title="Delete"
                  style={{marginTop: wh(0.01)}}
                  onPress={deleteTask}
                />
              </View>
            </View>
          </Modal>
          {/* SETTINGS MODAL */}

          <Image style={styles.taskImage} source={{uri: task?.banner}} />
          <View style={styles.bottomSide}>
            <Text style={styles.taskName}>{task?.taskName}</Text>
            <TouchableOpacity
              style={styles.row}
              onPress={() => createGoogleMapsRoute()}>
              <Location size={ww(0.05)} />
              <Text style={styles.infoText}>
                {JSON.parse(task?.address).address}
                {console.log(task?.address)}
              </Text>
            </TouchableOpacity>

            <View style={styles.row}>
              <EndDate size={ww(0.05)} />
              <Text style={styles.infoText}>
                {dateFormatter(new Date(task?.times.end))?.split(' ')[0]}
              </Text>
            </View>

            <View style={styles.divider} />

            <Text style={styles.description}>{task?.description}</Text>

            <View style={[styles.row, {marginTop: wh(0.03)}]}>
              <Responsibles size={ww(0.05)} />
              <Text style={styles.responsibles}>Responsibles</Text>
            </View>

            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
              {task?.users?.map((user, index) => (
                <Image
                  key={index}
                  style={styles.responsibleAvatars}
                  source={{uri: user.avatar}}
                />
              ))}
            </View>

            <Button
              title="Comment"
              style={styles.commentButton}
              onPress={() =>
                navigation.navigate('TaskComments', {
                  taskId: route.params?.task?.id,
                })
              }
            />
          </View>
        </SafeAreaView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TaskPreview;

const styles = StyleSheet.create({
  taskImage: {
    width: ww(1),
    height: wh(0.3),
  },
  responsibles: {
    fontFamily: UbuntuRegular,
    fontSize: ww(0.04),
    color: '#6c6c6c',
    marginLeft: ww(0.025),
  },
  responsibleAvatars: {
    width: ww(0.13),
    height: ww(0.13),
    borderRadius: ww(0.02),
    marginHorizontal: ww(0.014),
    marginVertical: wh(0.005),
  },
  commentButton: {
    alignSelf: 'center',
    marginTop: wh(0.03),
    marginBottom: wh(0.05),
  },
  taskName: {
    fontFamily: UbuntuBold,
    fontSize: ww(0.06),
    color: '#373737',
    marginBottom: wh(0.02),
  },
  description: {
    fontFamily: UbuntuRegular,
    fontSize: ww(0.04),
    color: '#515151',
  },
  infoText: {
    fontFamily: UbuntuRegular,
    fontSize: ww(0.04),
    color: '#333',
    marginLeft: ww(0.03),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: wh(0.006),
  },
  divider: {
    borderBottomWidth: wh(0.001),
    marginVertical: wh(0.035),
  },
  bottomSide: {
    paddingHorizontal: ww(0.08),
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '80%',
    height: '30%',
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
  doYouWant: {
    fontFamily: UbuntuBold,
    fontSize: ww(0.04),
    textAlign: 'center',
  },
});
