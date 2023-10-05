/* eslint-disable react-native/no-inline-styles */
import {MainBlue, White} from '@constants/colors';
import {UbuntuBold, UbuntuMedium, UbuntuRegular} from 'assets/fonts';
import axios from 'axios';
import {ArrowHeader, Button, CompanyView} from 'components';
import {wh} from 'helpers';
import {dateFormatter} from 'helpers';
import {ww} from 'helpers';
import {dateFormatter3} from 'helpers/dateFormatter';
import React, {useEffect, useState} from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';

const Timer = ({navigation}) => {
  const user = useSelector(state => state.app.user);
  const lang = useSelector(state => state.lang);

  const [step, setStep] = useState(0);
  const [companies, setCompanies] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState();
  const [selectedGroup, setSelectedGroup] = useState();
  /* jakadar */
  // const [timer, setTimer] = useState(0);
  // const [timerStatus, setTimerStatus] = useState(0);
  // const [startTime, setStartTime] = useState();
  /* jakadar */
  const [workerInfo, setWorkerInfo] = useState([]);
  const [timerOptions, setTimerOptions] = useState([
    {
      text: 'Recents',
      onPress: id => {
        setTimerOptions(prev =>
          prev.map((el, index) => {
            if (index == id) {
              el.selected = true;
              return el;
            } else {
              el.selected = false;
              return el;
            }
          }),
        );
      },
      selected: true,
    },
    {
      text: 'Daily',
      onPress: (id, company, group) => {
        fetchDailyWorkTimes(company, group);
        setTimerOptions(prev =>
          prev.map((el, index) => {
            if (index == id) {
              el.selected = true;
              return el;
            } else {
              el.selected = false;
              return el;
            }
          }),
        );
      },
      selected: false,
    },
    {
      text: 'Weekly',
      onPress: id => {
        setTimerOptions(prev =>
          prev.map((el, index) => {
            if (index == id) {
              el.selected = true;
              return el;
            } else {
              el.selected = false;
              return el;
            }
          }),
        );
      },
      selected: false,
    },
    {
      text: 'Monthly',
      onPress: id => {
        setTimerOptions(prev =>
          prev.map((el, index) => {
            if (index == id) {
              el.selected = true;
              return el;
            } else {
              el.selected = false;
              return el;
            }
          }),
        );
      },
      selected: false,
    },
  ]);

  /* jakadar */
  const {id: userId} = user;

  const [jTimerLoading, setJTimerLoading] = useState(true);
  const [jTimerStatus, setJTimerStatus] = useState(0);
  const [jTimerId, setJTimerId] = useState(null);
  const [jTimer, setJTimer] = useState(0);

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

          console.log('init axios data - res');
          console.log(data);

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
                date2 =
                  new Date(new Date().toUTCString()).getTime() -
                  180 * 1000 * 60;
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

  // Timer
  useEffect(() => {
    if (jTimerStatus == 1) {
      const timer = setInterval(() => setJTimer(prev => prev + 1), 1000);

      return () => clearInterval(timer);
    }
  }, [jTimerStatus]);

  const jOnTimerStart = () => {
    const {id: groupId} = selectedGroup;

    const data = JSON.stringify({userId, groupId});
    const config = {
      method: 'post',
      url: 'https://api.businessagenda.org/users/setTimer', // değişecek
      headers: {'Content-Type': 'application/json'},
      data: data,
    };
    axios(config)
      .then(res => {
        console.log('jOnTimerStart RESPONSE');
        console.log(res);
        console.log(res.data);
        const {data, status} = res.data;
        if (status == 'success') {
          setJTimerId(data?.timerId);
          setJTimerStatus(1);
        }
      })
      .catch(error => console.error(error));
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

  const jOnTimerPause = () => jOnTimerAction(2);

  const jOnTimerStop = () => jOnTimerAction(0);

  const jOnTimerContinue = () => jOnTimerAction(1);
  /* jakadar */

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
        console.log('Companies: ', response.data.message);
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
        console.log('Groups: ', response.data.data);
      })
      .catch(function (error) {
        console.error(error);
      });

    setSelectedCompany(company);
    setStep(prev => prev + 1);
  };

  /* jakadar */
  // const startTimer = () => {
  //   var data = JSON.stringify({
  //     userId: user.id,
  //     groupId: selectedGroup.id,
  //     start: new Date(),
  //   });

  //   var config = {
  //     method: 'post',
  //     url: 'https://api.businessagenda.org/groups/startWork',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     data: data,
  //   };

  //   axios(config)
  //     .then(function (response) {
  //       if (response.data.status === 'success') {
  //         setTimerStatus(0);
  //         setStartTime(new Date().toISOString());
  //       }
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // };

  // const stopTimer = () => {
  //   var data = JSON.stringify({
  //     userId: user.id,
  //     groupId: selectedGroup.id,

  //     start: dateFormatter3(startTime),
  //     end: dateFormatter3(new Date().toISOString()),
  //   });

  //   var config = {
  //     method: 'post',
  //     url: 'https://api.businessagenda.org/groups/endWork',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     data: data,
  //   };

  //   axios(config)
  //     .then(function (response) {
  //       if (response.data.status === 'success') {
  //         setTimerStatus(1);
  //         setTimer(0);
  //       }
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // };

  // const fetchUserTimers = () => {
  //   var data = JSON.stringify({
  //     userId: user.id,
  //   });

  //   var config = {
  //     method: 'post',
  //     url: 'https://api.businessagenda.org/groups/getUserWorks',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     data: data,
  //   };

  //   axios(config)
  //     .then(function (response) {
  //       if (response?.data?.data?.filter(el => el.status == 0).length > 0) {
  //         setStartTime(
  //           response?.data?.data?.filter(el => el.status == 0)[0]?.start
  //         );
  //         setTimerStatus(0);
  //       } else {
  //         setTimerStatus(1);
  //       }
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // };
  /* jakadar */

  const fetchRecents = () => {
    let data = JSON.stringify({
      userId: user?.id,
      companyId: selectedCompany?.id,
      type: 'recent',
    });

    let config = {
      method: 'post',
      url: 'https://api.businessagenda.org/groups/getTeamMemberWorks',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios(config)
      .then(response => {
        // console.log(response.data.data);
        setWorkerInfo(response.data.data[`${selectedGroup?.id}`]);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const fetchDailyWorkTimes = (company, group) => {
    let data = JSON.stringify({
      userId: user?.id,
      companyId: company?.id,
      type: 'daily',
    });

    let config = {
      method: 'post',
      url: 'https://api.businessagenda.org/groups/getTeamMemberWorks',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios(config)
      .then(response => {
        let dailyWorks = Object.values(response.data.data).filter(el => {
          if (Object.keys(el).includes(`${group.id}`)) {
            return el;
          } else {
            return false;
          }
        });
        console.log(dailyWorks[0][`${group.id}`]);
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchCompanies();
    // fetchUserTimers(); //jakadar
  }, []);

  useEffect(() => {
    if (step == 2) {
      fetchRecents();
    }
  }, [step]);

  /* jakadar */
  // useEffect(() => {
  //   let interval = setInterval(() => {
  //     if (startTime) {
  //       setTimer((new Date().getTime() - new Date(startTime).getTime()) / 1000);
  //     }
  //   }, 1000);
  //   if (timerStatus === 1) {
  //     clearInterval(interval);
  //   }

  //   return () => clearInterval(interval);
  // }, [timerStatus, startTime]);
  /* jakadar */

  function formatSeconds(secs) {
    function pad(n) {
      return n < 10 ? '0' + n : n;
    }

    var h = Math.floor(secs / 3600);
    var m = Math.floor(secs / 60) - h * 60;
    var s = Math.floor(secs - h * 3600 - m * 60);

    return pad(h) + ':' + pad(m) + ':' + pad(s);
  }

  return (
    <SafeAreaView style={styles.container}>
      {step == 0 ? (
        <View style={styles.pageTwoContainer}>
          <ArrowHeader title="Companies" onPress={() => navigation.goBack()} />
          <ScrollView style={styles.companyViewContainer}>
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
          </ScrollView>
        </View>
      ) : step == 1 ? (
        <View style={styles.pageTwoContainer}>
          <ArrowHeader
            title="Groups"
            onPress={() => setStep(prev => prev - 1)}
          />
          <View style={styles.companyViewContainer}>
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
        </View>
      ) : step == 2 ? (
        <>
          {selectedCompany.ownerId === user.id ? (
            <View style={styles.pageTreeContainer}>
              <ArrowHeader
                title="Timer"
                onPress={() => setStep(prev => prev - 1)}
              />
              <View style={styles.timerOptions}>
                {timerOptions.map((option, index) => (
                  <Pressable
                    key={index}
                    style={{
                      borderBottomWidth: option?.selected ? 2 : 0,
                      paddingBottom: wh(0.01),
                      borderColor: '#3D50DF',
                    }}
                    onPress={() =>
                      option.onPress(index, selectedCompany, selectedGroup)
                    }>
                    <Text
                      style={[
                        styles.optionText,
                        {color: option?.selected ? '#3D50DF' : '#807A7A'},
                      ]}>
                      {option?.text}
                    </Text>
                  </Pressable>
                ))}
              </View>
              {workerInfo?.map((worker, index) => (
                <Pressable
                  key={index}
                  onPress={() => setStep(prev => prev + 1)}
                  style={styles.timerContainer}>
                  <Text style={styles.timerText}>{worker?.user?.fullname}</Text>
                  <Text style={styles.timerText}>
                    {formatSeconds(worker?.calc)}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : (
            <View style={styles.pageTreeContainer}>
              {/* Header */}
              <ArrowHeader
                title="Timer"
                onPress={() => setStep(prev => prev - 1)}
              />

              {jTimerLoading ? (
                <Text>Loading</Text>
              ) : (
                <View style={{paddingTop: wh(0.2), alignItems: 'center'}}>
                  {/* Timer */}
                  <Text style={styles.timeText}>
                    {/* {Number.isNaN(timer) || !timer
                      ? '00:00:00'
                      : formatSeconds(timer.toString())} */}

                    {/* jakadar */}
                    {formatSeconds(jTimer)}
                    {/* jakadar */}
                  </Text>
                  {jTimerStatus == 2 ? (
                    <Text style={styles.infoText}>
                      Stopping the timer will send info to group admin
                    </Text>
                  ) : (
                    <Text style={styles.infoText}>
                      This timer will start for {selectedGroup.groupName} of{' '}
                      {selectedCompany.companyName} Company
                    </Text>
                  )}

                  {/* jakadar */}
                  {jTimerStatus == 0 ? (
                    /* Start  */
                    <Button
                      title={'Start'}
                      style={{
                        backgroundColor: MainBlue,
                        marginTop: wh(0.1),
                      }}
                      /* jakadar */
                      // onPress={() =>
                      //   timerStatus === 1 ? startTimer() : stopTimer()
                      // }
                      onPress={jOnTimerStart}
                      /* jakadar */
                    />
                  ) : jTimerStatus == 1 ? (
                    <>
                      {/* Pause */}
                      <Button
                        title={'Pause'}
                        style={{
                          backgroundColor: '#F08729',
                          marginTop: wh(0.1),
                        }}
                        onPress={jOnTimerPause}
                      />
                      {/* Stop */}
                      <Button
                        title={'Stop and Send'}
                        style={{
                          backgroundColor: '#EB5757',
                          marginTop: wh(0.02),
                        }}
                        onPress={jOnTimerStop}
                      />
                      <TouchableOpacity onPress={jOnTimerStop}>
                        <Text
                          style={{
                            fontFamily: UbuntuMedium,
                            fontSize: ww(0.04),
                            color: '#626262',
                            marginTop: wh(0.03),
                          }}>
                          CANCEL
                        </Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    /* Resume */
                    <>
                      <Button
                        title={'Resume'}
                        style={{
                          backgroundColor: '#7BD6AA',
                          marginTop: wh(0.1),
                        }}
                        onPress={jOnTimerContinue}
                      />
                      <Button
                        title={'Stop and send'}
                        style={{
                          backgroundColor: '#EB5757',
                          marginTop: wh(0.02),
                        }}
                        onPress={jOnTimerStop}
                      />
                      <TouchableOpacity onPress={jOnTimerStop}>
                        <Text
                          style={{
                            fontFamily: UbuntuMedium,
                            fontSize: ww(0.04),
                            color: '#626262',
                            marginTop: wh(0.03),
                          }}>
                          CANCEL
                        </Text>
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
    flexDirection: 'row',
    width: ww(0.9),
    alignSelf: 'center',
    justifyContent: 'space-evenly',
    marginVertical: wh(0.05),
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
  timerText: {
    color: '#fff',
    fontFamily: UbuntuRegular,
    fontSize: ww(0.04),
  },
  timeText: {
    fontFamily: UbuntuBold,
    fontSize: ww(0.2),
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
    alignItems: 'center',
  },
  pageTwoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  pageTreeContainer: {
    flex: 1,
    alignItems: 'center',
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
});
