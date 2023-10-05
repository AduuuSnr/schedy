import {MainBlue, White} from '@constants/colors';
import {UbuntuBold, UbuntuRegular} from 'assets/fonts';
import {wh, ww} from 'helpers';
import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';

interface CompanyViewProps {
  teamName: string;
  teamDescription: string;
  workers?: {avatar: string}[];
  onPress: () => any;
}

const CompanyView = ({
  teamName,
  teamDescription,
  workers,
  onPress,
}: CompanyViewProps) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Text style={styles.teamName}>{teamName}</Text>
      <Text style={styles.teamDescription}>{teamDescription}</Text>
      <View style={styles.workerImagesView}>
        {workers?.map(
          (worker, index) =>
            index < 3 && (
              <View
                key={index}
                style={[
                  styles.workerView,
                  {
                    zIndex: -index,
                    left: index != 0 ? -ww(0.015) * index : null,
                  },
                ]}>
                <Image
                  style={styles.workerAvatars}
                  source={{uri: worker?.avatar}}
                />
              </View>
            ),
        )}
        {workers?.length > 3 && (
          <View
            style={[styles.moreWorkers, {left: -ww(0.005 * workers.length)}]}>
            <Text style={styles.moreWorkersText}>+{workers.length - 3}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default CompanyView;

const styles = StyleSheet.create({
  container: {
    backgroundColor: White,
    width: ww(0.8),
    height: wh(0.23),
    borderRadius: 20,
    elevation: 10,
    shadowColor: '#58563D',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 44,
    paddingHorizontal: ww(0.05),
    paddingVertical: wh(0.035),
    marginVertical: wh(0.015),
  },
  teamName: {
    fontFamily: UbuntuBold,
    fontSize: ww(0.05),
    marginBottom: wh(0.01),
  },
  teamDescription: {
    fontFamily: UbuntuRegular,
    fontSize: ww(0.03),
    color: '#5E5E5E',
  },
  workerImagesView: {
    flexDirection: 'row',
    marginTop: wh(0.015),
    alignItems: 'center',
  },
  workerView: {
    width: ww(0.08),
    height: ww(0.08),
    borderRadius: ww(0.04),
    elevation: 2,
    shadowColor: '#58563D',
    shadowOffset: {
      width: 1,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    backgroundColor: White,
    marginTop: wh(0.017),
  },
  workerAvatars: {
    width: '95%',
    height: '95%',
    backgroundColor: White,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: ww(0.04),
  },
  moreWorkers: {
    backgroundColor: MainBlue,
    paddingHorizontal: ww(0.04),
    paddingVertical: wh(0.007),
    borderRadius: ww(0.04),
    elevation: 10,
    shadowColor: '#58563D',
    shadowOffset: {
      width: 1,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    zIndex: 99,
  },
  moreWorkersText: {
    fontFamily: UbuntuRegular,
    fontSize: ww(0.04),
    color: White,
  },
});
