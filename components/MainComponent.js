import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Linking } from 'react-native';
import { Icon, Image } from 'react-native-elements';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { baseUrl } from '../shared/baseUrl';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import List from './ListComponent';
import Hoteldetail from './HoteldetailComponent';
import Home from './HomeComponent';
import Contact from './ContactComponent';
import About from './AboutComponent';
import Bookmark from './BookmarkComponent';
import Login from './LoginComponent';
import Register from './RegisterComponent';

function HomeNavigatorScreen() {
    const HomeNavigator = createStackNavigator();
    return (
        <HomeNavigator.Navigator
            initialRouteName='Home'
            screenOptions={{
                headerStyle: { backgroundColor: '#3d9034' },
                headerTintColor: '#fff',
                headerTitleStyle: { color: '#fff' }
            }}>
            <HomeNavigator.Screen name='Home' component={Home} options={({ navigation }) => ({
                headerTitle: 'Home',
                headerLeft: () => (<Icon name='menu' size={36} color='#fff' onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 20 }} />)
            })} />
        </HomeNavigator.Navigator>
    );
}

function TabNavigatorScreen() {
    const TabNavigator = createBottomTabNavigator();
    return (
        <TabNavigator.Navigator initialRouteName='Login'>
            <TabNavigator.Screen name='Login' component={Login}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (<Icon name='sign-in' type='font-awesome' size={size} color={color} />)
                }} />
            <TabNavigator.Screen name='Register' component={Register}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (<Icon name='user-plus' type='font-awesome' size={size} color={color} />)
                }} />
        </TabNavigator.Navigator>
    );
}

function LoginNavigatorScreen() {
    const LoginNavigator = createStackNavigator();
    return (
        <LoginNavigator.Navigator initialRouteName='LoginRegister'
            screenOptions={{
                headerStyle: { backgroundColor: '#3d9034' },
                headerTintColor: '#fff',
                headerTitleStyle: { color: '#fff' }
            }}>
            <LoginNavigator.Screen name='LoginRegister' component={TabNavigatorScreen}
                options={({ navigation }) => ({
                    headerTitle: 'Login',
                    headerLeft: () => (<Icon name='menu' size={36} color='#fff' onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 20 }} />)
                })} />
        </LoginNavigator.Navigator>
    );
}

function BookmarkNavigatorScreen() {
    const BookmarkNavigator = createStackNavigator();
    return (
        <BookmarkNavigator.Navigator initialRouteName='Bookmark'
            screenOptions={{
                headerStyle: { backgroundColor: '#3d9034' },
                headerTintColor: '#fff',
                headerTitleStyle: { color: '#fff' }
            }}>
            <BookmarkNavigator.Screen name='Bookmark' component={Bookmark}
                options={({ navigation }) => ({
                    headerTitle: 'My Bookmarks',
                    headerLeft: () => (<Icon name='menu' size={36} color='#fff' onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 20 }} />)
                })} />
            <BookmarkNavigator.Screen name='Hoteldetail' component={Hoteldetail}
                options={{ headerTitle: 'Dish Detail' }} />
        </BookmarkNavigator.Navigator>
    );
}

function ListNavigatorScreen() {
    const ListNavigator = createStackNavigator();
    return (
        <ListNavigator.Navigator initialRouteName='List'
            screenOptions={{
                headerStyle: { backgroundColor: '#3d9034' },
                headerTintColor: '#fff',
                headerTitleStyle: { color: '#fff' }
            }}>
            <ListNavigator.Screen name='List' component={List}
                options={({ navigation }) => ({
                    headerTitle: 'List',
                    headerLeft: () => (<Icon name='menu' size={36} color='#fff' onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 20 }} />)
                })} />
            <ListNavigator.Screen name='Hoteldetail' component={Hoteldetail} options={{ headerTitle: 'Hotel Detail' }} />
        </ListNavigator.Navigator>
    );
}

function ContactNavigatorScreen() {
    const ContactNavigator = createStackNavigator();
    return (
        <ContactNavigator.Navigator
            initialRouteName='Contact'
            screenOptions={{
                headerStyle: { backgroundColor: '#3d9034' },
                headerTintColor: '#fff',
                headerTitleStyle: { color: '#fff' }
            }}>
            <ContactNavigator.Screen name='Contact' component={Contact}
                options={({ navigation }) => ({
                    headerTitle: 'Contact',
                    headerLeft: () => (<Icon name='menu' size={36} color='#fff' onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 20 }} />)
                })} />
        </ContactNavigator.Navigator>
    );
}

