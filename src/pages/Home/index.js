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
        operator: pendingOperator, // Pastikan operator disimpan
        result,
      };
      
      setRiwayatTransaksi([...riwayatTransaksi, newTransaction]);
      setTotal(result);
    } else if (currentNominal > 0) {
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
    if (pendingOperator === '-') {
      // Langsung proses pengurangan tanpa perlu klik '='
      const result = total - currentNominal;
      const newTransaction = {
        nominal1: total,
        nominal2: currentNominal,
        operator: '-',
        result: result,
      };
      setRiwayatTransaksi([...riwayatTransaksi, newTransaction]);
      setTotal(result);
    } else {
      // Logika normal untuk penambahan
      const newTransaction = {
        nominal1: currentNominal,
        nominal2: 0,
        operator: null,
        result: currentNominal,
      };
      setRiwayatTransaksi([...riwayatTransaksi, newTransaction]);
      setTotal(prev => prev + currentNominal);
    }
  
    // Reset states
    setCurrentNominal(0);
    setSelectedNominal(null);
    setPendingOperator(null);
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

      {/* Tampilan Total */}
      <View style={styles.totalContainer}>
        <Image
          source={require('../../assets/icon-coin.png')}
          style={styles.coinIcon}
        />
       <Text style={styles.totalText}>
  {formatRupiah(selectedNominal !== null ? currentNominal : total)}
</Text>
      </View>

      <View style={{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",  
      }}>
        <TouchableOpacity 
          style={[styles.operatorButton, { backgroundColor: '#f9a8d4' }]} 
          onPress={() => handleOperator('+')}
        >
          <Text style={styles.symbol}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.operatorButton, { backgroundColor: '#fde68a' }]} 
          onPress={() => handleOperator('-')}
        >
          <Text style={styles.symbol}>-</Text>
        </TouchableOpacity>
      </View>

      <View style={{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        marginTop:5
      }}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#c4b5fd' }]} 
          onPress={handleKeranjang}
        >
          <Image
            source={require('../../assets/icon-belanja.png')}
            style={styles.icon}
          />
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
    width:'100%',
    justifyContent: 'center',
    height:80,
    marginBottom:10,
    marginTop:20,
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
  button: {
    width: 169,
    height: 71,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal:5
  },
  operatorButton: {
    width: 169,
    height: 71,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal:5
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
    padding:10
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
    alignItems:"center",
    justifyContent:"center",
  },
  resetButton: {
    backgroundColor: '#ef4444',
    borderRadius: 10,
    padding: 10,
    width:140,
    alignItems:"center",
    justifyContent:"center"
  },
  resetIcon: {
    width: 21.7,
    height: 25,
    tintColor: 'white',
  },
});