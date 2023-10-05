import React, {useCallback, useMemo, useRef} from 'react';
import {View, StyleSheet, Button, Platform} from 'react-native';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';

import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {wh, ww} from 'helpers';
import {SearchIcon} from 'assets/icons';
import {UbuntuRegular} from 'assets/fonts';

interface placesProps {
  onPress: () => {};
}

const Places = ({onPress}: placesProps) => {
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {}, []);

  // const onPress = () => {
  //   handlePresentModalPress();
  // };

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <Button onPress={onPress} title="Present Modal" color="black" />
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}>
          <View style={styles.contentContainer}>
            <GooglePlacesAutocomplete
              placeholder="Search"
              renderLeftButton={() => (
                <View style={styles.searchIconView}>
                  <SearchIcon />
                </View>
              )}
              onPress={(data, details = null) => {
                // 'details' is provided when fetchDetails = true
                // console.log(data, details);
              }}
              filterReverseGeocodingByTypes={[
                'locality',
                'administrative_area_level_3',
              ]}
              GooglePlacesDetailsQuery={{type: 'geocode', fields: 'geometry'}}
              query={{
                key: 'AIzaSyCMFNjZ-GKf2qqRcGlx9YU8RsWzcv-05CA',
                language: 'tr',
              }}
              styles={{
                poweredContainer: styles.placesPoweredContainer,
                listView: styles.placesListView,
                powered: styles.placesPowered,
                container: styles.placesContainer,
                textInputContainer: styles.placesTextInputContainer,
                textInput: styles.placesTextInput,
                predefinedPlacesDescription: styles.predefinedPlacesDescription,
              }}
            />
          </View>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#EEEBEB',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },

  placesTextInputContainer:
    Platform.OS === 'android'
      ? {
          borderWidth: 0.5,
          borderRadius: 10,
          width: ww(0.9),
          alignSelf: 'center',
          zIndex: 999,
          backgroundColor: 'white',
        }
      : {
          borderWidth: 0.5,
          borderRadius: 10,
          width: ww(0.9),
          alignSelf: 'center',
          position: 'absolute',
          zIndex: 999,
        },
  placesPowered: {
    display: 'none',
  },
  placesPoweredContainer: {
    backgroundColor: 'transparent',
  },
  placesListView:
    Platform.OS === 'android'
      ? {
          // top: 45,
          width: ww(1),
          height: wh(1),
        }
      : {
          top: wh(0.05),
          width: ww(1),
          height: wh(1),
        },
  placesTextInput: {
    height: wh(0.05),
    borderRadius: 10,
    paddingLeft: ww(0.09),

    color: '#747688',
    fontSize: ww(0.04),
    fontFamily: UbuntuRegular,
  },
  predefinedPlacesDescription: {
    color: '#1faadb',
  },
  placesContainer: {
    position: 'absolute',
    zIndex: 1,
  },
  searchIconView: {
    top: wh(0.015),
    left: ww(0.03),
    width: ww(0.05),
    position: 'absolute',
    zIndex: 99,
  },
});

export default Places;
