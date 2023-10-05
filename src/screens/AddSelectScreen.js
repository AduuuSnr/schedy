import {MainBlue, White} from '@constants/colors';
import {UbuntuMedium} from 'assets/fonts';
import axios from 'axios';
import {ArrowHeader, CompanyView} from 'components';
import {ww} from 'helpers';
import React, {useEffect, useState} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
} from 'react-native';
import {useSelector} from 'react-redux';

const AddSelectScreen = ({navigation}) => {
  const lang = useSelector(state => state.lang);
  const user = useSelector(state => state.app.user);
  const [step, setStep] = useState(0);
  const [companies, setCompanies] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);

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

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {step == 0 ? (
        <View style={styles.pageOneContainer}>
          <Pressable
            onPress={() => setStep(prev => prev + 1)}
            style={styles.addContainers}>
            <Image
              style={styles.addIcons}
              source={require('assets/images/addTask.png')}
            />
            <Text style={[styles.addText, {color: MainBlue}]}>
              {lang.addTask}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('CreateCompanyScreen')}
            style={styles.addContainers}>
            <Image
              style={styles.addIcons}
              source={require('assets/images/addCompany.png')}
            />
            <Text style={styles.addText}>{lang.addCompany}</Text>
          </Pressable>
        </View>
      ) : step == 1 ? (
        <View style={styles.pageTwoContainer}>
          <ArrowHeader
            title="Companies"
            onPress={() => setStep(prev => prev - 1)}
          />
          <View style={styles.companyViewContainer}>
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
        </View>
      ) : (
        <View style={styles.pageTwoContainer}>
          <ArrowHeader
            title="Groups"
            onPress={() => setStep(prev => prev - 1)}
          />
          <View style={styles.companyViewContainer}>
            {groups?.map((group, index) => (
              <CompanyView
                onPress={() => {
                  navigation.navigate('AddEditTask', {groupId: group.id});
                }}
                key={index}
                teamName={group.groupName}
                teamDescription={group.groupDescription}
                workers={group.teamMembers}
              />
            ))}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default AddSelectScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: White,
  },
  pageOneContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: White,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageTwoContainer: {flex: 1, alignItems: 'center'},
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
