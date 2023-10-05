import React, {useState} from 'react';
import {Image, SafeAreaView, StyleSheet, Text, View, Modal} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Carousel from 'react-native-snap-carousel';

import {White} from '@constants/colors';
import {UbuntuBold, UbuntuMedium} from 'assets/fonts';
import {ArrowHeader, HeaderBack} from 'components';
import {ww} from 'helpers';
import {wh} from 'helpers';
import {dateFormatter} from 'helpers';

const CommentDetail = ({route, navigation}) => {
  const {comment} = route.params;
  const [imageModal, setImageModal] = useState(false);

  const _renderItem = ({item, index}) => {
    return (
      <Image
        style={{width: ww(1), height: 200}}
        source={{uri: item.image}}
        resizeMode="contain"
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ArrowHeader title="Detail" onPress={() => navigation.pop()} />
      <Modal animationType="slide" transparent={true} visible={imageModal}>
        <View
          style={{
            flex: 1,
            backgroundColor: White,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <HeaderBack onPress={() => setImageModal(false)} />
          <View style={{paddingTop: wh(0.35)}}>
            <Carousel
              data={comment.gallery}
              renderItem={_renderItem}
              sliderWidth={ww(1)}
              itemWidth={ww(1)}
            />
          </View>
        </View>
      </Modal>
      <Image source={{uri: comment?.user[0]?.avatar}} style={styles.avatar} />

      <Text style={styles.name}>{comment?.user[0]?.fullname} </Text>

      <Text style={styles.comment}>
        {dateFormatter(new Date(comment?.date)).split(' ')[0]}
      </Text>

      <View style={{top: wh(0.05)}}>
        <Text>{comment?.comment}</Text>
      </View>
      <TouchableOpacity
        onPress={() => setImageModal(true)}
        style={{top: wh(0.1)}}>
        <Carousel
          data={comment.gallery}
          renderItem={_renderItem}
          sliderWidth={ww(1)}
          itemWidth={ww(1)}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CommentDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: White,
    alignItems: 'center',
    paddingTop: wh(0.03),
  },
  avatar: {
    width: ww(0.2),
    height: ww(0.2),
    borderRadius: ww(0.2),
  },
  name: {
    fontFamily: UbuntuBold,
    fontSize: ww(0.05),
  },
  comment: {
    fontFamily: UbuntuMedium,
    fontSize: ww(0.04),
    // marginVertical: wh(0.02),
  },
});
