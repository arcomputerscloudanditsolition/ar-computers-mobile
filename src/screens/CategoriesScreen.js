import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProducts } from '../context/ProductContext';

export default function CategoriesScreen({ navigation }) {
  const { categories, products } = useProducts();

  const getCount = (cat) => {
    return products.filter(p => cat.subcategories.includes(p.category)).length;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Browse Categories</Text>
        <Text style={styles.subtitle}>Find exactly what you need</Text>
      </View>
      <FlatList
        data={categories}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ProductsList', { category: item.name })}>
            <View style={styles.iconWrap}>
              <Ionicons name={item.icon} size={36} color="#ff6f00" />
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.count}>{getCount(item)} products</Text>
              <Text style={styles.subs} numberOfLines={1}>{item.subcategories.slice(0, 4).join(' • ')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#ccc" />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#1a237e', padding: 20, paddingTop: 56 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  list: { padding: 14 },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 18, marginBottom: 12, flexDirection: 'row', alignItems: 'center', elevation: 2 },
  iconWrap: { width: 66, height: 66, borderRadius: 33, backgroundColor: '#fff3e0', justifyContent: 'center', alignItems: 'center' },
  info: { flex: 1, marginLeft: 14 },
  name: { fontSize: 17, fontWeight: 'bold', color: '#1a237e' },
  count: { fontSize: 13, color: '#ff6f00', marginTop: 3, fontWeight: '600' },
  subs: { fontSize: 11, color: '#999', marginTop: 3 },
});
