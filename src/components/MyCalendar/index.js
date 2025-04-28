import React from 'react';
import { StyleSheet, Text, View, Picker } from 'react-native';
import { Icon, ListItem, Button } from 'react-native-elements';
import { Color, colors } from '../../utils/colors';
import { MyDimensi, fonts } from '../../utils/fonts';
import DatePicker from 'react-native-datepicker'
import moment from 'moment';
import 'moment/locale/id'


export default function MyCalendar({
  label,
  valueShow,
  iconname,
  onDateChange,
  value,
  keyboardType,
  secureTextEntry,
  styleInput,
  placeholder,
  label2,
  iconColor = colors.black,
  textColor = colors.black,
  styleLabel,
  colorIcon = colors.primary,
  data = [],
}) {
  return (

    <View
      style={{
        marginTop:10
      }}>

      <Text
        style={{
          fontFamily:fonts.primary[600],
          color: colors.primary,
          marginBottom: 8,
          marginLeft:10
        }}>
        {label}
      </Text>


      <View style={{
        backgroundColor: colors.white,
        borderWidth: 1,
        borderRadius: 30,
        borderColor: Color.blueGray[300]
      }}>

        <View style={{
          position: 'absolute',
          left: 12,
          top: 13,
        }}>
          <Icon type='ionicon' name='calendar' color={colors.primary} size={24} />
        </View>
        <Text style={{
          position: 'absolute',
          zIndex: 0,
          ...fonts.body3,
          top: 12,
          left: 44,
        }}>{moment(value).format('DD MMMM YYYY')}</Text>
        <DatePicker

          style={{ width: '100%', height: 50, }}
          date={value}
          mode="date"
          placeholder={placeholder}
          showIcon={false}
          format="YYYY-MM-DD"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 0
            },
            dateInput: {
              textAlign: 'left',
              alignItems: 'flex-start',
              opacity: 0,
              paddingLeft: 20,
              borderWidth: 0,
            }
            // ... You can check the source to find the other keys.
          }}
          onDateChange={onDateChange}
        />
        <View style={{
          position: 'absolute',
          right: 12,
          top: 13,
        }}>
          <Icon type='ionicon' name='caret-down-outline' color={Color.blueGray[300]} size={24} />
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({});