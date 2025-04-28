import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, FlatList, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Icon } from 'react-native-elements';
import { Color, colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';

export default function MyPicker({
  label,
  iconname,
  onChangeText,
  value = '',  // Pastikan value punya default value
  data = [],
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(data[0]);  // Default selected item
  
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        setSelectedItem(item);  // Simpan item yang dipilih
        onChangeText(item.value);  // Update value sesuai yang dipilih
        setModalVisible(false);
      }}
    >
      <Text style={styles.itemText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <Text
        style={{
          fontFamily: fonts.primary[600],
          color: colors.primary,
          marginBottom: 8,
          marginTop: 10,
          marginLeft: 10,
        }}
      >
        {label}
      </Text>

      <TouchableOpacity
        style={styles.pickerContainer}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.iconContainer}>
          <Icon type="ionicon" name={iconname} color={Color.blueGray[300]} size={24} />
        </View>
        {/* Menampilkan nilai yang dipilih atau teks placeholder */}
        <Text style={styles.selectedText}>
          {selectedItem ? selectedItem.label : 'Select an option'}
        </Text>
        <View style={styles.iconContainer}>
          <Icon type="ionicon" name="caret-down-outline" color={Color.blueGray[300]} size={24} />
        </View>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <FlatList
                  data={data}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.value}
                  style={styles.flatList}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: Color.blueGray[300],
    minHeight: 60,  // Atur minimum height supaya cukup untuk teks panjang
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  iconContainer: {
    flex: 1,
  },
  selectedText: {
    flex: 8,
    fontSize: 14,
    fontFamily: fonts.primary[500],
    color: colors.primary,
    textAlign: 'left',  // Teks diatur agar di kiri
    flexShrink: 1,      // Agar teks bisa disesuaikan dengan ruang yang ada
    flexWrap: 'wrap',   // Agar teks panjang bisa dibungkus ke baris berikutnya
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    width: '80%',
    maxHeight: '50%',
  },
  flatList: {
    marginVertical: 10,
  },
  itemContainer: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  itemText: {
    fontSize: 14,
    fontFamily: fonts.primary[500],
    color: colors.primary,
    flexWrap: 'wrap',  // Pastikan teks panjang dibungkus
  },
});
