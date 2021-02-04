import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, LogBox, BackHandler, Button, FlatList } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { firebaseApp } from './FirebaseConfig';
import ListItem from './ListItem'
export default function TimelineScreen({ route }) {
    let [data, setData] = useState(null)
    let { user } = route.params
    let [isLoading, setIsloading] = useState(false)
    useEffect(() => {
        let arr = []
        setIsloading(true)
        firebaseApp.database().ref('Posts/').orderByChild("uid").equalTo(user.providerData[0].uid).on("child_added", function (snapshot) {
            setIsloading(false)
            arr.push(snapshot.val())
        })
        setData(arr)
    }, [])
    return (
        <View style={{ backgroundColor: '#333542' }}>
            <Spinner
                visible={isLoading}
                textStyle={{ color: '#FFF' }}
            />
            <FlatList
                data={data}
                renderItem={
                    ({ item }) => <ListItem item={item} user={firebaseApp.auth().currentUser}></ListItem>
                }
            >
            </FlatList>

        </View>
    )
}
