import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductContext = createContext();

const initialProducts = [
  { id: 'AR001', category: 'Laptop', name: 'HP 15s i3 8GB 512GB', brand: 'HP', model: '15s-fq2672TU', price: 38000, stock: 15, imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', description: '11th Gen Intel Core i3, 8GB RAM, 512GB SSD, 15.6" FHD Display', specifications: { processor: 'Intel Core i3-1115G4', ram: '8GB DDR4', storage: '512GB SSD', display: '15.6" FHD', os: 'Windows 11 Home' } },
  { id: 'AR002', category: 'Laptop', name: 'Dell Inspiron i5 11th Gen', brand: 'Dell', model: 'Inspiron 3511', price: 62000, stock: 8, imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400', description: '11th Gen Intel Core i5, 8GB RAM, 512GB SSD', specifications: { processor: 'Intel Core i5-1135G7', ram: '8GB DDR4', storage: '512GB SSD', display: '15.6" FHD', os: 'Windows 11 Home' } },
  { id: 'AR003', category: 'Desktop', name: 'Gaming PC RTX 3060', brand: 'Custom Build', model: 'AR-Gaming-001', price: 75000, stock: 5, imageUrl: 'https://images.unsplash.com/photo-1587202372634-32705e3e568e?w=400', description: 'Intel i5 12th Gen, RTX 3060, 16GB RAM, 1TB SSD', specifications: { processor: 'Intel Core i5-12400F', gpu: 'NVIDIA RTX 3060 12GB', ram: '16GB DDR4', storage: '1TB NVMe SSD' } },
  { id: 'AR004', category: 'Monitor', name: '24 inch IPS Monitor', brand: 'Samsung', model: 'LS24R350', price: 10500, stock: 25, imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400', description: '24" Full HD IPS Panel, 75Hz, AMD FreeSync', specifications: { size: '24 inches', panel: 'IPS', resolution: '1920x1080', refreshRate: '75Hz' } },
  { id: 'AR005', category: 'RAM', name: '16GB DDR4 3200MHz', brand: 'Corsair', model: 'Vengeance LPX', price: 3200, stock: 50, imageUrl: 'https://images.unsplash.com/photo-1562976540-1502c48ce8b0?w=400', description: '16GB DDR4 3200MHz C16 Desktop Memory', specifications: { capacity: '16GB', type: 'DDR4', speed: '3200MHz' } },
  { id: 'AR006', category: 'Storage', name: 'SSD 1TB NVMe', brand: 'Kingston', model: 'NV2 NVMe', price: 6200, stock: 30, imageUrl: 'https://images.unsplash.com/photo-1597872252165-4827a235d7bc?w=400', description: '1TB NVMe PCIe 4.0 M.2 Internal SSD', specifications: { capacity: '1TB', interface: 'PCIe 4.0 NVMe', readSpeed: '3500 MB/s' } },
  { id: 'AR007', category: 'CCTV', name: '2MP Bullet Camera', brand: 'Hikvision', model: 'DS-2CE16D0T-IRP', price: 1350, stock: 100, imageUrl: 'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=400', description: '2MP Full HD 1080P Bullet Camera, 20m IR Night Vision', specifications: { resolution: '2MP 1080P', irRange: '20m', protection: 'IP66' } },
  { id: 'AR008', category: 'CCTV', name: '4MP Dome Camera', brand: 'Dahua', model: 'DH-HAC-HDW1400RP', price: 3450, stock: 45, imageUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400', description: '4MP HDCVI IR Dome Camera, 30m Night Vision', specifications: { resolution: '4MP 2560x1440', irRange: '30m', protection: 'IP67' } },
  { id: 'AR009', category: 'Networking', name: 'WiFi Router AC1200', brand: 'TP-Link', model: 'Archer C6', price: 1850, stock: 60, imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400', description: 'AC1200 Wireless MU-MIMO Gigabit Router', specifications: { standard: 'Wi-Fi 5 (802.11ac)', speed: 'AC1200', bands: 'Dual Band' } },
  { id: 'AR010', category: 'Speaker', name: 'Bluetooth Speaker boAt', brand: 'boAt', model: 'Stone 1200F', price: 1200, stock: 80, imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', description: '14W Bluetooth Speaker with RGB LEDs and TWS', specifications: { power: '14W', bluetooth: 'v5.0', battery: '3600mAh' } },
  { id: 'AR011', category: 'Laptop', name: 'Lenovo IdeaPad Slim 3', brand: 'Lenovo', model: '81X800LGIN', price: 45000, stock: 12, imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', description: 'AMD Ryzen 5 5500U, 8GB RAM, 512GB SSD', specifications: { processor: 'AMD Ryzen 5 5500U', ram: '8GB', storage: '512GB SSD' } },
  { id: 'AR012', category: 'Monitor', name: '27 inch Curved Monitor', brand: 'Samsung', model: 'LC27F390', price: 18500, stock: 8, imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400', description: '27" Curved FHD Monitor, AMD FreeSync', specifications: { size: '27 inches', curvature: '1800R', resolution: '1920x1080' } },
  { id: 'AR013', category: 'Accessories', name: 'Wireless Keyboard Mouse', brand: 'Logitech', model: 'MK270', price: 1800, stock: 40, imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400', description: 'Wireless Keyboard and Mouse Combo', specifications: { connectivity: '2.4GHz USB', range: '10m' } },
  { id: 'AR014', category: 'Accessories', name: 'HD Webcam 1080P', brand: 'Logitech', model: 'C920', price: 5500, stock: 25, imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400', description: 'Full HD 1080P Webcam with Stereo Mic', specifications: { resolution: '1080P', fps: '30fps', mic: 'Stereo' } },
  { id: 'AR015', category: 'CCTV', name: '8MP 4K Dome Camera', brand: 'Hikvision', model: 'DS-2CD2183G2-IU', price: 8500, stock: 20, imageUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400', description: '8MP 4K Ultra HD IP Dome Camera with Built-in Mic', specifications: { resolution: '8MP 4K', irRange: '30m', mic: 'Built-in' } },
];

export const categories = [
  { id: 'computers', name: 'Computers', icon: 'desktop-outline', subcategories: ['Laptop', 'Desktop', 'Workstation', 'Gaming PC'] },
  { id: 'parts', name: 'Computer Parts', icon: 'hardware-chip-outline', subcategories: ['Processor', 'RAM', 'Motherboard', 'Storage', 'Graphics Card', 'Power Supply', 'Cabinet'] },
  { id: 'accessories', name: 'Accessories', icon: 'keypad-outline', subcategories: ['Keyboard', 'Mouse', 'Webcam', 'Headset', 'Printer', 'UPS', 'Accessories'] },
  { id: 'cctv', name: 'CCTV', icon: 'videocam-outline', subcategories: ['CCTV', '2MP Camera', '4MP Camera', 'Dome Camera', 'Bullet Camera', 'DVR', 'NVR'] },
  { id: 'networking', name: 'Networking', icon: 'wifi-outline', subcategories: ['Networking', 'Router', 'Access Point', 'LAN Switch'] },
  { id: 'audio', name: 'Audio', icon: 'musical-notes-outline', subcategories: ['Speaker', 'Bluetooth Speakers', 'Headphones', 'Earphones'] },
  { id: 'storage', name: 'Storage', icon: 'save-outline', subcategories: ['Storage', 'SSD', 'HDD', 'Pen Drive', 'Memory Card'] },
  { id: 'monitors', name: 'Monitors', icon: 'tv-outline', subcategories: ['Monitor', '24 inch', '27 inch', 'Gaming Monitor'] },
];

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const [importHistory, setImportHistory] = useState([]);

  useEffect(() => { loadProducts(); loadImportHistory(); }, []);

  const loadProducts = async () => {
    try {
      const stored = await AsyncStorage.getItem('ar_products');
      if (stored) setProducts(JSON.parse(stored));
    } catch (e) {}
  };

  const saveProducts = async (p) => {
    try { await AsyncStorage.setItem('ar_products', JSON.stringify(p)); } catch (e) {}
  };

  const loadImportHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem('import_history');
      if (stored) setImportHistory(JSON.parse(stored));
    } catch (e) {}
  };

  const addProduct = (product) => {
    const newProducts = [...products, { ...product, id: product.id || `AR${String(products.length + 1).padStart(3, '0')}` }];
    setProducts(newProducts); saveProducts(newProducts);
  };

  const updateProduct = (id, updates) => {
    const newProducts = products.map(p => p.id === id ? { ...p, ...updates } : p);
    setProducts(newProducts); saveProducts(newProducts);
  };

  const deleteProduct = (id) => {
    const newProducts = products.filter(p => p.id !== id);
    setProducts(newProducts); saveProducts(newProducts);
  };

  const importProducts = async (newProducts, source = 'CSV Import') => {
    setLoading(true);
    try {
      const merged = [...products];
      let added = 0, updated = 0;
      newProducts.forEach(np => {
        const idx = merged.findIndex(p => p.id === np.id);
        if (idx >= 0) { merged[idx] = { ...merged[idx], ...np }; updated++; }
        else { merged.push(np); added++; }
      });
      setProducts(merged); await saveProducts(merged);
      const record = { id: Date.now().toString(), date: new Date().toISOString(), source, productsAdded: added, productsUpdated: updated, totalProducts: newProducts.length };
      const newHistory = [record, ...importHistory].slice(0, 50);
      setImportHistory(newHistory);
      await AsyncStorage.setItem('import_history', JSON.stringify(newHistory));
      return { success: true, added, updated, total: newProducts.length };
    } catch (e) { return { success: false, error: e.message }; }
    finally { setLoading(false); }
  };

  const getProductsByCategory = (category) => {
    if (!category) return products;
    const cat = categories.find(c => c.name === category);
    if (cat) return products.filter(p => cat.subcategories.includes(p.category));
    return products.filter(p => p.category === category);
  };

  const searchProducts = (query) => {
    const q = query.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) ||
      (p.model && p.model.toLowerCase().includes(q))
    );
  };

  const getLowStockProducts = (threshold = 10) => products.filter(p => p.stock <= threshold);

  const exportToCSV = () => {
    const headers = ['Product ID', 'Category', 'Product Name', 'Brand', 'Model', 'Price', 'Stock', 'Image URL', 'Description'];
    const rows = products.map(p => [p.id, p.category, p.name, p.brand, p.model || '', p.price, p.stock, p.imageUrl || '', p.description || '']);
    return [headers, ...rows];
  };

  return (
    <ProductContext.Provider value={{ products, categories, loading, importHistory, addProduct, updateProduct, deleteProduct, importProducts, exportToCSV, getProductsByCategory, searchProducts, getLowStockProducts }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within a ProductProvider');
  return context;
}
