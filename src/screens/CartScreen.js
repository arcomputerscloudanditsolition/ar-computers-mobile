import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { Card, Divider, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';

export default function CartScreen({ navigation }) {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = useCart();

  const gst = Math.round(cartTotal * 0.18);
  const total = cartTotal + gst;

  const handleCheckout = () => {
    Alert.alert('Place Order', `Total: ₹${total.toLocaleString()} (incl. 18% GST)\n\nProceed to checkout?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Place Order', onPress: () => { clearCart(); Alert.alert('✅ Order Placed!', 'Thank you! Your order has been placed successfully.'); } }
    ]);
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="cart-outline" size={80} color="#ccc" />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptyText}>Add products to get started</Text>
        <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate('Products')}>
          <Text style={styles.shopBtnText}>Browse Products</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <Text style={styles.headerSub}>{cartCount} items</Text>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.itemRow}>
                <Image source={{ uri: item.imageUrl }} style={styles.img} />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemBrand}>{item.brand}</Text>
                  <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                  <Text style={styles.itemPrice}>₹{item.price.toLocaleString()} each</Text>
                </View>
                <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                  <Ionicons name="trash-outline" size={20} color="#f44336" />
                </TouchableOpacity>
              </View>
              <Divider style={{ marginVertical: 10 }} />
              <View style={styles.qtyRow}>
                <Text style={styles.qtyLabel}>Quantity</Text>
                <View style={styles.qtyControl}>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.id, item.quantity - 1)}>
                    <Ionicons name="remove" size={16} color="#333" />
                  </TouchableOpacity>
                  <Text style={styles.qtyVal}>{item.quantity}</Text>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.id, item.quantity + 1)}>
                    <Ionicons name="add" size={16} color="#333" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.itemTotal}>₹{(item.price * item.quantity).toLocaleString()}</Text>
              </View>
            </Card.Content>
          </Card>
        )}
        ListFooterComponent={() => (
          <Card style={styles.summary}>
            <Card.Content>
              <Text style={styles.summaryTitle}>Order Summary</Text>
              {[['Subtotal', `₹${cartTotal.toLocaleString()}`], ['Shipping', 'FREE ✨'], ['GST (18%)', `₹${gst.toLocaleString()}`]].map(([label, val]) => (
                <View key={label} style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>{label}</Text>
                  <Text style={[styles.summaryVal, val === 'FREE ✨' && { color: '#4caf50', fontWeight: 'bold' }]}>{val}</Text>
                </View>
              ))}
              <Divider style={{ marginVertical: 10 }} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalVal}>₹{total.toLocaleString()}</Text>
              </View>
            </Card.Content>
          </Card>
        )}
      />

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.clearBtn} onPress={() => Alert.alert('Clear Cart', 'Remove all items?', [{ text: 'Cancel' }, { text: 'Clear', onPress: clearCart }])}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
          <Ionicons name="card-outline" size={18} color="#fff" />
          <Text style={styles.checkoutText}>Checkout - ₹{total.toLocaleString()}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#1a237e', padding: 20, paddingTop: 56 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#fff' },
  headerSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  list: { padding: 14 },
  card: { marginBottom: 10, elevation: 2 },
  itemRow: { flexDirection: 'row', alignItems: 'center' },
  img: { width: 80, height: 80, borderRadius: 8, backgroundColor: '#f0f0f0' },
  itemInfo: { flex: 1, marginLeft: 12 },
  itemBrand: { fontSize: 11, color: '#ff6f00', fontWeight: '700' },
  itemName: { fontSize: 14, fontWeight: 'bold', color: '#333', marginTop: 2 },
  itemPrice: { fontSize: 13, color: '#666', marginTop: 4 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  qtyLabel: { fontSize: 13, color: '#666' },
  qtyControl: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 8 },
  qtyBtn: { padding: 8, width: 32, alignItems: 'center' },
  qtyVal: { fontSize: 15, fontWeight: 'bold', paddingHorizontal: 12, borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#ddd' },
  itemTotal: { fontSize: 17, fontWeight: 'bold', color: '#1a237e' },
  summary: { marginBottom: 10, elevation: 2 },
  summaryTitle: { fontSize: 17, fontWeight: 'bold', color: '#1a237e', marginBottom: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: '#666' },
  summaryVal: { fontSize: 14, color: '#333', fontWeight: '600' },
  totalLabel: { fontSize: 17, fontWeight: 'bold', color: '#333' },
  totalVal: { fontSize: 22, fontWeight: 'bold', color: '#1a237e' },
  bottomBar: { flexDirection: 'row', padding: 14, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee' },
  clearBtn: { borderWidth: 1, borderColor: '#f44336', borderRadius: 12, paddingHorizontal: 16, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  clearText: { color: '#f44336', fontWeight: '600' },
  checkoutBtn: { flex: 1, backgroundColor: '#ff6f00', borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14 },
  checkoutText: { color: '#fff', fontWeight: 'bold', fontSize: 15, marginLeft: 6 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  emptyTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginTop: 16 },
  emptyText: { fontSize: 14, color: '#999', marginTop: 8, marginBottom: 24 },
  shopBtn: { backgroundColor: '#ff6f00', borderRadius: 12, paddingHorizontal: 30, paddingVertical: 14 },
  shopBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
