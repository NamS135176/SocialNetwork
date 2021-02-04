import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, LogBox, BackHandler } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Spinner from 'react-native-loading-spinner-overlay';
import { Ionicons } from '@expo/vector-icons';
import NewsScreen from './NewsScreen'
import UserScreen from './UserScreen'
import Login from './Login';
import { firebaseApp } from './FirebaseConfig';
import TempPost from './TempPost'

//  function HomeScreen({route,navigation}) {
//    let {user} = route.params
//    useEffect(() => {
//      navigation.navigate("PostScreen", {
//        user: user
//      })
//    })
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Home!</Text>
//     </View>
//   );
// }

// function SettingsScreen() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Settings!</Text>
//     </View>
//   );
// }
const Tab = createBottomTabNavigator(

);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Main" component={HomeScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
const MainScreen = ({ route, navigation }) => {
  let [user, setUser] = useState(null);
  let [re, setRe] = useState(null)
  let [data, setData] = useState(null)
  let { reload } = route.params
  useEffect(() => {
    setRe(reload)
    setUser(firebaseApp.auth().currentUser)
    try {
      firebaseApp.database().ref('Posts/').on('value', function (snapshot) {
        let arr = [];
        snapshot.forEach(element => {
          let childData = element.val()
          arr.push({
            id: element.key,
            photoURL: childData.photoURL,
            status: childData.status,
            likeCount: childData.likeCount,
            commentCount: childData.commentCount,
            time: childData.time,
            uid: childData.uid,
            userName: childData.userName,
            avatar: childData.avatar,
            liked: JSON.parse(childData.liked)
          })
        })
        arr.reverse()
        // setData(arr)
        // console.log(arr);
        firebaseApp.database().ref('Users/').on('value', function (snapshot) {
          let array = []
          snapshot.forEach(function (childSnapshot) {
            let childData = childSnapshot.val();
            array.push({
              email: childSnapshot.key,
              name: childData.name,
              avatar: childData.avatar
            });
          });
          // console.log(array);
          array.forEach(e => {
            arr.map((item) => {
              if (item.uid.split("@")[0] == e.email) {
                item.avatar = e.avatar
                item.userName = e.name
                return item
              }
              else {
                return item
              }
            })
          })
          // console.log(arr);
          setData(arr)
        });
      })
    } catch (error) {
      setData([])
    }
    LogBox.ignoreAllLogs();
    // console.log(firebaseApp.auth().currentUser.providerData[0]);
    // BackHandler.addEventListener('hardwareBackPress', () => {
    //   return true;
    // })
    navigation.setOptions({
      headerLeft: null
    })
  }, [])
  return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'News') {
              iconName = focused ? 'ios-cafe' : 'ios-cafe-outline';
            } else if (route.name === 'User') {
              iconName = focused ? 'ios-person-circle-outline' : 'ios-person-circle-outline';
            }
            else if(route.name === "Temp"){
              iconName = focused ? 'add-circle-outline' : 'add-circle-outline'
              size = 50
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={35} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'cyan',
          inactiveTintColor: 'gray'
        }}
      >
        <Tab.Screen name="News" children={() => <NewsScreen data={data}></NewsScreen>} />
        {/* <Tab.Screen name="Temp" children={() => <TempPost user={user}></TempPost>} /> */}
        <Tab.Screen name="User" children={() => <UserScreen user={user}></UserScreen>} />
      </Tab.Navigator>
  );
};

export default MainScreen;