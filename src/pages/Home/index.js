import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {colors, fonts, windowWidth} from '../../utils';
import {formatRupiah} from '../../utils/currency';
import Tts from 'react-native-tts';
import Voice from '@react-native-voice/voice';
import {Icon} from 'react-native-elements';

export default function Home({navigation, route}) {
  Tts.setDefaultRate(0.6);
  Tts.setDefaultLanguage('in-ID');

  const [text, setText] = useState('');
  const [resultAngka, setResultAngka] = useState(null);
  const [isListening, setIsListening] = useState(false);

  // Konversi kata-kata sederhana ke angka
  const kataKeAngka = kata => {
    const peta = {
      nol: 0,
      satu: 1,
      dua: 2,
      tiga: 3,
      empat: 4,
      lima: 5,
      enam: 6,
      tujuh: 7,
      delapan: 8,
      sembilan: 9,
      sepuluh: 10,
      sebelas: 11,
      seratus: 100,
      seribu: 1000,
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
    {nominal: 500, src: require('../../assets/500.png')},
    {nominal: 1000, src: require('../../assets/1000.png')},
    {nominal: 2000, src: require('../../assets/2000.png')},
    {nominal: 5000, src: require('../../assets/5000.png')},
    {nominal: 10000, src: require('../../assets/10000.png')},
    {nominal: 20000, src: require('../../assets/20000.png')},
    {nominal: 50000, src: require('../../assets/50000.png')},
    {nominal: 100000, src: require('../../assets/100000.png')},
  ];

  const handleOperator = operator => {
    setPreviousTotal(total);
    setPendingOperator(operator);
    setCurrentNominal(0);
    setSelectedNominal(null);
  };

  const handleNominalClick = nominal => {
    setCurrentNominal(nominal);
    setSelectedNominal(nominal);
    if (!pendingOperator && total === 0 && riwayatTransaksi.length === 0) {
      setTotal(nominal);
    }
  };

  const [DUIT, setDUIT] = useState([]);

  const handleEqual = () => {
    Tts.speak('sama dengan');
    if (!pendingOperator || currentNominal === 0) return;

    const baseValue = previousTotal !== 0 ? previousTotal : total;

    const result =
      pendingOperator === '+'
        ? baseValue + currentNominal
        : baseValue - currentNominal;

    setTotal(result);
    setPendingOperator(null);
    setCurrentNominal(0);
    setSelectedNominal(null);
    setPreviousTotal(0);
    console.log(result);

    const transaksi = {
      nominal1: baseValue,
      nominal2: currentNominal,
      operator: pendingOperator,
      result: Math.abs(result),
      tipe: 1,
    };

    console.log(transaksi);
    console.log(total);

    console.log([...riwayatTransaksi, transaksi]);

    setRiwayatTransaksi([...riwayatTransaksi, transaksi]);

    if (Math.abs(result) > 0) {
      Tts.speak(convertNumberToWords(Math.abs(result)));
    } else {
      console.log(Math.abs(result));
      Tts.speak('Minus ' + convertNumberToWords(Math.abs(result)));
      // Tts.speak('Hitungan Kamu Minus !');
    }
  };

  const handleKeranjang = () => {
    console.log('🔥 === HANDLE KERANJANG DEBUG ===');
    console.log('📊 State saat ini:');
    console.log('  currentNominal:', currentNominal);
    console.log('  total:', total);
    console.log('  pendingOperator:', pendingOperator);
    console.log('  isInKembalianMode:', isInKembalianMode);
    console.log('  riwayatTransaksi.length:', riwayatTransaksi.length);
    console.log('  riwayatTransaksi:', riwayatTransaksi);

    Tts.speak('masuk keranjang');

    // Early return jika tidak ada data untuk diproses
    if (currentNominal === 0 && total === 0) {
      console.log('⚠️ SKIP: Tidak ada data untuk diproses');
      return;
    }

    // PERBAIKAN 1: Deteksi input berulang
    const lastTransaction = riwayatTransaksi[riwayatTransaksi.length - 1];
    const isRepeatedInput =
      lastTransaction &&
      lastTransaction.nominal1 === currentNominal &&
      lastTransaction.result === total &&
      !pendingOperator &&
      currentNominal !== 0;

    console.log('🔎 Checking for repeated input:');
    console.log('  lastTransaction:', lastTransaction);
    console.log('  isRepeatedInput:', isRepeatedInput);

    if (isRepeatedInput) {
      console.log(
        '⚠️ SKIP: Input berulang terdeteksi, tidak akan menambahkan lagi',
      );
      // Reset current nominal saja, jangan tambahkan ke transaksi
      setCurrentNominal(0);
      setSelectedNominal(null);
      return;
    }

    // PERBAIKAN 2: Logika untuk transaksi pertama
    const isFirstTransaction =
      riwayatTransaksi.length === 0 && !pendingOperator && currentNominal > 0;

    console.log('🔎 Checking first transaction:');
    console.log('  isFirstTransaction:', isFirstTransaction);

    if (isFirstTransaction) {
      console.log('✅ MASUK KONDISI TRANSAKSI PERTAMA');
      const transaksi = {
        operator: '+',
        nominal1: currentNominal,
        result: currentNominal,
        isKembalian: false,
        tipe: 0,
      };

      console.log('  Transaksi pertama:', transaksi);
      setRiwayatTransaksi([transaksi]);
      setTotal(currentNominal);
      setCurrentNominal(0);
      setSelectedNominal(null);
      return;
    }

    // PERBAIKAN 3: Handle kembalian mode
    if (isInKembalianMode && currentNominal > 0) {
      console.log('💰 MASUK KONDISI KEMBALIAN MODE');
      const kembalian = currentNominal - total;
      console.log(`🧮 Kembalian: ${currentNominal} - ${total} = ${kembalian}`);

      const transaksiKembalian = {
        operator: 'kembalian',
        nominal1: currentNominal,
        result: Math.abs(kembalian),
        isKembalian: true,
        tipe: 1,
      };

      setRiwayatTransaksi([...riwayatTransaksi, transaksiKembalian]);
      setTotal(Math.abs(kembalian));
      setCurrentNominal(0);
      setSelectedNominal(null);
      setIsInKembalianMode(false);
      setPendingOperator(null);

      // Speak the kembalian
      Tts.speak(`kembalian ${convertNumberToWords(Math.abs(kembalian))}`);
      return;
    }

    // PERBAIKAN 4: Normal calculation dengan validasi
    if (currentNominal > 0) {
      console.log('🔄 MASUK KONDISI NORMAL CALCULATION');

      let result = total;
      const operatorToUse = pendingOperator || '+';

      console.log('🧮 Calculation:');
      console.log('  Initial result (total):', result);
      console.log('  operatorToUse:', operatorToUse);
      console.log('  currentNominal:', currentNominal);

      // Validasi: Cek apakah ini adalah penambahan yang tidak diinginkan
      if (
        operatorToUse === '+' &&
        result === currentNominal &&
        riwayatTransaksi.length > 0
      ) {
        console.log('⚠️ WARNING: Possible unwanted addition detected');

        // Cek apakah transaksi terakhir sudah sama
        if (lastTransaction && lastTransaction.result === result) {
          console.log('⚠️ SKIP: Transaksi sudah ada dengan hasil yang sama');
          setCurrentNominal(0);
          setSelectedNominal(null);
          return;
        }
      }

      // Lakukan perhitungan
      switch (operatorToUse) {
        case '+':
          result = total + currentNominal;
          console.log(`  Addition: ${total} + ${currentNominal} = ${result}`);
          break;
        case '-':
          result = total - currentNominal;
          console.log(
            `  Subtraction: ${total} - ${currentNominal} = ${result}`,
          );

          // Jika hasil negatif, masuk ke kembalian mode
          if (result < 0) {
            console.log('  Result is negative, entering kembalian mode');
            setIsInKembalianMode(true);
            // Jangan lanjutkan, biarkan user input nominal pembayaran
            return;
          }
          break;
        default:
          result = total + currentNominal;
          console.log(
            `  Default Addition: ${total} + ${currentNominal} = ${result}`,
          );
      }

      // Buat transaksi baru
      const transaksi = {
        operator: operatorToUse,
        nominal1: currentNominal,
        result: result,
        isKembalian: false,
        tipe: 0,
      };

      console.log('📝 Transaksi baru:', transaksi);

      // Update state
      const updatedTransaksi = [...riwayatTransaksi, transaksi];
      console.log('📋 Updated riwayatTransaksi:', updatedTransaksi);

      setRiwayatTransaksi(updatedTransaksi);
      setTotal(result);
      setCurrentNominal(0);
      setSelectedNominal(null);
      setPendingOperator(null);
      setPreviousTotal(0);

      console.log('🔚 Final states:');
      console.log('  new total:', result);
      console.log('  reset currentNominal: 0');
      console.log('  reset pendingOperator: null');

      // Speak the result
      Tts.speak(convertNumberToWords(result));
    }

    console.log('🏁 === END HANDLE KERANJANG ===\n');
  };

  const resetAll = () => {
    setTotal(0);
    setDUIT([]);
    setCurrentNominal(0);
    setPreviousTotal(0);
    setPendingOperator(null);
    setRiwayatTransaksi([]);
    setSelectedNominal(null);
    setIsInKembalianMode(false); // ✅ reset juga
  };

  const goToDetail = () => {
    console.log({
      riwayatTransaksi,
      total,
      DUIT,
    });
    navigation.navigate('Detail', {
      riwayatTransaksi,
      total,
      DUIT,
      onReset: () => {
        setRiwayatTransaksi([]);
        setTotal(0);
      },
    });
  };

  // PERBAIKAN 5: Modifikasi handleSelectNominal untuk menghindari konflik
  const handleSelectNominal = nominal => {
    console.log('🎯 === HANDLE SELECT NOMINAL ===');
    console.log('nominal:', nominal);
    console.log(
      'uang filter:',
      uang.filter(i => i.nominal == nominal),
    );

    if (uang.filter(i => i.nominal == nominal).length > 0) {
      console.log('NORMAL - nominal ada di daftar uang');
    } else {
      console.log('TIDAK NORMAL - nominal tidak ada di daftar uang');
    }

    // PERBAIKAN: Cek apakah ini input berulang
    if (selectedNominal === nominal && currentNominal === nominal) {
      console.log('⚠️ SKIP: Nominal yang sama sudah dipilih');
      return;
    }

    const newNominal = selectedNominal === nominal ? 0 : nominal;
    setCurrentNominal(newNominal);
    setSelectedNominal(newNominal);

    // Update DUIT array
    const updated = [...DUIT, newNominal];
    setDUIT(updated);

    // Hanya set total jika ini adalah transaksi pertama
    if (
      !pendingOperator &&
      total === 0 &&
      riwayatTransaksi.length === 0 &&
      newNominal > 0
    ) {
      console.log('Setting initial total:', newNominal);
      setTotal(newNominal);
    }

    console.log('🏁 === END SELECT NOMINAL ===\n');
  };

  useEffect(() => {
    if (route.params?.resetData) {
      resetAll();
    }
  }, [route.params]);

  const isAngka = value => {
    return !isNaN(value) && Number.isFinite(Number(value));
  };

  // PERBAIKAN 6: Modifikasi Voice handler untuk konsistensi
  useEffect(() => {
    Voice.onSpeechResults = event => {
      const spokenText = event.value[0].toLowerCase();
      console.log('🎤 === VOICE RECOGNITION ===');
      console.log('hasil suara:', spokenText);

      let gabung = event.value[0].split(' ');
      let nominalStr = gabung[0].replace('.', '');

      if (isAngka(nominalStr)) {
        const nominal = parseFloat(nominalStr);
        console.log('suara nominal:', nominal);

        // Cek apakah ini input berulang dari voice
        if (currentNominal === nominal) {
          console.log('⚠️ SKIP: Voice input berulang');
          return;
        }

        Tts.speak(convertNumberToWords(nominal));
        handleSelectNominal(nominal);
      } else {
        console.log('❌ Nominal tidak dikenali');
        Tts.speak('Jumlah tidak dikenali');
      }

      console.log('🏁 === END VOICE RECOGNITION ===\n');
    };

    Voice.onSpeechEnd = () => {
      setIsListening(false);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [currentNominal, selectedNominal, total, riwayatTransaksi]);

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
      x = Math.floor(x);
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
      <View
        style={{
          width: windowWidth,
          position: 'relative',
        }}>
        <Text style={styles.title}>MIKACER</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Info')}
          style={{
            position: 'absolute',
            right: 10,
            top: 5,
            padding: 5,
          }}>
          <Icon
            type="ionicon"
            name="information-circle-outline"
            color={colors.secondary}
            size={40}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.totalContainer}>
        <Image
          source={require('../../assets/icon-coin.png')}
          style={styles.coinIcon}
        />
        <Text style={styles.totalText}>
          {formatRupiah(
            pendingOperator ? Math.abs(currentNominal) : Math.abs(total),
          )}
        </Text>
      </View>

      <View style={styles.operatorRow}>
        <TouchableOpacity
          style={[
            styles.operatorButton,
            {
              backgroundColor: '#f9a8d4',
              borderWidth: pendingOperator === '+' ? 3 : 0,
              borderColor: '#fb5607',
            },
          ]}
          onPress={() => {
            handleOperator('+');

            Tts.speak('ditambah');
          }}>
          <Text style={styles.symbol}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.operatorButton,
            {
              backgroundColor: '#fde68a',
              borderWidth: pendingOperator === '-' ? 3 : 0,
              borderColor: '#fb5607',
            },
          ]}
          onPress={() => {
            handleOperator('-');

            Tts.speak('dikurang');
          }}>
          <Text style={styles.symbol}>-</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: '#7dd3fc',
              borderWidth: keranjangHighlight ? 3 : 0,
              borderColor: keranjangHighlight ? '#fb5607' : 'transparent',
            },
          ]}
          onPress={handleKeranjang}>
          <Image
            source={require('../../assets/icon-belanja.png')}
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, {backgroundColor: '#c4b5fd'}]}
          onPress={handleEqual}>
          <Text style={styles.symbol}>=</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.moneyGrid}>
        {uang.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              handleSelectNominal(item.nominal);
              // console.log(item.nominal);
              let terbilang = convertNumberToWords(item.nominal);
              // console.log(terbilang);

              Tts.speak(terbilang);
            }}>
            <Image
              source={item.src}
              style={[
                styles.uangImage,
                selectedNominal === item.nominal && styles.selectedUang,
              ]}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.detailButton} onPress={goToDetail}>
          <Text style={styles.detailText}>Lihat Detail</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: windowWidth / 3,
            backgroundColor: colors.secondary,
            padding: 10,
            // height: 100,
            borderRadius: 10,
          }}
          onPress={mulaiDengar}
          disabled={isListening}>
          <Icon type="ionicon" name="mic" color={colors.white} />
          <Text
            style={{
              fontFamily: fonts.secondary[600],
              fontSize: 10,
              textAlign: 'center',
              color: colors.white,
            }}>
            {isListening ? 'Mendengarkan...' : 'Tekan untuk Bicara'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton} onPress={resetAll}>
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
    padding: 5,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
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
    marginTop: 5,
  },
  button: {
    width: 169,
    height: 71,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  operatorButton: {
    width: 169,
    height: 71,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  symbol: {
    lineHeight: 70,
    fontSize: 65,
    color: '#000',
    textShadowColor: 'black',

    fontWeight: 'bold',
  },
  icon: {
    width: 50,
    height: 50,
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
    padding: 10,
  },
  detailButton: {
    width: windowWidth / 4,
    backgroundColor: '#a3a635',
    borderRadius: 14,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
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
    justifyContent: 'center',
  },
  resetIcon: {
    width: 21.7,
    height: 25,
    tintColor: 'white',
  },
});
