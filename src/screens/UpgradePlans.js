import {White} from '@constants/colors';
import {ArrowHeader} from 'components';

import {ww, wh} from 'helpers';
import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View, Image} from 'react-native';
import axios from 'axios';
import {useSelector} from 'react-redux';

const UpgradePlans = ({navigation, route}) => {
  console.log(navigation);
  const user = useSelector(state => state.app.user);

  const [free, setFree] = useState('');
  const [premium, setPremium] = useState('');

  useEffect(() => {
    const options = {
      method: 'POST',
      url: 'https://api.businessagenda.org/users/getPLans',
      headers: {'Content-Type': 'application/json'},
      data: {userId: user?.id},
    };

    axios
      .request(options)
      .then(function (response) {
        setFree(response?.data.data[0].image);
        setPremium(response?.data.data[1].image);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [user?.id]);

  return (
    <SafeAreaView style={styles.container}>
      <ArrowHeader
        title={route?.params?.free ? 'Free Plan' : 'Premium Plan'}
        onPress={() => navigation.goBack()}
      />
      {route?.params?.free ? (
        <Image style={styles.image} source={{uri: free}} resizeMode="contain" />
      ) : (
        <Image
          style={styles.image}
          source={{uri: premium}}
          resizeMode="contain"
        />
      )}
    </SafeAreaView>
  );
};

export default UpgradePlans;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: White,
  },
  image: {
    width: '100%',
    height: '90%',
  },
});
