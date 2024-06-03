import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    FlatList,
    Image,
    Dimensions,
    Animated,
    ToastAndroid,Alert
} from 'react-native';
import { Rating, AirbnbRating } from 'react-native-ratings';
import { COLOURS, Items } from '../database/Database';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { images, icons } from "../../constants"
import { AuthContext } from '../../context/AuthContext';
import { API_URL, UPLOAD_IMAGES_URL } from "@env"

const EPay = ({ route, navigation }) => {
    const { user, userToken, fomatTime } = useContext(AuthContext);
    const [userBalance, setUserBalance] = useState(0);
    const [coinPackage, setCoinPackage] = useState([])
    const [subscriptionPackage, setSubscriptionPackage] = useState([])
    const [subscriptionPackageIsUsing, setSubscriptionPackageIsUsing] = useState([])
    const getUserBalance = async () => {
        const resp = await fetch(`${API_URL}/api/User/getMyProfile`, {
            method: "get",
            headers: {
                'Accept': 'text/plain',
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + userToken
            },

        })
        const res = await resp.json();
        setUserBalance(res.userBalance)
        console.log(res);
    }
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getUserBalance();
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            (async () => {
                const resp = await fetch(`${API_URL}/api/CoinPackage/getAll`, {
                    method: "get",
                    headers: {
                        'Accept': 'text/plain',
                        'Content-type': 'application/json',
                        'Authorization': 'Bearer ' + userToken
                    },

                })
                const res = await resp.json();
                setCoinPackage(res)
                console.log(res);
            })()
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            (async () => {
                const resp = await fetch(`${API_URL}/api/SubscriptionPackage/getAll`, {
                    method: "get",
                    headers: {
                        'Accept': 'text/plain',
                        'Content-type': 'application/json',
                        'Authorization': 'Bearer ' + userToken
                    },

                })
                const res = await resp.json();
                setSubscriptionPackage(res)
                console.log(res);
            })()
        });
        return unsubscribe;
    }, [navigation]);
    const getSubscriptionPackageIsUsing = async () => {
        const resp = await fetch(`${API_URL}/getByUserIdLogged`, {
            method: "get",
            headers: {
                'Accept': 'text/plain',
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + userToken
            },

        })
        const res = await resp.json();
        setSubscriptionPackageIsUsing(res);
        console.log(res);
    }
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getSubscriptionPackageIsUsing();
        });
        return unsubscribe;
    }, [navigation]);
    const addSubscriptionPackage = async (id, price) => {
        if (userBalance >= price) {
            const resp = await fetch(`${API_URL}/add?SpId=${id}`, {
                method: "post",
                headers: {
                    'Accept': 'text/plain',
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },

            })
            const res = await resp.json();
            if (res.isSuccess) {
                Alert.alert("Mua thành công", "Đã mua gói đăng!", [{ text: "OK" }], {
                    cancelable: true,
                });
                getUserBalance();
                getSubscriptionPackageIsUsing();
            } else {
                Alert.alert("Lỗi", "Đã xảy ra lỗi!", [{ text: "OK" }], {
                    cancelable: true,
                });
            }
            console.log(res);
        } else {
            Alert.alert("", "Số dư không đủ!", [{ text: "OK" }], {
                cancelable: true,
            });
        }
      
    }
    return (
        <View style={{ padding: 10 }}>
            <View style={{ padding: 10, backgroundColor: 'white', marginBottom: 5 }}>
                <Text style={{ fontSize: 26, color: 'green' }}>{userBalance.toLocaleString()} VNĐ</Text>
            </View>
            <View style={{ padding: 10, backgroundColor: 'white', marginBottom: 10 }}>
                <Text style={{ fontSize: 13, color: 'orange', fontWeight: '700', marginBottom: 20 }}>Nạp thêm</Text>
                <FlatList
                    data={coinPackage}
                    keyExtractor={item => item.id}
                    horizontal
                    renderItem={
                        ({ item }) =>
                            <TouchableOpacity onPress={() => { }} style={{ width: 130, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2ECC71', padding: 10, marginRight: 20, borderRadius: 10, }}>
                                <Text style={{ fontSize: 16, fontWeight: '800', color: 'white' }}>{item.packageName}</Text>
                            </TouchableOpacity>
                    }
                >
                </FlatList>
            </View>

            <View style={{ padding: 10, backgroundColor: 'white', marginBottom: 10 }}>
                <Text style={{ fontSize: 13, color: 'red', fontWeight: '700', marginBottom: 20 }}>Mua thêm gói đăng</Text>
                <FlatList
                    data={subscriptionPackage}
                    keyExtractor={item => item.id}
                    horizontal
                    renderItem={
                        ({ item }) =>
                            item.name != 'Free Subscription Package' &&
                            <TouchableOpacity onPress={() => {addSubscriptionPackage(item.id,item.price) }} style={{ width: 130, alignItems: 'center', justifyContent: 'center', backgroundColor: '#5DADE2', padding: 10, marginRight: 20, borderRadius: 10, }}>
                                <Text style={{ fontSize: 16, fontWeight: '800', color: 'white' }}>{item.name}</Text>
                                <Text style={{ fontSize: 14, fontWeight: '400', color: 'red' }}>{item.price} đ</Text>
                            </TouchableOpacity>
                    }
                >
                </FlatList>
            </View>
            <View style={{ padding: 10, backgroundColor: 'white', }}>
                <Text style={{ fontSize: 13, color: 'blue', fontWeight: '700', marginBottom: 20 }}>Các gói đang có</Text>
                <FlatList
                    data={subscriptionPackageIsUsing}
                    keyExtractor={item => item.id}

                    renderItem={
                        ({ item }) =>
                            item.sp.name != 'Free Subscription Package' &&
                            <TouchableOpacity onPress={() => { }} style={{ width: '100%', marginBottom: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: 'orange', padding: 10, marginRight: 20, borderRadius: 10, }}>
                                <Text style={{ fontSize: 16, fontWeight: '800', color: 'white' }}>{item.sp.name}</Text>
                                <Text style={{ fontSize: 14, fontWeight: '400', color: 'red' }}>{item.sp.price} đ</Text>
                                <Text style={{ fontSize: 16, fontWeight: '600', color: 'green' }}>Còn {(item.sp.postAmout - item.usedPost)} lượt</Text>
                            </TouchableOpacity>
                    }
                    style={{ height: 200 }}
                >
                </FlatList>
            </View>
            <View></View>
        </View>
    )
}; export default EPay