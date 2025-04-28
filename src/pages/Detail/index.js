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

  const renderTransaction = (item, index) => {
    // For single money (first transaction)
    if (index === 0) {
      return (
        <View key={index} style={styles.transactionBlock}>
          <Image source={getImageByNominal(item.nominal1)} style={styles.uangImage} />
          <Text style={styles.equalSymbol}>=</Text>
          <Text style={styles.resultText}>{formatRupiah(item.nominal1)}</Text>
        </View>
      );
    }

    // For addition transactions
    return (
      <View key={index} style={styles.transactionBlock}>
        <View style={styles.uangRow}>
          <Image source={getImageByNominal(riwayatTransaksi[0].nominal1)} style={styles.uangImage} />
          <Text style={styles.operatorText}>+</Text>
          <Image source={getImageByNominal(item.nominal1)} style={styles.uangImage} />
        </View>
        <Text style={styles.equalSymbol}>=</Text>
        <Text style={styles.resultText}>{formatRupiah(item.result)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>DETAIL</Text>

      <View style={styles.totalContainer}>
        <Image source={require('../../assets/icon-coin.png')} style={styles.coinIcon} />
        <Text style={styles.totalText}>{formatRupiah(total)}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollArea}>
        {riwayatTransaksi.map((item, index) => renderTransaction(item, index))}
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
  totalContainer: {
    backgroundColor: '#fb5607',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
  scrollArea: {
    alignItems: 'center',
    paddingBottom: 20,
    width: '100%',
  },
  transactionBlock: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 15,
    padding: 15,
  },
  uangRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  uangImage: {
    width: windowWidth / 3.5,
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
  equalSymbol: {
    fontSize: 30,
    color: '#000',
    marginVertical: 5,
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 5,
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
});