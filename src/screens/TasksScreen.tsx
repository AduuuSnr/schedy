/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useRef, useMemo, useCallback} from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
  Modal,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
  Text,
} from 'react-native';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {useSelector} from 'react-redux';
import axios from 'axios';
import {Dropdown} from 'react-native-element-dropdown';
import {CalendarList} from 'react-native-calendars';
import {BlurView} from '@react-native-community/blur';

import {Header, Searchbar, TaskView} from 'components';
import {wh, ww} from 'helpers';

import {LightBlue, White} from '@constants/colors';
import {UbuntuMedium, UbuntuRegular} from 'assets/fonts';
import {
  BackIcon,
  CalendarIcon,
  CloseIcon,
  CompanyIcon,
  FilterIcon,
  GroupIcon,
  RightIcon,
} from 'assets/icons';

interface Props {
  navigation: any;
}

const TasksScreen = ({navigation}: Props) => {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const lang = useSelector(state => state.lang);
  const user = useSelector((state: any) => state.app.user);

  const [calendarSelectedDate, setCalendarSelectedDate] =
    useState('1978-09-10');
  const [companies, setCompanies] = useState([]);

  const [companyDropdown, setCompanyDropdown] = useState(null);
  const [teamDropdown, setTeamDropdown] = useState(null);
  const [filterCompany, setFilterCompany] = useState();
  const [filterGroup, setFilterGroup] = useState();
  const [filterDate, setFilterDate] = useState('');

  const [calendarModal, setCalendarModal] = useState(false);

  const [groups, setGroups] = useState([]);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['10%', '75%'], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback(index => {}, []);

  const handleClosePress = useCallback(() => {
    console.log('object');
    bottomSheetModalRef.current?.close();
  }, []);

  const setApply = () => {
    setFilterCompany(filterCompany);
    setFilterDate(filterDate);
    setFilterGroup(filterGroup);
    handleClosePress();
    fetchTasks();
  };

  const onReset = useCallback(() => {
    setSearch('');
    fetchTasks();
    getCompanies();
    handleClosePress();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setSearch('');
    fetchTasks();
    getCompanies();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [selectedDate]);

  const fetchTasks = (): void => {
    let data = {
      userId: user.id,
    };
    if (filterCompany) {
      data.company = filterCompany;
    }
    if (filterDate) {
      data.inDate = filterDate;
    }
    if (filterGroup) {
      data.group = filterGroup;
    }

    const options = {
      method: 'POST',
      url: 'https://api.businessagenda.org/tasks/getTaskByUser',
      headers: {'Content-Type': 'application/json'},
      data: data,
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(data);
        console.log(response.data.message);
        setTasks(response.data.message);
      })
      .catch(function (error) {
        console.error(error);
      });
    setRefreshing(false);
  };

  const getItemsBySearch = () => {
    const options = {
      method: 'POST',
      url: 'https://api.businessagenda.org/tasks/search',
      headers: {'Content-Type': 'application/json'},
      data: {query: search, userId: user.id},
    };

    axios
      .request(options)
      .then(function (response) {
        // console.log(response.data);
        setTasks(response.data.message);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const getCompanies = () => {
    console.log('fyck');
    const options = {
      method: 'POST',
      url: 'https://api.businessagenda.org/companies/getCompanyTeams',
      headers: {'Content-Type': 'application/json'},
      data: {userId: user.id},
    };
    let compValues: any[] | ((prevState: never[]) => never[]) = [];
    axios
      .request(options)
      .then(function (response) {
        for (const company of response.data.message) {
          compValues = [
            ...compValues,
            {
              value: company.id,
              label: company.companyName,
            },
          ];
        }
        setCompanies(compValues);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const openFilter = () => {
    handlePresentModalPress();
    getCompanies();
  };

  const fetchGroups = (id: any) => {
    const options = {
      method: 'POST',
      url: 'https://api.businessagenda.org/groups/getUserGroups',
      headers: {'Content-Type': 'application/json'},
      data: {userId: user.id, companyId: id},
    };

    axios
      .request(options)
      .then(function (response) {
        let groupValues: any[] | ((prevState: never[]) => never[]) = [];
        console.log(response.data.data);
        if (response.data.data.length > 0) {
          for (const group of response.data.data) {
            groupValues = [
              ...groupValues,
              {
                value: group.id,
                label: group.groupName,
              },
            ];
            console.log('set: ', groupValues);
          }
        } else {
          groupValues = [{value: null, label: 'No Teams'}];
        }

        console.log('groups: ', groupValues);
        setGroups(groupValues);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const selectedDateFunc = () => {
    setCalendarModal(!calendarModal);
    changeFilterDate(calendarSelectedDate, 'special');
  };

  const changeFilterDate = (date: string | number | Date, params: string) => {
    console.log('açıl amık açıl');
    let createDate;
    switch (params) {
      case 'today':
        createDate = new Date().toISOString();
        break;

      case 'tomorrow':
        createDate = new Date(new Date().getTime() + 86400).toISOString();
        break;

      case 'special':
        createDate = new Date(date).toISOString();
        break;

      default:
        break;
    }
    setFilterDate(new Date(createDate).toISOString().split('T')[0]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <Header
          onPress={() => navigation.openDrawer()}
          title={lang.tasks}
          onPressNotification={() => navigation.navigate('NotificationsScreen')}
        />
        <View style={{flexDirection: 'row'}}>
          {console.log(search)}
          <Searchbar
            onSubmitEditing={getItemsBySearch}
            value={search}
            onChangeText={text => setSearch(text)}
            containerStyle={styles.searchBar}
          />
          <TouchableOpacity style={styles.filterIcon} onPress={openFilter}>
            <FilterIcon />
          </TouchableOpacity>
        </View>
        <View style={styles.tasksOuterView}>
          {Array.isArray(tasks) &&
            tasks?.length !== 0 &&
            tasks
              ?.sort(function (a, b) {
                return a.pinned - b.pinned;
              })
              ?.reverse()
              ?.map((task, index) => (
                <TaskView
                  style={styles.taskViews}
                  key={index}
                  title={task.taskName}
                  times={task.times}
                  pinned={task.pinned}
                  taskId={task.id}
                  passed={false}
                  status={task.status}
                  refreshFunc={fetchTasks}
                  onPress={() => navigation.navigate('TaskPreview', {task})}
                  onEditPress={() =>
                    navigation.navigate('AddEditTask', {task, edit: true})
                  }
                />
              ))}
        </View>
      </ScrollView>

      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          backgroundStyle={{borderRadius: 30}}
          handleStyle={styles.bottomSheetHandleStyle}
          snapPoints={snapPoints}
          style={styles.shadow}
          onChange={handleSheetChanges}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={calendarModal}
            onRequestClose={() => {
              setCalendarModal(!calendarModal);
            }}>
            <BlurView
              style={styles.absolute}
              blurType="dark"
              blurAmount={10}
              reducedTransparencyFallbackColor="white"
            />
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <TouchableOpacity
                  style={{
                    alignSelf: 'flex-end',
                    right: ww(0.02),
                    top: wh(0.002),
                  }}
                  onPress={() => setCalendarModal(false)}>
                  <CloseIcon />
                </TouchableOpacity>
                <CalendarList
                  horizontal={true}
                  pagingEnabled={true}
                  onDayPress={day => {
                    console.log('selected day', day.dateString);
                    setCalendarSelectedDate(day.dateString);
                    changeFilterDate(day.dateString, 'special');
                    setCalendarModal(false);
                  }}
                  calendarWidth={ww(0.8)}
                  calendarHeight={wh(0.5)}
                />
              </View>
            </View>
          </Modal>
          <View style={styles.modalTitle}>
            <Text style={styles.modalTitleText}>Filter</Text>
          </View>
          {console.log('Calendar STate: ', calendarSelectedDate)}
          <View style={styles.modalSubTitle}>
            <Text style={styles.modalSubTitleText}>Time & Date</Text>
          </View>
          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.today}
              onPress={() => changeFilterDate('', 'today')}>
              <Text style={styles.buttonText}>Today</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tomorrow}
              onPress={() => changeFilterDate('', 'tomorrow')}>
              <Text style={styles.buttonText}>Tommorrow</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.selectDate}
              // onPress={() => changeFilterDate('2021-09-23', 'special')}
              onPress={() => selectedDateFunc()}>
              <CalendarIcon />
              <Text style={styles.chooseButtonText}>Choose</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalSubTitle}>
            <Text style={styles.modalSubTitleText}>Company</Text>
          </View>
          <View style={styles.dropdownContainer}>
            <View style={styles.iconContainer}>
              <View style={{backgroundColor: White, borderRadius: 5}}>
                <GroupIcon />
              </View>
            </View>
            <View style={{marginLeft: ww(0.04)}}>
              <Dropdown
                style={styles.dropdown}
                data={companies}
                labelField="label"
                valueField="value"
                placeholder="Select Company"
                value={companyDropdown}
                onChange={item => {
                  setCompanyDropdown(item.value);
                  fetchGroups(item.value);
                  console.log('selected', item.value);
                }}
              />
            </View>
            <View>
              <RightIcon size={ww(0.03)} />
            </View>
          </View>

          <View style={styles.modalSubTitle}>
            <Text style={styles.modalSubTitleText}>Team</Text>
          </View>
          {console.log(companyDropdown)}
          {companyDropdown === null ? (
            <View style={styles.dropdownContainer}>
              <View style={styles.iconContainer}>
                <View style={{backgroundColor: White, borderRadius: 5}}>
                  <CompanyIcon size={22} />
                </View>
              </View>
              <View style={{marginLeft: ww(0.04)}}>
                <View style={{alignItems: 'center'}}>
                  <Text>Please Select A Company</Text>
                </View>
              </View>
            </View>
          ) : (
            <View
              style={{
                borderWidth: 1,
                borderColor: '#E5E5E5',
                flexDirection: 'row',
                alignItems: 'center',
                width: ww(0.8),
                height: wh(0.07),
                alignSelf: 'center',
                marginTop: wh(0.02),
                borderRadius: 10,
              }}>
              <View
                style={{
                  backgroundColor: '#E6E7FE',
                  width: ww(0.1),
                  height: wh(0.05),
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                  marginLeft: ww(0.03),
                }}>
                <View style={{backgroundColor: White, borderRadius: 5}}>
                  <GroupIcon />
                </View>
              </View>
              <View style={{marginLeft: ww(0.04)}}>
                <Dropdown
                  style={styles.dropdown}
                  data={groups}
                  labelField="label"
                  // disable
                  valueField="value"
                  placeholder="Select Group"
                  value={teamDropdown}
                  onChange={item => {
                    setTeamDropdown(item.value);

                    console.log('selected', item);
                  }}
                />
              </View>
              <View>
                <RightIcon size={ww(0.03)} />
              </View>
            </View>
          )}
          <View
            style={{
              flexDirection: 'row',
              marginTop: ww(0.1),
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: '#E5E5E5',
                width: ww(0.3),
                height: wh(0.06),
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
              }}
              onPress={onReset}>
              <Text style={{fontFamily: UbuntuMedium, fontSize: ww(0.04)}}>
                Reset
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: '#E5E5E5',
                backgroundColor: '#5669FF',
                width: ww(0.4),
                height: wh(0.06),
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
              }}
              onPress={() => setApply(filterGroup, filterCompany)}>
              <Text
                style={{
                  fontFamily: UbuntuMedium,
                  color: White,
                  fontSize: ww(0.04),
                }}>
                Apply
              </Text>
            </TouchableOpacity>
          </View>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </SafeAreaView>
  );
};

export default TasksScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: White,
    // alignItems: 'center',
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
    marginTop: wh(0.02),
  },
  taskViews: {
    marginVertical: wh(0.012),
  },
  searchBar: {
    alignSelf: 'flex-start',
    marginLeft: ww(0.105),
    width: ww(0.5),
  },
  filterIcon: {
    width: ww(0.2),
    marginLeft: ww(0.07),
    height: Platform.OS === 'android' ? wh(0.07) : wh(0.06),
    borderRadius: ww(0.05),
    backgroundColor: LightBlue,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: ww(0.07),
  },
  shadow: {
    elevation: 10,
    alignSelf: 'center',
    borderRadius: 10,
    width: ww(1),
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  modalTitle: {
    marginLeft: ww(0.05),
    marginTop: wh(0.02),
  },
  modalTitleText: {
    fontFamily: UbuntuMedium,
    fontSize: ww(0.07),
  },
  modalSubTitle: {
    marginTop: wh(0.04),
    marginLeft: ww(0.05),
  },
  modalSubTitleText: {
    fontFamily: UbuntuMedium,
    fontSize: ww(0.0448),
  },
  today: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    width: ww(0.2),
    alignItems: 'center',
    justifyContent: 'center',
    height: wh(0.05),
  },
  tomorrow: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',

    width: ww(0.3),
    alignItems: 'center',
    justifyContent: 'center',
    height: wh(0.05),
    marginLeft: ww(0.04),
  },
  selectDate: {
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    borderColor: '#E5E5E5',
    width: ww(0.32),
    alignItems: 'center',
    justifyContent: 'center',
    height: wh(0.05),
    marginLeft: ww(0.04),
  },
  buttonText: {
    fontFamily: UbuntuRegular,
    color: '#807A7A',
  },
  chooseButtonText: {
    fontFamily: UbuntuRegular,
    color: '#807A7A',
    marginLeft: ww(0.03),
  },
  buttons: {
    flexDirection: 'row',
    marginTop: wh(0.02),
    marginLeft: ww(0.05),
  },
  dropdown: {
    backgroundColor: 'white',
    borderBottomColor: 'gray',
    width: ww(0.55),
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  bottomSheetHandleStyle: {
    shadowColor: '#E4E8FF',
    shadowOffset: {
      width: 0,
      height: -15,
    },
    shadowOpacity: 3,
    shadowRadius: 5,
    elevation: 10,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    flexDirection: 'row',
    alignItems: 'center',
    width: ww(0.8),
    height: wh(0.07),
    alignSelf: 'center',
    marginTop: wh(0.02),
    borderRadius: 10,
    zIndex: 99,
  },
  iconContainer: {
    backgroundColor: '#E6E7FE',
    width: ww(0.1),
    height: wh(0.05),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginLeft: ww(0.03),
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: ww(0.8),
    height: wh(0.5),
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
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
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
