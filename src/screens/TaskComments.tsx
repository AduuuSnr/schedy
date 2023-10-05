import {LightGray, MainBlue, White} from '@constants/colors';
import {UbuntuBold, UbuntuMedium, UbuntuRegular} from 'assets/fonts';
import axios from 'axios';
import {ArrowHeader, Button, Header} from 'components';
import {wh, ww} from 'helpers';
import React, {useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {useSelector} from 'react-redux';

interface Props {
  navigation: any;
}

const TaskComments = ({navigation, route}: Props) => {
  const [getComments, setGetComments] = useState([]);
  const lang = useSelector(state => state.lang);
  const user = useSelector(state => state.app.user);

  console.log(route.params?.taskId);

  useEffect(() => {
    const options = {
      method: 'POST',
      url: 'https://api.businessagenda.org/tasks/getCommentTask',
      headers: {'Content-Type': 'application/json'},
      data: {taskId: route.params?.taskId},
    };

    axios
      .request(options)
      .then(function (response) {
        const comments = response.data?.data;

        setGetComments(comments ? comments : []);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: White}}>
      <ArrowHeader title={lang.tasks} onPress={() => navigation.pop()} />
      <ScrollView>
        <SafeAreaView style={styles.container}>
          {getComments?.length > 0 ? (
            getComments.map((comments, index) => (
              <TouchableOpacity
                activeOpacity={0.7}
                key={index}
                onPress={() =>
                  navigation.navigate('CommentDetail', {comment: comments})
                }>
                <View style={styles.notificationView}>
                  <View style={{flex: 1, marginRight: ww(0.05)}}>
                    <Image
                      style={styles.avatar}
                      source={{uri: comments?.user[0].avatar}}
                    />
                  </View>

                  <View style={{flex: 4}}>
                    <Text style={styles.fromText}>
                      {comments?.user[0].fullname}
                    </Text>
                    <Text style={styles.commentText} numberOfLines={1}>
                      {comments?.comment}
                    </Text>
                    <Text style={styles.attachmentText}>
                      {comments?.gallery?.length === 0
                        ? `No`
                        : `+` + comments?.gallery?.length}{' '}
                      Attachments
                    </Text>
                  </View>
                  {/* <View style={{flex: 2, alignItems: 'center'}}>
        {getComments?.length > 0 ? (
          getComments.map(comments => (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate('CommentDetail', {comment: comments})
              }>
              {console.log(comments.gallery.length)}
              <View style={styles.notificationView}>
                <View style={{flex: 1, marginRight: ww(0.05)}}>
                  <Image
                    style={styles.avatar}
                    source={{uri: comments?.user[0].avatar}}
                  />
                </View>

                <View style={{flex: 4}}>
                  <Text style={styles.fromText}>
                    {comments?.user[0].fullname}
                  </Text>
                  <Text style={styles.commentText} numberOfLines={1}>
                    {comments?.comment}
                  </Text>
                  <Text style={styles.attachmentText}>
                    {comments?.gallery?.length === 0
                      ? `No`
                      : `+` + comments?.gallery?.length}{' '}
                    Attachments
                  </Text>
                </View>
                {/* <View style={{flex: 2, alignItems: 'center'}}>
                  <Text style={styles.when}>{notification.when}</Text>
                </View> */}
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{textAlign: 'center', fontFamily: UbuntuMedium}}>
              {lang.noComments}
            </Text>
          )}
          <Button
            title={lang?.addComment}
            style={{alignSelf: 'center', marginVertical: wh(0.1)}}
            onPress={() =>
              navigation.navigate(
                'AddComment',
                {taskId: route.params?.taskId},
                console.log(route.params.taskId),
              )
            }
          />
        </SafeAreaView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TaskComments;

const styles = StyleSheet.create({
  container: {
    backgroundColor: White,

    flex: 1,
  },
  commentText: {
    fontFamily: UbuntuRegular,
    fontSize: ww(0.035),
    color: '#5e5e5e',
    marginVertical: wh(0.005),
  },
  attachmentText: {
    fontFamily: UbuntuBold,
    fontSize: ww(0.03),
    color: MainBlue,
  },
  notificationView: {
    flexDirection: 'row',
    marginVertical: wh(0.02),
    paddingLeft: ww(0.08),
  },
  notificationActionButton: {
    width: ww(0.35),
    height: wh(0.055),
    marginHorizontal: ww(0.02),
    marginVertical: wh(0.01),
  },
  avatar: {
    width: ww(0.15),
    height: ww(0.15),
    borderRadius: ww(0.15),
  },
  contentText: {
    fontSize: ww(0.037),
    fontFamily: UbuntuRegular,
  },
  fromText: {
    fontFamily: UbuntuMedium,
    color: '#060518',
    fontSize: ww(0.037),
  },
  when: {
    fontFamily: UbuntuRegular,
    fontSize: ww(0.033),
    color: '#3C3E56',
  },
});
