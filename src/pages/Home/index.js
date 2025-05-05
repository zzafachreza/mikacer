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
  const [keranjangHighlight, setKeranjangHighlight] = useState(false);
  const [isInKembalianMode, setIsInKembalianMode] = useState(false); // ✅ FLAG

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
    setPreviousTotal(total);
    setPendingOperator(operator);
    setCurrentNominal(0);
    setSelectedNominal(null);
  };

  const handleNominalClick = (nominal) => {
    setCurrentNominal(nominal);
    setSelectedNominal(nominal);
    if (!pendingOperator && total === 0 && riwayatTransaksi.length === 0) {
      setTotal(nominal);
    }
  };

  const handleEqual = () => {
    if (!pendingOperator || currentNominal === 0) return;

    const baseValue = previousTotal !== 0 ? previousTotal : total;

    const result = pendingOperator === '+'
      ? baseValue + currentNominal
      : baseValue - currentNominal;

    const transaksi = {
      nominal1: baseValue,
      nominal2: currentNominal,
      operator: pendingOperator,
      result
    };

    setRiwayatTransaksi([...riwayatTransaksi, transaksi]);
    setTotal(result);
    setPendingOperator(null);
    setCurrentNominal(0);
    setSelectedNominal(null);
    setPreviousTotal(0);
  };

  const handleKeranjang = () => {
    if (currentNominal === 0 && total === 0) return;

    const alreadyAdded = total === currentNominal && riwayatTransaksi.length === 0 && !pendingOperator;
    if (alreadyAdded) {
      const transaksi = {
        operator: '+',
        nominal1: currentNominal,
        result: currentNominal,
        isKembalian: false,
      };

      setRiwayatTransaksi([transaksi]);
      setCurrentNominal(0);
      setSelectedNominal(null);
      return;
    }

    let result = total;
    let operatorToUse = pendingOperator || '+';

    if (pendingOperator === '+') {
      result += currentNominal;
    } else if (pendingOperator === '-') {
      result -= currentNominal;
      setIsInKembalianMode(true); // ✅ MASUK MODE KEMBALIAN
    } else {
      result += currentNominal;
    }

    const transaksi = {
      operator: operatorToUse,
      nominal1: currentNominal,
      result,
      isKembalian: isInKembalianMode, // ✅ Cek flag kembalian
    };

    const updated = [...riwayatTransaksi, transaksi];

    setRiwayatTransaksi(updated);
    setTotal(result);
    setCurrentNominal(0);
    setSelectedNominal(null);
    setPendingOperator(null);
    setPreviousTotal(0);

    if (isInKembalianMode) {
      setIsInKembalianMode(false); // ✅ Keluar dari mode kembalian setelah masukin
    }
  };

  const resetAll = () => {
    setTotal(0);
    setCurrentNominal(0);
    setPreviousTotal(0);
    setPendingOperator(null);
    setRiwayatTransaksi([]);
    setSelectedNominal(null);
    setIsInKembalianMode(false); // ✅ reset juga
  };

  const goToDetail = () => {
    navigation.navigate('Detail', {
      riwayatTransaksi,
      total,
      onReset: () => {
        setRiwayatTransaksi([]);
        setTotal(0);
      }
    });
  };

  const handleSelectNominal = (nominal) => {
    const newNominal = selectedNominal === nominal ? 0 : nominal;
    setCurrentNominal(newNominal);
    setSelectedNominal(newNominal);
    if (!pendingOperator && total === 0 && riwayatTransaksi.length === 0) {
      setTotal(newNominal);
    }
  };

  useEffect(() => {
    if (route.params?.resetData) {
      resetAll();
    }
  }, [route.params]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MIKACER</Text>

      <View style={styles.totalContainer}>
        <Image source={require('../../assets/icon-coin.png')} style={styles.coinIcon} />
        <Text style={styles.totalText}>
          {formatRupiah(pendingOperator ? currentNominal : total)}
        </Text>
      </View>

      <View style={styles.operatorRow}>
        <TouchableOpacity
          style={[styles.operatorButton, {
            backgroundColor: '#f9a8d4',
            borderWidth: pendingOperator === '+' ? 3 : 0,
            borderColor: '#fb5607'
          }]}
          onPress={() => handleOperator('+')}
        >
          <Text style={styles.symbol}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.operatorButton, {
            backgroundColor: '#fde68a',
            borderWidth: pendingOperator === '-' ? 3 : 0,
            borderColor: '#fb5607'
          }]}
          onPress={() => handleOperator('-')}
        >
          <Text style={styles.symbol}>-</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.button, {
            backgroundColor: '#c4b5fd',
            borderWidth: keranjangHighlight ? 3 : 0,
            borderColor: keranjangHighlight ? '#fb5607' : 'transparent'
          }]}
          onPress={handleKeranjang}
        >
          <Image source={require('../../assets/icon-belanja.png')} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#7dd3fc' }]}
          onPress={handleEqual}
        >
          <Text style={styles.symbol}>=</Text>
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
        <TouchableOpacity style={styles.detailButton} onPress={goToDetail}>
          <Text style={styles.detailText}>Lihat Detail</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton} onPress={resetAll}>
          <Image source={require('../../assets/icon-reset.png')} style={styles.resetIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7ff9c',
    padding: 5,
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
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    height: 80,
    marginBottom: 10,
    marginTop: 20,
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
  operatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5
  },
  button: {
    width: 169,
    height: 71,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5
  },
  operatorButton: {
    width: 169,
    height: 71,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5
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
    marginTop: 0,
    width: '100%',
    padding: 10
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
    borderRadius: 10,
    padding: 10,
    width: 140,
    alignItems: 'center',
    justifyContent: 'center'
  },
  resetIcon: {
    width: 21.7,
    height: 25,
    tintColor: 'white',
  },
});
