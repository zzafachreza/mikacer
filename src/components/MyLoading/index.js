import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Spinner from 'react-native-spinkit';
import { Color } from '../../utils';

export default function MyLoading({ type = 'ThreeBounce', color = Color.primary[900] }) {
    return (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, }}>
            <Spinner isVisible={true} size={60} type={type} color={color} />
        </View>
    );
}

const styles = StyleSheet.create({});