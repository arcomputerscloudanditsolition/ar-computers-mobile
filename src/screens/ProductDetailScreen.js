import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Button, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import Toast from 'react-native-toast-message';

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, qty);
    Toast.show({ type: 'success', text1: '✅ Added to Cart!', text2: `${qty}x ${product.name}`, visibilityTime: 2500 });
  };

  const gst = Math.round(product.price * 0.18);
  const totalWithGst = product.price + gst;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: product.imageUrl }} style={styles.image} resizeMode="cover" />

        <View style={styles.body}>
          <View style={styles.topRow}>
            <Text style={styles.category}>{product.category}</Text>
            <TouchableOpacity onPress={() => inWishlist ? removeFromWishlist(product.id) : addToWishlist(product)}>
              <Ionicons name={inWishlist ? 'heart' : 'heart-outline'} size={26} color={inWishlist ? '#e91e63' : '#ccc'} />
            </TouchableOpacity>
          </View>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.model}>Model: {product.model}</Text>

          <View style={styles.priceCard}>
            <Text style={styles.price}>₹{product.price.toLocaleString()}</Text>
            <Text style={styles.gstNote}>+₹{gst.toLocaleString()} GST (18%) = ₹{totalWithGst.toLocaleString()}</Text>
          </View>

          <View style={[styles.stockBadge, { backgroundColor: product.stock < 5 ? '#ffebee' : product.stock < 10 ? '#fff3e0' : '#e8f5e9' }]}>
            <Ionicons name={product.stock < 5 ? 'alert-circle' : 'checkmark-circle'} size={16} color={product.stock < 5 ? '#f44336' : product.stock < 10 ? '#ff9800' : '#4caf50'} />
            <Text style={[styles.stockText, { color: product.stock < 5 ? '#f44336' : product.stock < 10 ? '#ff9800' : '#4caf50' }]}>
              {product.stock < 5 ? `Only ${product.stock} left - Order Now!` : product.stock < 10 ? `${product.stock} units in stock` : `In Stock (${product.stock} units)`}
            </Text>
          </View>

          <View style={styles.qtyRow}>
            <Text style={styles.qtyLabel}>Quantity:</Text>
            <View style={styles.qtyControl}>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(Math.max(1, qty - 1))}>
                <Ionicons name="remove" size={18} color="#333" />
              </TouchableOpacity>
              <Text style={styles.qtyVal}>{qty}</Text>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(Math.min(product.stock, qty + 1))}>
                <Ionicons name="add" size={18} color="#333" />
              </TouchableOpacity>
            </View>
            <Text style={styles.qtyTotal}>₹{(product.price * qty).toLocaleString()}</Text>
          </View>

          <Divider style={{ marginVertical: 16 }} />

          {/* Tabs */}
          <View style={styles.tabs}>
            {['description', 'specifications'].map(tab => (
              <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.activeTab]} onPress={() => setActiveTab(tab)}>
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab === 'description' ? 'Description' : 'Specifications'}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {activeTab === 'description' ? (
            <Text style={styles.description}>{product.description}</Text>
          ) : (
            <View>
              {product.specifications && Object.entries(product.specifications).map(([key, val]) => (
                <View key={key} style={styles.specRow}>
                  <Text style={styles.specKey}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                  <Text style={styles.specVal}>{val}</Text>
                </View>
              ))}
              {!product.specifications && <Text style={styles.description}>No specifications available.</Text>}
            </View>
          )}

          <View style={{ height: 20 }} />
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.wishBtn} onPress={() => inWishlist ? removeFromWishlist(product.id) : addToWishlist(product)}>
          <Ionicons name={inWishlist ? 'heart' : 'heart-outline'} size={22} color={inWishlist ? '#e91e63' : '#666'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.cartBarBtn} onPress={handleAddToCart}>
          <Ionicons name="cart-outline" size={20} color="#fff" />
          <Text style={styles.cartBarText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyBtn} onPress={() => { addToCart(product, qty); navigation.navigate('Cart'); }}>
          <Text style={styles.buyBtnText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  image: { width: '100%', height: 280, backgroundColor: '#f0f0f0' },
  body: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: -20, padding: 16 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  category: { backgroundColor: '#fff3e0', color: '#ff6f00', fontWeight: '700', fontSize: 12, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  brand: { fontSize: 14, color: '#1a237e', fontWeight: '700', marginTop: 10 },
  name: { fontSize: 20, fontWeight: 'bold', color: '#222', marginTop: 4 },
  model: { fontSize: 13, color: '#888', marginTop: 4 },
  priceCard: { backgroundColor: '#e8eaf6', borderRadius: 10, padding: 12, marginTop: 14 },
  price: { fontSize: 28, fontWeight: 'bold', color: '#1a237e' },
  gstNote: { fontSize: 12, color: '#555', marginTop: 4 },
  stockBadge: { flexDirection: 'row', alignItems: 'center', borderRadius: 8, padding: 8, marginTop: 12 },
  stockText: { marginLeft: 6, fontSize: 13, fontWeight: '600' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, backgroundColor: '#f9f9f9', borderRadius: 10, padding: 12 },
  qtyLabel: { fontSize: 14, color: '#555' },
  qtyControl: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 8 },
  qtyBtn: { padding: 8, width: 34, alignItems: 'center' },
  qtyVal: { fontSize: 16, fontWeight: 'bold', paddingHorizontal: 14, borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#ddd' },
  qtyTotal: { fontSize: 18, fontWeight: 'bold', color: '#1a237e' },
  tabs: { flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: '#eee', marginBottom: 12 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#ff6f00' },
  tabText: { fontSize: 14, color: '#999' },
  activeTabText: { color: '#ff6f00', fontWeight: 'bold' },
  description: { fontSize: 14, color: '#555', lineHeight: 22 },
  specRow: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  specKey: { flex: 1, fontSize: 13, color: '#666', fontWeight: '600' },
  specVal: { flex: 2, fontSize: 13, color: '#333' },
  bottomBar: { flexDirection: 'row', padding: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee' },
  wishBtn: { width: 46, height: 46, borderRadius: 23, borderWidth: 1, borderColor: '#ddd', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  cartBarBtn: { flex: 1, flexDirection: 'row', backgroundColor: '#1a237e', borderRadius: 12, justifyContent: 'center', alignItems: 'center', paddingVertical: 12, marginRight: 8 },
  cartBarText: { color: '#fff', fontWeight: 'bold', marginLeft: 6, fontSize: 14 },
  buyBtn: { flex: 1, backgroundColor: '#ff6f00', borderRadius: 12, justifyContent: 'center', alignItems: 'center', paddingVertical: 12 },
  buyBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});