function AboutNavigatorScreen() {
    const AboutNavigator = createStackNavigator();
    return (
        <AboutNavigator.Navigator
            initialRouteName='About'
            screenOptions={{
                headerStyle: { backgroundColor: '#3d9034' },
                headerTintColor: '#fff',
                headerTitleStyle: { color: '#fff' }
            }}>
            <AboutNavigator.Screen name='About' component={About}
                options={({ navigation }) => ({
                    headerTitle: 'About',
                    headerLeft: () => (<Icon name='menu' size={36} color='#fff' onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 20 }} />)
                })} />
        </AboutNavigator.Navigator>
    );
}

function CustomDrawerContent(props) {
    return (
        <DrawerContentScrollView {...props}>
            <View style={{ backgroundColor: '#fff', height: 80, alignItems: 'center', flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                    <Image source={{ uri: baseUrl + 'images/user.png' }} style={{ margin: 10, width: 80, height: 60 }} />
                </View>
                <View style={{ flex: 2 }}>
                    <Text style={{ color: '#3d9034', fontSize: 22, fontWeight: 'bold', marginLeft: 20 }}>User</Text>
                </View>
            </View>
            <DrawerItemList {...props} />
            <DrawerItem label='Help'
                icon={({ focused, color, size }) => <Icon name='help' size={size} color={focused ? '#3d9034' : '#ccc'} />}
                onPress={() => Linking.openURL('https://reactnative.dev')} />
        </DrawerContentScrollView>
    );
}

function MainNavigatorScreen() {
    const MainNavigator = createDrawerNavigator();
    return (
        <MainNavigator.Navigator initialRouteName='HomeScreen' drawerContent={(props) => <CustomDrawerContent {...props} />}>
            <MainNavigator.Screen name='HomeScreen' component={HomeNavigatorScreen} options={{ title: 'Home', headerShown: false, drawerIcon: ({ focused, size }) => (<Icon name='home' size={size} color={focused ? '#3d9034' : '#ccc'} />) }} />
            <MainNavigator.Screen name='ListScreen' component={ListNavigatorScreen} options={{ title: 'List', headerShown: false, drawerIcon: ({ focused, size }) => (<Icon name='bed' size={size} color={focused ? '#3d9034' : '#ccc'} />) }} />
            <MainNavigator.Screen name='AboutScreen' component={AboutNavigatorScreen} options={{ title: 'About Us', headerShown: false, drawerIcon: ({ focused, size }) => (<Icon name='menu' size={size} color={focused ? '#3d9034' : '#ccc'} />) }} />
            <MainNavigator.Screen name='ContactScreen' component={ContactNavigatorScreen} options={{ title: 'Contact Us', headerShown: false, drawerIcon: ({ focused, size }) => (<Icon name='contacts' size={size} color={focused ? '#3d9034' : '#ccc'} />) }} />
            <MainNavigator.Screen name='BookmarkScreen' component={BookmarkNavigatorScreen} options={{ title: 'My Bookmarks', headerShown: false, drawerIcon: ({ focused, size }) => (<Icon name='bookmark' size={size} color={focused ? '#3d9034' : '#ccc'} />) }} />
            <MainNavigator.Screen name='LoginScreen' component={LoginNavigatorScreen} options={{ title: 'Login', headerShown: false, drawerIcon: ({ focused, size }) => (<Icon name='sign-in' type='font-awesome' size={size} color={focused ? '#3d9034' : '#ccc'} />) }} />
        </MainNavigator.Navigator>
    );
}

// redux
import { connect } from 'react-redux';
import { fetchLeaders, fetchHotels, fetchComments, fetchPromos } from '../redux/ActionCreators';
import autoMergeLevel1 from 'redux-persist/es/stateReconciler/autoMergeLevel1';
const mapDispatchToProps = (dispatch) => ({
    fetchLeaders: () => dispatch(fetchLeaders()),
    fetchHotels: () => dispatch(fetchHotels()),
    fetchComments: () => dispatch(fetchComments()),
    fetchPromos: () => dispatch(fetchPromos())
});

class Main extends Component {
    render() {
        return (
            <NavigationContainer>
                <MainNavigatorScreen />
            </NavigationContainer>
        );
    }

    componentDidMount() {
        // redux
        this.props.fetchLeaders();
        this.props.fetchHotels();
        this.props.fetchComments();
        this.props.fetchPromos();
    }
}

export default connect(null, mapDispatchToProps)(Main);
