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
import Tts from 'react-native-tts';
import Voice from '@react-native-voice/voice';
import { Icon } from 'react-native-elements';

export default function Home({ navigation, route }) {
  Tts.setDefaultRate(0.6);
  Tts.setDefaultLanguage('in-ID');



  const [text, setText] = useState('');
  const [resultAngka, setResultAngka] = useState(null);
  const [isListening, setIsListening] = useState(false);

  // Konversi kata-kata sederhana ke angka
  const kataKeAngka = (kata) => {
    const peta = {
      "nol": 0, "satu": 1, "dua": 2, "tiga": 3, "empat": 4,
      "lima": 5, "enam": 6, "tujuh": 7, "delapan": 8, "sembilan": 9,
      "sepuluh": 10, "sebelas": 11, "seratus": 100, "seribu": 1000
      // Untuk kasus kompleks, bisa dikembangkan lebih lanjut
    };

    if (kata in peta) return peta[kata];
    return 'Tidak dikenali';
  };



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


    Tts.speak('sama dengan');
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

    // setRiwayatTransaksi([...riwayatTransaksi, transaksi]);
    setTotal(result);
    setPendingOperator(null);
    setCurrentNominal(0);
    setSelectedNominal(null);
    setPreviousTotal(0);
    console.log(result);
    if (result > 0) {
      Tts.speak(convertNumberToWords(result));
    } else {
      Tts.speak("Hitungan Kamu Minus !");
    }
  };

  const handleKeranjang = () => {


    Tts.speak('masuk keranjang')
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

  const isAngka = (value) => {
    return !isNaN(value) && Number.isFinite(Number(value));
  };

  useEffect(() => {
    Voice.onSpeechResults = (event) => {
      const spokenText = event.value[0].toLowerCase();

      let gabung = event.value[0].split(" ");
      let uang = gabung[0].replace(".", "");

      console.log(uang)

      if (isAngka(uang)) {
        Tts.speak(convertNumberToWords(uang));

        handleSelectNominal(parseInt(uang));

      } else {
        Tts.speak('Jumlah tidak dikenali')
      }

      // setText(spokenText);
      // const angka = kataKeAngka(spokenText);
      // setResultAngka(angka);
      // setIsListening(false);
    };

    Voice.onSpeechEnd = () => {
      setIsListening(false);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  function convertNumberToWords(n) {
    const satuan = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"];

    const terbilang = (x) => {
      x = Math.floor(x);
      if (x < 12) {
        return satuan[x];
      } else if (x < 20) {
        return satuan[x - 10] + " belas";
      } else if (x < 100) {
        return terbilang(x / 10) + " puluh " + terbilang(x % 10);
      } else if (x < 200) {
        return "seratus " + terbilang(x - 100);
      } else if (x < 1000) {
        return terbilang(x / 100) + " ratus " + terbilang(x % 100);
      } else if (x < 2000) {
        return "seribu " + terbilang(x - 1000);
      } else if (x < 1000000) {
        return terbilang(x / 1000) + " ribu " + terbilang(x % 1000);
      } else if (x < 1000000000) {
        return terbilang(x / 1000000) + " juta " + terbilang(x % 1000000);
      } else {
        return "Angka terlalu besar";
      }
    };

    return terbilang(n).replace(/\s+/g, " ").trim();
  }


  const mulaiDengar = async () => {
    try {
      setIsListening(true);
      setText('');
      setResultAngka(null);
      await Voice.start('id-ID');
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

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
          onPress={() => {
            handleOperator('+')

            Tts.speak('ditambah');
          }
          }
        >
          <Text style={styles.symbol}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.operatorButton, {
            backgroundColor: '#fde68a',
            borderWidth: pendingOperator === '-' ? 3 : 0,
            borderColor: '#fb5607'
          }]}
          onPress={() => {
            handleOperator('-')

            Tts.speak('dikurang');
          }
          }
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
            onPress={() => {
              handleSelectNominal(item.nominal);
              console.log(item.nominal);
              let terbilang = convertNumberToWords(item.nominal);
              console.log(terbilang);

              Tts.speak(terbilang);
            }}
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
        <TouchableOpacity style={{
          width: windowWidth / 3,
          backgroundColor: colors.secondary,
          padding: 10,
          // height: 100,
          borderRadius: 10,
        }} onPress={mulaiDengar}
          disabled={isListening}
        >
          <Icon type='ionicon' name='mic' color={colors.white} />
          <Text style={{
            fontFamily: fonts.secondary[600],
            fontSize: 10,
            textAlign: 'center',
            color: colors.white
          }}>{isListening ? 'Mendengarkan...' : 'Tekan untuk Bicara'}</Text>
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
    backgroundColor: colors.primary,
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
    width: windowWidth / 4,
    backgroundColor: '#a3a635',
    borderRadius: 14,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  detailText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resetButton: {
    width: windowWidth / 4,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  resetIcon: {
    width: 21.7,
    height: 25,
    tintColor: 'white',
  },
});
