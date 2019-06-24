import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class Header extends Component {

    render() {
        const { gameCount } = this.props;

        return (
            <View style={styles.container}>
                <Text style={styles.title}>Tic-Tac-Toe</Text>
                <Text style={styles.gameCount}>{gameCount}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 0,
        backgroundColor: '#303030'
    },
    title: {
        fontSize: 24,
        padding: 24,
        textAlign: 'left',
        textShadowRadius: 10,
        textShadowOffset: { width: 1, height: 1 },
        textShadowColor: 'rgba(0, 0, 0, .8)',
        color: '#fff',
        letterSpacing: 4
    },
    gameCount: {
        position: 'absolute',
        fontSize: 24,
        textShadowRadius: 10,
        textShadowOffset: { width: 1, height: 1 },
        textShadowColor: 'rgba(0, 0, 0, .8)',
        color: '#fff',
        top: 24,
        right: 24
    }
});
