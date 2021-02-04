import React, { useState, useEffect } from 'react';
import { View, Text, Image, Dimensions, LogBox, Share } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { FlatList, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import { firebaseApp, storage } from './FirebaseConfig'
export default function ListItem(props) {

    let [isLiked, setIsLiked] = useState(false);
    // let [likeCount, setLikeCount] = useState(props.item.likeCount)
    useEffect(() => {

        if (props.item.liked.includes(props.user.providerData[0].uid)) {
            setIsLiked(true)
        }
    }, [])
    const like = () => {

        let arr = props.item.liked
        let likeCount = props.item.likeCount
        if (isLiked) {
            arr.pop()
            likeCount--
        }
        else {

            arr.push(props.user.providerData[0].uid)
            likeCount++
        }
        let isLike = !isLiked;
        setIsLiked(isLike)

        if (props.item.photoURL == null) {
            firebaseApp.database().ref('Posts/' + props.item.id).set({
                photoURL: null,
                status: props.item.status,
                likeCount: likeCount,
                commentCount: props.item.commentCount,
                time: props.item.time,
                uid: props.item.uid,
                userName: props.item.userName,
                avatar: props.item.avatar,
                liked: JSON.stringify(arr)
            }, function (error) {

            });
        }
        else {
            firebaseApp.database().ref('Posts/' + props.item.id).set({
                photoURL: props.item.photoURL,
                status: props.item.status,
                likeCount: likeCount,
                commentCount: props.item.commentCount,
                time: props.item.time,
                uid: props.item.uid,
                userName: props.item.userName,
                avatar: props.item.avatar,
                liked: JSON.stringify(arr)
            }, function (error) {

            });
        }

    }
    return (
        <View>
            <View style={{ width: "100%", height: 80, backgroundColor: 'white', borderBottomColor: "black", borderBottomWidth: 1 }}>
                <View style={{ flex: 1, backgroundColor: 'white', alignItems: "center", flexDirection: "row", justifyContent: "space-around" }}>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                        {
                            props.item.avatar == "" ? <Image source={require('../images/icon_account.png')} style={{ width: 60, height: 60, borderRadius: 30, marginHorizontal: 20, borderWidth:2, borderColor:"#ccc" }}></Image> :
                                <Image source={{ uri: props.item.avatar }} style={{ width: 60, height: 60, borderRadius: 30, marginHorizontal: 20 , borderWidth:2, borderColor:"#ccc"}}></Image>
                        }

                        <Text style={{ fontSize: 20 ,fontWeight:"bold"}}>{props.item.userName}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: "center", paddingRight: 20 }}><Text style={{}}>{props.item.time.split(" ")[1] + " " + props.item.time.split(" ")[2]}</Text></View>

                </View>

            </View>
            <View style={{ width: "100%", backgroundColor: 'white' }}>
                {props.item.status == "" ? <View></View> : <Text style={{ padding: 25, fontSize: 20 }}>{props.item.status}</Text>}
                
            </View>
            {props.item.photoURL != null ? <View style={{ width: "100%", backgroundColor: 'white' }}>
                <Image style={{ width: "100%", height: 600 }} source={{ uri: props.item.photoURL }}></Image>

            </View> : <View></View>}
            <View style={{ width: "100%", height: 50, backgroundColor: 'white', marginBottom: 20, borderTopWidth: 1, borderTopColor: "black" }}>
                <View style={{ flex: 1, backgroundColor: 'white', flexDirection: 'row', justifyContent: "space-around", alignItems: "center" }}>
                    {isLiked == false ? <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }} >
                        <TouchableOpacity onPress={like}><Ionicons name='ios-heart-outline' size={22} color="black" /></TouchableOpacity>
                        <TouchableOpacity onPress={like}>
                            <Text style={{ textAlign: "center", color: "black" }}>{props.item.likeCount} Like</Text>
                        </TouchableOpacity>

                    </View> : <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }} >
                            <TouchableOpacity onPress={like}><Ionicons name='ios-heart' size={22} color="red" /></TouchableOpacity>
                            <TouchableOpacity onPress={like}>
                                <Text style={{ textAlign: "center", color: "red" }}>{props.item.likeCount} Like</Text>
                            </TouchableOpacity>
                        </View>}
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }} >
                        <MaterialIcon name="comment" size={22} color="black" />
                        <Text style={{ textAlign: "center" }}>{props.item.commentCount} Comment</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }} >
                        <Ionicons name='ios-share-social-outline' size={22} color="black" />
                        <TouchableOpacity onPress={async () => {
                            try {
                                const result = await Share.share({
                                    message: props.item.status,
                                    photoURL: props.item.photoURL
                                });
                                if (result.action === Share.sharedAction) {
                                    if (result.activityType) {
                                        // shared with activity type of result.activityType
                                        console.log('a')
                                    } else {
                                        console.log('b')
                                        // shared
                                    }
                                } else if (result.action === Share.dismissedAction) {
                                    console.log('c')
                                    // dismissed
                                }
                            } catch (error) {
                                alert(error.message);
                            }
                        }}>
                            <Text style={{ textAlign: "center" }}>Share</Text>
                        </TouchableOpacity>

                    </View>
                </View>

            </View>
        </View>
    )
}