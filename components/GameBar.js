import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';

export default class GameBar extends Component {

    getStatusLabel = () => {
        switch (this.props.gameState) {
            case 2:
                return 'Player 1 Wins';
            case 3:
                return 'Player 2 Wins';
            case 4:
                return "It's a Tie";
        }
    }

    getButtonLabel = () => {
        return this.props.gameState == 0 ? 'START GAME' : 'RESTART GAME';
    }

    render() {
        const { changeGameState, gameState } = this.props;

        return (
            <View style={styles.container}>
                {gameState > 1 && <Text style={styles.gameStatus}>{this.getStatusLabel()}</Text>}
                <TouchableOpacity
                    onPress={changeGameState}
                    style={styles.button} >
                    <Text style={styles.buttonText}>{this.getButtonLabel()}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#303030'
    },
    gameStatus: {
        fontSize: 14,
        textShadowRadius: 10,
        textShadowOffset: { width: 1, height: 1 },
        textShadowColor: 'rgba(0, 0, 0, .8)',
        color: '#fff',
        letterSpacing: 4,
        marginBottom: 8
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#202020',
        padding: 14,
        borderRadius: 4
    },
    buttonText: {
        fontSize: 14,
        textShadowRadius: 10,
        textShadowOffset: { width: 1, height: 1 },
        textShadowColor: 'rgba(0, 0, 0, .8)',
        color: '#fff',
        letterSpacing: 4
    }
});
