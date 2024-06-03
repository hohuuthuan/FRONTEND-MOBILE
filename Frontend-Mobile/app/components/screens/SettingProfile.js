import React, { useState, useRef, useContext, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    FlatList,
    Image,
    StyleSheet,
    Dimensions,
    Animated,
    ToastAndroid,
    Button,
    TextInput, Alert, Linking
} from 'react-native';
import InputField from './InputField'
import { icons } from "../../constants"
import Colors from "../../constants/Colors"
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from "react-native-modal";
import * as ImagePicker from 'expo-image-picker';
import { API_URL } from "@env"
import { AuthContext } from '../../context/AuthContext';
const SettingProfile = ({ route, navigation }) => {
    const { userToken } = useContext(AuthContext);
    const [date, setDate] = useState('09-10-2021');
    const [isModalVisible, setModalVisible] = useState(false);
    const [isSubmit, setIsSubmit] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    }
    const [user, setUser] = useState();
    const [data, setData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        avatarUrl: "",
        description: "",
        userBalance: 0,
        phoneNumber: ""
    })
    const [selectedImage, setSelectedImage] = useState('')
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            aspect: [4, 3],
            quality: 1,
        });
        if (result.canceled) {
            return;
        }

        if (result.assets) {
            const element = { uri: result.assets[0].uri }
            setSelectedImage(element);
        }
    };
    const handleOnChange = (name, value) => {

        console.log(data)
        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })

    }

    const handleUploadImage = async (im) => {
        const data = new FormData()
        data.append("file", im)
        data.append("upload_preset", "ml_default")
        await fetch("https://api.cloudinary.com/v1_1/dqfyfxb2r/image/upload", {
            method: "post",
            body: data
        }).then(res => res.json()).then(data => { handleOnChange('avatarUrl', data.public_id) })
    }
    const onSubmitImage = async () => {
        if (selectedImage) {
            let newImage = { uri: selectedImage.uri, type: "test/png", name: "ok" }
            const res = await handleUploadImage(newImage);
        }
        setIsSubmit(true);
    }
    const save = async () => {
        const resp = await fetch(`${API_URL}/api/User/updateProfile`, {
            method: "put",
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + userToken
            },
            body: JSON.stringify(data)
        })
        const res = await resp.json();
        console.log(res);
        if (res) {
            Alert.alert("Chỉnh sửa thành công", "Thông tin đã được chỉnh sửa ", [{ text: "OK" }], {
                cancelable: true,
            });
        }
        setIsSubmit(false);
    }
    useEffect(() => {
        if (isSubmit) {
            save();
        }
    },[isSubmit])
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
                const da = {
                    firstName: res.firstName,
                    middleName: res.middleName,
                    lastName: res.lastName,
                    avatarUrl: res.avatarUrl,
                    description: res.description,
                    userBalance: 0,
                    phoneNumber: res.phoneNumber
                }
                setData(da);
                console.log(res);
            })()
        });
        return unsubscribe;
    }, [navigation]);


    return (
        <View
            style={{ flex: 1, justifyContent: 'center', paddingTop: 10, marginBottom: 50, backgroundColor: '#0DA271' }}>
            <ScrollView style={{ paddingHorizontal: 25, paddingTop: 30, marginBottom: 10, backgroundColor: '#ffffff', marginHorizontal: 10, borderRadius: 10 }}>
                <Text style={{ textAlign: 'left', fontSize: 22, fontWeight: '500', marginBottom: 20 }}>
                    Thông tin cá nhân
                </Text>
                <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'gray', paddingVertical: 5, marginBottom: 10 }}>
                    <TextInput value={data.firstName} placeholder="Họ" onChangeText={(e) => { handleOnChange('firstName', e) }}></TextInput>
                </View>

                <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'gray', paddingVertical: 5, marginBottom: 10 }}>

                    <TextInput value={data.middleName} placeholder="Tên lót" onChangeText={(e) => { handleOnChange('middleName', e) }}></TextInput>
                </View>

                <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'gray', paddingVertical: 5, marginBottom: 10 }}>

                    <TextInput value={data.lastName} placeholder="Tên" onChangeText={(e) => { handleOnChange('lastName', e) }}></TextInput>
                </View>

                <TouchableOpacity
                    onPress={() => pickImage()}
                    style={{ width: '100%', alignItems: 'center', padding: 10 }}>
                    {selectedImage ?
                        <View style={{ width: '100%', alignItems: 'center', padding: 10 }}>
                            <Image source={{ uri: selectedImage.uri }} style={{ width: 80, height: 80, marginBottom: 10, borderRadius: 40, borderWidth: 0.5 }} />
                            <TouchableOpacity
                                onPress={() => setSelectedImage('')}
                            >
                                <Ionicons
                                    name='trash-outline'
                                    size={24}
                                    style={{ color: '#0DA271' }}
                                />
                            </TouchableOpacity>
                        </View>
                        :
                        <View>
                            <Ionicons
                                name='camera'
                                size={25}
                                style={{ color: '#0DA271' }}
                            />

                        </View>

                    }


                </TouchableOpacity>
                <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'gray', paddingVertical: 5, marginBottom: 10 }}>

                    <TextInput placeholder="Mô tả" value={ data.description} onChangeText={(e) => { handleOnChange('description', e) }}></TextInput>
                </View>
                <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'gray', paddingVertical: 5, marginBottom: 10 }}>

                    <TextInput placeholder="Số điện thoại" value={data.phoneNumber} keyboardType="phone-pad" onChangeText={(e) => { handleOnChange('phoneNumber', e) }}></TextInput>
                </View>

                <TouchableOpacity onPress={() => { onSubmitImage() }} style={{
                    backgroundColor: '#8fce00',
                    padding: 15,
                    marginBottom: 50,

                    borderRadius: 10
                }}>
                    <Text style={{
                        textAlign: 'center',
                        fontWeight: '700',
                        fontSize: 16,
                    }}>Lưu</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};
const CONTAINER_HEIGHT = 50;
export default SettingProfile;
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    view: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: CONTAINER_HEIGHT,
    },
    header: {
        borderBottomRightRadius: 16,
        borderBottomLeftRadius: 16,
        marginHorizontal: 4,
    },
    bottomBar: {
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16,
        marginHorizontal: 4,
    },
    contentContainerStyle: {
        paddingTop: CONTAINER_HEIGHT,
        marginTop: 8,
    },
    rowContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    item: {
        marginHorizontal: 10,
        marginBottom: 12,
        elevation: 6,
        borderRadius: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
    },
    caption: {
        color: Colors.darkGray,
    },
    image: {
        height: 300,
        width: null,
        marginBottom: 1,
        marginHorizontal: 16,
        borderRadius: 16,
    },
    bottomView: {
        alignItems: 'center',
        flexDirection: 'row',
        padding: 16
    },
    content: {
        alignItems: 'center',
        flexDirection: 'row',
        marginHorizontal: 16,
        paddingVertical: 8,
    },
    textContainer: {
        marginHorizontal: 16,
    },
    avatar: {
        height: 35,
        width: 35,
        borderRadius: 20,
        backgroundColor: Colors.primary,
    },
    rowView: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    icon: {
        marginHorizontal: 10,
    },
    container: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#A8E9CA'
    },
    title: {
        textAlign: 'left',
        fontSize: 20,
        fontWeight: 'bold',
    },
    datePickerStyle: {
        width: 230,
    },
    text: {
        textAlign: 'left',
        width: 230,
        fontSize: 16,
        color: "#000"
    }
})