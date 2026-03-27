import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, FlatList } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { products, categories } = useProducts();
  const { cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');

  const featuredProducts = products.slice(0, 6);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate('Products', { screen: 'ProductsList', params: { searchQuery } });
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <Text style={styles.logoAR}>AR</Text>
          </View>
          <View style={styles.logoText}>
            <Text style={styles.logoMain}>COMPUTERS</Text>
            <Text style={styles.logoSub}>Cloud & IT Solutions</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.cartBtn} onPress={() => navigation.navigate('Cart')}>
          <Ionicons name="cart-outline" size={28} color="#fff" />
          {cartCount > 0 && (
            <View style={styles.badge}><Text style={styles.badgeText}>{cartCount}</Text></View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Searchbar placeholder="Search laptops, CCTV, parts..." onChangeText={setSearchQuery} value={searchQuery} onSubmitEditing={handleSearch} style={styles.search} iconColor="#ff6f00" />
      </View>

      {/* Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerLeft}>
          <Text style={styles.bannerTitle}>1000+ Products</Text>
          <Text style={styles.bannerSub}>Laptops • CCTV • Networking • Parts</Text>
          <TouchableOpacity style={styles.bannerBtn} onPress={() => navigation.navigate('Products')}>
            <Text style={styles.bannerBtnText}>Shop Now</Text>
          </TouchableOpacity>
        </View>
        <Ionicons name="cloud-done" size={70} color="rgba(255,255,255,0.15)" />
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={i => i.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.catCard} onPress={() => navigation.navigate('Categories', { screen: 'ProductsList', params: { category: item.name } })}>
              <View style={styles.catIcon}><Ionicons name={item.icon} size={30} color="#ff6f00" /></View>
              <Text style={styles.catName}>{item.name}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingRight: 10 }}
        />
      </View>

      {/* Featured */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Products')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={featuredProducts}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={i => i.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.prodCard} onPress={() => navigation.navigate('Products', { screen: 'ProductDetail', params: { product: item } })}>
              <Image source={{ uri: item.imageUrl }} style={styles.prodImg} resizeMode="cover" />
              <View style={styles.prodInfo}>
                <Text style={styles.prodBrand}>{item.brand}</Text>
                <Text style={styles.prodName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.prodPrice}>₹{item.price.toLocaleString()}</Text>
                {item.stock < 10 && <Text style={styles.lowStock}>Only {item.stock} left!</Text>}
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingRight: 10 }}
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          {[
            { icon: 'cloud-upload', label: 'Import', action: () => navigation.navigate('Import') },
            { icon: 'call', label: 'Call Us', action: () => {} },
            { icon: 'location', label: 'Store', action: () => {} },
            { icon: 'share-social', label: 'Share', action: () => {} },
          ].map((a, idx) => (
            <TouchableOpacity key={idx} style={styles.actionCard} onPress={a.action}>
              <Ionicons name={a.icon} size={28} color="#1a237e" />
              <Text style={styles.actionLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Business Info */}
      <View style={[styles.section, { marginBottom: 30 }]}>
        <View style={styles.infoCard}>
          <Ionicons name="business" size={24} color="#ff6f00" />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.infoTitle}>AR Computers</Text>
            <Text style={styles.infoSub}>📞 +91 98765 43210</Text>
            <Text style={styles.infoSub}>✉️ info@arcomputers.com</Text>
            <Text style={styles.infoSub}>🕐 Mon-Sat: 10AM - 8PM</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#1a237e', paddingTop: 50, paddingHorizontal: 16, paddingBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  logoBox: { backgroundColor: '#ff6f00', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  logoAR: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  logoText: { marginLeft: 10 },
  logoMain: { fontSize: 18, fontWeight: 'bold', color: '#fff', letterSpacing: 1 },
  logoSub: { fontSize: 10, color: '#ffcc80', marginTop: 1 },
  cartBtn: { padding: 8, position: 'relative' },
  badge: { position: 'absolute', top: 0, right: 0, backgroundColor: '#ff6f00', borderRadius: 10, minWidth: 18, height: 18, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  searchWrap: { backgroundColor: '#1a237e', paddingHorizontal: 14, paddingBottom: 14 },
  search: { borderRadius: 10, elevation: 0 },
  banner: { backgroundColor: '#1a237e', margin: 14, borderRadius: 14, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  bannerLeft: { flex: 1 },
  bannerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  bannerSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 4, marginBottom: 14 },
  bannerBtn: { backgroundColor: '#ff6f00', borderRadius: 8, paddingHorizontal: 18, paddingVertical: 8, alignSelf: 'flex-start' },
  bannerBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  section: { marginTop: 16, paddingHorizontal: 14 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1a237e', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  seeAll: { color: '#ff6f00', fontWeight: '600' },
  catCard: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginRight: 10, alignItems: 'center', width: 90, elevation: 2 },
  catIcon: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#fff3e0', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  catName: { fontSize: 11, fontWeight: '600', color: '#333', textAlign: 'center' },
  prodCard: { backgroundColor: '#fff', borderRadius: 12, marginRight: 14, width: 160, elevation: 2, overflow: 'hidden' },
  prodImg: { width: '100%', height: 120, backgroundColor: '#f0f0f0' },
  prodInfo: { padding: 10 },
  prodBrand: { fontSize: 11, color: '#ff6f00', fontWeight: '600' },
  prodName: { fontSize: 13, fontWeight: 'bold', color: '#333', marginTop: 2, height: 36 },
  prodPrice: { fontSize: 16, fontWeight: 'bold', color: '#1a237e', marginTop: 4 },
  lowStock: { fontSize: 11, color: '#f44336', marginTop: 2, fontWeight: '600' },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  actionCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', width: (width - 60) / 4, elevation: 2 },
  actionLabel: { marginTop: 6, fontSize: 11, color: '#333', fontWeight: '600' },
  infoCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', elevation: 2 },
  infoTitle: { fontSize: 16, fontWeight: 'bold', color: '#1a237e', marginBottom: 4 },
  infoSub: { fontSize: 12, color: '#555', marginTop: 2 },
});
