import {LightGray, MainBlue, White} from '@constants/colors';
import CheckBox from '@react-native-community/checkbox';
import {UbuntuMedium} from 'assets/fonts';
import axios from 'axios';
import {ArrowHeader, Button, CustomAlert} from 'components';
import {wh} from 'helpers';
import {ww} from 'helpers';
import React, {useEffect, useState} from 'react';
import {Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';

const EditUserAuth = ({navigation, route}) => {
  const {worker, groupId} = route.params;
  const user = useSelector(state => state.app.user);
  const [permissions, setPermissions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [responseModal, setResponseModal] = useState();
  const [taskId, setTaskId] = useState(null);

  const editAuth = () => {
    const options = {
      method: 'POST',
      url: 'https://api.businessagenda.org/users/updatePermissions',
      headers: {'Content-Type': 'application/json'},
      data: {
        userId: user.id,
        memberId: worker.id,
        permission: {
          allowCreateTask: permissions[0].checked,
          allowEditTask: permissions[1].checked,
          allowDeleteTask: permissions[2].checked,
          allowEditGroup: permissions[3].checked,
          allowViewMap: permissions[4].checked,
          allowAddUser: permissions[5].checked,
          allowKickUser: permissions[6].checked,
        },
        groupId,
      },
    };

    console.log(options.data);

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        setShowModal(true);
        setResponseModal({
          message: response.data.message,
          status: response.data.status,
        });
        if (response?.data?.status == 'success') {
          setTimeout(() => {
            navigation.pop();
          }, 500);
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const fetchPermissions = () => {
    const options = {
      method: 'POST',
      url: 'https://api.businessagenda.org/users/getPermissions',
      headers: {'Content-Type': 'application/json'},
      data: {userId: worker.id, groupId: groupId},
    };
    // console.log(options.data);
    axios
      .request(options)
      .then(function (response) {
        // console.log(response.data);
        const short = response.data.data.permission;
        const titles = response.data.data.permissionTitles;

        console.log(titles?.allowCreateTask);
        setTaskId(response.data.data.id);
        setPermissions(
          Object.keys(short)?.map(key => ({
            text: titles[key],
            checked: short[key],
          })),
        );
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ArrowHeader onPress={() => navigation.pop()} />
      <CustomAlert
        showModal={showModal}
        setShowModal={setShowModal}
        message={responseModal?.message}
        status={responseModal?.status}
      />

      <View style={styles.personInfo}>
        <Image style={styles.avatar} source={{uri: worker.avatar}} />
        <Text style={styles.workerName}>{worker.fullname}</Text>
      </View>
      <View style={{marginTop: wh(0.02)}}>
        {Array.isArray(permissions) &&
          permissions?.map((permission, index) => (
            <View key={index} style={styles.authOptions}>
              <Text>{permission?.text}</Text>

              <CheckBox
                value={permission.checked}
                onValueChange={newValue => {
                  const newPermissions = [...permissions];
                  newPermissions[index].checked = newValue;
                  setPermissions(newPermissions);
                }}
                tintColors={{true: MainBlue, false: LightGray}}
              />
            </View>
          ))}
      </View>
      <View>
        <Button
          title="Confirm"
          style={styles.confirmButton}
          onPress={() => editAuth()}
        />
      </View>
    </SafeAreaView>
  );
};

export default EditUserAuth;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: White,
    alignItems: 'center',
  },
  avatar: {
    width: ww(0.13),
    height: ww(0.13),
    borderRadius: ww(0.13),
  },
  workerName: {
    fontFamily: UbuntuMedium,
    fontSize: ww(0.04),
  },
  personInfo: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  authOptions: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: ww(0.6),
    marginVertical: wh(0.01),
  },
  confirmButton: {
    marginTop: wh(0.01),
  },
});
