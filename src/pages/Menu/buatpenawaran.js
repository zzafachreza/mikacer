import { View, Text, ScrollView, TouchableNativeFeedback } from 'react-native'
import React from 'react'
import { colors } from '../../utils'
import { MyHeader } from '../../components'
import { Icon } from 'react-native-elements'

export default function BuatPenawaran({navigation}) {
  return (
    <View style={{
        flex:1,
        backgroundColor:colors.white
    }}>
    <View>
        <MyHeader title="Buat Penawaran"/>
    </View>
     <ScrollView>
        <View>

        </View>
     </ScrollView>
     <View style={{
        flexDirection:"row",
        justifyContent:'flex-end',
        padding:10,

     }}>
        <TouchableNativeFeedback onPress={()=>navigation.navigate('TambahPenawaran')}>
            <View style={{
                padding:10,
                backgroundColor:colors.primary,
                borderRadius:100,

            }}>

            <Icon type='ionicon' name='add-outline' color='white' size={25}/>

            </View>
        </TouchableNativeFeedback>
     </View>
    </View>
  )
}