import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ProductProvider } from './src/context/ProductContext';
import { CartProvider } from './src/context/CartContext';

import HomeScreen from './src/screens/HomeScreen';
import ProductsScreen from './src/screens/ProductsScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import CartScreen from './src/screens/CartScreen';
import ImportScreen from './src/screens/ImportScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1a237e',
    accent: '#ff6f00',
    background: '#f5f5f5',
    surface: '#ffffff',
    text: '#212121',
  },
};

function ProductsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#1a237e' }, headerTintColor: '#fff' }}>
      <Stack.Screen name="ProductsList" component={ProductsScreen} options={{ title: 'All Products' }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Product Details' }} />
    </Stack.Navigator>
  );
}

function CategoriesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#1a237e' }, headerTintColor: '#fff' }}>
      <Stack.Screen name="CategoriesList" component={CategoriesScreen} options={{ title: 'Categories' }} />
      <Stack.Screen name="ProductsList" component={ProductsScreen} options={({ route }) => ({ title: route.params?.category || 'Products' })} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Product Details' }} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Home: focused ? 'home' : 'home-outline',
            Products: focused ? 'cube' : 'cube-outline',
            Categories: focused ? 'grid' : 'grid-outline',
            Cart: focused ? 'cart' : 'cart-outline',
            Import: focused ? 'cloud-upload' : 'cloud-upload-outline',
            Profile: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#ff6f00',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Categories" component={CategoriesStack} />
      <Tab.Screen name="Products" component={ProductsStack} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Import" component={ImportScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <ProductProvider>
          <CartProvider>
            <NavigationContainer>
              <StatusBar style="light" />
              <MainTabs />
            </NavigationContainer>
            <Toast />
          </CartProvider>
        </ProductProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
