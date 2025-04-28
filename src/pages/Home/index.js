import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { colors, fonts, windowWidth } from '../../utils';
import { formatRupiah } from '../../utils/currency';

export default function Home({ navigation, route }) {
  const [total, setTotal] = useState(0);
  const [currentNominal, setCurrentNominal] = useState(0);
  const [previousTotal, setPreviousTotal] = useState(0);
  const [pendingOperator, setPendingOperator] = useState(null);
  const [riwayatTransaksi, setRiwayatTransaksi] = useState([]);
  const [selectedNominal, setSelectedNominal] = useState(null);

  const uang = [
    { nominal: 500, src: require('../../assets/500.png') },
    { nominal: 1000, src: require('../../assets/1000.png') },
    { nominal: 2000, src: require('../../assets/2000.png') },
    { nominal: 5000, src: require('../../assets/5000.png') },
    { nominal: 10000, src: require('../../assets/10000.png') },
    { nominal: 20000, src: require('../../assets/20000.png') },
    { nominal: 50000, src: require('../../assets/50000.png') },
    { nominal: 100000, src: require('../../assets/100000.png') },
  ];

  const handleOperator = (operator) => {
    const valueToUse = currentNominal !== 0 ? currentNominal : total;
    setPreviousTotal(valueToUse);
    setPendingOperator(operator);
    setCurrentNominal(0);
    setSelectedNominal(null);
  };

  const handleEqual = () => {
    if (pendingOperator) {
      const result = pendingOperator === '+'
        ? previousTotal + currentNominal
        : previousTotal - currentNominal;
      
      const newTransaction = {
        nominal1: previousTotal,
        nominal2: currentNominal,
        operator: pendingOperator,
        result,
      };
      
      setRiwayatTransaksi([...riwayatTransaksi, newTransaction]);
      setTotal(result);
    } else if (currentNominal > 0) {
      // Jika hanya memilih nominal tanpa operator
      const newTransaction = {
        nominal1: currentNominal,
        nominal2: 0,
        operator: null,
        result: currentNominal,
      };
      setRiwayatTransaksi([...riwayatTransaksi, newTransaction]);
      setTotal(currentNominal);
    }

    setCurrentNominal(0);
    setPendingOperator(null);
    setSelectedNominal(null);
  };

  const handleKeranjang = () => {
    // Jika ada nominal yang dipilih, simpan sebagai transaksi baru
    if (currentNominal > 0) {
      const newTransaction = {
        nominal1: currentNominal,
        nominal2: 0,
        operator: null,
        result: currentNominal,
      };
      const updatedTransactions = [...riwayatTransaksi, newTransaction];
      setRiwayatTransaksi(updatedTransactions);
      setTotal(currentNominal);
      
      // Navigasi dengan transaksi terbaru
      navigation.navigate('Detail', {
        riwayatTransaksi: updatedTransactions,
        total: currentNominal
      });
    } else {
      // Jika tidak ada nominal yang dipilih, gunakan riwayat yang ada
      navigation.navigate('Detail', {
        riwayatTransaksi,
        total
      });
    }

    // Reset selection
    setCurrentNominal(0);
    setPendingOperator(null);
    setSelectedNominal(null);
  };

  const reset = () => {
    setTotal(0);
    setCurrentNominal(0);
    setPreviousTotal(0);
    setPendingOperator(null);
    setRiwayatTransaksi([]);
    setSelectedNominal(null);
  };

  const goToDetail = () => {
    navigation.navigate('Detail', {
      riwayatTransaksi,
      total
    });
  };

  const handleSelectNominal = (nominal) => {
    const newNominal = selectedNominal === nominal ? 0 : nominal;
    setCurrentNominal(newNominal);
    setSelectedNominal(newNominal);
  };

  useEffect(() => {
    if (route.params?.resetData) {
      reset();
    }
  }, [route.params]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MIKACER</Text>

      <View style={styles.totalContainer}>
        <Image
          source={require('../../assets/icon-coin.png')}
          style={styles.coinIcon}
        />
        <Text style={styles.totalText}>
          {formatRupiah(currentNominal || total)}
        </Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#f9a8d4' }]} 
          onPress={() => handleOperator('+')}
        >
          <Text style={styles.symbol}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#fde68a' }]} 
          onPress={() => handleOperator('-')}
        >
          <Text style={styles.symbol}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#7dd3fc' }]} 
          onPress={handleEqual}
        >
          <Text style={styles.symbol}>=</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#c4b5fd' }]} 
          onPress={handleKeranjang}
        >
          <Image
            source={require('../../assets/icon-belanja.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.moneyGrid}>
        {uang.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            onPress={() => handleSelectNominal(item.nominal)}
          >
            <Image
              source={item.src}
              style={[
                styles.uangImage, 
                selectedNominal === item.nominal && styles.selectedUang
              ]}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.detailButton} 
          onPress={goToDetail}
        >
          <Text style={styles.detailText}>Lihat Detail</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.resetButton} 
          onPress={reset}
        >
          <Image
            source={require('../../assets/icon-reset.png')}
            style={styles.resetIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7ff9c',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.primary[800],
    color: '#fb5607',
    marginTop: 10,
  },
  totalContainer: {
    backgroundColor: '#fb5607',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  totalText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    width: windowWidth / 2.4,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  symbol: {
    fontSize: 30,
    color: '#000',
    fontWeight: 'bold',
  },
  icon: {
    width: 28,
    height: 28,
    tintColor: '#000',
  },
  moneyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  uangImage: {
    width: windowWidth / 2.5,
    height: 80,
    resizeMode: 'contain',
    margin: 6,
    borderWidth: 0,
  },
  selectedUang: {
    borderWidth: 3,
    borderColor: '#fb5607',
    borderRadius: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
    width: '100%',
  },
  detailButton: {
    backgroundColor: '#a3a635',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  detailText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: '#ef4444',
    borderRadius: 14,
    padding: 14,
  },
  resetIcon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
});