import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {colors, fonts} from '../../utils';
import {MyHeader} from '../../components';

export default function Info({navigation, route}) {
  const MyPilih = ({label, onPress}) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          marginBottom: 10,
          backgroundColor: colors.secondary,
          padding: 20,
          height: 100,
          borderRadius: 10,
          justifyContent: 'center',
          //   alignItems: 'center',
        }}>
        <Text
          style={{
            fontFamily: fonts.secondary[600],
            color: colors.white,
            fontSize: 18,
            textAlign: 'center',
          }}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>
      <View
        style={{
          padding: 10,
          height: 60,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontFamily: fonts.secondary[800],
            fontSize: 20,
            textAlign: 'center',
            color: colors.secondary,
          }}>
          INFORMASI
        </Text>
      </View>
      <View
        style={{
          flex: 1,
        }}>
        <View
          style={{
            flex: 0.5,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontFamily: fonts.secondary[600],
              textAlign: 'center',
              fontSize: 18,
            }}>
            Pencipta Aplikasi
          </Text>
          <Text
            style={{
              fontFamily: fonts.secondary[800],
              textAlign: 'center',
              fontSize: 22,
            }}>
            Resvi Fitri
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            padding: 10,
          }}>
          <MyPilih
            label="Tutorial Menghitung Jumlah Uang"
            onPress={() =>
              navigation.navigate('Tutorial', {
                link_youtube: 'rVoPmiwT5vQ',
              })
            }
          />
          <MyPilih
            label="Tutorial Menghitung Pengurangan Uang"
            onPress={() =>
              navigation.navigate('Tutorial', {
                link_youtube: 'PJb5FQKYMRQ',
              })
            }
          />
          <MyPilih
            label="Tutorial Menghitung Total Belanja dan Uang Kembalian"
            onPress={() =>
              navigation.navigate('Tutorial', {
                link_youtube: 'Tr_X5JgQDcQ',
              })
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
