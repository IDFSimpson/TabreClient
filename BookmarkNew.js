'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
} from 'react-native';

const REQUEST_URL = 'https://tabre.herokuapp.com/api/v1/bookmarks/';

class BookmarkNew extends Component {
  constructor(props) {
    super(props);
  }

  postData() {
    fetch(REQUEST_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookmark: {
          name: this.state.name,
          url: this.state.url,
        }
      })
    })
  }

  render() {
    return (
      <View>
        <Text>Name</Text>
        <TextInput
          onChangeText={(name) => {
            this.setState({name});
          }}>
        </TextInput>
        <Text>URL</Text>
        <TextInput
          onChangeText={(url) => {
            this.setState({url});
          }}>
        </TextInput>
        <TouchableHighlight onPress={() => {
          this.postData.call(this);
        }}>
          <Text style={styles.submitButton}>Submit</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
   submitButton: {
     marginTop: 10,
     backgroundColor: '#eeeeee',
 },
});

module.exports = BookmarkNew;
