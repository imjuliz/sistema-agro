import { createContext, useContext, useState } from 'react';

const storeMapping = {
  AG001: 'Main Store',
  AG002: 'Downtown Branch',
  AT6001: 'Suburban Store',
  ATH001: 'Mall Location',
  AC001: 'City Center',
  MV001: 'Airport Store'
};

const mockInventoryItems = [
  {
    id: '1',
    code: 'ELDH01',
    name: 'ADMIN',
    createDate: '03-07-2025',
    updateDate: '18-08-2025',
    updatedBy: 'ADMIN',
    itemCode: 'SAM-REF-001',
    itemName: 'Samsung Smart Refrigerator 25 cu.ft',
    itemGroup: 'MAJOR APPLIANCES',
    category: 'Refrigerators',
    capacity: '25 cu.ft',
    cluster: 'SAMSUNG/REFRIGERATION',
    brand: 'Samsung',
    setupType: 'model',
    price: 1299.99,
    currentStock: { AG001: 15, AG002: 8, AT6001: 12, ATH001: 22, AC001: 5, MV001: 18 },
    minimumStock: { AG001: 8, AG002: 6, AT6001: 10, ATH001: 12, AC001: 4, MV001: 8 },
    storeDisplayStock: { AG001: 2, AG002: 1, AT6001: 2, ATH001: 3, AC001: 1, MV001: 2 }
  },
  {
    id: '2',
    code: 'ELDH02',
    name: 'ADMIN',
    createDate: '03-07-2025',
    updateDate: '18-08-2025',
    updatedBy: 'ADMIN',
    itemCode: 'SAM-REF-007',
    itemName: 'Samsung French Door Refrigerator',
    itemGroup: 'MAJOR APPLIANCES',
    category: 'Refrigerators',
    capacity: '28 cu.ft',
    cluster: 'SAMSUNG/REFRIGERATION',
    brand: 'Samsung',
    setupType: 'model',
    price: 1599.99,
    currentStock: { AG001: 8, AG002: 12, AT6001: 2, ATH001: 15, AC001: 7, MV001: 10 },
    minimumStock: { AG001: 6, AG002: 8, AT6001: 4, ATH001: 10, AC001: 5, MV001: 6 },
    storeDisplayStock: { AG001: 1, AG002: 2, AT6001: 1, ATH001: 2, AC001: 1, MV001: 2 }
  },
  {
    id: '3',
    code: 'ELDH03',
    name: 'ADMIN',
    createDate: '03-07-2025',
    updateDate: '',
    updatedBy: '',
    itemCode: 'SAM-REF-009',
    itemName: 'Samsung Side-by-Side Refrigerator',
    itemGroup: 'MAJOR APPLIANCES',
    category: 'Refrigerators',
    capacity: '24 cu.ft',
    cluster: 'SAMSUNG/REFRIGERATION',
    brand: 'Samsung',
    setupType: 'model',
    price: 1899.99,
    currentStock: { AG001: 12, AG002: 7, AT6001: 9, ATH001: 18, AC001: 3, MV001: 14 },
    minimumStock: { AG001: 8, AG002: 5, AT6001: 7, ATH001: 12, AC001: 3, MV001: 8 },
    storeDisplayStock: { AG001: 2, AG002: 1, AT6001: 1, ATH001: 2, AC001: 1, MV001: 2 }
  },
  // LG Products
  {
    id: '4',
    code: 'ELDH04',
    name: 'ADMIN',
    createDate: '03-07-2025',
    updateDate: '',
    updatedBy: '',
    itemCode: 'LG-WASH-002',
    itemName: 'LG Front Load Washer',
    itemGroup: 'MAJOR APPLIANCES',
    category: 'Washers & Dryers',
    capacity: '4.5 cu.ft',
    cluster: 'LG/LAUNDRY',
    brand: 'LG',
    setupType: 'model',
    price: 899.99,
    currentStock: { AG001: 10, AG002: 3, AT6001: 15, ATH001: 20, AC001: 8, MV001: 12 },
    minimumStock: { AG001: 6, AG002: 4, AT6001: 8, ATH001: 12, AC001: 5, MV001: 7 },
    storeDisplayStock: { AG001: 2, AG002: 1, AT6001: 2, ATH001: 3, AC001: 1, MV001: 2 }
  },
  {
    id: '5',
    code: 'ELDH05',
    name: 'ADMIN',
    createDate: '03-07-2025',
    updateDate: '',
    updatedBy: '',
    itemCode: 'LG-DRY-008',
    itemName: 'LG Top Load Dryer',
    itemGroup: 'MAJOR APPLIANCES',
    category: 'Washers & Dryers',
    capacity: '7.3 cu.ft',
    cluster: 'LG/LAUNDRY',
    brand: 'LG',
    setupType: 'model',
    price: 699.99,
    currentStock: { AG001: 12, AG002: 18, AT6001: 8, ATH001: 25, AC001: 6, MV001: 15 },
    minimumStock: { AG001: 8, AG002: 10, AT6001: 6, ATH001: 15, AC001: 4, MV001: 8 },
    storeDisplayStock: { AG001: 2, AG002: 2, AT6001: 1, ATH001: 3, AC001: 1, MV001: 2 }
  },
  {
    id: '6',
    code: 'ELDH06',
    name: 'ADMIN',
    createDate: '03-07-2025',
    updateDate: '',
    updatedBy: '',
    itemCode: 'LG-WASH-013',
    itemName: 'LG Smart Washer with WiFi',
    itemGroup: 'MAJOR APPLIANCES',
    category: 'Washers & Dryers',
    capacity: '5.2 cu.ft',
    cluster: 'LG/LAUNDRY',
    brand: 'LG',
    setupType: 'model',
    price: 1099.99,
    currentStock: { AG001: 6, AG002: 11, AT6001: 4, ATH001: 16, AC001: 9, MV001: 13 },
    minimumStock: { AG001: 5, AG002: 7, AT6001: 4, ATH001: 10, AC001: 6, MV001: 8 },
    storeDisplayStock: { AG001: 1, AG002: 2, AT6001: 1, ATH001: 2, AC001: 1, MV001: 2 }
  },
  // Whirlpool Products
  {
    id: '7',
    code: 'ELDH07',
    name: 'ADMIN',
    createDate: '25-07-2025',
    updateDate: '18-08-2025',
    updatedBy: 'ADMIN',
    itemCode: 'WP-MIC-003',
    itemName: 'Whirlpool Convection Microwave',
    itemGroup: 'SMALL APPLIANCES',
    category: 'Microwaves',
    capacity: '1.7 cu.ft',
    cluster: 'WHIRLPOOL/COOKING',
    brand: 'Whirlpool',
    setupType: 'model',
    price: 399.99,
    currentStock: { AG001: 25, AG002: 30, AT6001: 18, ATH001: 35, AC001: 12, MV001: 22 },
    minimumStock: { AG001: 15, AG002: 18, AT6001: 12, ATH001: 20, AC001: 8, MV001: 15 },
    storeDisplayStock: { AG001: 3, AG002: 4, AT6001: 2, ATH001: 4, AC001: 2, MV001: 3 }
  },
  {
    id: '8',
    code: 'ELDH08',
    name: 'ADMIN',
    createDate: '25-07-2025',
    updateDate: '',
    updatedBy: '',
    itemCode: 'WP-MIC-014',
    itemName: 'Whirlpool Over-Range Microwave',
    itemGroup: 'SMALL APPLIANCES',
    category: 'Microwaves',
    capacity: '1.9 cu.ft',
    cluster: 'WHIRLPOOL/COOKING',
    brand: 'Whirlpool',
    setupType: 'model',
    price: 299.99,
    currentStock: { AG001: 14, AG002: 19, AT6001: 9, ATH001: 23, AC001: 7, MV001: 16 },
    minimumStock: { AG001: 8, AG002: 12, AT6001: 6, ATH001: 15, AC001: 5, MV001: 10 },
    storeDisplayStock: { AG001: 2, AG002: 3, AT6001: 1, ATH001: 3, AC001: 1, MV001: 2 }
  },
  // GE Products
  {
    id: '9',
    code: 'ELDH09',
    name: 'ADMIN',
    createDate: '25-07-2025',
    updateDate: '',
    updatedBy: '',
    itemCode: 'GE-RNG-004',
    itemName: 'GE 4-Burner Gas Range',
    itemGroup: 'MAJOR APPLIANCES',
    category: 'Ranges & Ovens',
    capacity: '5.0 cu.ft',
    cluster: 'GE/COOKING',
    brand: 'GE',
    setupType: 'model',
    price: 649.99,
    currentStock: { AG001: 8, AG002: 12, AT6001: 0, ATH001: 15, AC001: 6, MV001: 10 },
    minimumStock: { AG001: 6, AG002: 8, AT6001: 4, ATH001: 10, AC001: 4, MV001: 6 },
    storeDisplayStock: { AG001: 1, AG002: 2, AT6001: 0, ATH001: 2, AC001: 1, MV001: 1 }
  },
  {
    id: '10',
    code: 'ELDH10',
    name: 'ADMIN',
    createDate: '25-07-2025',
    updateDate: '',
    updatedBy: '',
    itemCode: 'GE-RNG-011',
    itemName: 'GE Electric Range with Self-Clean',
    itemGroup: 'MAJOR APPLIANCES',
    category: 'Ranges & Ovens',
    capacity: '5.3 cu.ft',
    cluster: 'GE/COOKING',
    brand: 'GE',
    setupType: 'model',
    price: 579.99,
    currentStock: { AG001: 10, AG002: 14, AT6001: 6, ATH001: 18, AC001: 4, MV001: 12 },
    minimumStock: { AG001: 6, AG002: 8, AT6001: 4, ATH001: 12, AC001: 3, MV001: 8 },
    storeDisplayStock: { AG001: 1, AG002: 2, AT6001: 1, ATH001: 2, AC001: 1, MV001: 2 }
  },
  // Bosch Products
  {
    id: '11',
    code: 'ELDH11',
    name: 'ADMIN',
    createDate: '25-07-2025',
    updateDate: '',
    updatedBy: '',
    itemCode: 'BSH-DW-005',
    itemName: 'Bosch Built-in Dishwasher',
    itemGroup: 'MAJOR APPLIANCES',
    category: 'Dishwashers',
    capacity: '16 Place Settings',
    cluster: 'BOSCH/CLEANING',
    brand: 'Bosch',
    setupType: 'model',
    price: 749.99,
    currentStock: { AG001: 8, AG002: 15, AT6001: 12, ATH001: 20, AC001: 5, MV001: 11 },
    minimumStock: { AG001: 6, AG002: 10, AT6001: 8, ATH001: 12, AC001: 4, MV001: 7 },
    storeDisplayStock: { AG001: 1, AG002: 2, AT6001: 2, ATH001: 3, AC001: 1, MV001: 2 }
  },
  {
    id: '12',
    code: 'ELDH12',
    name: 'ADMIN',
    createDate: '25-07-2025',
    updateDate: '',
    updatedBy: '',
    itemCode: 'BSH-DW-010',
    itemName: 'Bosch Compact Dishwasher',
    itemGroup: 'MAJOR APPLIANCES',
    category: 'Dishwashers',
    capacity: '8 Place Settings',
    cluster: 'BOSCH/CLEANING',
    brand: 'Bosch',
    setupType: 'model',
    price: 549.99,
    currentStock: { AG001: 18, AG002: 22, AT6001: 14, ATH001: 28, AC001: 9, MV001: 16 },
    minimumStock: { AG001: 10, AG002: 15, AT6001: 8, ATH001: 18, AC001: 6, MV001: 10 },
    storeDisplayStock: { AG001: 2, AG002: 3, AT6001: 2, ATH001: 4, AC001: 1, MV001: 2 }
  },
  // Frigidaire Products
  {
    id: '13',
    code: 'ELDH13',
    name: 'ADMIN',
    createDate: '25-07-2025',
    updateDate: '',
    updatedBy: '',
    itemCode: 'FRG-AC-006',
    itemName: 'Frigidaire Window AC Unit 12K BTU',
    itemGroup: 'CLIMATE CONTROL',
    category: 'Air Conditioners',
    capacity: '12000 BTU',
    cluster: 'FRIGIDAIRE/COOLING',
    brand: 'Frigidaire',
    setupType: 'model',
    price: 449.99,
    currentStock: { AG001: 25, AG002: 22, AT6001: 28, ATH001: 35, AC001: 15, MV001: 20 },
    minimumStock: { AG001: 15, AG002: 12, AT6001: 18, ATH001: 25, AC001: 10, MV001: 15 },
    storeDisplayStock: { AG001: 4, AG002: 3, AT6001: 4, ATH001: 5, AC001: 2, MV001: 3 }
  },
  {
    id: '14',
    code: 'ELDH14',
    name: 'ADMIN',
    createDate: '25-07-2025',
    updateDate: '',
    updatedBy: '',
    itemCode: 'FRG-AC-012',
    itemName: 'Frigidaire Portable AC Unit',
    itemGroup: 'CLIMATE CONTROL',
    category: 'Air Conditioners',
    capacity: '10000 BTU',
    cluster: 'FRIGIDAIRE/COOLING',
    brand: 'Frigidaire',
    setupType: 'model',
    price: 349.99,
    currentStock: { AG001: 20, AG002: 18, AT6001: 24, ATH001: 30, AC001: 12, MV001: 16 },
    minimumStock: { AG001: 12, AG002: 10, AT6001: 15, ATH001: 20, AC001: 8, MV001: 12 },
    storeDisplayStock: { AG001: 3, AG002: 2, AT6001: 3, ATH001: 4, AC001: 2, MV001: 2 }
  },
  {
    id: '15',
    code: 'ELDH15',
    name: 'ADMIN',
    createDate: '25-07-2025',
    updateDate: '',
    updatedBy: '',
    itemCode: 'FRG-FRZ-015',
    itemName: 'Frigidaire Chest Freezer',
    itemGroup: 'MAJOR APPLIANCES',
    category: 'Freezers',
    capacity: '7.2 cu.ft',
    cluster: 'FRIGIDAIRE/REFRIGERATION',
    brand: 'Frigidaire',
    setupType: 'model',
    price: 429.99,
    currentStock: { AG001: 6, AG002: 3, AT6001: 8, ATH001: 12, AC001: 4, MV001: 7 },
    minimumStock: { AG001: 4, AG002: 3, AT6001: 5, ATH001: 8, AC001: 3, MV001: 5 },
    storeDisplayStock: { AG001: 1, AG002: 0, AT6001: 1, ATH001: 2, AC001: 1, MV001: 1 }
  },
  // Branch-wise Setup Example
  {
    id: '16',
    code: 'ELDH16',
    name: 'ADMIN',
    createDate: '25-07-2025',
    updateDate: '18-08-2025',
    updatedBy: 'ADMIN',
    itemCode: 'FN00005',
    itemName: 'Premium Furniture Display Set',
    itemGroup: 'FURNITURE',
    category: 'Display Furniture',
    capacity: 'PREMIUM DISPLAY',
    cluster: 'FURNITURE/DISPLAY',
    brand: 'Generic',
    setupType: 'branch',
    price: 899.99,
    currentStock: { AG001: 12, AG002: 24, AT6001: 0, ATH001: 30, AC001: 0, MV001: 0 },
    minimumStock: { AG001: 8, AG002: 15, AT6001: 0, ATH001: 20, AC001: 0, MV001: 0 },
    storeDisplayStock: { AG001: 2, AG002: 4, AT6001: 0, ATH001: 5, AC001: 0, MV001: 0 }
  }
];

