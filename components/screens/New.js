import React, { useState, useRef,useContext, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    FlatList,
    Image,
    StyleSheet,
    Dimensions,
    Animated,
    ToastAndroid,
    SafeAreaView,
    Alert,
    Pressable, ActivityIndicator, LogBox
} from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import Colors from "../../constants/Colors"
import { COLOURS, Items } from '../database/Database';
import Modal from 'react-native-modal';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Rating, AirbnbRating } from 'react-native-ratings';
import SelectDropdown from 'react-native-select-dropdown'
import { icons } from "../../constants"
import { Video, ResizeMode } from 'expo-av';
import { AuthContext } from '../../context/AuthContext';
import { color } from 'react-native-reanimated';
import {API_URL} from "@env"
const New = ({ route, navigation }) => {
    const { userToken } = useContext(AuthContext);
    //useEffect(() => {
    //    console.log('user:' + user)
    //    if (!user) {
    //        navigation.navigate('Login');
    //    }
    //}, [navigation, route])
    const [isModalVisible, setModalVisible] = useState(false)
    const [isAddressModalVisible, setAddressModalVisible] = useState(false)
    const [cate, setCate] = useState("")
    const [hasPermission, setHasPermission] = useState(null)
    const [image, setImage] = useState([])
    const [selectedImage, setSelectedImage] = useState([])
    const [selectedVideo, setSelectedVideo] = useState()
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    const [district, setDistrict] = useState([])
    const [ward, setWard] = useState([]);
    const [stepAddress, setStepAddress] = useState(1);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState();
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);
    const [colors, setColors] = useState([]);
    const [selectedColor, setSelectedColor] = useState();
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [brands, setBrands] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState();
    const [showBrandPicker, setShowBrandPicker] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [isSubmitImage, setIsSubmibImage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [subscriptionPackageIsUsing, setSubscriptionPackageIsUsing] = useState([])
    const [data, setData] = useState({
        name: "",
        description: "",
        stock: 0,
        price: 0,
        status: 0,
        spId:1,
        isHidden: true,
        categoryId: 0,
        brandId: 0,
        userId: "8200e7ec-059f-40db-8aad-fa436a9919f4",
        sizeId: 1,
        colorId: 0,
        images: [
            {
                id: 0,
                url: "",
                isCover: true,
                isVideo: true,
                isDeleted: true,
                isNewlyAdded: true
            }
        ]
    })
    const handleOnChange = (name, value) => {
        console.log(data)
        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })

    }
    useEffect(() => {
        console.log('DATA:')
        console.log(data)
    }, [data]);
    useEffect(() => {
        setIsValid(data.name.length>3&&selectedImage.length>1&&data.price>=1000)
    }, [data]);
    useEffect(() => {
        (async () => {
            console.log(API_URL)
            const res = await fetch(`${API_URL}/api/Color/getAll`)
        const da = await res.json();
            //console.log(da)
            setColors(da)
            setData((preve) => {
                return {
                    ...preve,
                    colorId: da[3].id
                }
            })
            setSelectedColor(da[3].hexValue)
        }
        )()
    }, []);

    useEffect(() => {
        (async () => {
            const res = await fetch(`${API_URL}/api/Brand/getAll`)
            const da = await res.json();
            //console.log(da)
            setBrands(da)
            setData((preve) => {
                return {
                    ...preve,
                    brandId: da[0].id
                }
            })
            setSelectedBrand(da[0].name)
        }
        )()
    }, []);

    useEffect(() => {
        (async () => {
            const res = await fetch(`${API_URL}/api/Category/getAll`)
            const da = await res.json();
            //console.log(da)
            setCategories(da)
            setData((preve) => {
                return {
                    ...preve,
                    categoryId: da[0].id
                }
            })
            setSelectedCategory(da[0].name)
        }
        )()
    }, []);
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
    useEffect(() => {
        (async () => {
            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasPermission(galleryStatus.status === 'granted');
        })()
    }, []);

    const reset = () => {
        setSelectedImage([]);
    }
    const addSelectedImage = (item) => {
        setSelectedImage([...selectedImage, item])
    }
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            selectionLimit: 6 - selectedImage.length,
            aspect: [4, 3],
            quality: 1,
        });
        if (result.canceled) {
            return;
        }
        const list = []
        if (result.assets) {
            for (var i = 0; i < result.assets.length; i++) {
                const element = { uri: result.assets[i].uri }
                list.push(element)

            }
            setSelectedImage(selectedImage.concat(list));
        }
        

    };
    const pickVideo = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            quality: 1,
            videoMaxDuration:1,
        });
        console.log(result);

        if (result.canceled) {
            return;
        }
        if (result.assets[0].duration>30000) {
            Alert.alert("Lỗi", "Video phải dưới 30 giây ", [{ text: "OK" }], {
                cancelable: true,
            });
            return
        }
        const element = { uri: result.assets[0].uri }
        setSelectedVideo(element)
        let newImage = { uri: element.uri, type: "test/mp4", name: "ok" }
        // handleUploadVideo(newImage);
    };
    
    const addImage = (publicId,index,isVid) => {
        let element = {
            id: 0,
            url: publicId,
            isCover: index==0?true:false,
            isVideo: isVid,
            isDeleted: false,
            isNewlyAdded: true
        }
        //console.log(element)
        setImage(prev => [...prev,element])
    }
    const deleteSelectedImage = (i) => {
        const list = selectedImage.filter((item, index) => index !== i)
        setSelectedImage(list)
    }
    const handleUploadVideo = async(image) => {
        const data = new FormData()
        const isVideo = true;
        data.append("file", image)
        data.append("upload_preset", "ml_default")
        fetch("https://api.cloudinary.com/v1_1/dqfyfxb2r/video/upload", {
            method: "post",
            body: data
        }).then(res => res.json()).then(data => { console.log('video up'+data.public_id),addImage(data.public_id,2,isVideo)})
    }
    useEffect(() => {
        
        handleOnChange('images', image);
       
    }, [image])

    useEffect(() => {

        if (data.images.length > 1 && (data.images.length == (selectedImage.length+(selectedVideo?1:0)))) {
            addProduct();
           // setImage([])
            //handleOnChange('images', [{
            //    id: 0,
            //    url: "",
            //    isCover: true,
            //    isVideo: true,
            //    isDeleted: true,
            //    isNewlyAdded: true
            //}]);
            setIsLoading(false)
        }
        
    }
, [data.images])
    const onSubmitImage =async () => {
        setIsLoading(true)
         if (selectedImage.length > 0) {
            selectedImage.map((item, index) => {
                let newImage = { uri: item.uri, type: "test/png", name: "ok" }
                handleUploadImage(newImage, index);
            });
        }
        if (selectedVideo) {
            let newImage = { uri: selectedVideo.uri, type: "test/mp4", name: "ok" }
            handleUploadVideo(newImage)
        }
        setIsSubmibImage(true);
        //setIsLoading(false)
    }
    const addProduct = async () => {
        const resp = await fetch(`${API_URL}/api/Product/add`, {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + userToken
            },
            body: JSON.stringify(data)
        })
        const res = await resp.json();
        console.log(res);
        if (res.isSuccess) {
            Alert.alert("Đăng bán thành công", "Sản phẩm đã được đăng bán ", [{ text: "OK" }], {
                cancelable: true,
            });
            getSubscriptionPackageIsUsing();
        }
        setIsSubmibImage(false);
        setSelectedImage([]);
    }
    const onSubmit = async() => {
       
         await onSubmitImage();
        // await console.log(data)
        //addProduct();
}
    useEffect(() => {
        if (isSubmitImage) {
            console.log('DATA BEFORE')
            //console.log(data)
        }
        console.log('is submit '+isSubmitImage)
    },[isSubmitImage])
    const handleUploadImage =async (im,index) => {
        const data = new FormData()
        const isVideo = false;
        data.append("file", im)
        data.append("upload_preset", "ml_default")
        await fetch("https://api.cloudinary.com/v1_1/dqfyfxb2r/image/upload", {
            method: "post",
            body: data
        }).then(res => res.json()).then(data => { console.log(data.public_id) ,addImage(data.public_id,index,isVideo)})
    }
    const toggleModal = () => {
        setModalVisible(!isModalVisible)
    }
    const toggleAddressModal = () => {
        setAddressModalVisible(!isAddressModalVisible)
    }
    const setCategory = (cat) => {
        setCate(cat)
        setModalVisible(!isModalVisible)
        console.log(cat)
    }

    const CategoryItem = ({ name, icon }) => {
        return (
            <TouchableOpacity style={{ width: 80, height: 80, marginLelf: 14, marginHorizontal: 14, marginVertical: 24, }}
                onPress={() => setCategory(name)}
            >
                <View style={{ alignItems: 'center', }}>
                    {icon}
                    <Text style={{ fontSize: 12, marginTop: 10 }}>{name}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    return (

        <View style={styles.container}>
            <ScrollView style={{ width: '98%' }}>
                <View style={{ alignItems: 'center',paddingVertical:30 }}>
                    

                    <Modal style={{justifyContent:'center',alignItems:'center'}} isVisible={isLoading} backdropOpacity={0.2} onBackdropPress={toggleAddressModal}>
                        <ActivityIndicator size='large' color='black' />
                        <Text>Đang tải</Text>
                    </Modal>

                    <Text style={{fontSize:26,}}>Đăng bán sản phẩm</Text>
                    <View style={{ backgroundColor: '#ddd', width: '100%', padding: 10, justifyContent: 'center', alignItems: 'center', }}>
                        <Text>Thông tin chi tiết</Text>
                    </View>

                    <View style={{ width: '95%', justifyContent: 'center', alignItems: 'center', }}>
                        {selectedImage.length > 0 ?
                            <View style={{
                                flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center',
                                alignItems: 'center',
                            }}>

                                <FlatList data={selectedImage}
                                    horizontal
                                    renderItem={({ item, index }) =>
                                        <View style={{ borderWidth: 0.5, margin: 10, position: 'relative' }}>
                                            <Image source={{ uri: item.uri }} style={{ height: 150, width: 100, resizeMode: 'contain' }} />
                                            <Pressable
                                                onPress={() => deleteSelectedImage(index)}
                                                style={{
                                                    position: 'absolute', top: -10, right: -10, borderRadius: 25,
                                                    backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'
                                                }}>
                                                <Ionicons name="close-circle" size={24} />
                                            </Pressable>
                                            {
                                                index == 0 &&
                                                <View style={{ position: 'absolute', bottom: 0, height: 20, width: '100%', backgroundColor: 'black', alignItems: 'center' }}>
                                                    <Text style={{ color: 'white' }}>Ảnh bìa</Text>
                                                </View>
                                            }
                                        </View>
                                    }
                                >

                                </FlatList>

                                {/*{selectedImage.map((item, index) => {*/}
                                {/*    return <Image key={index} source={{ uri: item.uri }} style={{ margin: 5, borderWidth: 0.5, borderRadius: 5, height: selectedImage.length == 1 ? 280 : 200, width: selectedImage.length == 1 ? 210 : 150, resizeMode: 'stretch' }} />*/}
                                {/*})*/}
                                {/*}*/}
                                <View style={{
                                    flexDirection: 'row', width: 200, justifyContent: 'space-between', marginTop: 30
                                }}>
                                    <Text>{selectedImage.length} / 6</Text>
                                    <Pressable
                                        onPress={selectedImage.length < 6 ? () => pickImage() : null}
                                    >
                                        <Ionicons
                                            name='images-outline'
                                            size={24}
                                            style={{ color: selectedImage.length < 6 ? '#0DA271' : 'gray' }}
                                        />
                                    </Pressable>
                                    <Pressable
                                        onPress={() => setSelectedImage([])}
                                    >
                                        <Ionicons
                                            name='trash-outline'
                                            size={24}
                                            style={{ color: '#0DA271' }}
                                        />
                                    </Pressable>
                                    
                                </View>
                                 
                            </View>
                            :
                            <Pressable style={{
                                width: '100%', height: 200,
                                paddingVertical: 10,
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingHorizontal: 10,
                                marginTop: 10,
                                marginBottom: 10,
                                borderWidth: 2,
                                borderRadius: 10,
                                borderStyle: 'dashed',
                                borderColor: '#0DA271',
                                backgroundColor: '#BFFFFD'
                            }} onPress={!selectedImage.length > 0 ? () => pickImage() : null}>
                                <View style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Ionicons
                                        name='camera'
                                        size={70}
                                        style={{ color: '#0DA271' }}
                                    />
                                    <Text style={{ color: '#898989' }}>Có thể đăng từ 1 -6 hình</Text>
                                </View>
                            </Pressable>
                        }
                        {(selectedImage.length < 2) &&
                            <Text style={{ fontSize: 9, color: 'red' }}>Sản phẩm phải có ít nhất 2 hình ảnh</Text>
                        }
                        {selectedVideo ?
                            <View style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 20,
                            }}>
                                <Video source={{ uri: selectedVideo.uri }}
                                    style={{ width: 350, height: 250 }}
                                    ref={video}
                                    useNativeControls
                                    resizeMode={ResizeMode.CONTAIN}
                                    isLooping
                                    onPlaybackStatusUpdate={status => setStatus(() => status)}
                                />
                                <Button
                                    title={status.isPlaying ? 'Dừng' : 'Phát'}
                                    onPress={() =>
                                        status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
                                    }
                                />
                                <View style={{
                                    flexDirection: 'row', width: 100, justifyContent: 'space-between', marginTop: 20
                                }}>
                                    <Pressable
                                        onPress={() => pickVideo()}
                                    >
                                        <Ionicons
                                            name='film-outline'
                                            size={24}
                                            style={{ color: '#0DA271' }}
                                        />
                                    </Pressable>
                                    <Pressable
                                        onPress={() => setSelectedVideo("")}
                                    >
                                        <Ionicons
                                            name='trash-outline'
                                            size={24}
                                            style={{ color: '#0DA271' }}
                                        />
                                    </Pressable>
                                </View>
                            </View> :
                            <Pressable style={{
                                width: '100%', height: 200,
                                paddingVertical: 10,
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingHorizontal: 10,
                                marginTop: 10,
                                marginBottom: 30,
                                borderWidth: 2,
                                borderRadius: 10,
                                borderStyle: 'dashed',
                                borderColor: '#0DA271',
                                backgroundColor: '#BFFFFD'
                            }} onPress={!selectedVideo ? () => pickVideo() : null}>
                                <View style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Ionicons
                                        name='film'
                                        size={70}
                                        style={{ color: '#0DA271' }}
                                    />
                                    <Text style={{ color: '#898989' }}>Có thể đăng 1 video</Text>
                                </View>
                            </Pressable>

                        }

                        {/*<Button*/}
                        {/*    title={status.isPlaying ? 'Pause' : 'Play'}*/}
                        {/*    onPress={() =>*/}
                        {/*        status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()*/}
                        {/*    }*/}
                        {/*/>*/}
                        <View style={{
                            width: '95%'
                        }} >
                        <Text style={{marginBottom:10,fontWeight:'600'} }>Tên</Text>
                        <View style={{ width: '100%', height: 50, borderColor:data.name.length>3? '#D5D5D5':'red', marginBottom: 20, borderRadius: 10, borderWidth: 1, justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 15 }}>
                            <TextInput placeholder="Tên" value={data.name} onChangeText={(e)=>handleOnChange('name',e)}></TextInput>
                                {(data.name.length<=3)&&
                                    <Text style={{ fontSize: 9, color: 'red' }}>Tên sản phẩm phải trên 4 ký tự</Text>
                                } 
                            </View>

                            <Text style={{ marginBottom: 10, fontWeight: '600' }}>Loại</Text>
                            <Pressable onPress={() => { setShowCategoryPicker(!showCategoryPicker) }} style={{ width: '100%', height: 50, borderColor: '#D5D5D5', marginBottom: 20, borderRadius: 10, borderWidth: 1, justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 15 }}>
                                <Text>{selectedCategory}</Text>
                            </Pressable>
                            {showCategoryPicker &&
                                <FlatList
                                    data={categories}
                                    horizontal
                                    //showsHorizontalScrollIndicator={false}
                                    keyExtractor={item => item.id}
                                    renderItem={
                                        ({ item }) =>
                                            <Pressable onPress={() => { handleOnChange('categoryId', item.id), setSelectedCategory(item.name), setShowCategoryPicker(!showCategoryPicker) }} style={{width:100, alignItems: 'center', justifyContent: 'center',padding:1, marginRight: 20, borderWidth: 0.5, borderColor: item.name == selectedCategory ? 'blue' : 'gray' }}>
                                                <Image source={{ uri: item.imageUrl }} style={{ height: 60, width: 60, resizeMode: 'stretch', borderRadius: 20 }} />
                                                <Text style={{ fontSize: 12 }}>{item.name}</Text>
                                            </Pressable>
                                    }
                                >
                                </FlatList>

                            }

                        <Text style={{ marginBottom: 10, fontWeight: '600' }}>Hãng</Text>
                            <Pressable onPress={() => {setShowBrandPicker(!showBrandPicker) }} style={{ width: '100%', height: 50, borderColor: '#D5D5D5', marginBottom: 20, borderRadius: 10, borderWidth: 1, justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 15 }}>
                                <Text>{selectedBrand}</Text>
                            </Pressable>
                            {showBrandPicker &&
                                <FlatList
                                    data={brands}
                                    horizontal
                                    //showsHorizontalScrollIndicator={false}
                                    keyExtractor={item => item.id}
                                    renderItem={
                                        ({ item }) =>
                                            <Pressable onPress={() => { handleOnChange('brandId', item.id), setSelectedBrand(item.name), setShowBrandPicker(!showBrandPicker) }} style={{width:100, alignItems: 'center', justifyContent: 'center', marginRight:20 ,borderWidth:0.5,borderColor:item.name==selectedBrand?'blue':'gray' }}>
                                                <Image source={{ uri:item.imageUrl}} style={{ height: 60, width: 60,resizeMode:'stretch', borderRadius: 20 }}/>
                                                <Text style={{ fontSize: 12 }}>{item.name}</Text>
                                            </Pressable>
                                    }
                                >
                                </FlatList>

                            }

                            <Text style={{ marginBottom: 10, fontWeight: '600' }}>Màu</Text>
                            <Pressable onPress={() => { setShowColorPicker(!showColorPicker)} } style={{ width: '100%', height: 50, borderColor: '#D5D5D5', marginBottom: 20, borderRadius: 10, borderWidth: 1, justifyContent: 'center', paddingVertical: 2, paddingHorizontal: 15 }}>
                                <View style={{ width: '100%', height: '50%', backgroundColor: selectedColor }}></View>
                        </Pressable>
                            {showColorPicker &&
                                <FlatList
                                    data={colors}
                                    horizontal
                                    //showsHorizontalScrollIndicator={false}
                                    keyExtractor={item => item.colorName}
                                    renderItem={
                                        ({ item }) =>
                                            <Pressable onPress={() => { handleOnChange('colorId', item.id), setSelectedColor(item.hexValue),setShowColorPicker(!showColorPicker)}} style={{ alignItems: 'center', justifyContent: 'center', margin: 10 }}>
                                                <View style={{ height: 20, width: 20, backgroundColor: item.hexValue, borderRadius: 20 }}></View>
                                                <Text style={{ fontSize: 12 }}>{item.colorName}</Text>
                                            </Pressable>
                                    }
                                >
                                </FlatList>

                            }
                            <Text style={{ marginBottom: 10, fontWeight: '600' }}>Giá bán</Text>
                            <View style={{ width: '100%', height: 50, borderColor: data.price < 1000?'red': '#D5D5D5', marginBottom: 20, borderRadius: 10, borderWidth: 1, justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 15 }}>
                                <TextInput placeholder="Giá bán" keyboardType="number-pad" value={data.price} onChangeText={(e) => { handleOnChange('price', e.toLocaleString()) } }></TextInput>
                                {(data.price < 1000) &&
                                    <Text style={{ fontSize: 9, color: 'red' }}>Giá sản phẩm phải trên 1000đ</Text>
                                }
                            </View>
                        </View>
                    </View>
                    <View style={{ backgroundColor: '#ddd', width: '100%', padding:10, justifyContent: 'center', alignItems: 'center', }}>
                        <Text>Mô tả chi tiết</Text>
                    </View>
                    <View style={{ width: '95%', justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}>
                        <Text style={{ marginBottom: 10, fontWeight: '600' }}>Mô tả</Text>
                        <View
                            style={{ width: '100%', height: 200, borderColor: '#D5D5D5', marginBottom: 20, borderRadius: 10, borderWidth: 1, justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 15 }}>
                            <TextInput
                                editable
                                multiline
                                numberOfLines={4}
                                maxLength={250}
                                placeholder="Mô tả chi tiết"
                                value={data.description}
                                onChangeText={(e) => { handleOnChange('description',e)} }
                            ></TextInput>
                        </View>
                        <FlatList
                            data={subscriptionPackageIsUsing}
                            keyExtractor={item => item.id}
                            horizontal
                            renderItem={
                                ({ item }) => 
                                    <TouchableOpacity onPress={() => { handleOnChange('spId', item.id) }} style={{position:'relative', width:150, marginBottom: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: 'orange', marginRight: 20, borderRadius: 10, }}>
                                        <Text style={{ fontSize: 16, fontWeight: '800', color: 'white' }}>{item.sp.name}</Text>
                                        <Text style={{ fontSize: 14, fontWeight: '400', color: 'red' }}>{item.sp.price} đ</Text>
                                        <Text style={{ fontSize: 16, fontWeight: '600', color: 'green' }}>Còn {(item.sp.postAmout - item.usedPost)} lượt</Text>
                                        {item.id != data.spId &&
                                                <View style={{ position: 'absolute', backgroundColor: '#AEB6BF', borderRadius: 10, width: '100%', height: '100%', opacity:0.8 }}></View>
                                            }
                                    </TouchableOpacity>
                            }
                            style={{ height: 200 }}
                        >
                        </FlatList>
                    </View>
                    
                    <View style={{ width: '95%', height:300,alignItems:'center', paddingVertical: 10, paddingHorizontal: 20 }}>
                        <Pressable style={{
                            width: '70%',
                            alignItems: 'center',
                            backgroundColor:isValid? 'green':'gray',
                            padding: 20,
                            marginBottom: 30,
                            borderRadius: 10,
                            
                        }}
                            onPress={() => {onSubmit()}}
                            disabled={!isValid}
                        >
                            <Text style={{color:'white',fontWeight:'700'} }>Đăng bán</Text>
                        </Pressable>
                        
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
export default New;
const styles = StyleSheet.create({
    container: {

        backgroundColor: '#ffffff',
        justifyContent: "center",
        alignItems: "center"

    },
    bottomModalView: {
        justifyContent: 'flex-end',
        margin: 0,

    },
    closeModalViewButton: {

    },
    button: {
        width: "50%",
        borderRadius: 10,
        borderWidth: 2,
        borderStyle: 'solid',
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "limegreen"
    },
    buttonText: {
        fontWeight: "bold"
    },
    modal: {
        width: "100%",
        height: "50%",

        backgroundColor: "white"
    },
    modalText: {
        fontSize: 20
    }
});

