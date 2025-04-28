import { View, Text, ImageBackground, ScrollView, TouchableNativeFeedback } from 'react-native'
import React, { useState } from 'react'
import { fonts } from '../../utils'
import { MyInput } from '../../components'
import { colors } from '../../utils/colors'
import { showMessage } from 'react-native-flash-message'
import axios from 'axios'

export default function Register({navigation}) {

    const [data, setData] = useState({
        nama:'',
        email:'',
        telepon:'',
        alamat:'',
        password:'',


    });

    const handleRegister = () => {
        if (data.nama.length == '' || data.email.length == '' || data.telepon.length == '' || data.alamat.length == '' || data.password.length == '') { 
            showMessage({
                type:'danger',
                backgroundColor:colors.danger,
                color:colors.white,
                message:'Semua Field Harus Diisi!',
                position:'top',
                style:{borderBottomRightRadius:10, borderBottomLeftRadius:10,},
                textStyle:{fontFamily:fonts.primary[600]}
            })
        } else if (data.nama.length === '') {
            showMessage({
                type:'danger',
                backgroundColor:colors.danger,
                color:colors.white,
                message:'Nama Harus Diisi!',
                position:'top',
                style:{borderBottomRightRadius:10, borderBottomLeftRadius:10,},
                textStyle:{fontFamily:fonts.primary[600]}
        });
     } else if (data.email.length === '') {
        showMessage({
            type:'danger',
            backgroundColor:colors.danger,
            color:colors.white,
            message:'Email Harus Diisi!',
            position:'top',
            style:{borderBottomRightRadius:10, borderBottomLeftRadius:10,},
            textStyle:{fontFamily:fonts.primary[600]}
        });
     } else if (data.telepon.length === '') {
        showMessage({
            type:'danger',
            backgroundColor:colors.danger,
            color:colors.white,
            message:'Telepon Harus Diisi!',
            position:'top',
            style:{borderBottomRightRadius:10, borderBottomLeftRadius:10,},
            textStyle:{fontFamily:fonts.primary[600]}
        });
     } else if (data.alamat.length === '') {
        showMessage({
            type:'danger',
            backgroundColor:colors.danger,
            color:colors.white,
            message:'Alamat Harus Diisi!',
            position:'top',
            style:{borderBottomRightRadius:10, borderBottomLeftRadius:10,},
            textStyle:{fontFamily:fonts.primary[600]}
        });
     } else if (data.password.length === '') {
        showMessage({
            type:'danger',
            backgroundColor:colors.danger,
            color:colors.white,
            message:'Password Harus Diisi!',
            position:'top',
            style:{borderBottomRightRadius:10, borderBottomLeftRadius:10,},
            textStyle:{fontFamily:fonts.primary[600]}
        });
     } else {
        console.log('Data yang dikirim: ', data);
        axios
        .post('API KEY', data)
        .then((res) => {
            if (res.data.status == 'success') {
                showMessage({
                    type:'success',
                    backgroundColor:colors.success,
                    color:colors.white,
                    message:'Selamat Anda Berhasil Mendaftar!'
                });
                navigation.navigate('Login');
            } else {
                showMessage({
                    type:'danger',
                    backgroundColor:colors.danger,
                    color:colors.white,
                    message:'Akun Sudah Terdaftar!'
                });
            }
        })
        .catch((err) => {
            console.error('Error: ', err);
        });
     }
    };


  return (
    <ImageBackground source={require('../../assets/bgregister.png')} style={{
        flex:1,
        width:"100%",
        height:"100%",
    }}>
      <ScrollView>
        <View style={{
            padding:10
        }}>

        <View style={{
            marginTop:'60%'
        }}>
            <Text style={{
                fontFamily:fonts.primary[600],
                fontSize:25,
                textAlign:'center',
                color:'white',
            }}>Daftar</Text>

            <View style={{
                padding:10,
            }}>

            <MyInput value={data.nama} 
            label="Nama Lengkap" 
            colorlabel='white' 
            placeholder="Isi Nama Lengkap" 
            onChangeText={(x) => setData({...data, 'nama':x})}
            />

            <MyInput 
            value={data.email}
            label="Email" 
            colorlabel='white' 
            placeholder="Isi Email"
            onChangeText={(x) => setData({...data, 'email':x})}
            />

            <MyInput 
            value={data.telepon}
            label="Telepon"
            colorlabel='white' 
            placeholder="Isi Telepon"
            onChangeText={(x) => setData({...data, 'telepon':x})}
            />

            <MyInput 
            value={data.alamat}
            label="Alamat Lengkap" 
            colorlabel='white'
            placeholder="Isi Alamat Lengkap"
            onChangeText={(x) => setData({...data, 'alamat':x})}
             />

            <MyInput
            value={data.password}
             label="Kata Sandi" 
             colorlabel='white' 
             placeholder="Isi Kata Sandi" 
             secureTextEntry={true}
            onChangeText={(x) => setData({...data, 'password':x})}
             />


            <View>
                <TouchableNativeFeedback onPress={handleRegister}>
                    <View style={{
                        padding:10,
                        backgroundColor:colors.secondary,
                        borderRadius:30,
                        marginTop:20,

                    }}>
                        <Text style={{
                            fontFamily:fonts.primary[600],
                            color:colors.white,
                            textAlign:'center',

                        }}>Daftar</Text>
                    </View>
                </TouchableNativeFeedback>

                
                                    <TouchableNativeFeedback onPress={() => navigation.navigate('Login')}>
                                        <Text style={{
                                            fontFamily:fonts.primary[500],
                                            color:'white',
                                            textAlign:'center',
                                            marginTop:10,
                                            fontSize:12,
                                        }}>Sudah memiliki akun? Silakan <Text style={{
                                            fontFamily:fonts.primary[600],
                                        }}>Masuk</Text></Text>
                                    </TouchableNativeFeedback>
            </View>
            </View>
        </View>

        </View>
      </ScrollView>
    </ImageBackground>
  )
}