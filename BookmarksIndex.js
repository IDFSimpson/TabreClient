'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  ListView,
  TouchableHighlight,
  View,
} from 'react-native';

// var REQUEST_URL = 'http://192.168.0.11:3000/api/v1/bookmarks/';
var REQUEST_URL = 'http://10.0.0.13:3000/api/v1/bookmarks/';
// var REQUEST_URL = 'http://b50-80.local:3000/api/v1/bookmarks/';

class BookmarksIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // navigator: this.props.navigator,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }), loaded: false,
    };
  }

  componentDidMount() { this.fetchData(); }

  fetchData() {
    fetch(REQUEST_URL)
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(responseData),
        loaded: true,
      });
    })
    .done();
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <ListView
        dataSource = {this.state.dataSource}
        renderRow = {this.renderBookmark.bind(this) }
        style = {styles.listView}
      />
    );
  }

  renderLoadingView() {
    return (
      <View style={styles.container}>
        <Text>Loading ... </Text>
      </View>
    );
  }

  renderBookmark(bookmark) {
    console.log("find the index render");
    // console.log(this.props.navigator);
    // console.log(this.state.navigator);
    return (
      <TouchableHighlight onPress={() => {
        this.props.navigator.push({ name: 'bookmarkScreen', bookmark: bookmark.id, bookmarkName: bookmark.name, navigator: this.props.navigator });
      }}>
        <View style={styles.container}>
          <Text>{bookmark.name}</Text>
          <Text>({bookmark.url})</Text>
        </View>
      </TouchableHighlight>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
   listView: {
     margin: 10,
     paddingTop: 20,
     backgroundColor: '#F5FCFF',
 },
});

module.exports = BookmarksIndex;
