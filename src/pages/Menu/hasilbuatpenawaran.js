import { View, Text, ScrollView, TouchableNativeFeedback } from 'react-native'
import React from 'react'

import { MyHeader } from '../../components'
import { Image } from 'react-native'
import { Color, colors, fonts } from '../../utils'

export default function HasilBuatPenawaran({navigation}) {
  return (
    <View style={{
        flex:1,
        backgroundColor:colors.white,

    }}>
      <View>
        <MyHeader title='Buat Penawaran'/>
      </View>

      <ScrollView>
        <View style={{
            padding:10,

        }}>

        {/* HASIL PENAWARAN */}
        {/* DUMMY */}
        <View style={{
            alignItems:"center"
        }}>
            <Image style={{
                width:412,
                height:580
            }} source={require('../../assets/penawaran_dummy.png')}/>
        </View>

        <View style={{
            flexDirection:"row",
            justifyContent:'space-between',
         
            
        }}>

        <TouchableNativeFeedback>
            <View style={{
                padding:10,
                backgroundColor:colors.tertiary,
                borderRadius:30,
                width:160
            }}>
            <Text style={{
                fontFamily:fonts.primary[600],
                fontSize:15,
                color:colors.white,
                textAlign:"center"
            }}>Edit</Text>

            </View>
        </TouchableNativeFeedback>

        <TouchableNativeFeedback>
            <View style={{
                padding:10,
                backgroundColor:colors.primary,
                borderRadius:30,
                width:160
            }}>
            <Text style={{
                fontFamily:fonts.primary[600],
                color:colors.white,
                fontSize:15,
                textAlign:'center',
               
            }}>Simpan</Text>

            </View>
        </TouchableNativeFeedback>

        </View>

        </View>
      </ScrollView>

    </View>
  )
}