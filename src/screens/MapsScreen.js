/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  SafeAreaView,
  Pressable,
  FlatList,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';

import {mapDarkStyle, mapStandardStyle} from '../model/mapData';

import {useTheme} from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import {useSelector} from 'react-redux';
import axios from 'axios';
import {wh, ww} from 'helpers';

import {UbuntuBold, UbuntuLight, UbuntuRegular} from 'assets/fonts';
import {
  Camera,
  CameraIcon,
  Location,
  MessageCircle,
  PhoneIcon,
  PlaceIcon,
} from 'assets/icons';
import {Header} from 'components';

const {width} = Dimensions.get('window');
const CARD_HEIGHT = wh(0.15);
const CARD_WIDTH = ww(0.4);
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

const ExploreScreen = ({navigation}) => {
  const theme = useTheme();

  const [location, setLocation] = useState('');
  const [usersLat, setUsersLat] = useState('');
  const [usersLong, setUsersLong] = useState('');

  const [users, setUsers] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [showDescription, setShowDescription] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);

  const heightAnim = useRef(new Animated.Value(+wh(1))).current;

  const user = useSelector(state => state.app.user);
  const lang = useSelector(state => state.lang);

  const toggleAnim = worker => {
    setSelectedWorker(worker);
    if (showDescription) {
      animate(-wh(0.04));
    } else {
      animate(wh(1));
    }
    setShowDescription(!showDescription);
  };

  const animate = val => {
    Animated.timing(heightAnim, {
      toValue: val,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  console.log(user.token);

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setLocation({
          latitude,
          longitude,
        });
      },
      error => {
        console.log(error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const fetchPeopleToChat = () => {
    const options = {
      method: 'POST',
      url: `https://api.businessagenda.org/companies/getCompanyTeams`,
      headers: {'Content-Type': 'application/json'},
      data: {userId: user.id},
    };
    axios
      .request(options)
      .then(function (response) {
        // console.log('fasdfas', response.data.message[0]);
        // console.log('users: ', user.id);

        let people = [];
        response.data.message.map(company =>
          people.push(company.companyMembers),
        );
        // console.log('fetchPeople: ', people);
        setUsers(people[0]);
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  const getWorkersLocations = () => {
    const options = {
      method: 'POST',
      url: 'https://api.businessagenda.org/users/getLocation',
      headers: {'Content-Type': 'application/json'},
      data: {userId: user.id},
    };

    axios
      .request(options)
      .then(function (response) {
        // console.log(response.data.data);
        setWorkers(response.data.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  useEffect(() => {
    getWorkersLocations();
    const interval = setInterval(() => {
      getWorkersLocations();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchPeopleToChat();
  }, []);

  useEffect(() => {
    if (!location) {
      getLocation();
    }
  }, [location]);

  const usersLocUpdate = (lat, long) => {
    _map.current.animateToRegion(
      {
        latitude: lat,
        longitude: long,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      0,
    );
  };

  const onMarkerPress = (mapEventData, worker) => {
    const markerID = mapEventData._targetInst.return.key;

    let x = markerID * CARD_WIDTH + markerID * 10;
    if (Platform.OS === 'ios') {
      x = x - SPACING_FOR_CARD_INSET;
    }

    _scrollView.current.scrollTo({x: x, y: 0, animated: true});
  };

  const renderItem = ({item}) => (
    <Pressable
      style={styles.card}
      onPress={() => {
        usersLocUpdate(
          JSON.parse(item.location).lat,
          JSON.parse(item.location).long,
        );
      }}>
      <View
        style={{
          width: '30%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={{
            uri: item?.avatar,
          }}
          style={styles.cardImage}
          resizeMode="contain"
        />
      </View>
      <View>
        <View style={[styles.textContent]}>
          <View>
            <Text style={styles.cardtitle}>{item.fullname}</Text>
          </View>
          <View style={{flexDirection: 'row', left: ww(0.1)}}>
            <TouchableOpacity style={{marginRight: ww(0.03)}}>
              <CameraIcon />
            </TouchableOpacity>
            <TouchableOpacity
              style={{marginRight: ww(0.1)}}
              onPress={() => navigation.navigate('MessagesScreen')}>
              <PhoneIcon />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            top: wh(0.01),
            left: -ww(0.01),
            flexDirection: 'row',
          }}>
          <PlaceIcon />
          <Text
            style={{
              fontFamily: UbuntuRegular,
              color: '#989AA6',
              left: ww(0.03),
            }}>
            {JSON.parse(item.location).address}
          </Text>
        </View>
      </View>
    </Pressable>
  );

  const _map = React.useRef(null);
  const _scrollView = React.useRef(null);

  return (
    <View style={styles.container}>
      <Header title={lang.map} onPress={() => navigation.openDrawer()} />
      {location?.latitude && location?.longitude && (
        <MapView
          ref={_map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation
          style={styles.mapContainer}
          provider={PROVIDER_GOOGLE}
          customMapStyle={theme.dark ? mapDarkStyle : mapStandardStyle}>
          {workers?.map((worker, index) => {
            let loc = JSON.parse(worker?.location);

            return (
              <Animated.View style={[styles.markerWrap]} key={index}>
                {worker.id != user.id && (
                  <Marker
                    onPress={e => onMarkerPress(e)}
                    coordinate={{
                      latitude: loc.lat,
                      longitude: loc.long,
                    }}>
                    <Animated.View style={[styles.markerWrap]}>
                      <Animated.Image
                        source={{uri: worker?.avatar}}
                        style={[styles.workerAvatar]}
                      />
                    </Animated.View>
                  </Marker>
                )}
              </Animated.View>
            );
          })}
        </MapView>
      )}

      <FlatList
        data={users}
        style={styles.flatList}
        renderItem={renderItem}
        horizontal
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default ExploreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: wh(0.055),
  },
  mapContainer: {
    flex: 1,
    backgroundColor: 'red',
  },
  workerAvatar: {
    width: ww(0.2),
    height: wh(0.1),
    borderRadius: ww(0.05),
    resizeMode: 'contain',
  },
  searchBox: {
    position: 'absolute',
    marginTop: Platform.OS === 'ios' ? 40 : 20,
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#ccc',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  chipsScrollView: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 90 : 80,
    paddingHorizontal: 10,
  },
  chipsIcon: {
    marginRight: 5,
  },
  chipsItem: {
    flexDirection: 'row',
    backgroundColor: 'blue',
    borderRadius: 20,
    padding: 8,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    height: 35,
    shadowColor: '#ccc',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  scrollView: {
    position: 'absolute',
    right: 0,
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
  },
  card: {
    flexDirection: 'row',
    elevation: 2,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 20,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: {x: 2, y: -2},
    height: wh(0.15),
    width: ww(0.8),
    overflow: 'hidden',
  },
  cardImage: {
    borderRadius: 10,
    width: ww(0.2),
    height: wh(0.1),
  },
  textContent: {
    alignSelf: 'center',
    marginTop: wh(0.03),
    flexDirection: 'row',

    width: ww(0.65),
  },
  cardtitle: {
    fontSize: ww(0.04),
    fontFamily: UbuntuBold,
  },
  cardDescription: {
    fontSize: 12,
    color: '#444',
  },
  markerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: ww(0.2),
    height: wh(0.1),
  },
  marker: {
    width: 30,
    height: 30,
  },
  button: {
    alignItems: 'center',
    marginTop: 5,
  },
  signIn: {
    width: '100%',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
  },
  textSign: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  flatList: {
    bottom: 10,
    position: 'absolute',
    zIndex: 99,
  },
});
