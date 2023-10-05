/* eslint-disable radix */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, useMemo} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
  RefreshControl,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {SceneMap, TabView} from 'react-native-tab-view';

import axios from 'axios';

import {MainBlue, White} from '@constants/colors';
import {BebasNeue, UbuntuBold, UbuntuMedium, UbuntuRegular} from 'assets/fonts';

import {ArrowHeader, Button, CompanyView} from 'components';
import {wh, ww} from 'helpers';
import {BlurView} from '@react-native-community/blur';
import {CloseIcon, PauseIcon} from 'assets/icons';
import {setRecentTime} from '@redux/app/actions';

const Timer = ({navigation}) => {
  const user = useSelector(state => state.app.user);
  const recentTime = useSelector(state => state.app.recentTime);
  const dispatch = useDispatch();
  const lang = useSelector(state => state.lang);

  const [step, setStep] = useState(0);
  const [companies, setCompanies] = useState([]);
  const [groups, setGroups] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const {id: userId} = user;

  const [jTimerLoading, setJTimerLoading] = useState(false);
  const [jTimerStatus, setJTimerStatus] = useState(0);
  const [jTimerId, setJTimerId] = useState(null);
  const [jTimer, setJTimer] = useState(0);

  const jOnTimerPause = () => jOnTimerAction(2);

  const jOnTimerStop = () => jOnTimerAction(0);

  const jOnTimerContinue = () => jOnTimerAction(1);

  const [workerInfo, setWorkerInfo] = useState([]);

  const [selectedCompany, setSelectedCompany] = useState();
  const [selectedGroup, setSelectedGroup] = useState();

  const [sendModal, setSendModal] = useState(false);

  const [timeDetailModal, setTimeDetailModal] = useState(false);

  const [usersTime, setUsersTime] = useState([]);
  let ongoingTimes = {};
  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([
    {key: 'first', title: 'Recently'},
    {key: 'second', title: 'Daily'},
    {key: 'third', title: 'Weekly'},
    {key: 'fourth', title: 'Mountly'},
  ]);

  const stopTimer = () => {
    jOnTimerStop();
    setSendModal(true);
  };

  const jOnTimerAction = async action => {
    const data = JSON.stringify({timerId: jTimerId, action});
    const config = {
      method: 'post',
      url: 'https://api.businessagenda.org/users/timerAct', // değişecek
      headers: {'Content-Type': 'application/json'},
      data: data,
    };

    try {
      const res = await axios(config);
      const {data} = res;
      if (data.status == 'success') {
        if (action == 0) {
          setJTimerId(null);
          setJTimer(0);
        }
        setJTimerStatus(action);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCompanies = () => {
    const options = {
      method: 'POST',
      url: 'https://api.businessagenda.org/companies/getCompanyTeams',
      headers: {'Content-Type': 'application/json'},
      data: {userId: user.id},
    };

    axios
      .request(options)
      .then(function (response) {
        setCompanies(response.data.message);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const fetchGroups = company => {
    const options = {
      method: 'POST',
      url: 'https://api.businessagenda.org/groups/getUserGroups',
      headers: {'Content-Type': 'application/json'},
      data: {userId: user.id, companyId: company.id},
    };

    axios
      .request(options)
      .then(function (response) {
        // console.log(response.data);
        setGroups(response?.data?.data);
      })
      .catch(function (error) {
        console.error(error);
      });

    setSelectedCompany(company);
    setStep(prev => prev + 1);
  };

  const fetchRecents = () => {
    let config = {
      method: 'post',
      url: 'https://api.businessagenda.org/groups/getUserWorks',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        groupId: selectedGroup?.id,
      },
    };

    axios(config)
      .then(response => {
        // console.log('GELEN: ', response.data.data);
        setUsersTime(response?.data?.data);
        // dispatch(setRecentTime(response.data.data));
      })
      .catch(error => {
        console.log(error);
      });
    setRefresh(false);
  };

  useEffect(() => {
    fetchCompanies();
    // console.log('recentTime:', recentTime);
  }, []);

  useEffect(() => {
    if (step == 2) {
      fetchRecents();
      // fetchUserWorks();
    }
  }, [step]);

  const jOnTimerStart = () => {
    const config = {
      method: 'post',
      url: 'https://api.businessagenda.org/users/setTimer',
      headers: {'Content-Type': 'application/json'},
      data: {userId, groupId: selectedGroup?.id},
    };

    axios(config)
      .then(res => {
        // console.log('jOnTimerStart RESPONSE');
        // console.log(res);
        // console.log(res.data);
        const {data, status} = res.data;
        if (status == 'success') {
          setJTimerId(data?.timerId);
          setJTimerStatus(1);
        }
      })
      .catch(error => console.error(error));
    setRefresh(false);
  };

  let formattedData = usersTime.reduce((formattedData, values) => {
    const date = values.date.split('T')[0];
    if (!formattedData[date]) {
      formattedData[date] = [];
    }
    formattedData[date].push(values);
    return formattedData;
  }, {});

  const groupArrays = Object.keys(formattedData).map(date => {
    return {
      date,
      values: formattedData[date],
    };
  });

  const onRefresh = React.useCallback(() => {
    setRefresh(true);
    fetchRecents();
  }, []);

  const calculateOngoingTime = (dates, selector) => {
    // console.log('init axios data - res');
    // console.log(data);

    const datesLen = dates.length;

    let ms = 0,
      date1 = null,
      date2 = null;

    for (let i = 0; i < datesLen; i += 2) {
      date1 = new Date(dates[i].startDate).getTime();

      if (i + 2 < datesLen || dates[i].type === 'pauseTime') {
        date2 = new Date(dates[i + 1].startDate).getTime();
      } else {
        date2 = new Date(new Date().toUTCString()).getTime();
      }

      ms += date2 - date1;
    }

    ongoingTimes[selector] = ms / 1000;
  };

  const RecentlyRoute = () => (
    <View>
      {groupArrays.reverse().map((element, index) => (
        <View key={index} style={{alignSelf: 'center'}}>
          <Modal
            animationType="slide"
            transparent={false}
            visible={timeDetailModal}
            onRequestClose={() => {
              setTimeDetailModal(!timeDetailModal);
            }}>
            <SafeAreaView style={styles.timeDetailModal}>
              <View style={styles.button}>
                <CloseIcon />
              </View>
              <ScrollView style={styles.timeDetailContainer}>
                {element.values.map(i => (
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    key={i.id}>
                    <View
                      style={[
                        i.status === 0
                          ? styles.timerButtonStop
                          : i.status === 1
                          ? styles.timerButton
                          : styles.timerButtonPause,
                      ]}>
                      <View style={{marginLeft: ww(0.05)}}>
                        <Text
                          style={[
                            i.status === 0
                              ? styles.timerButtonTextStop
                              : i.status === 1
                              ? styles.timerButtonText
                              : styles.timerButtonPauseText,
                          ]}>
                          {i.user.fullname}
                        </Text>
                      </View>
                      <View
                        style={{
                          marginRight: ww(0.05),
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={[
                            i.status === 0
                              ? styles.timerButtonTextStop
                              : i.status === 1
                              ? styles.timerButtonText
                              : styles.timerButtonPauseText,
                          ]}>
                          {new Date(i.totalTime * 1000)
                            .toISOString()
                            .substr(11, 8)}
                        </Text>
                        <View style={{marginLeft: ww(0.01)}}>
                          <PauseIcon />
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </SafeAreaView>
          </Modal>
          <View style={{alignSelf: 'center', marginTop: ww(0.1)}}>
            {/* {console.log('element ', element)} */}
            <Text style={styles.elementDate}>{element.date}</Text>
          </View>
          {element.values.reverse().map(i => (
            <View key={i.id}>
              <View
                style={[
                  i.status === 0
                    ? styles.timerButtonStop
                    : i.status === 1
                    ? styles.timerButton
                    : styles.timerButtonPause,
                ]}>
                <View style={{marginLeft: ww(0.05)}}>
                  <Text
                    style={[
                      i.status === 0
                        ? styles.timerButtonTextStop
                        : i.status === 1
                        ? styles.timerButtonText
                        : styles.timerButtonTextPause,
                    ]}>
                    {i.user.fullname}
                  </Text>
                </View>
                <View style={{marginRight: ww(0.05)}}>
                  <Text
                    style={[
                      i.status === 0
                        ? styles.timerButtonTextStop
                        : i.status === 1
                        ? styles.timerButtonText
                        : styles.timerButtonTextPause,
                    ]}>
                    {}
                    {i.status ? setJTimerStatus(1) : null}
                    {i.status ? calculateOngoingTime(i.steps, i.id) : null}
                    {/* {console.log(i.steps.length)} */}
                    {i.status === 1
                      ? formatSeconds(ongoingTimes[i.id])
                      : new Date(
                          i.totalTime === 0
                            ? new Date(i.steps[0].endDate).getTime() -
                              new Date(i.steps[0].startDate).getTime()
                            : i.totalTime * 1000,
                        )
                          .toISOString()
                          .substr(11, 8)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
  const DailyRoute = () => (
    <ScrollView>
      {groupArrays.map((element, index) => (
        <View key={index} style={{alignItems: 'center'}}>
          <View style={{alignSelf: 'center', marginTop: ww(0.1)}}>
            <Text style={styles.elementDateText}>{element.date}</Text>
          </View>
          {/* {console.log('Element Values: ', element.values)} */}

          {element.values.map(i => (
            <View key={i.id}>
              <TouchableOpacity style={styles.timerButton}>
                <View style={{marginLeft: ww(0.05)}}>
                  <Text style={styles.timerButtonText}>{i.user.fullname}</Text>
                </View>
                <View style={{marginRight: ww(0.05)}}>
                  <Text style={styles.timerButtonText}>
                    {new Date(i.totalTime * 1000).toISOString().substr(11, 8)}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
  const WeeklyRoute = () => (
    <View style={{alignItems: 'center'}}>
      {groupArrays.map((element, index) => (
        <ScrollView
          key={index}
          style={{height: wh(1)}}
          showsVerticalScrollIndicator={false}>
          <View style={{alignSelf: 'center', marginTop: ww(0.1)}}>
            <Text style={styles.elementDateText}>{element.date}</Text>
          </View>

          {element.values.map(i => (
            <View key={i.id}>
              <View style={styles.timerButton}>
                <View style={{marginLeft: ww(0.05)}}>
                  <Text style={styles.timerButtonText}>{i.user.fullname}</Text>
                </View>
                <View style={{marginRight: ww(0.05)}}>
                  <Text style={styles.timerButtonText}>
                    {new Date(i.totalTime * 1000).toISOString().substr(11, 8)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      ))}
    </View>
  );
  const MountlyRoute = () => (
    <View style={{alignItems: 'center'}}>
      {groupArrays.map((element, index) => (
        <ScrollView
          key={index}
          style={{height: wh(1)}}
          showsVerticalScrollIndicator={false}>
          <View style={{alignSelf: 'center', marginTop: ww(0.1)}}>
            <Text style={styles.elementDateText}>{element.date}</Text>
          </View>

          {element.values.map(i => (
            <View key={i.id}>
              <View style={styles.timerButton}>
                <View style={{marginLeft: ww(0.05)}}>
                  <Text style={styles.timerButtonText}>{i.user.fullname}</Text>
                </View>
                <View style={{marginRight: ww(0.05)}}>
                  <Text style={styles.timerButtonText}>
                    {new Date(i.totalTime * 1000).toISOString().substr(11, 8)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      ))}
    </View>
  );
  const renderScene = SceneMap({
    first: RecentlyRoute,
    second: DailyRoute,
    third: WeeklyRoute,
    fourth: MountlyRoute,
  });
  const LazyPlaceholder = ({route}) => (
    <View style={styles.lazyLoading}>
      <ActivityIndicator size="large" />
    </View>
  );

  const _renderLazyPlaceholder = ({route}) => <LazyPlaceholder route={route} />;

  function formatSeconds(secs) {
    function pad(n) {
      return n < 10 ? '0' + n : n;
    }

    var h = Math.floor(secs / 3600);
    var m = Math.floor(secs / 60) - h * 60;
    var s = Math.floor(secs - h * 3600 - m * 60);

    return pad(h) + ':' + pad(m) + ':' + pad(s);
  }
  // On the Step-2 (the third step)
  useEffect(() => {
    if (step == 2) {
      const {id: groupId} = selectedGroup;
      const data = JSON.stringify({userId, groupId});
      const config = {
        method: 'post',
        url: 'https://api.businessagenda.org/users/timerStatus',
        headers: {'Content-Type': 'application/json'},
        data: data,
      };

      axios(config)
        .then(res => {
          const {data} = res.data; // real data

          // console.log('init axios data - res');
          // console.log(data);

          let status = 0;

          if (data != null) {
            const {timerId, timerStatus, dates} = data;
            const datesLen = dates.length;

            let ms = 0,
              date1 = null,
              date2 = null;

            for (let i = 0; i < datesLen; i += 2) {
              date1 = new Date(dates[i].date).getTime();

              if (i + 2 < datesLen || timerStatus == 2) {
                date2 = new Date(dates[i + 1].date).getTime();
              } else {
                date2 = new Date(new Date().toUTCString()).getTime();
              }

              ms += date2 - date1;
            }

            status = timerStatus;
            setJTimer(ms / 1000);
            setJTimerId(timerId);
            setJTimerStatus(status);
          }
        })
        .catch(error => console.error(error))
        .finally(() => setJTimerLoading(false));
    }
  }, [step]);

  // Timer;
  useEffect(() => {
    if (jTimerStatus === 1) {
      const timer = setInterval(() => setJTimer(prev => prev + 1), 1000);

      return () => clearInterval(timer);
    }
    // console.log(timer);
  }, [jTimerStatus]);
  return (
    <SafeAreaView style={styles.container}>
      {step === 0 ? (
        <View style={styles.pageTwoContainer}>
          <ArrowHeader title="Companies" onPress={() => navigation.goBack()} />
          <ScrollView style={styles.companyViewContainer}>
            <View style={{alignItems: 'center'}}>
              {companies?.map((company, index) => (
                <CompanyView
                  onPress={() => {
                    fetchGroups(company);
                  }}
                  key={index}
                  teamName={company.companyName}
                  teamDescription={company.companyDescription}
                  workers={company.companyMembers}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      ) : step === 1 ? (
        <View style={styles.pageTwoContainer}>
          <ArrowHeader
            title="Groups"
            onPress={() => setStep(prev => prev - 1)}
          />
          <ScrollView style={styles.companyViewContainer}>
            <View style={{alignItems: 'center'}}>
              {groups?.map((group, index) => (
                <CompanyView
                  onPress={() => {
                    setSelectedGroup(group);
                    setStep(prev => prev + 1);
                  }}
                  key={index}
                  teamName={group.groupName}
                  teamDescription={group.groupDescription}
                  workers={group.teamMembers}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      ) : step === 2 ? (
        <>
          {selectedCompany.ownerId === user.id ? (
            <View style={styles.pageTreeContainer}>
              <ArrowHeader
                title="Timer"
                onPress={() => setStep(prev => prev - 1)}
              />
              <TabView
                lazy
                renderLazyPlaceholder={_renderLazyPlaceholder}
                navigationState={{index, routes}}
                renderScene={renderScene}
                onIndexChange={setIndex}
              />
            </View>
          ) : (
            <View style={styles.pageTreeContainer}>
              {/* Header */}
              <ArrowHeader
                title="Timer"
                onPress={() => setStep(prev => prev - 1)}
              />

              {jTimerLoading ? (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <ActivityIndicator size="large" />
                </View>
              ) : (
                <View style={{paddingTop: wh(0.15), alignItems: 'center'}}>
                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={sendModal}
                    onRequestClose={() => {
                      setSendModal(!sendModal);
                    }}>
                    <BlurView
                      style={styles.absolute}
                      blurType="light"
                      blurAmount={10}
                      reducedTransparencyFallbackColor="white"
                    />
                    <View style={styles.centeredView}>
                      <View style={styles.modalView}>
                        <Text style={styles.modalText}>
                          {lang.workingTimeSended}
                        </Text>
                        <Pressable
                          style={[styles.button, styles.buttonClose]}
                          onPress={() => setSendModal(!sendModal)}>
                          <Text style={styles.textStyle}>OK</Text>
                        </Pressable>
                      </View>
                    </View>
                  </Modal>
                  {/* Timer */}
                  <Text style={styles.timeText}>{formatSeconds(jTimer)}</Text>
                  {jTimerStatus === 2 ? (
                    <Text style={styles.infoText}>{lang.sendAdmin}</Text>
                  ) : (
                    <Text style={styles.infoText}>
                      {lang.timerStartFor} {selectedGroup.groupName} of{' '}
                      {selectedCompany.companyName} {lang.company}
                    </Text>
                  )}

                  {jTimerStatus === 0 ? (
                    /* Start  */
                    <Button
                      title={lang.start}
                      style={styles.start}
                      onPress={jOnTimerStart}
                    />
                  ) : jTimerStatus === 1 ? (
                    <>
                      {/* Pause */}
                      <Button
                        title={lang.pause}
                        style={styles.pause}
                        onPress={jOnTimerPause}
                      />
                      {/* Stop */}
                      <Button
                        title={lang.stopAndSend}
                        style={styles.stopSend}
                        onPress={stopTimer}
                      />
                      <TouchableOpacity onPress={jOnTimerStop}>
                        <Text style={styles.cancel}>{lang.cancel}</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    /* Resume */
                    <>
                      <Button
                        title={lang.resume}
                        style={styles.resume}
                        onPress={jOnTimerContinue}
                      />
                      <Button
                        title={lang.stopAndSend}
                        style={styles.stopSend}
                        onPress={stopTimer}
                      />
                      <TouchableOpacity onPress={jOnTimerStop}>
                        <Text style={styles.cancel}>{lang.cancel}</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              )}
            </View>
          )}
        </>
      ) : (
        <View style={styles.pageTreeContainer}>
          <ArrowHeader
            title="Timer"
            onPress={() => setStep(prev => prev - 1)}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Timer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: White,
  },
  timerOptions: {
    width: ww(1),
    alignSelf: 'center',
    justifyContent: 'center',
  },
  timerContainer: {
    width: ww(0.8),
    height: wh(0.07),
    borderRadius: ww(0.02),
    backgroundColor: '#7BD6AA',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ww(0.05),
  },
  optionText: {
    fontFamily: UbuntuMedium,
    fontSize: ww(0.04),
    color: '#807a7a',
  },
  timeText: {
    fontFamily: BebasNeue,
    fontSize: ww(0.3),
  },
  infoText: {
    fontFamily: UbuntuRegular,
    width: ww(0.7),
    textAlign: 'center',
    fontSize: ww(0.04),
    color: '#5E5E5E',
    marginTop: wh(0.01),
  },
  pageOneContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: White,
    justifyContent: 'center',
  },
  pageTwoContainer: {
    flex: 1,
  },
  lazyLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageTreeContainer: {
    flex: 1,
  },
  addIcons: {
    width: ww(0.45),
    height: ww(0.35),
  },
  addContainers: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addText: {
    fontFamily: UbuntuMedium,
    fontSize: ww(0.04),
  },
  sectionStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: ww(0.04),
    fontFamily: UbuntuMedium,
  },
  timerText: {
    fontFamily: UbuntuRegular,
    fontSize: ww(0.03),
    textAlign: 'center',
    color: '#5e5e5e',
  },
  pagerView: {
    width: ww(1),
    height: wh(1),
  },
  elementDateText: {
    fontFamily: UbuntuBold,
    fontSize: ww(0.03),
    color: 'black',
    opacity: 0.6,
  },
  pageTitlesView: {
    width: ww(0.25),
    justifyContent: 'center',
    alignItems: 'center',
  },
  timesContainer: {
    width: ww(0.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentlyPage: {
    marginTop: wh(0.04),
    alignItems: 'center',
  },
  timerButton: {
    width: ww(0.8),
    height: wh(0.07),
    flexDirection: 'row',
    marginTop: wh(0.03),
    borderRadius: 10,
    justifyContent: 'space-between',
    alignItems: 'center',

    backgroundColor: '#7BD6AA',
  },
  timerButtonPause: {
    width: ww(0.8),
    height: wh(0.07),
    flexDirection: 'row',
    marginTop: wh(0.03),
    borderRadius: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F08729',
  },
  companyViewContainer: {
    flex: 1,
  },
  timerButtonStop: {
    width: ww(0.8),
    height: wh(0.07),
    flexDirection: 'row',
    marginTop: wh(0.03),
    borderColor: '#E4DFDF',
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  timerButtonText: {
    fontFamily: UbuntuRegular,
    fontSize: ww(0.035),
    color: 'white',
  },
  timerButtonTextStop: {
    fontFamily: UbuntuRegular,
    fontSize: ww(0.035),
    color: '#747688',
  },
  timerButtonTextPause: {
    fontFamily: UbuntuRegular,
    fontSize: ww(0.035),
    color: White,
  },
  cancel: {
    fontFamily: UbuntuMedium,
    fontSize: ww(0.04),
    color: '#626262',
    marginTop: wh(0.03),
  },
  stopSend: {
    backgroundColor: '#EB5757',
    marginTop: wh(0.02),
  },
  pause: {
    backgroundColor: '#F08729',
    marginTop: wh(0.1),
  },
  resume: {
    backgroundColor: '#7BD6AA',
    marginTop: wh(0.1),
  },
  start: {
    backgroundColor: MainBlue,
    marginTop: wh(0.1),
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    alignSelf: 'flex-end',
    right: ww(0.05),
    top: wh(0.01),
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  elementDate: {
    fontFamily: UbuntuBold,
    fontSize: ww(0.03),
    color: 'black',
    opacity: 0.6,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  timeDetailModal: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  timeDetailContainer: {
    width: ww(0.9),
    top: wh(0.01),
    height: wh(0.8),
  },
});

const options = {
  container: {
    borderRadius: 5,
    width: ww(0.8),
    alignItems: 'center',
  },
  text: {
    fontSize: ww(0.26),
    fontFamily: BebasNeue,
    color: '#8F8F8F',
    marginLeft: 7,
  },
  timerButton: {
    backgroundColor: '#828282',
    width: ww(0.45),
    marginTop: ww(0.06),
    height: wh(0.06),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  isStart: {
    backgroundColor: '#5669FF',
    width: ww(0.45),
    height: wh(0.06),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  isStop: {
    backgroundColor: '#EB5757',
    width: ww(0.45),
    height: wh(0.06),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
};
