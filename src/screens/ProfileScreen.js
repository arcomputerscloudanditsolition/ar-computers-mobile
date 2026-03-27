import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';

export default function ProfileScreen({ navigation }) {
  const { products, getLowStockProducts } = useProducts();
  const { wishlist } = useCart();
  const lowStock = getLowStockProducts(10);

  const stats = [
    { label: 'Products', value: products.length, icon: 'cube', color: '#1a237e' },
    { label: 'Low Stock', value: lowStock.length, icon: 'alert-circle', color: '#f44336' },
    { label: 'Categories', value: 8, icon: 'grid', color: '#ff6f00' },
    { label: 'Wishlist', value: wishlist.length, icon: 'heart', color: '#e91e63' },
  ];

  const menu = [
    { icon: 'heart-outline', title: 'Wishlist', sub: `${wishlist.length} saved items` },
    { icon: 'receipt-outline', title: 'My Orders', sub: 'View order history' },
    { icon: 'notifications-outline', title: 'Notifications', sub: 'Manage alerts' },
    { icon: 'help-circle-outline', title: 'Help & Support', sub: 'FAQs and contact' },
    { icon: 'settings-outline', title: 'Settings', sub: 'App preferences' },
  ];

  const quickActions = [
    { icon: 'cloud-upload', label: 'Import', color: '#e3f2fd', iconColor: '#1a237e', action: () => navigation.navigate('Import') },
    { icon: 'share-social', label: 'Share', color: '#fff3e0', iconColor: '#ff6f00', action: () => {} },
    { icon: 'print', label: 'Print', color: '#f3e5f5', iconColor: '#9c27b0', action: () => {} },
    { icon: 'analytics', label: 'Reports', color: '#e8f5e9', iconColor: '#4caf50', action: () => {} },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>AR</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.bizName}>AR Computers</Text>
          <Text style={styles.tagline}>Cloud & IT Solutions</Text>
          <View style={styles.badge}><Text style={styles.badgeText}>⭐ Premium Partner</Text></View>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsWrap}>
        {stats.map((s, i) => (
          <View key={i} style={styles.statBox}>
            <Ionicons name={s.icon} size={22} color={s.color} />
            <Text style={styles.statVal}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actRow}>
            {quickActions.map((a, i) => (
              <TouchableOpacity key={i} style={styles.actBtn} onPress={a.action}>
                <View style={[styles.actIcon, { backgroundColor: a.color }]}>
                  <Ionicons name={a.icon} size={22} color={a.iconColor} />
                </View>
                <Text style={styles.actLabel}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Business Info */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Business Information</Text>
          {[
            ['Business ID', 'AR-COMP-2024-001'],
            ['GST Number', '33AABCU9603R1ZX'],
            ['Phone', '+91 98765 43210'],
            ['Email', 'info@arcomputers.com'],
            ['Working Hours', 'Mon-Sat 10AM-8PM'],
          ].map(([label, val]) => (
            <View key={label} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{label}</Text>
              <Text style={styles.infoVal}>{val}</Text>
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Menu */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Account</Text>
          {menu.map((item, i) => (
            <TouchableOpacity key={i} style={styles.menuItem}>
              <Ionicons name={item.icon} size={22} color="#666" />
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSub}>{item.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#ccc" />
            </TouchableOpacity>
          ))}
        </Card.Content>
      </Card>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#1a237e', paddingTop: 56, paddingBottom: 28, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#ff6f00', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  userInfo: { marginLeft: 16 },
  bizName: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  tagline: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 3 },
  badge: { backgroundColor: '#ff6f00', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start', marginTop: 8 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  statsWrap: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10, paddingTop: 14, marginTop: -14 },
  statBox: { width: '23%', backgroundColor: '#fff', borderRadius: 12, padding: 14, alignItems: 'center', marginHorizontal: '1%', marginBottom: 10, elevation: 2 },
  statVal: { fontSize: 20, fontWeight: 'bold', color: '#333', marginTop: 6 },
  statLabel: { fontSize: 10, color: '#666', marginTop: 3, textAlign: 'center' },
  card: { margin: 14, marginBottom: 0, elevation: 2 },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#1a237e', marginBottom: 14 },
  actRow: { flexDirection: 'row', justifyContent: 'space-between' },
  actBtn: { alignItems: 'center' },
  actIcon: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  actLabel: { marginTop: 6, fontSize: 11, color: '#555', fontWeight: '600' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  infoLabel: { fontSize: 13, color: '#666' },
  infoVal: { fontSize: 13, color: '#333', fontWeight: '600', flex: 1, textAlign: 'right' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  menuText: { flex: 1, marginLeft: 14 },
  menuTitle: { fontSize: 15, fontWeight: '600', color: '#333' },
  menuSub: { fontSize: 12, color: '#999', marginTop: 2 },
});
