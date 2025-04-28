import { View, Text, ImageBackground, ScrollView, Image, TouchableNativeFeedback, Alert } from 'react-native'
import React, { useState } from 'react'
import { colors, fonts } from '../../utils'
import { MyInput } from '../../components'
import { showMessage } from 'react-native-flash-message';
import axios from 'axios';

export default function Login({navigation}) {
    const [data, setData] = useState({
        email: '',
        password:'',
    });

    const handleLogin = () => {
        if (data.email.length == '' || data.password.length == '') {
            showMessage({
                type:'danger',
                backgroundColor:colors.danger,
                color:colors.white,
                message:'Semua Field Harus Diisi!',
                position:'top',
                style:{borderBottomRightRadius:10, borderBottomLeftRadius:10,},
                textStyle:{fontFamily:fonts.primary[600]}
            });
        } else if (data.email.length == '') {
            showMessage({
                type:'danger',
                backgroundColor:colors.danger,
                color:colors.white,
                message:'Email Harus Diisi!',
                position:'top',
                style:{borderBottomRightRadius:10, borderBottomLeftRadius:10,},
                textStyle:{fontFamily:fonts.primary[600]}
                
            });
        } else if (data.password.length == '') {
            showMessage({
                type:'danger',
                backgroundColor:colors.white,
                color:colors.danger,
                message:'Password Harus Diisi!',
            });
        }  else {
            console.log('Data yang dikirim: ', data);

            axios
            .post('API KEY', data)
            .then((res) => {
                if (res.data.status == 'success') {
                    showMessage({
                        type:'success',
                        backgroundColor:colors.white,
                        color:colors.success,
                        message:res.data.message
                    });
                    navigation.navigate('Home');
                } else {
                    showMessage({
                        type:'danger',
                        backgroundColor:colors.white,
                        color:colors.danger,
                        message:res.data.message
                    });
                }
            
            })
            .catch((err) => {
                console.error('Error: ', err);
            })
        }
    };


  return (
    <ImageBackground style={{
        flex:1,
        width:'100%',
        height:'100%',
        backgroundColor:'white'
    }} source={require('../../assets/bglogin.png')}>
      <ScrollView>
        <View style={{
            padding:10,
        }}>

       

        <View style={{
            marginTop:'105%',
            padding:10
        }}>
            <Text style={{
                fontFamily:fonts.primary[600],
                color:'white',
                fontSize:25,
                textAlign:'center'
                
            }}>Masuk</Text>

            <View style={{
                padding:10
            }}>
                <MyInput value={data.email} 
                label="Email" 
                placeholder="Isi Email"  
                colorlabel='white'
                onChangeText={(x) => setData({...data, 'email':x})}
                />

                <MyInput 
                label="Kata Sandi" 
                placeholder="Isi Kata Sandi"  
                colorlabel='white'
                secureTextEntry={true}
                value={data.password}
                onChangeText={(x) => setData({...data, 'password':x})}
                />

                <View style={{
                    flexDirection:'row',
                    justifyContent:"flex-end"
                }}>
                    <TouchableNativeFeedback>
                        <View style={{
                            marginTop:10,
                        }}>
                            <Text style={{
                                fontFamily:fonts.primary[600],
                                color:'white',
                                fontSize:12
                            }}>Lupa Kata Sandi</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>


                <View>
                    <TouchableNativeFeedback onPress={handleLogin}>
                        <View style={{
                            padding:10,
                            backgroundColor:colors.secondary,
                            borderRadius:30,
                            marginTop:10

                        }}>
                        <Text style={{
                            fontFamily:fonts.primary[600], 
                            color:colors.white,
                            textAlign:"center"
                            }}>Masuk</Text>

                        </View>
                    </TouchableNativeFeedback>

                    <TouchableNativeFeedback onPress={() => navigation.navigate('Register')}>
                        <Text style={{
                            fontFamily:fonts.primary[500],
                            color:'white',
                            textAlign:'center',
                            marginTop:10,
                            fontSize:12,
                        }}>Belum memiliki akun? Silakan <Text style={{
                            fontFamily:fonts.primary[600],
                        }}>Daftar</Text></Text>
                    </TouchableNativeFeedback>
                </View>
            </View>
        </View>

        </View>
      </ScrollView>
    </ImageBackground>
  )
}