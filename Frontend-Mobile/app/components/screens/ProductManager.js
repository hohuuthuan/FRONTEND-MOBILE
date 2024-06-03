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
    ToastAndroid,
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

const ProductManager = ({ route, navigation }) => {
    const [productState, setProductState] = useState(1);
    const [products, setProducts] = useState([]);
    const { user, userToken, fomatTime } = useContext(AuthContext);
    const [products1, setProducts1] = useState([]);
    const [products2, setProducts2] = useState([]);
    const [products3, setProducts3] = useState([]);
    const choose = (state) => {
        setProductState(state);
    }
    useEffect(() => {
        console.log(productState)
    }, [productState])
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            (async () => {
                const resp = await fetch(`${API_URL}/api/User/getMyProfile`, {
                    method: "get",
                    headers: {
                        'Accept': 'text/plain',
                        'Content-type': 'application/json',
                        'Authorization': 'Bearer ' + userToken
                    },

                })
                const res = await resp.json();
                setProducts(res.products);
                setProducts1(res.products.filter((e) => e.status == 1))
                setProducts2(res.products.filter((e) => e.status == 2))
                setProducts3(res.products.filter((e) => e.status == 3))
                console.log(res);
            })()
        });
        return unsubscribe;
    }, [navigation,userToken]);
    return (
        <View style={{ paddingVertical: 50,alignItems:'center' }}>
            <Text style={{marginBottom:10,fontWeight:'600'} }>Quản lý bài đăng</Text>
            <View style={{ flexDirection: 'row', height: 60, backgroundColor: 'white' }}>
                <TouchableOpacity onPress={() => { choose(2) }} style={{ flex: 1, borderBottomWidth: 4, alignItems: 'center', justifyContent: 'center', borderBottomColor: productState == 2 ? 'red' : 'white' }}>
                    <Text style={{ fontSize: productState == 2 ? 12 : 10, fontWeight: '400', color: productState == 2 ? 'black' : 'gray' }}>Chờ duyệt ({products2.length})</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { choose(1) }} style={{ flex: 1, borderBottomWidth: 4, alignItems: 'center', justifyContent: 'center', borderBottomColor: productState == 1 ? 'red' : 'white',}}>
                    <Text style={{ fontSize: productState == 1 ? 12 : 10, fontWeight: '400', color: productState == 1 ? 'black' : 'gray' }}>Đang hiển thị ({ products1.length})</Text>
                </TouchableOpacity>
        
                <TouchableOpacity onPress={() => { choose(3) }} style={{ flex: 1, borderBottomWidth: 4, alignItems: 'center', justifyContent: 'center', borderBottomColor: productState == 3 ? 'red' : 'white' }}>
                    <Text style={{ fontSize: productState == 3 ? 12 : 10, fontWeight: '400', color: productState == 3 ? 'black' : 'gray' }}>Đã bán ({products3.length})</Text>
                </TouchableOpacity>
            </View>
            <View style={{ width: '100%',alignItems:'center' }}>
                <FlatList
                    style={{ width: '90%',height:'80%' }}
                    data={productState == 1 ? products1 : productState == 2?products2:products3}
                    keyExtractor={item => item.id}
                    renderItem={
                        ({ item }) =>
                            <TouchableOpacity
                                onPress={() => { navigation.navigate('UpdateProduct', { productID: item.id }) } }
                                style={{ width: '100%', height: 100, flexDirection: 'row', padding: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', marginTop: 10, borderRadius: 10 }} >
                                <Image
                                    source={{ uri: UPLOAD_IMAGES_URL + item.images[0]?.url + '.png' }}
                                    style={{
                                        width: 80,
                                        height: 80,
                                        resizeMode: 'contain',

                                        flex: 1
                                    }}
                                />
                                <View style={{ flex: 2, paddingLeft: 10 }}>
                                    <Text style={{ fontSize: 12 }}>{item.name}</Text>
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: 'red' }}>{item.price.toLocaleString()}đ</Text>
                                    <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                        <Text style={{ fontSize: 10, fontWeight: '400', color: 'gray' }}>{fomatTime(item.createdDate)}</Text>
                                        <FontAwesome size={20} color="green" name="pencil"></FontAwesome>
                                    </View>
                                </View>
                            </TouchableOpacity>
                    }
                >

                </FlatList>
            </View>
        </View>
    )
}; export default ProductManager