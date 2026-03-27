import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Card, DataTable, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useProducts } from '../context/ProductContext';
import Toast from 'react-native-toast-message';

function parseCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  return lines.slice(1).map((line, idx) => {
    const vals = line.split(',').map(v => v.trim().replace(/"/g, ''));
    const row = {};
    headers.forEach((h, i) => row[h] = vals[i] || '');
    return {
      id: row['Product ID'] || row['id'] || `IMP${Date.now()}${idx}`,
      category: row['Category'] || row['category'] || 'Uncategorized',
      name: row['Product Name'] || row['name'] || 'Unknown',
      brand: row['Brand'] || row['brand'] || 'Generic',
      model: row['Model'] || row['model'] || '',
      price: parseFloat(row['Price'] || row['price'] || 0) || 0,
      stock: parseInt(row['Stock'] || row['stock'] || 0) || 0,
      imageUrl: row['Image URL'] || row['imageUrl'] || '',
      description: row['Description'] || row['description'] || '',
    };
  }).filter(p => p.name && p.name !== 'Unknown' || p.price > 0);
}

export default function ImportScreen() {
  const { importProducts, importHistory } = useProducts();
  const [previewData, setPreviewData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [fullData, setFullData] = useState([]);

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: ['text/csv', 'text/plain', '*/*'], copyToCacheDirectory: true });
      if (!result.canceled && result.assets?.[0]) {
        const file = result.assets[0];
        setSelectedFile(file);
        const content = await FileSystem.readAsStringAsync(file.uri);
        const parsed = parseCSV(content);
        setFullData(parsed);
        setPreviewData(parsed.slice(0, 5));
        Toast.show({ type: 'success', text1: `📄 ${parsed.length} products found`, text2: file.name });
      }
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Error picking file', text2: e.message });
    }
  };

  const handleImport = async () => {
    if (!fullData.length) { Toast.show({ type: 'error', text1: 'No data', text2: 'Please select a CSV file first' }); return; }
    setImporting(true);
    const result = await importProducts(fullData, selectedFile?.name || 'CSV Import');
    setImporting(false);
    if (result.success) {
      Toast.show({ type: 'success', text1: '✅ Import Successful!', text2: `Added: ${result.added} | Updated: ${result.updated}` });
      setPreviewData([]); setFullData([]); setSelectedFile(null);
    } else {
      Toast.show({ type: 'error', text1: 'Import Failed', text2: result.error });
    }
  };

  const downloadTemplate = async () => {
    const template = `Product ID,Category,Product Name,Brand,Model,Price,Stock,Image URL,Description\nAR011,Laptop,ASUS VivoBook i5,ASUS,X515EA,52000,10,https://example.com/img.jpg,11th Gen Intel Core i5 Laptop\nAR012,CCTV,2MP PTZ Camera,Hikvision,DS-2DE4A220IW,12500,8,https://example.com/ptz.jpg,2MP 20x Optical Zoom PTZ Camera`;
    const path = FileSystem.documentDirectory + 'ar_template.csv';
    await FileSystem.writeAsStringAsync(path, template);
    Toast.show({ type: 'success', text1: '📋 Template Ready', text2: 'ar_template.csv saved' });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Product Import</Text>
        <Text style={styles.subtitle}>Bulk import from CSV files</Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>📥 Import Products</Text>
          <Text style={styles.desc}>Upload a CSV file with columns: Product ID, Category, Product Name, Brand, Model, Price, Stock, Image URL, Description</Text>
          <TouchableOpacity style={styles.templateBtn} onPress={downloadTemplate}>
            <Ionicons name="download-outline" size={18} color="#1a237e" />
            <Text style={styles.templateBtnText}>Download CSV Template</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.uploadArea} onPress={pickFile}>
            <Ionicons name="cloud-upload" size={50} color="#ff6f00" />
            <Text style={styles.uploadTitle}>{selectedFile ? `✅ ${selectedFile.name}` : 'Tap to Select CSV File'}</Text>
            <Text style={styles.uploadHint}>Supports .csv, .txt files</Text>
            {fullData.length > 0 && <Text style={styles.foundText}>{fullData.length} products found</Text>}
          </TouchableOpacity>

          {previewData.length > 0 && (
            <View style={styles.preview}>
              <Text style={styles.previewTitle}>Preview (first 5 rows):</Text>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>ID</DataTable.Title>
                  <DataTable.Title>Name</DataTable.Title>
                  <DataTable.Title numeric>Price</DataTable.Title>
                </DataTable.Header>
                {previewData.map((item, i) => (
                  <DataTable.Row key={i}>
                    <DataTable.Cell>{item.id}</DataTable.Cell>
                    <DataTable.Cell>{item.name.slice(0, 14)}…</DataTable.Cell>
                    <DataTable.Cell numeric>₹{item.price}</DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
            </View>
          )}

          <TouchableOpacity style={[styles.importBtn, (!fullData.length || importing) && styles.importBtnDisabled]} onPress={handleImport} disabled={!fullData.length || importing}>
            <Ionicons name="cloud-upload-outline" size={18} color="#fff" />
            <Text style={styles.importBtnText}>{importing ? 'Importing...' : `Import ${fullData.length || ''} Products`}</Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>

      {importHistory.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>📋 Import History</Text>
            {importHistory.slice(0, 5).map((item) => (
              <View key={item.id} style={styles.historyItem}>
                <View style={styles.historyRow}>
                  <Text style={styles.historyDate}>{new Date(item.date).toLocaleDateString('en-IN')}</Text>
                  <Text style={styles.historySource}>{item.source}</Text>
                </View>
                <View style={styles.historyStats}>
                  <Text style={styles.statChip}>📦 {item.totalProducts} total</Text>
                  <Text style={[styles.statChip, { color: '#4caf50' }]}>✅ {item.productsAdded} added</Text>
                  <Text style={[styles.statChip, { color: '#ff9800' }]}>🔄 {item.productsUpdated} updated</Text>
                </View>
                <Divider style={{ marginTop: 8 }} />
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#1a237e', padding: 20, paddingTop: 56 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  card: { margin: 14, marginBottom: 0, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1a237e', marginBottom: 10 },
  desc: { fontSize: 13, color: '#666', lineHeight: 20, marginBottom: 14 },
  templateBtn: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#1a237e', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14, marginBottom: 14 },
  templateBtnText: { color: '#1a237e', fontWeight: '600', marginLeft: 8 },
  uploadArea: { borderWidth: 2, borderStyle: 'dashed', borderColor: '#ff6f00', borderRadius: 14, padding: 28, alignItems: 'center', backgroundColor: '#fffbf5', marginBottom: 14 },
  uploadTitle: { fontSize: 15, fontWeight: '600', color: '#333', marginTop: 10, textAlign: 'center' },
  uploadHint: { fontSize: 12, color: '#aaa', marginTop: 4 },
  foundText: { marginTop: 8, fontSize: 13, color: '#4caf50', fontWeight: '700' },
  preview: { marginBottom: 14 },
  previewTitle: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6 },
  importBtn: { backgroundColor: '#ff6f00', borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14 },
  importBtnDisabled: { backgroundColor: '#ccc' },
  importBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15, marginLeft: 8 },
  historyItem: { marginBottom: 4 },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  historyDate: { fontWeight: '700', color: '#333' },
  historySource: { color: '#666', fontSize: 12 },
  historyStats: { flexDirection: 'row', gap: 8 },
  statChip: { fontSize: 12, color: '#1a237e', fontWeight: '600' },
});
