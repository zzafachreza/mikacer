import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { colors, fonts, windowWidth } from '../../utils';

const formatRupiah = (amount) => {
  return 'Rp' + (amount || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export default function DetailPage({ route, navigation }) {
  const { riwayatTransaksi = [], total = 0 } = route.params || {};

  const getImageByNominal = (nominal) => {
    const imageMap = {
      500: require('../../assets/500.png'),
      1000: require('../../assets/1000.png'),
      2000: require('../../assets/2000.png'),
      5000: require('../../assets/5000.png'),
      10000: require('../../assets/10000.png'),
      20000: require('../../assets/20000.png'),
      50000: require('../../assets/50000.png'),
      100000: require('../../assets/100000.png'),
    };
    return imageMap[nominal] || null;
  };

  const calculateTotal = () => {
    return riwayatTransaksi.reduce((sum, item) => {
      if (item.operator === '+') return sum + item.nominal2;
      if (item.operator === '-') return sum - item.nominal2;
      return sum + item.nominal1;
    }, 0);
  };

  const renderTransaction = () => {
    if (riwayatTransaksi.length === 0) return null;
  
    // Kelompokkan uang menjadi pasangan 2-2
    const pairs = [];
    for (let i = 0; i < riwayatTransaksi.length; i += 2) {
      pairs.push(riwayatTransaksi.slice(i, i + 2));
    }
  
    return (
      <View style={styles.transactionContainer}>
        {pairs.map((pair, pairIndex) => {
          // Jika ini pasangan terakhir dan hanya ada 1 uang (ganjil)
          if (pair.length === 1 && pairIndex === pairs.length - 1) {
            return (
              <View key={pairIndex} style={styles.singleItemContainer}>
                <Image 
                  source={getImageByNominal(pair[0].nominal1)} 
                  style={styles.uangImage} 
                />
              </View>
            );
          }
          
          // Untuk pasangan normal (2 uang)
          return (
            <View key={pairIndex} style={styles.horizontalPair}>
              <Image 
                source={getImageByNominal(pair[0].nominal1)} 
                style={styles.uangImage} 
              />
              <Text style={styles.operatorText}>+</Text>
              <Image 
                source={getImageByNominal(pair[1].nominal1)} 
                style={styles.uangImage} 
              />
            </View>
          );
        })}
      </View>
    );
  };
  

  const displayTotal = total > 0 ? total : calculateTotal();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>DETAIL</Text>
      
      {/* Total display at the top (warna merah) */}
      <View style={styles.topTotalContainer}>
        <Image source={require('../../assets/icon-coin.png')} style={styles.coinIcon} />
        <Text style={styles.topTotalText}>{formatRupiah(displayTotal)}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollArea}>
        {renderTransaction()}
      </ScrollView>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Kembali</Text>
      </TouchableOpacity>
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
  header: {
    fontSize: 32,
    fontFamily: fonts.primary[800],
    color: '#fb5607',
    marginTop: 10,
    marginBottom: 20,
  },
  topTotalContainer: {
    backgroundColor: '#fb5607',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    justifyContent: 'center',
  },
  topTotalText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  scrollArea: {
    alignItems: 'center',
    paddingBottom: 20,
    width: '100%',
  },
  transactionContainer: {
    width: '100%',
    alignItems: 'center',
  },
  operationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  uangImage: {
    width: windowWidth / 2.5,
    height: 80,
    resizeMode: 'contain',
    marginHorizontal: 10,
  },
  operatorText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000',
    marginHorizontal: 15,
  },
  coinIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  backButton: {
    marginTop: 10,
    backgroundColor: '#fb5607',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 60,
  },
  backText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  transactionContainer: {
    alignItems: 'center',
    width: '100%',
  },
  pairContainer: {
    marginBottom: 10,
    alignItems: 'center',
  },
  horizontalPair: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  singleItemContainer: {
    alignItems: 'center',
    marginTop: 5,
  },
  uangImage: {
    width: windowWidth / 3,
    height: 70,
    resizeMode: 'contain',
    marginHorizontal: 5,
  },
  operatorText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
    marginHorizontal: 10,
  },
});