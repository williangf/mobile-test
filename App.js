import React, { Component } from 'react';
import { StyleSheet, View, AsyncStorage, Alert } from 'react-native';
import Header from './components/Header';
import GameBox from './components/GameBox';
import GameBar from './components/GameBar';
import { WIN_CONDITIONS } from './constants/gameLogic';

export default class App extends Component {

  constructor() {
    super()

    // Game State
    // 0 - Initial
    // 1 - Game in progress
    // 2 - Finished - Player wins
    // 3 - Finished - Oponent wins
    // 4 - Finished - Tie

    this.state = {
      gameState: 0,
      gameBoxesLabels: this.emptyGameBoxLabels(),
      playerTurn: true,
      gameCount: 0
    }

    this.getGameCount();
  }

  emptyGameBoxLabels = () => {
    var gameBoxesLabels = [];
    for (let i = 0; i < 9; i++) {
      gameBoxesLabels.push('');
    }
    return gameBoxesLabels;
  }

  changeGameState = () => {
    const { gameState } = this.state;
    switch (gameState) {
      case 0:
        this.setState({ gameState: 1 });
        break;
      default:
        Alert.alert(
          'Do you want to restart the game?',
          '',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            { text: 'OK', onPress: this.restartGame }
          ],
          { cancelable: false }
        );
        break;
    }
  }

  incrementGameCount = async () => {
    const { gameCount } = this.state;
    await AsyncStorage.setItem('gameCount', JSON.stringify(gameCount + 1)).then(() => {
      if (gameCount == 4) {
        Alert.alert(
          'Congratulations!',
          'You already finished five games!',
          [
            { text: 'OK', onPress: () => console.log('OK Pressed') }
          ],
          { cancelable: false }
        );
      }
      this.getGameCount();
    });
  }

  restartGame = async () => {
    this.setState({ gameState: 1, gameBoxesLabels: this.emptyGameBoxLabels(), playerTurn: true });
  }

  getGameCount = async () => {
    await AsyncStorage.getItem('gameCount').then(value =>
      this.setState({ gameCount: JSON.parse(value) })
    );
  }

  playerAction = (gameBox) => () => {
    const { gameState, gameBoxesLabels, playerTurn } = this.state;
    var boxesLabels = gameBoxesLabels;

    if (gameState == 1 && gameBoxesLabels[gameBox] == '' && playerTurn) {
      boxesLabels[gameBox] = 'O';
      this.setState({ gameBoxesLabels: boxesLabels, playerTurn: !playerTurn }, () => this.checkGameState(true));
    }
  }

  oponentLogic = () => {

    // The logic of the opponent looks for the boxes with greater chance of victory.
    // To make it not impossible, he only analyzes one of the real player's victory options.

    const { gameState, gameBoxesLabels, playerTurn } = this.state;
    var boxesLabels = gameBoxesLabels;

    var playerIndexes = this.getAllIndexes(gameBoxesLabels, 'O');
    var oponentIndexes = this.getAllIndexes(gameBoxesLabels, 'X');
    var emptyIndexes = this.getAllIndexes(gameBoxesLabels, '');

    var playerChances = playerIndexes.concat(emptyIndexes.filter((item) => playerIndexes.indexOf(item) < 0));
    var oponentChances = oponentIndexes.concat(emptyIndexes.filter((item) => oponentIndexes.indexOf(item) < 0));

    var gameBox = 0;

    if (oponentIndexes.length == 0) {
      gameBox = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
    } else {
      let greaterChance = -1;
      let greaterChanceIndex = -1;
      WIN_CONDITIONS.map((condition, index) => {
        if (condition.every((val) => oponentChances.includes(val))) {
          let chanceCount = condition.filter(element => oponentIndexes.includes(element)).length;
          if (chanceCount >= greaterChance) {
            greaterChance = chanceCount;
            greaterChanceIndex = index;
          }
        }
      });
      if (greaterChanceIndex > -1) {
        let choosenOponentArray = WIN_CONDITIONS[greaterChanceIndex].filter(val => {
          return !oponentIndexes.includes(val);
        });
        greaterChance = -1;
        greaterChanceIndex = -1;
        WIN_CONDITIONS.map((condition, index) => {
          if (condition.every((val) => playerChances.includes(val))) {
            console.log(condition);
            let chanceCount = condition.filter(element => playerIndexes.includes(element)).length;
            if (chanceCount >= greaterChance) {
              greaterChance = chanceCount;
              greaterChanceIndex = index;
            }
          }
        });
        let choosenPlayerArray = WIN_CONDITIONS[greaterChanceIndex].filter(val => {
          return !playerIndexes.includes(val);
        });
        if (choosenOponentArray.length == 1) {
          gameBox = choosenOponentArray[0];
        } else if (choosenPlayerArray.length == 1) {
          gameBox = choosenPlayerArray[0];
        } else {
          gameBox = choosenOponentArray[Math.floor(Math.random() * choosenOponentArray.length)];
        }
      } else {
        gameBox = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
      }
    }

    if (gameState == 1 && !playerTurn) {
      boxesLabels[gameBox] = 'X';
      this.setState({ gameBoxesLabels: boxesLabels, playerTurn: !playerTurn }, () => this.checkGameState(false));
    }
  }

  checkGameState = (isPlayer) => {
    const { gameBoxesLabels, gameState, playerTurn } = this.state;
    var labelIndexes = isPlayer ? this.getAllIndexes(gameBoxesLabels, 'O') : this.getAllIndexes(gameBoxesLabels, 'X');
    var gameFinished = false;

    WIN_CONDITIONS.map(condition => {
      if (condition.every((val) => labelIndexes.includes(val))) {
        gameFinished = true;
        this.setState({ gameState: (isPlayer ? 2 : 3) }, () => {
          this.incrementGameCount();
        })
      }
    });

    if (!gameFinished) {
      if (gameBoxesLabels.includes('')) {
        if (!playerTurn) {
          var rand = Math.round(Math.random() * (1000 - 500)) + 500; // Oponent "thinking" delay
          setTimeout(() => {
            this.oponentLogic();
          }, rand);
        }
      } else {
        this.setState({ gameState: 4 }, () => {
          this.incrementGameCount();
        });
      }
    }

  }

  getAllIndexes = (arr, val) => {
    var indexes = [], i;
    for (i = 0; i < arr.length; i++) {
      if (arr[i] === val) indexes.push(i);
    }
    return indexes;
  }

  render() {
    const { gameCount, gameState, playerTurn, gameBoxesLabels } = this.state;

    return (
      <View style={styles.container}>
        <Header gameCount={gameCount} />
        <GameBox playerAction={this.playerAction} gameBoxesLabels={gameBoxesLabels} gameState={gameState} playerTurn={playerTurn} />
        <GameBar gameState={gameState} playerTurn={playerTurn} changeGameState={this.changeGameState} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  }
});
