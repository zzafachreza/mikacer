import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors, fonts, windowWidth} from '../../utils';
import Tts from 'react-native-tts';
const formatRupiah = amount => {
  return 'Rp' + (amount || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export default function DetailPage({route, navigation}) {
  const [riwayat, setRiwayat] = useState(route.params?.riwayatTransaksi || []);
  const [total, setTotal] = useState(route.params?.total || 0);
  const [duit, setDuit] = useState(route.params?.DUIT || []);

  function convertNumberToWords(n) {
    const satuan = [
      '',
      'satu',
      'dua',
      'tiga',
      'empat',
      'lima',
      'enam',
      'tujuh',
      'delapan',
      'sembilan',
      'sepuluh',
      'sebelas',
    ];

    const terbilang = x => {
      x = Math.abs(Math.floor(x));
      if (x < 12) {
        return satuan[x];
      } else if (x < 20) {
        return satuan[x - 10] + ' belas';
      } else if (x < 100) {
        return terbilang(x / 10) + ' puluh ' + terbilang(x % 10);
      } else if (x < 200) {
        return 'seratus ' + terbilang(x - 100);
      } else if (x < 1000) {
        return terbilang(x / 100) + ' ratus ' + terbilang(x % 100);
      } else if (x < 2000) {
        return 'seribu ' + terbilang(x - 1000);
      } else if (x < 1000000) {
        return terbilang(x / 1000) + ' ribu ' + terbilang(x % 1000);
      } else if (x < 1000000000) {
        return terbilang(x / 1000000) + ' juta ' + terbilang(x % 1000000);
      } else {
        return 'Angka terlalu besar';
      }
    };

    return terbilang(n).replace(/\s+/g, ' ').trim();
  }

  useEffect(() => {
    let calculatedTotal = 0;
    riwayat.forEach(item => {
      if (item.operator === '+' && !item.isKembalian) {
        calculatedTotal += item.nominal1;
      } else if (item.operator === '-') {
        calculatedTotal -= item.nominal1;
      }
      // Kembalian tidak dihitung
    });

    if (Math.abs(total) >= 0) {
      Tts.speak(convertNumberToWords(Math.abs(total)));
    } else {
      Tts.speak('Minus ' + convertNumberToWords(total));
    }

    setTotal(total);
  }, [riwayat]);

  const getImageByNominal = nominal => {
    console.log(nominal);
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

  const breakdownNominal = amount => {
    if (amount <= 0) return [];

    const availableNominals = uang.map(u => u.nominal).sort((a, b) => b - a); // Sort descending
    const result = [];
    let remaining = amount;

    for (const nominal of availableNominals) {
      while (remaining >= nominal) {
        result.push(nominal);
        remaining -= nominal;
      }
    }

    return result;
  };

  const uang = [
    {nominal: 500, src: require('../../assets/500.png')},
    {nominal: 1000, src: require('../../assets/1000.png')},
    {nominal: 2000, src: require('../../assets/2000.png')},
    {nominal: 5000, src: require('../../assets/5000.png')},
    {nominal: 10000, src: require('../../assets/10000.png')},
    {nominal: 20000, src: require('../../assets/20000.png')},
    {nominal: 50000, src: require('../../assets/50000.png')},
    {nominal: 100000, src: require('../../assets/100000.png')},
  ];

  const uangMasuk =
    riwayat.length == 1 && riwayat[0].tipe == 1
      ? [
          {nominal1: riwayat[0].nominal1, operator: riwayat[0].operator},
          {nominal1: riwayat[0].nominal2, operator: riwayat[0].operator},
        ]
      : riwayat.length == 2 && riwayat[0].tipe == 1
      ? [
          {nominal1: riwayat[0].nominal1, operator: riwayat[0].operator},
          {nominal1: riwayat[0].nominal2, operator: riwayat[0].operator},
          {nominal1: riwayat[1].nominal2, operator: riwayat[1].operator},
        ]
      : riwayat.length == 3 && riwayat[0].tipe == 1
      ? [
          {nominal1: riwayat[0].nominal1},
          {nominal1: riwayat[0].nominal2},
          {nominal1: riwayat[0].nominal1},
        ]
      : riwayat.length == 1 && riwayat[0].tipe == 2
      ? [{nominal1: riwayat[0].nominal1, operator: riwayat[0].operator}]
      : riwayat.length == 2 && riwayat[0].tipe == 2
      ? [
          {nominal1: riwayat[0].nominal1, operator: riwayat[0].operator},
          {nominal1: riwayat[1].nominal1, operator: riwayat[0].operator},
        ]
      : riwayat.length == 3 && riwayat[0].tipe == 2
      ? [
          {nominal1: riwayat[0].nominal1},
          {nominal1: riwayat[1].nominal1},
          {nominal1: riwayat[2].nominal1},
        ]
      : riwayat.filter(item => item.operator === '+' && !item.isKembalian);
  const pengeluaran = riwayat.filter(item => item.operator === '-');
  console.log('pengeluaran', riwayat);

  const kembalian = riwayat.filter(
    item => item.operator === '+' && item.isKembalian,
  );

  console.log('u', uangMasuk);

  const handleReset = () => {
    Alert.alert('Reset Berhasil', 'Semua data transaksi telah dikosongkan.');
    if (route.params?.onReset) {
      route.params.onReset();
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>DETAIL</Text>

      <View style={styles.topTotalContainer}>
        <Image
          source={require('../../assets/icon-coin.png')}
          style={styles.coinIcon}
        />
        <Text style={styles.topTotalText}>{formatRupiah(Math.abs(total))}</Text>
      </View>

      {riwayat.length > 0 && riwayat[0].tipe == 0 && (
        <ScrollView contentContainerStyle={styles.scrollArea}>
          {/* Uang Masuk */}
          {uangMasuk.length > 0 && (
            <View style={styles.columnWrap}>
              {uangMasuk.map((item, idx) => (
                <React.Fragment key={`in-${idx}`}>
                  {uang.filter(i => i.nominal == item.nominal1 || item.nominal2)
                    .length > 0 && (
                    <Image
                      source={getImageByNominal(item.nominal1 || item.nominal2)}
                      style={styles.uangImageVertical}
                    />
                  )}

                  {uang.filter(i => i.nominal == item.nominal1 || item.nominal2)
                    .length == 0 && (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <View style={{}}>
                        {breakdownNominal(item.nominal1).map(
                          (brokenNominal, index) => (
                            <Image
                              key={`${brokenNominal}-${index}`}
                              source={getImageByNominal(brokenNominal)}
                              style={[
                                styles.uangImageVertical,
                                {marginRight: 5, marginBottom: 5},
                              ]}
                            />
                          ),
                        )}
                      </View>
                    </View>
                  )}

                  {idx < uangMasuk.length - 1 && (
                    <Text style={styles.plusSymbolVertical}>+</Text>
                  )}
                </React.Fragment>
              ))}
            </View>
          )}

          {/* Pengeluaran dan Kembalian */}
          {(pengeluaran.length > 0 || kembalian.length > 0) && (
            <>
              <Text style={styles.operatorText}>-</Text>

              {pengeluaran.length > 0 && (
                <View style={[styles.rowWrap, {marginTop: 10}]}>
                  {pengeluaran.map((item, idx) => (
                    <Image
                      key={`out-${idx}`}
                      source={getImageByNominal(item.nominal1 || item.nominal2)}
                      style={[
                        styles.uangImageVertical,
                        {marginRight: 5, marginBottom: 5},
                      ]}
                    />
                  ))}
                </View>
              )}

              {kembalian.length > 0 && (
                <View style={[styles.rowWrap, {marginTop: 10}]}>
                  {kembalian.map((item, idx) => (
                    <Image
                      key={`kembali-${idx}`}
                      source={getImageByNominal(item.nominal1 || item.nominal2)}
                      style={styles.uangImageVertical}
                    />
                  ))}
                </View>
              )}
            </>
          )}

          <Text style={styles.plusSymbolVertical}>=</Text>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={{}}>
              {breakdownNominal(Math.abs(total)).map((brokenNominal, index) => (
                <Image
                  key={`${brokenNominal}-${index}`}
                  source={getImageByNominal(brokenNominal)}
                  style={[
                    styles.uangImageVertical,
                    {marginRight: 5, marginBottom: 5},
                  ]}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      )}

      {riwayat.length > 0 && riwayat[0].tipe == 1 && (
        <ScrollView contentContainerStyle={styles.scrollArea}>
          {/* Uang Masuk */}
          {uangMasuk.length > 0 && (
            <View style={styles.columnWrap}>
              {uangMasuk.map((item, idx) => (
                <React.Fragment key={`in-${idx}`}>
                  <Text style={styles.plusSymbolVertical}>
                    {idx > 0 && uangMasuk[idx].operator}
                  </Text>
                  {uang.filter(i => i.nominal == item.nominal1 || item.nominal2)
                    .length > 0 && (
                    <Image
                      source={getImageByNominal(item.nominal1)}
                      style={styles.uangImageVertical}
                    />
                  )}
                  {uang.filter(i => i.nominal == item.nominal1 || item.nominal2)
                    .length == 0 && (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <View style={{}}>
                        {breakdownNominal(item.nominal1).map(
                          (brokenNominal, index) => (
                            <Image
                              key={`${brokenNominal}-${index}`}
                              source={getImageByNominal(brokenNominal)}
                              style={[
                                styles.uangImageVertical,
                                {marginRight: 5, marginBottom: 5},
                              ]}
                            />
                          ),
                        )}
                      </View>
                    </View>
                  )}
                </React.Fragment>
              ))}
            </View>
          )}

          <Text style={styles.plusSymbolVertical}>=</Text>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={{}}>
              {breakdownNominal(Math.abs(total)).map((brokenNominal, index) => (
                <Image
                  key={`${brokenNominal}-${index}`}
                  source={getImageByNominal(brokenNominal)}
                  style={[
                    styles.uangImageVertical,
                    {marginRight: 5, marginBottom: 5},
                  ]}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      )}

      {riwayat.length > 0 && riwayat[0].tipe == 2 && (
        <ScrollView contentContainerStyle={styles.scrollArea}>
          {/* Uang Masuk */}
          {uangMasuk.length > 0 && (
            <View style={styles.columnWrap}>
              {uangMasuk.map((item, idx) => (
                <React.Fragment key={`in-${idx}`}>
                  {uang.filter(i => i.nominal == item.nominal1).length > 0 && (
                    <Image
                      source={getImageByNominal(item.nominal1)}
                      style={styles.uangImageVertical}
                    />
                  )}

                  {uang.filter(i => i.nominal == item.nominal1 || item.nominal2)
                    .length == 0 && (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <View style={{}}>
                        {breakdownNominal(item.nominal1).map(
                          (brokenNominal, index) => (
                            <Image
                              key={`${brokenNominal}-${index}`}
                              source={getImageByNominal(brokenNominal)}
                              style={[
                                styles.uangImageVertical,
                                {marginRight: 5, marginBottom: 5},
                              ]}
                            />
                          ),
                        )}
                      </View>
                    </View>
                  )}

                  {idx < uangMasuk.length - 1 && (
                    <Text style={styles.plusSymbolVertical}>+</Text>
                  )}
                </React.Fragment>
              ))}
            </View>
          )}

          {/* Pengeluaran dan Kembalian */}
          {(pengeluaran.length > 0 || kembalian.length > 0) && (
            <>
              <Text style={styles.operatorText}>-</Text>

              {pengeluaran.length > 0 && (
                <View style={[styles.rowWrap, {marginTop: 10}]}>
                  {pengeluaran.map((item, idx) => (
                    <Image
                      key={`out-${idx}`}
                      source={getImageByNominal(item.nominal2)}
                      style={[
                        styles.uangImageVertical,
                        {marginRight: 5, marginBottom: 5},
                      ]}
                    />
                  ))}
                </View>
              )}

              {kembalian.length > 0 && (
                <View style={[styles.rowWrap, {marginTop: 10}]}>
                  {kembalian.map((item, idx) => (
                    <Image
                      key={`kembali-${idx}`}
                      source={getImageByNominal(item.nominal2)}
                      style={styles.uangImageVertical}
                    />
                  ))}
                </View>
              )}
            </>
          )}

          <Text style={styles.plusSymbolVertical}>=</Text>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={{}}>
              {breakdownNominal(Math.abs(total)).map((brokenNominal, index) => (
                <Image
                  key={`${brokenNominal}-${index}`}
                  source={getImageByNominal(brokenNominal)}
                  style={[
                    styles.uangImageVertical,
                    {marginRight: 5, marginBottom: 5},
                  ]}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Kembali</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
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
    backgroundColor: colors.primary,
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
    paddingVertical: 15,
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
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  uangImage: {
    width: windowWidth / 3,
    height: 80,
    resizeMode: 'contain',
    margin: 5,
  },
  uangImageVertical: {
    width: windowWidth / 2,
    height: 80,
    resizeMode: 'contain',
    marginVertical: 4,
  },
  plusSymbolVertical: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fb5607',
    marginVertical: 6,
    textAlign: 'center',
  },
  operatorText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#000',
  },
  coinIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  resetButton: {
    backgroundColor: '#ef4444',
    borderRadius: 14,
    padding: 10,
    width: 120,
    alignItems: 'center',
  },
  resetIcon: {
    width: 21.7,
    height: 25,
    tintColor: 'white',
  },
  backButton: {
    backgroundColor: '#a3a635',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  backText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  columnWrap: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
