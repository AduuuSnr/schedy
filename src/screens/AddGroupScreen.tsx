import {apiUrl} from '@constants';
import {White} from '@constants/colors';
import {UbuntuRegular} from 'assets/fonts';
import {AddPicture, AddResponsible, Picture, Responsibles} from 'assets/icons';
import axios from 'axios';
import {ArrowHeader, Button, CustomAlert, Input} from 'components';
import {doStorage, ImagePicker, wh, ww} from 'helpers';
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Image,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';

interface Props {
  navigation: any;
  route: any;
}

const AddGroupScreen = ({navigation, route}: Props) => {
  const {companyId} = route?.params;
  const user = useSelector(state => state.app.user);
  const [title, setTitle] = useState({text: null, error: false});
  const [description, setDescription] = useState({text: null, error: false});
  const [responseMessage, setResponseMessage] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState();
  const lang = useSelector(state => state.lang);

  const createGroup = () => {
    if (!title.text) {
      setTitle({text: null, error: true});
      setShowModal(true);
      setResponseMessage({
        message: 'Please Enter Group Name',
        status: 'fail',
      });
    } else if (!description.text) {
      setDescription({text: null, error: true});
      setShowModal(true);
      setResponseMessage({
        message: 'Please Enter Group Description',
        status: 'fail',
      });
    } else {
      const options = {
        method: 'POST',
        url: 'https://api.businessagenda.org/groups/',
        headers: {'Content-Type': 'application/json'},
        data: {
          groupName: title.text,
          groupDescription: description.text,
          banner: image,
          companyId,
          userId: user.id,
        },
      };

      axios
        .request(options)
        .then(function (response) {
          // console.log(response.data);
          setShowModal(true);
          setResponseMessage({
            message: response.data.message,
            status: response.data.status,
          });
          if (response.data.status == 'success') {
            setShowModal(false);

            navigation.pop();
          }
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  };

  return (
    <ScrollView style={{backgroundColor: White}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={{flex: 1, backgroundColor: White}}>
          <ArrowHeader title="New Group" onPress={() => navigation.pop()} />

          <CustomAlert
            message={responseMessage?.message}
            status={responseMessage?.status}
            setShowModal={setShowModal}
            showModal={showModal}
          />
          <View style={{marginTop: wh(0.03)}}>
            <View style={styles.marginHorizontal}>
              <Input
                value={title.text}
                error={title.error}
                onChangeText={(text: string) => setTitle({text, error: false})}
                iconName="title"
                title={lang.groupName}
                containerStyle={styles.singleInput}
              />
            </View>

            <View style={styles.marginHorizontal}>
              <Input
                value={description.text}
                error={description.error}
                onChangeText={(text: string) =>
                  setDescription({text, error: false})
                }
                containerStyle={styles.multiline}
                iconName="description"
                title={lang.groups + ' ' + lang.description}
                multiline
              />
            </View>

            <View style={styles.marginHorizontal}>
              <View style={styles.row}>
                <Picture size={ww(0.05)} />
                <Text style={styles.addTexts}>{lang.banner} </Text>
              </View>
              <View style={styles.imagesRow}>
                {image && (
                  <Image style={styles.companyImages} source={{uri: image}} />
                )}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() =>
                    ImagePicker(res => {
                      res.map(el => {
                        doStorage(
                          'groupBanners/',
                          el.uri,
                          `${new Date().getTime()}-${el.fileName}`,
                          el.type,
                          setImage,
                          image,
                        );
                      });
                    }, false)
                  }>
                  {!image ? (
                    <AddPicture size={ww(0.14)} />
                  ) : (
                    <Button
                      title={lang.edit}
                      style={{width: ww(0.14), height: ww(0.14)}}
                      onPress={() =>
                        ImagePicker(res => {
                          res.map(el => {
                            doStorage(
                              'companyBanners/',
                              el.uri,
                              `${new Date().getTime()}-${el.fileName}`,
                              el.type,
                              setImage,
                              image,
                            );
                          });
                        }, false)
                      }
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <Button
              title={lang.createGroup}
              style={styles.createTaskButton}
              onPress={createGroup}
            />
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

export default AddGroupScreen;

const styles = StyleSheet.create({
  row: {flexDirection: 'row', marginVertical: wh(0.03)},
  createTaskButton: {alignSelf: 'center', marginVertical: wh(0.05)},
  addTexts: {
    fontFamily: UbuntuRegular,
    fontSize: ww(0.033),
    color: '#6c6c6c',
    marginLeft: ww(0.015),
  },
  imagesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  marginHorizontal: {marginHorizontal: ww(0.1), marginVertical: wh(0.02)},
  companyImages: {
    width: ww(0.14),
    height: ww(0.14),
    borderRadius: ww(0.02),
    marginHorizontal: ww(0.01),
  },
});
