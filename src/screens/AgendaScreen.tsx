import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Modal,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import axios, {AxiosRequestConfig} from 'axios';

import {apiUrl} from '@constants';
import {White} from '@constants/colors';

import {CustomCalendar, Header, TaskView} from 'components';

import {dateFormatter, wh, ww} from 'helpers';

import {UbuntuMedium} from 'assets/fonts';

import WebView from 'components/Webview';

interface Props {
  navigation: any;
  route: any;
}

interface TaskProps {
  address: string;
  description: string;
  taskName: string;
  times: {start: string; end: string};
  pinned: boolean;
}

const AgendaScreen = ({navigation, route}: Props) => {
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showAd, setShowAd] = useState(true);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [refreshing, setRefreshing] = React.useState(false);

  const user = useSelector((state: any) => state.app.user);

  const advertisement = useSelector(state => state.app.advertisement);

  const lang = useSelector(state => state.lang);

  useEffect(() => {
    fetchTasks();
  }, [selectedDate]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchTasks();
  }, []);

  const fetchTasks = (): void => {
    const options: AxiosRequestConfig = {
      method: 'POST',
      url: `${apiUrl}/tasks/getTaskByUserDate`,
      headers: {'Content-Type': 'application/json'},
      data: {
        userId: user?.id,
        date: {
          startDate: dateFormatter(selectedDate),
        },
      },
    };

    axios
      .request(options)
      .then(function (response) {
        // console.log(response.data.message);
        setTasks(response.data.message[0]);
      })
      .catch(function (error) {
        console.error(error);
      });
    setRefreshing(false);
  };
  const onCloseWebview = () => setShowAd(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={White} barStyle="dark-content" />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <Header
          title={lang.agenda}
          navigation={navigation}
          onPress={() => navigation.openDrawer()}
          onPressNotification={() => navigation.navigate('NotificationsScreen')}
        />
        {typeof advertisement === 'string' && advertisement?.length > 0 && (
          <WebView visible={showAd} onClose={onCloseWebview} />
        )}
        <CustomCalendar
          selectedDate={selectedDate}
          onDateSelected={date => {
            setSelectedDate(new Date(date));
          }}
        />
        <View style={styles.tasksOuterView}>
          <Text style={styles.scheduleText}>{lang.schedule} </Text>

          {tasks?.length !== 0 &&
            tasks
              ?.sort(function (a, b) {
                return a.pinned - b.pinned;
              })
              ?.reverse()
              ?.map((task: TaskProps, index) => {
                return (
                  <TaskView
                    style={styles.taskViews}
                    key={index}
                    title={task.taskName}
                    times={task.times}
                    pinned={task.pinned}
                    passed={false}
                    taskId={task.id}
                    status={task.status}
                    refreshFunc={fetchTasks}
                    onPress={() =>
                      navigation.navigate('TaskPreview', {
                        task,
                      })
                    }
                    onEditPress={() =>
                      navigation.navigate('AddEditTask', {
                        task,
                        edit: true,
                      })
                    }
                  />
                );
              })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: White,
  },
  scheduleText: {
    fontFamily: UbuntuMedium,
    color: '#2B2B2B',
    fontSize: ww(0.05),
    alignSelf: 'flex-start',
    marginLeft: ww(0.07),
    marginBottom: wh(0.02),
  },
  tasksOuterView: {
    backgroundColor: White,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskViews: {
    marginVertical: wh(0.012),
  },
  adText: {
    textAlign: 'center',
    width: '100%',
  },
  adCloseButton: {
    position: 'absolute',
  },
  adMenu: {
    zIndex: 99,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  webViewArea: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.5)',
  },
  webViewInnerArea: {
    flex: 1,
  },
  webViewContainerStyle: {
    width: ww(0.8),
    height: wh(0.6),
  },
});

// export default withSok(AgendaScreen);
export default AgendaScreen;
