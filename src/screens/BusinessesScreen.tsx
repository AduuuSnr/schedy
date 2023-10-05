import {apiUrl} from '@constants';
import {White} from '@constants/colors';
import {setBusinesses} from '@redux/app/actions';
import axios from 'axios';
import {CompanyView, Header, Searchbar} from 'components';
import {wh, ww} from 'helpers';
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  RefreshControl,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

interface Props {
  navigation: any;
}
interface companyProps {
  companyName: string;
  companyDescription: string;
  companyMembers: any[];
}

const BusinessesScreen = ({navigation}: Props) => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState('');
  const user = useSelector((state: any) => state.app.user);
  const businesses = useSelector((state: any) => state.app.businesses);
  const lang = useSelector(state => state.lang);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchCompanies();
  }, []);

  const searchCompanies = () => {
    const options = {
      method: 'POST',
      url: 'https://api.businessagenda.org/companies/search',
      headers: {'Content-Type': 'application/json'},
      data: {query: search, userId: user.id},
    };

    axios
      .request(options)
      .then(function (response) {
        // console.log(response.data);
        setCompanies(response.data.message);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const fetchCompanies = () => {
    const options = {
      method: 'POST',
      url: `https://api.businessagenda.org/companies/getCompanyTeams`,
      headers: {'Content-Type': 'application/json'},
      data: {userId: user.id},
    };
    axios
      .request(options)
      .then(function (response) {
        dispatch(setBusinesses(response.data.message));
      })
      .catch(function (error) {
        console.error(error);
      });

    setRefreshing(false);
  };

  return (
    <SafeAreaView style={{backgroundColor: White, flex: 1}}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <Header
          title={lang.business}
          onPress={() => navigation.openDrawer()}
          onPressNotification={() => navigation.navigate('NotificationsScreen')}
        />
        <View style={styles.container}>
          <Searchbar
            value={search}
            onChangeText={text => setSearch(text)}
            containerStyle={styles.searchBar}
            onSubmitEditing={searchCompanies}
          />
          <View style={styles.companyViewContainer}>
            {businesses?.map((company: companyProps, index) => (
              <CompanyView
                onPress={() =>
                  navigation.navigate('CompanyScreen', {companyId: company.id})
                }
                key={index}
                teamName={company.companyName}
                teamDescription={company.companyDescription}
                workers={company.companyMembers}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BusinessesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  searchBar: {
    alignSelf: 'flex-start',
    marginLeft: ww(0.105),
    width: ww(0.78),
    marginTop: Platform.OS === 'android' ? wh(0.02) : null,
  },
  companyViewContainer: {
    marginTop: wh(0.03),
  },
});
