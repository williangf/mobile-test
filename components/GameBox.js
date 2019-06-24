import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, Dimensions, Text } from 'react-native';

const windowWidth = Dimensions.get('window').width;

export default class GameBox extends Component {

    renderBoxes = () => {
        const { playerAction, gameBoxesLabels } = this.props;
        var gameBoxes = [];

        for (let i = 0; i < 9; i++) {
            gameBoxes.push(<TouchableOpacity
                key={i}
                onPress={playerAction(i)}
                style={styles.gameBox} >
                <Text style={styles.gameBoxText}>{gameBoxesLabels[i]}</Text>
            </TouchableOpacity>);
        }
        return gameBoxes;
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.boxContainer}>
                    {this.renderBoxes()}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#202020'
    },
    boxContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    gameBox: {
        width: (windowWidth / 3),
        height: (windowWidth / 3),
        backgroundColor: '#303030',
        borderStyle: 'solid',
        borderColor: '#202020',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    gameBoxText: {
        fontSize: 52,
        fontFamily: 'sans-serif',
        textShadowRadius: 10,
        textShadowOffset: { width: 1, height: 1 },
        textShadowColor: 'rgba(0, 0, 0, .8)',
        color: '#fff',
        letterSpacing: 4
    }
});
