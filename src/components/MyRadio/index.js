import React from 'react';
import { View, Text, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { colors, fonts, MyDimensi } from '../../utils';

export default function MyRadio({ label, selected, onPress }) {
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={styles.container}>
                <View style={styles.radioButton}>
                    {selected && <View style={styles.radioButtonSelected} />}
                </View>
                <Text style={styles.radioLabel}>{label}</Text>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    radioButton: {
        width: 24,   // Ukuran lingkaran besar
        height: 24,
        backgroundColor: colors.white,
        borderRadius: 12,  // Membuat lingkaran
        borderColor: colors.primary,  // Warna border
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButtonSelected: {
        width: 12,   // Ukuran lingkaran kecil di dalamnya
        height: 12,
        backgroundColor: colors.primary,  // Warna lingkaran kecil saat dipilih
        borderRadius: 6,  // Membuat lingkaran kecil
    },
    radioLabel: {
        marginLeft: 15,  // Jarak antara radio button dan teks
        fontSize: MyDimensi / 4,
        fontFamily: fonts.secondary[600],
        color: colors.primary,
    },
});
