import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import { colors, fonts } from '../../utils';
import { MyHeader } from '../../components';

export default function Petunjuk({ navigation }) {
  // Data for the table
  const tableHead = ['Bahan Kompos', 'C/N Ratio', 'Kelembapan'];
  const tableData = [
    ['Kotoran Sapi', '19', '81%'],
    ['Eceng Gondok', '25', '93%'],
    ['Sekam Padi', '120', '14%'],
    ['Abu Sekam Padi', '22', '15%'],
    ['Dedak', '10', '9%'],
    ['Kotoran Ayam', '14', '37%'],
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.tertiary }}>
      <MyHeader title="Petunjuk" onPress={() => navigation.goBack()} />

      <ScrollView>
        <View style={{ padding: 10 }}>
          <View
            style={{
              padding: 10,
              backgroundColor: colors.primary,
              borderRadius: 30,
            }}>
            <Text
              style={{
                color: colors.white,
                fontFamily: fonts.primary[600],
                fontSize: 16,
                textAlign: 'center',
              }}>
              Tahap input komposisi bahan dengan Klik Kompos:
            </Text>
          </View>

          <View style={{ marginTop: 20 }}>
            <Text
              style={{
                color: colors.coklat,
                fontFamily: fonts.primary[600],
                textAlign: 'center',
                marginBottom: 20,
              }}>
              Tabel Kandungan Bahan Kompos
            </Text>

            {/* TABEL */}
            <View style={styles.tableContainer}>
              <Table borderStyle={{ borderWidth: 1, borderColor: colors.coklat }}>
                <Row data={tableHead} style={styles.head} textStyle={styles.headerText} />
                <Rows data={tableData} style={styles.row} textStyle={styles.text} />
              </Table>
            </View>

            <View style={{
              padding: 20,
            }}>
              <Text style={{
                fontFamily: fonts.primary[500],
                textAlign: 'justify',
                color: colors.coklat
              }}>
                1. Hitung komposisi bahan dengan klik kompos sesuai target hasil C/N ratio 20-40 dan target hasil kelembapan 40-60
              </Text>
              <Text style={{
                fontFamily: fonts.primary[500],
                textAlign: 'justify',
                color: colors.coklat
              }}>
                2. Takaran komposisi bahan bisa menggunakan ember, tong, dll
              </Text>

              <Text style={{
                fontFamily: fonts.primary[500],
                textAlign: 'justify',
                color: colors.coklat
              }}>
                3. Jika takaran komposisi diisi angka 2, artinya bahan tersebut ditakar dengan 2 takaran yang sama.
              </Text>

              <Text style={{
                fontFamily: fonts.primary[500],
                textAlign: 'justify',
                color: colors.coklat
              }}>
                4. Jika hasil C/N ratio di bawah 20-40 maka tambahkan bahan dengan C/N ratio tinggi, atau kurangi bahan dengan C/N ratio rendah
              </Text>

              <Text style={{
                fontFamily: fonts.primary[500],
                textAlign: 'justify',
                color: colors.coklat
              }}>
                5. Jika hasil C/N ratio di atas 20-40 maka tambahkan bahan dengan C/N ratio rendah atau kurangi bahan dengan C/N ratio tinggi
              </Text>

              <Text style={{
                fontFamily: fonts.primary[500],
                textAlign: 'justify',
                color: colors.coklat
              }}>
                6. Jika hasil kelembapan di bawah 40-60% maka tambahkan bahan dengan    kelembapan tinggi, atau kurangi bahan dengan kelembapan rendah
              </Text>

              <Text style={{
                fontFamily: fonts.primary[500],
                textAlign: 'justify',
                color: colors.coklat
              }}>
                7. Jika hasil kelembapan di atas 40-60% maka tambahkan bahan dengan kelembapan rendah atau dikurangi bahan dengan kelembapan tinggi
              </Text>

              <Text style={{
                fontFamily: fonts.primary[500],
                textAlign: 'justify',
                color: colors.coklat
              }}>
                8. Setelah di campur semua bahan dan dedak, tambahkan dekomposer

              </Text>

              
              <Text style={{
                fontFamily: fonts.primary[500],
                textAlign: 'justify',
                color: colors.coklat
              }}>
                9. Proses pengomposan dilakukan secara tertutup, dan lakukan pembalikan 1 kali seminggu. Suhu panas saat proses pengomposan menunjukkan dekomposisi berjalan baik

              </Text>


              <Text style={{
                fontFamily: fonts.primary[600],
                textAlign: 'justify',
                color: colors.primary,
                marginTop: 20
              }}>
                Informasi Lebih Lanjut:{'\n'}
                E-mail: syariffadillah@gmail.com

              </Text>

            </View>

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tableContainer: {
    marginBottom: 20,
    padding: 10
  },
  head: {
    height: 50,
    backgroundColor: colors.tertiary,
  },
  headerText: {
    fontFamily: fonts.primary[600],
    fontSize: 16,
    color: colors.coklat,
    textAlign: 'center',
    padding: 10
  },
  row: {

    backgroundColor: '#fff',


  },
  text: {
    fontFamily: fonts.primary[400],
    fontSize: 15,
    color: colors.coklat,
    textAlign: 'center',

  },
});
