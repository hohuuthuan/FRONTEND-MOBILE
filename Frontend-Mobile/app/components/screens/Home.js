import React, { useState, useRef,useContext, useEffect } from 'react';
import {
    SafeAreaView, ScrollView, View, Animated, StyleSheet,
    StatusBar,
    TouchableOpacity,
    Image, FlatList, ActivityIndicator
} from 'react-native';
import { SharedElement } from 'react-navigation-shared-element'
import { Surface, Text } from 'react-native-paper'
import { COLOURS, Items } from '../database/Database';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SweetAlert from 'react-native-sweet-alert';
import AppHeader from './MyHeader';
import Colors from "../../constants/Colors"
import { images } from "../../constants"
import { AuthContext } from '../../context/AuthContext';
import { API_URL,UPLOAD_IMAGES_URL, API_TOKEN } from "@env"
//import { Item } from 'react-native-paper/lib/typescript/src/components/List/List';
const Home = ({ navigation }) => {
    const scrollY = useRef(new Animated.Value(0)).current;
    const offsetAnim = useRef(new Animated.Value(0)).current;
    const [focused, setFocused] = useState('home');
    const [isLoadIcon, SetIsLoadIcon] = useState(false);
    const { user, fomatTime } = useContext(AuthContext);
    const [data, setData] = useState([])
    const [pro, setPro] = useState([]);
    const [searchProducts, setSearchProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([])
    const [searchMode, setSearchMode] = useState(false)
    const [products, setProducts] = useState([]);
    const scrollOffsetY = useRef(new Animated.Value(0)).current;
    const [page, setPage] = useState(1);
    const [pageTotal, setPageTotal] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [searchData, setSearchData] = useState({
            keyWord: "",
            categoryId: 0,
            brandId:0
    })
    const [searchState, setSearchState] = useState({
        keyWord: "",
        categoryName: "",
        brandName: ""
    })
    const handleOnChange = (id,id_value,name,name_value) => {
        if (searchData[id] == id_value) {
            setSearchData((preve) => {
                return {
                    ...preve,
                    [id]:id=='keyWord'?'': 0
                }
            })
            setSearchState((preve) => {
                return {
                    ...preve,
                    [name]: ""
                }
            })
        } else {
            setSearchData((preve) => {
                return {
                    ...preve,
                    [id]: id_value
                }
            })
            setSearchState((preve) => {
                return {
                    ...preve,
                    [name]: name_value
                }
            })
        }
    }
    const clear = () => {
        setSearchData({
            keyWord: "",
            categoryId: 0,
            brandId: 0
        });
        setSearchState({
            keyWord: "",
            categoryName: "",
            brandName: ""
        })
        setPage(1);
    }
    const getSearchDataFromDB = async (pageNumber) => {
        SetIsLoadIcon(true)
        const res = await fetch(`${API_URL}/api/Search?page=${pageNumber}&size=4`, {
                method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(searchData)
            })
        const da = await res.json();
        setSearchProducts(searchProducts.concat(da.productList));
        setPageTotal(da.pager.totalPages)
        setTotalItems(da.pager.totalItems);
        SetIsLoadIcon(false)
    };
    const getDataFromDB = async (pageNumber) => {
        SetIsLoadIcon(true)
        const res = await fetch(`${API_URL}/api/Product/getAll?page=${pageNumber}&size=4`)
        const da = await res.json();
        setPro(pro.concat(da.productList));
        setPageTotal(da.pager.totalPages)
        setTotalItems(da.pager.totalItems);
        SetIsLoadIcon(false)
    };
    useEffect(() => {
        (async () => {
            SetIsLoadIcon(true)
            const res = await fetch(`${API_URL}/api/Search?page=1&size=4`, {
                method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(searchData)
            })
            const da = await res.json();
            //console.log(da)
            setSearchProducts(da.productList);
            console.log('TOTAL' + da.pager.totalPages)
            setPageTotal(da.pager.totalPages)
            setTotalItems(da.pager.totalItems);
            setPage(1)
            SetIsLoadIcon(false)
            

        }
        )()
    }, [searchData]);
    useEffect(() => {
        if (searchData.brandId > 0 || searchData.categoryId > 0 || searchData.keyWord != "") {
            setSearchMode(true);
        } else {
            setSearchMode(false);
            getDataFromDB(1)
        }
    }, [searchData]);
    useEffect(() => {
        if (searchMode) {
            setPro([])
        }
    }, [searchMode]);
    useEffect(() => {
        if (searchMode) {
            if(page>1)
            getSearchDataFromDB(page)
        } else {
            if (page > 1)
            getDataFromDB(page)
        }
        console.log('page'+page)
    }, [page]);
    useEffect(() => {
        (async () => {
            const res = await fetch(`${API_URL}/api/Brand/getAll`)
            const da = await res.json();
            //console.log(da)
            setBrands(da)
        }
        )()
    }, []);

    useEffect(() => {
        (async () => {
            const res = await fetch(`${API_URL}/api/Category/getAll`)
            const da = await res.json();
            //console.log(da)
            setCategories(da)
        }
        )()
    }, []);
    //Animated Header
    const clampedScroll = Animated.diffClamp(
        Animated.add(
            scrollY.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
                extrapolateLeft: 'clamp',
            }),
            offsetAnim,
        ),
        0,
        CONTAINER_HEIGHT
    )
    var _clampedScrollValue = 0;
    var _offsetValue = 0;
    var _scrollValue = 0;
    useEffect(() => {
        scrollY.addListener(({ value }) => {
            const diff = value - _scrollValue;
            _scrollValue = value;
            _clampedScrollValue = Math.min(
                Math.max(_clampedScrollValue + diff, 0),
                CONTAINER_HEIGHT,
            )
        });
        offsetAnim.addListener(({ value }) => {
            _offsetValue = value;
        })
    }, []);

    var scrollEndTimer = null;
    const onMomentumScrollBegin = () => {
        clearTimeout(scrollEndTimer)
    }
    const onMomentumScrollEnd = () => {
        const toValue = _scrollValue > CONTAINER_HEIGHT &&
            _clampedScrollValue > (CONTAINER_HEIGHT) / 2
            ? _offsetValue + CONTAINER_HEIGHT : _offsetValue - CONTAINER_HEIGHT;

        Animated.timing(offsetAnim, {
            toValue,
            duration: 500,
            useNativeDriver: true,
        }).start();


    }
    const onScrollEndDrag = () => {
        scrollEndTimer = setTimeout(onMomentumScrollEnd, 250);

    }

    const headerTranslate = clampedScroll.interpolate({
        inputRange: [0, CONTAINER_HEIGHT],
        outputRange: [0, -CONTAINER_HEIGHT],
        extrapolate: 'clamp',
    })
    const opacity = clampedScroll.interpolate({
        inputRange: [0, CONTAINER_HEIGHT - 20, CONTAINER_HEIGHT],
        outputRange: [1, 0.05, 0],
        extrapolate: 'clamp',
    })
    const bottomTabTranslate = clampedScroll.interpolate({
        inputRange: [0, CONTAINER_HEIGHT],
        outputRange: [0, CONTAINER_HEIGHT * 2],
        extrapolate: 'clamp',
    })
    //Animated Header

    
    


    
    useEffect(() => {
        console.log(products.length)
    }, [products]);
    //create an product reusable card

    const ProductCard = ({ data }) => {
        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('ProductInfo', { productID: data.id })}
                style={{
                    width: '48%',
                    marginVertical: 3,
                    paddingBottom: 8,
                    borderRadius: 5,
                    backgroundColor: '#ffffff',
                    height: 300
                }}>
                <View
                    style={{
                        width: '100%',
                        height: 100,


                        position: 'relative',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 8,

                    }}>
                    <Image
                        source={{ uri: UPLOAD_IMAGES_URL + (data.images.length>0?data.images[0].url :'ok_b7poza')+'.png'}}
                        style={{
                            width: '80%',
                            height: '80%',
                            resizeMode: 'contain',
                        }}
                    />
                </View>
                <View style={{ height: '25%', justifyContent: 'center', paddingHorizontal: 10, }}>
                    <Text
                        style={{
                            fontSize: 12,
                            color: COLOURS.black,
                            fontWeight: '600',
                            marginBottom: 2,
                        }}>
                        {data.name}
                    </Text>
                    <Text></Text>
                </View>
                {/*{*/}
                {/*    data.isAvailable ? (*/}
                {/*        <View*/}
                {/*            style={{*/}
                {/*                flexDirection: 'row',*/}
                {/*                alignItems: 'center',*/}
                {/*                paddingHorizontal: 10*/}
                {/*            }}>*/}
                {/*            <FontAwesome*/}
                {/*                name="circle"*/}
                {/*                style={{*/}
                {/*                    fontSize: 12,*/}
                {/*                    marginRight: 6,*/}
                {/*                    color: COLOURS.green,*/}
                {/*                }}*/}
                {/*            />*/}
                {/*            <Text*/}
                {/*                style={{*/}
                {/*                    fontSize: 12,*/}
                {/*                    color: COLOURS.green,*/}
                {/*                }}>*/}
                {/*                Còn hàng*/}
                {/*            </Text>*/}
                {/*        </View>*/}
                {/*    ) : (*/}
                {/*        <View*/}
                {/*            style={{*/}
                {/*                flexDirection: 'row',*/}
                {/*                alignItems: 'center',*/}
                {/*                padding: 10*/}
                {/*            }}>*/}
                {/*            <FontAwesome*/}
                {/*                name="circle"*/}
                {/*                style={{*/}
                {/*                    fontSize: 12,*/}
                {/*                    marginRight: 6,*/}
                {/*                    color: COLOURS.red,*/}
                {/*                }}*/}
                {/*            />*/}
                {/*            <Text*/}
                {/*                style={{*/}
                {/*                    fontSize: 12,*/}
                {/*                    color: COLOURS.red,*/}
                {/*                }}>*/}
                {/*                Hết hàng*/}
                {/*            </Text>*/}
                {/*        </View>*/}
                {/*    )}*/}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 10
                    }}
                >
                    <Text
                        style={{
                            fontSize: 16,
                            color: COLOURS.red,
                        }}
                    >{data.price.toLocaleString()} đ</Text>

                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        padding: 10
                    }}
                >
                    < MaterialCommunityIcons
                        name="clock-outline"
                        style={{
                            fontSize: 20,
                            marginRight: 6,
                            color: COLOURS.green,
                        }}
                    />
                    <Text
                        style={{
                            fontSize: 12,
                            color: COLOURS.green,
                        }}>
                        {fomatTime(data.createdDate)}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };
    const isLoad = (e) => {
        const scrollPosition = e.nativeEvent.contentOffset.y;
        const scrollViewHeight = e.nativeEvent.layoutMeasurement.height;
        const contentHeight = e.nativeEvent.contentSize.height;
        const isBot = scrollPosition + scrollViewHeight;
        if (isBot >= (contentHeight - 80)) {
            //console.log('load: '+i);
            if (page <=pageTotal-1) {
                //getDataFromDB(i + 1);
                setPage(page + 1);
            }
        }
    }
    return (
        <View style={styles.container}
        >
            <Animated.ScrollView
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                onMomentumScrollBegin={onMomentumScrollBegin}
                onMomentumScrollEnd={(e) => { onMomentumScrollEnd, isLoad(e) }}
                onScrollEndDrag={onScrollEndDrag}

                scrollEventThrottle={1}
            >
                <View style={{ height: 135, borderTopWidth: 1, paddingVertical: 10, borderColor: '#ddd', borderBottomWidth: 1, marginTop: 80, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 14, fontWeight: '500' }}>Khám phá danh mục</Text>
                    <FlatList
                        data={categories}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={item => item.name}
                        renderItem={
                            ({ item }) =>
                                <TouchableOpacity onPress={() => { handleOnChange('categoryId', item.id,'categoryName', item.name)}} style={{ alignItems: 'center', justifyContent: 'center', width: 90, height: 80,padding:5, margin: 10,borderColor:'green',borderRadius:10, borderWidth:item.id==searchData.categoryId?1:0 }}>
                                    <Image style={{ resizeMode: 'stretch', marginBottom: 5, width: 40, height: 40 }} source={{ uri: item.imageUrl }} />
                                    <Text style={{ fontSize: 8 }}>{item.name}</Text>
                                </TouchableOpacity>
                        }
                    >
                    </FlatList>
                </View>
                <FlatList
                    data={brands}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={item => item.id}
                    renderItem={
                        ({ item }) =>
                            <TouchableOpacity onPress={() => { handleOnChange('brandId', item.id,'brandName', item.name)}}
                                style={{ width: 100, alignItems: 'center', justifyContent: 'center', padding: 10, marginRight: 20, borderColor: 'orange',borderRadius:10, borderWidth: item.id == searchData.brandId ? 1 : 0 }}>
                                <Image source={{ uri: item.imageUrl }} style={{ height: 40, width: 40, resizeMode: 'stretch', borderRadius: 20 }} />
           
                            </TouchableOpacity>
                    }
                >
                </FlatList>
                <View style={{ height: 10, backgroundColor: '#ddd' }}></View>
                <StatusBar backgroundColor={COLOURS.white} barStyle="dark-content" />
                
                {searchMode ?
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: 10
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                            {searchState.categoryName != "" &&
                                <View style={{ padding: 5, backgroundColor: 'orange', marginRight: 10 }}>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            color: 'white',
                                            fontWeight: '500',
                                            letterSpacing: 1,
                                        }}>
                                        {searchState.categoryName}
                                    </Text>
                                </View>
                            }
                            {searchState.brandName != "" &&
                                <View style={{ padding: 5, backgroundColor: 'orange', marginRight: 10 }}>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            color: 'white',
                                            fontWeight: '500',
                                            letterSpacing: 1,
                                        }}>
                                        {searchState.brandName}
                                    </Text>
                                </View>
                            }
                            {searchState.keyWord !== "" &&
                                <View style={{ padding: 5, backgroundColor: 'orange', marginRight: 10 }}>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            color: 'white',
                                            fontWeight: '500',
                                            letterSpacing: 1,
                                        }}>
                                        {searchState.keyWord}
                                    </Text>
                                </View>
                            }
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: COLOURS.black,
                                    fontWeight: '400',
                                    opacity: 0.5,
                                    marginLeft: 10,
                                }}>
                                {totalItems} kết quả
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => clear()}>
                            <Ionicons name="close-circle-outline" size={24} color="red" />
                        </TouchableOpacity>
                    </View> :
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: 10
                        }}>
                        <Text>Tin mới đăng</Text>
                    </View>
                }
                <View
                    style={{
                        padding: 4,
                        backgroundColor: '#ddd'
                    }}>



                    <View
                        style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'space-around',

                        }}>
                        {searchMode ? (
                            searchProducts.length>0?
                            [...searchProducts]
                                .map((data, index) => {
                                    return <ProductCard data={data} key={index} />;
                                }) : <Text>Không tìm thấy kết quả</Text>
                        ) : (pro.length>0?
                            [...pro]
                            .map((data,index) => {
                            return <ProductCard data={data} key={index} />;
                            }):<Text>Không tìm thấy kết quả</Text>
                        )
                        }
                    </View>
                    {isLoadIcon ?
                        <ActivityIndicator size='large' color='black' /> : null
                    }
                </View>

            </Animated.ScrollView>
            <Animated.View style={[styles.view, { top: 15, transform: [{ translateY: headerTranslate }] }]}>
                <AppHeader
                    menu
                    title={"home"}
                    right="search"
                    onSubmit={handleOnChange }
                    value={searchState.keyWord}
                    style={[styles.header, { opacity }]}
                />
            </Animated.View>
            {/*<Animated.View style={[styles.view, { bottom: 0, transform: [{ translateY: bottomTabTranslate }] }]}>*/}
            {/*    <Surface style={[styles.rowContainer, styles.bottomBar]}>*/}
            {/*        <BottomTab navigation={navigation} />*/}
            {/*    </Surface>*/}
            {/*</Animated.View>*/}

        </View>
    )

};

const CONTAINER_HEIGHT = 50;
export default Home;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        bottom: 30,
        top: 10,
        backgroundColor: '#ffffff',
        paddingBottom: 70
    },
    view: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 10,
        height: CONTAINER_HEIGHT,
    },
    header: {
        borderRadius: 10,
        marginHorizontal: 7,

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
})