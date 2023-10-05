import {Black, DarkGray, Gray, LightGray, White} from '@constants/colors';
import {UbuntuMedium, UbuntuRegular} from 'assets/fonts';
import {wh, ww} from 'helpers';
import React from 'react';
import {useRef} from 'react';
import {Image, TouchableOpacity, StyleSheet, Text, View} from 'react-native';
import {CalendarStrip} from 'components/SEOCalendar';

interface CalendarProps {
  onDateSelected: (date: string) => any;
  selectedDate: Date;
}

const CustomCalendar = ({onDateSelected, selectedDate}: CalendarProps) => {
  const months = {
    Jan: 'January',
    Feb: 'February',
    Mar: 'March',
    Apr: 'April',
    May: 'May',
    Jun: 'June',
    Jul: 'July',
    Aug: 'August',
    Sep: 'September',
    Oct: 'October',
    Nov: 'November',
    Dec: 'December',
  };

  var days = {
    Sun: 'Sunday',
    Mon: 'Monday',
    Tue: 'Tuesday',
    Wed: 'Wednesday',
    Thu: 'Thursday',
    Fri: 'Friday',
    Sat: 'Saturday',
  };

  const formattedToday = `${months[new Date().toDateString().split(' ')[1]]} ${
    new Date().toDateString().split(' ')[2]
  }, `;

  const todayDate = new Date().toDateString().split(' ')[0];

  const calendarRef = useRef(null);

  return (
    <View style={styles.container}>
      <View style={styles.calendarUpper}>
        <View>
          <Text style={styles.formattedTextDark}>
            {formattedToday}
            <Text style={styles.formattedTextLight}>
              {`${days[`${todayDate}`]}`}
            </Text>
          </Text>
        </View>
        <View style={{flexDirection: 'row', marginRight: 20}}>
          <TouchableOpacity
            onPress={() => calendarRef?.current.getPreviousWeek()}>
            <Image
              style={styles.arrowStyles}
              source={require('../assets/icons/left-arrow.png')}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => calendarRef?.current.getNextWeek()}>
            <Image
              style={styles.arrowStyles}
              source={require('../assets/icons/right-arrow.png')}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      <CalendarStrip
        scrollable
        ref={calendarRef}
        style={{height: wh(0.15)}}
        calendarHeaderStyle={{display: 'none'}}
        calendarColor={White}
        dateNumberStyle={styles.dateNumberStyle}
        dateNameStyle={styles.dateNameStyle}
        customDatesStyles={[
          {
            dateContainerStyle: {
              backgroundColor: '#eee',
              borderRadius: ww(0.03),
            },
            startDate: new Date(1920, 11, 11),
            endDate: new Date(2099, 11, 11),
          },
        ]}
        highlightDateNumberStyle={styles.highlightDateNumberStyle}
        highlightDateNameStyle={styles.highlightDateNameStyle}
        highlightDateContainerStyle={styles.highlightedContainer}
        iconLeft={null}
        iconRight={null}
        upperCaseDays={false}
        selectedDate={selectedDate}
        onDateSelected={onDateSelected}
      />
    </View>
  );
};

export default CustomCalendar;

const styles = StyleSheet.create({
  container: {
    height: wh(0.24),
    backgroundColor: White,
  },
  highlightDateNumberStyle: {
    color: White,
    fontFamily: UbuntuMedium,
    fontSize: ww(0.05),
  },
  highlightDateNameStyle: {
    color: White,
    fontSize: ww(0.025),
    fontFamily: UbuntuRegular,
  },
  dateNumberStyle: {
    color: DarkGray,
    fontFamily: UbuntuMedium,
    fontSize: ww(0.05),
  },
  calendarUpper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ww(0.082),
    paddingTop: wh(0.02),
    marginBottom: wh(0.01),
  },
  highlightedContainer: {
    flexDirection: 'column-reverse',
    backgroundColor: '#EB5757',
    borderRadius: ww(0.03),
  },
  dateNameStyle: {
    color: DarkGray,
    fontSize: ww(0.025),
    fontFamily: UbuntuRegular,
  },
  formattedTextDark: {
    fontFamily: UbuntuMedium,
    fontSize: ww(0.05),
  },
  formattedTextLight: {
    fontFamily: UbuntuRegular,
    color: Gray,
  },
  arrowStyles: {
    width: ww(0.04),
    height: ww(0.04),
    marginHorizontal: ww(0.022),
  },
});
