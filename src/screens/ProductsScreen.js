import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Searchbar, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import Toast from 'react-native-toast-message';

export default function ProductsScreen({ navigation, route }) {
  const { products, categories, searchProducts, getProductsByCategory } = useProducts();
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState(route.params?.searchQuery || '');
  const [selectedCategory, setSelectedCategory] = useState(route.params?.category || null);
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    if (route.params?.category) setSelectedCategory(route.params.category);
    if (route.params?.searchQuery) setSearchQuery(route.params.searchQuery);
  }, [route.params]);

  let filteredProducts = selectedCategory ? getProductsByCategory(selectedCategory) : products;
  if (searchQuery.trim()) filteredProducts = searchProducts(searchQuery);

  filteredProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return a.name.localeCompare(b.name);
  });

  const allCats = ['All', ...categories.map(c => c.name)];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ProductDetail', { product: item })}>
      <Image source={{ uri: item.imageUrl }} style={styles.img} />
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.cat}>{item.category}</Text>
          <Text style={styles.stock}>Stock: {item.stock}</Text>
        </View>
        <Text style={styles.brand}>{item.brand}</Text>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.model} numberOfLines={1}>{item.model}</Text>
        <View style={styles.footer}>
          <Text style={styles.price}>₹{item.price.toLocaleString()}</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => { addToCart(item); Toast.show({ type: 'success', text1: 'Added to cart!', text2: item.name, visibilityTime: 2000 }); }}>
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchWrap}>
        <Searchbar placeholder="Search products..." onChangeText={setSearchQuery} value={searchQuery} style={styles.search} />
      </View>
      <View style={styles.filterWrap}>
        <FlatList data={allCats} horizontal showsHorizontalScrollIndicator={false} keyExtractor={i => i}
          renderItem={({ item }) => (
            <Chip selected={selectedCategory === item || (item === 'All' && !selectedCategory)} onPress={() => setSelectedCategory(item === 'All' ? null : item)} style={styles.chip} selectedColor="#ff6f00">{item}</Chip>
          )}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        />
      </View>
      <View style={styles.toolbar}>
        <Text style={styles.count}>{filteredProducts.length} products</Text>
        <View style={styles.sortRow}>
          {[['name', 'Name'], ['price-low', 'Price ↑'], ['price-high', 'Price ↓']].map(([val, label]) => (
            <TouchableOpacity key={val} style={[styles.sortBtn, sortBy === val && styles.sortBtnActive]} onPress={() => setSortBy(val)}>
              <Text style={[styles.sortText, sortBy === val && styles.sortTextActive]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <FlatList data={filteredProducts} renderItem={renderItem} keyExtractor={i => i.id} contentContainerStyle={styles.list}
        ListEmptyComponent={<View style={styles.empty}><Ionicons name="search" size={60} color="#ccc" /><Text style={styles.emptyText}>No products found</Text></View>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  searchWrap: { padding: 10, backgroundColor: '#fff' },
  search: { elevation: 0, backgroundColor: '#f0f0f0' },
  filterWrap: { backgroundColor: '#fff', paddingVertical: 8 },
  chip: { marginRight: 8, backgroundColor: '#f0f0f0' },
  toolbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee' },
  count: { color: '#666', fontSize: 13 },
  sortRow: { flexDirection: 'row' },
  sortBtn: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginLeft: 4, backgroundColor: '#f0f0f0' },
  sortBtnActive: { backgroundColor: '#1a237e' },
  sortText: { fontSize: 12, color: '#555' },
  sortTextActive: { color: '#fff', fontWeight: '600' },
  list: { padding: 10 },
  card: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 10, flexDirection: 'row', overflow: 'hidden', elevation: 2 },
  img: { width: 120, height: 120, backgroundColor: '#f0f0f0' },
  content: { flex: 1, padding: 12, justifyContent: 'space-between' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  cat: { fontSize: 11, color: '#ff6f00', fontWeight: '700', backgroundColor: '#fff3e0', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  stock: { fontSize: 11, color: '#666' },
  brand: { fontSize: 12, color: '#1a237e', fontWeight: '700', marginTop: 4 },
  name: { fontSize: 14, fontWeight: 'bold', color: '#333', marginTop: 2 },
  model: { fontSize: 11, color: '#999', marginTop: 2 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  price: { fontSize: 18, fontWeight: 'bold', color: '#1a237e' },
  addBtn: { backgroundColor: '#ff6f00', width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center' },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyText: { marginTop: 12, fontSize: 16, color: '#999' },
});
