import {DarkGray, MainBlue, White} from '@constants/colors';
import {UbuntuMedium} from 'assets/fonts';
import {Edit} from 'assets/icons';
import axios from 'axios';
import {wh, ww} from 'helpers';
import {dateFormatter2} from 'helpers/dateFormatter';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {useSelector} from 'react-redux';

interface TaskViewProps {
  style?: ViewStyle;
  textStyle?: TextStyle;
  title: string;
  onPress: () => void;
  onEditPress: () => void;
  times: {
    start: string;
    end: string;
  };
  pinned: boolean;
  passed: boolean;
  taskId: string;
  status: number;
  refreshFunc: () => any;
}

const TaskView = ({
  style,
  textStyle,
  title,
  onPress,
  onEditPress,
  times,
  pinned,
  passed,
  taskId,
  status,
  refreshFunc,
}: TaskViewProps) => {
  const buttonStyle = [
    styles.button,
    style,
    {backgroundColor: pinned ? MainBlue : White},
  ];
  const lang = useSelector(state => state.lang);
  const user = useSelector(state => state.app.user);

  const txtStyle = [styles.text, textStyle, {color: pinned ? White : DarkGray}];
  const timesText = [styles.timesText, {color: pinned ? White : DarkGray}];
  const statusColor =
    status == 0 ? '#F2C94C' : status == 1 ? '#7BD6AA' : '#EB5757';
  const outCircle = [styles.circleOuter, {borderColor: statusColor}];
  const inCircle = [styles.circleInner, {backgroundColor: statusColor}];

  const changePinStatus = () => {
    var data = JSON.stringify({
      taskId: taskId,
      userId: user.id,
    });

    var config = {
      method: 'post',
      url: 'https://api.businessagenda.org/tasks/pinTask',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        refreshFunc();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <Pressable style={buttonStyle} onPress={onPress}>
      <View style={styles.titleView}>
        <Text style={txtStyle}>{title}</Text>
      </View>
      <View style={styles.bottomSide}>
        <Pressable style={outCircle} onPress={changePinStatus}>
          <View style={inCircle} />
        </Pressable>
        <View style={styles.timesView}>
          <Text style={timesText}>
            {`Start:  ${dateFormatter2(times?.start)}`}
            {` End: ${dateFormatter2(times?.end)}`}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.editButton}
        onPress={onEditPress}>
        <Edit color={pinned ? White : DarkGray} size={ww(0.045)} />
      </TouchableOpacity>
    </Pressable>
  );
};

export default TaskView;

const styles = StyleSheet.create({
  button: {
    width: ww(0.88),
    height: wh(0.14),
    borderRadius: ww(0.04),
    justifyContent: 'center',
    paddingHorizontal: ww(0.06),
    shadowColor: '#58563D',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  text: {
    fontSize: ww(0.04),
    fontFamily: UbuntuMedium,
    marginBottom: wh(0.01),
  },
  absoluteArrow: {
    position: 'absolute',
    right: ww(0.04),
  },
  timesText: {
    fontSize: ww(0.04),
    fontFamily: UbuntuMedium,
    marginLeft: ww(0.02),
  },
  timesView: {},
  editButton: {
    position: 'absolute',
    right: ww(0.055),
    top: wh(0.045),
  },
  bottomSide: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circleOuter: {
    width: ww(0.05),
    height: ww(0.05),
    borderRadius: ww(0.025),
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleInner: {
    width: ww(0.03),
    height: ww(0.03),
    borderRadius: ww(0.04),
  },
  titleView: {width: ww(0.7)},
});