const InventoryContext = createContext();

export function InventoryProvider({ children }) {
  const [items, setItems] = useState(mockInventoryItems);

  const updateItem = (id, updates) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, ...updates, updateDate: new Date().toLocaleDateString('en-GB'), updatedBy: 'ADMIN' }
          : item
      )
    );
  };

  const addItem = (item) => {
    setItems(prevItems => [...prevItems, item]);
  };

  const deleteItem = (id) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const getStoreItems = (storeFilter) => {
    const storeItems = [];

    items.forEach(item => {
      Object.entries(item.currentStock).forEach(([storeCode, stock]) => {
        const storeName = storeMapping[storeCode];
        if (!storeFilter || storeFilter === 'all' || storeName === storeFilter) {
          storeItems.push({
            id: `${item.id}-${storeCode}`,
            name: item.itemName,
            brand: item.brand,
            category: item.category,
            sku: item.itemCode,
            store: storeName,
            currentStock: stock,
            displayStock: item.storeDisplayStock[storeCode] || 0,
            minimumStock: item.minimumStock[storeCode] || 0,
            price: item.price
          });
        }
      });
    });

    return storeItems;
  };

  const getBrandItems = () => {
    const brandItems = [];

    const brandCounts = items.reduce((acc, item) => {
      acc[item.brand] = (acc[item.brand] || 0) + 1;
      return acc;
    }, {});

    const totalItems = items.length;
    const brandMarketShares = {};

    Object.entries(brandCounts).forEach(([brand, count]) => {
      brandMarketShares[brand] = Math.round((count / totalItems) * 100 * 10) / 10;
    });

    items.forEach(item => {
      Object.entries(item.currentStock).forEach(([storeCode, stock]) => {
        const storeName = storeMapping[storeCode];
        brandItems.push({
          id: `${item.id}-${storeCode}`,
          name: item.itemName,
          brand: item.brand,
          category: item.category,
          sku: item.itemCode,
          store: storeName,
          currentStock: stock,
          displayStock: item.storeDisplayStock[storeCode] || 0,
          minimumStock: item.minimumStock[storeCode] || 0,
          price: item.price,
          marketShare: brandMarketShares[item.brand] || 0
        });
      });
    });

    return brandItems;
  };

  return (
    <InventoryContext.Provider value={{
      items,
      updateItem,
      addItem,
      deleteItem,
      storeMapping,
      getStoreItems,
      getBrandItems
    }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}
