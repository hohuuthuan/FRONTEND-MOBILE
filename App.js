import 'react-native-gesture-handler';
import React, { useContext } from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native'
import MyCart from './components/screens/MyCart'
import ProductInfo from './components/screens/ProductInfo'
import Home from './components/screens/Home'
import Login from './components/screens/Login'
import Register from './components/screens/Register'
import New from './components/screens/New'
import UserProfile from './components/screens/UserProfile'
import Tabs from './navigation/tabs'
import Chat from './components/screens/Chat'
import Unauthorized from './components/screens/Unauthorized'
import EPay from './components/screens/EPay'
import SettingProfile from './components/screens/SettingProfile'
import UpdateProduct from './components/screens/UpdateProduct'
import { AuthProvider, AuthContext } from './context/AuthContext'
const Stack = createStackNavigator();

const App = () => {
    //const {username }=useContext(AuthContext);

    return (
        <AuthProvider>
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: true
                    }}
                    initialRouteName={'HomeScreen'}
                >
                    <Stack.Screen name="HomeSreen" component={Tabs} options={{headerShown: false}} />
                    <Stack.Screen name="MyCart" component={MyCart} />
                    <Stack.Screen name="ProductInfo" component={ProductInfo} options={{ headerTitle: "Chi tiết bài đăng" }} />
                    <Stack.Screen name="New" component={New} />
                    <Stack.Screen name="Login" component={Login} options={{ headerTitle: "Đăng nhập" }} />
                    <Stack.Screen name="Register" component={Register} options={{ headerTitle: "Đăng ký" }} />
                    <Stack.Screen name="Chat" component={Chat} />
                    <Stack.Screen name="UserProfile" component={UserProfile} options={{ headerTitle: "Xem trang" }} />
                    <Stack.Screen name="Unauthorized" component={Unauthorized} />
                    <Stack.Screen name="EPay" component={EPay} options={{ headerTitle: "Ví điện tử" }} />
                    <Stack.Screen name="SettingProfile" component={SettingProfile} options={{ headerTitle: "Chỉnh sửa thông tin" }} />
                    <Stack.Screen name="UpdateProduct" component={UpdateProduct} options={{ headerTitle: "Chỉnh sửa bài đăng" }} />
                </Stack.Navigator>
            </NavigationContainer>
        </AuthProvider>
    );
}

export default App;