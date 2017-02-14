/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';
import ReactNative from 'react-native';
import * as firebase from 'firebase';
const StatusBar = require('./components/StatusBar');
const ActionButton = require('./components/actionButton');
const ListItem = require('./components/listItem');
const styles = require('./styles.js')

const {
  AppRegistry,
  ListView,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  AlertIOS,
} = ReactNative;


  // Initialize Firebase
  const firebaseConfig = {    
    apiKey: "AIzaSyBCDxDZy1vnBg5LXKsNaK3gTMNL_ZCypdg",
    authDomain: "familyapp-68910.firebaseapp.com",
    databaseURL: "https://familyapp-68910.firebaseio.com",
    storageBucket: "familyapp-68910.appspot.com",
    messagingSenderId: "510701642620"
  };
  const firebaseApp = firebase.initializeApp(firebaseConfig);


export default class FamilyApp extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };
    this.itemsRef = this.getRef().child('items');
  }

  getRef() {
    return firebaseApp.database().ref();
  }

  listenForItems(itemsRef) {
    itemsRef.on('value', (snap) => {

      // get children as an array
      var items = [];
      snap.forEach((child) => {
        items.push({
          title: child.val().title,
          _key: child.key
        });
      });

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(items)
      });

    });
  }

  componentDidMount() {
    this.listenForItems(this.itemsRef);
  }

  render() {
    return (
      <View style={styles.container}>

        <StatusBar title="Glöm inte att...!" />

        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderItem.bind(this)}
          enableEmptySections={true}
          style={styles.listview}/>

        <ActionButton onPress={this._addItem.bind(this)} title="Lägg till!" />

      </View>
    )
  }

  _addItem() {
    AlertIOS.prompt(
      'Vad ska du göra?',
      null,
      [
        {text: 'Avbryt', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {
          text: 'Lägg till',
          onPress: (text) => {
            this.itemsRef.push({ title: text })
          }
        },
      ],
      'plain-text'
    );
  }

  _renderItem(item) {

    const onPress = () => {
      AlertIOS.alert(
        'Done!',
        null,
        [
          {text: 'Fixat!', onPress: (text) => this.itemsRef.child(item._key).remove()},
          {text: 'Avbryt', onPress: (text) => console.log('Cancelled')}
        ]
      );
    };

    return (
      <ListItem item={item} onPress={onPress} />
    );
  }

}



AppRegistry.registerComponent('FamilyApp', () => FamilyApp);


