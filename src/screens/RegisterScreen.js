// import React, {useState, useRef} from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   SafeAreaView,
//   TouchableOpacity,
//   StatusBar,
//   Keyboard,
//   TouchableWithoutFeedback,
// } from 'react-native';
// import axios from 'axios';

// import {LoginInput} from 'components';
// import {ww, wh} from 'helpers';
// import {UbuntuMedium, UbuntuRegular} from 'assets/fonts';
// import Button from 'components/Button';
// import {apiUrl} from '@constants';
// import {White} from '@constants/colors';

// const RegisterScreen = ({navigation}) => {
//   const [fullName, setFullName] = useState({text: null, error: false});
//   const [email, setEmail] = useState({text: null, error: false});
//   const [password, setPassword] = useState({text: null, error: false});
//   const [passwordAgain, setPasswordAgain] = useState({
//     text: null,
//     error: false,
//   });

//   const register = () => {
//     const options = {
//       method: 'POST',
//       url: `${apiUrl}/users/register`,
//       headers: {'Content-Type': 'application/json'},
//       data: {
//         fullName: fullName.text,
//         email: email.text,
//         password: password.text,
//       },
//     };

//     axios
//       .request(options)
//       .then(function (response) {
//         if (password && passwordAgain && password.text !== passwordAgain.text) {
//           setPassword({text: password.text, error: true});
//           setPasswordAgain({text: passwordAgain.text, error: true});
//         } else {
//           if (response.data.status === 'success') {
//             setTimeout(() => {
//               navigation.navigate('LoginScreen');
//             }, 3000);
//           } else if (
//             response.data.message ===
//             'This e-mail address has been already used.'
//           ) {
//             setEmail({text: email.text, error: true});
//           } else {
//             setPassword({text: password.text, error: true});
//             setPasswordAgain({text: passwordAgain.text, error: true});
//             setEmail({text: email.text, error: true});
//             setFullName({text: fullName.text, error: true});
//           }
//         }
//       })
//       .catch(function (error) {
//         console.error(error);
//       });
//   };
//   return (
//     <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
//       <SafeAreaView style={styles.container}>
//         <StatusBar backgroundColor={White} barStyle="dark-content" />

//         <Text style={styles.registerText}>Register</Text>

//         <View style={styles.inputsView}>
//           <LoginInput
//             value={fullName.text}
//             error={fullName.error}
//             iconName="profile"
//             placeholder="Name"
//             onChangeText={text => setFullName({text, error: false})}
//           />
//           <LoginInput
//             value={email.text}
//             error={email.error}
//             iconName="mail"
//             placeholder="mail@email.com"
//             onChangeText={text => setEmail({text, error: false})}
//           />
//           <LoginInput
//             value={password.text}
//             error={password.error}
//             iconName="lock"
//             placeholder="Your password"
//             onChangeText={text => setPassword({text, error: false})}
//           />
//           <LoginInput
//             value={passwordAgain.text}
//             error={passwordAgain.error}
//             iconName="lock"
//             placeholder="***************"
//             onChangeText={text => setPasswordAgain({text, error: false})}
//           />
//         </View>
//         <View style={styles.buttonView}>
//           <Button title="Register" arrow onPress={register} />
//         </View>
//         <View style={styles.loginView}>
//           <Text style={styles.loginText1}>Already have an account? </Text>
//           <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
//             <Text style={styles.loginText2}>Sign In</Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     </TouchableWithoutFeedback>
//   );
// };

// export default RegisterScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     backgroundColor: White,
//   },
//   registerText: {
//     left: ww(0.1),
//     fontSize: ww(0.07),
//     fontFamily: UbuntuMedium,
//   },
//   inputsView: {
//     alignSelf: 'center',
//   },
//   buttonView: {
//     top: wh(0.03),
//     alignSelf: 'center',
//   },
//   loginView: {
//     flexDirection: 'row',
//     alignSelf: 'center',
//     top: wh(0.1),
//   },
//   loginText1: {
//     fontFamily: UbuntuRegular,
//     fontSize: ww(0.04),
//   },
//   loginText2: {
//     fontFamily: UbuntuRegular,
//     fontSize: ww(0.04),
//     color: '#5669FF',
//   },
// });

import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import {ww, wh} from 'helpers/responsive';

const SignUpScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [fullName, setFullName] = useState('');

  const register = () => {
    console.log(typeof email);
    console.log(typeof password);
    console.log(typeof fullName);

    let data = JSON.stringify({
      email: email,
      password: password,
      fullName: fullName,
    });

    let config = {
      method: 'post',
      url: 'http://api.businessagenda.org:3000/users/register',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios(config)
      .then(response => {
        console.log(JSON.stringify(response.data));
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.loginTxt}>REGISTER</Text>
        <Text style={styles.infoTxt}>
          Please define your login information !{' '}
        </Text>
        <View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputTxt}
              placeholder="Username"
              onChangeText={text => setFullName(text)}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputTxt}
              placeholder="Email"
              onChangeText={text => setEmail(text)}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputTxt}
              placeholder="Password"
              secureTextEntry
              onChangeText={text => setPassword(text)}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputTxt}
              placeholder="Password Again"
              secureTextEntry
              onChangeText={text => setPasswordAgain(text)}
            />
          </View>
        </View>
        <View style={styles.loginBtnView}>
          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
            <View style={styles.registerView}>
              <Text style={styles.accountTxt}>Already Have An Account ?</Text>
              <Text style={styles.registerTxt}> Login</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.loginBtnView}>
          <TouchableOpacity onPress={register}>
            <View style={styles.loginBtnTouch}>
              <Text style={styles.loginBtnTxt}>REGISTER</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  screen: {
    backgroundColor: 'white',
    flex: 1,
  },
  container: {
    paddingHorizontal: ww(0.15),
    paddingVertical: wh(0.2),
  },
  inputView: {
    borderBottomWidth: 1,
    marginBottom: wh(0.03),
  },
  inputTxt: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000A6',
    marginBottom: wh(0.01),
  },
  loginTxt: {
    fontSize: 25,
    fontWeight: '700',
    marginBottom: wh(0.01),
  },
  infoTxt: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: wh(0.03),
  },
  registerView: {
    flexDirection: 'row',
    marginBottom: wh(0.035),
    marginTop: wh(0.01),
  },
  accountTxt: {
    fontSize: 13,
    fontWeight: '900',
  },
  registerTxt: {
    fontSize: 13,
    fontWeight: '900',
    color: '#976D00',
  },
  loginBtnTxt: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  loginBtnTouch: {
    backgroundColor: '#1C1C1C',
    height: wh(0.052),
    width: ww(0.3),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
  },
  loginBtnView: {
    alignItems: 'center',
  },
});
