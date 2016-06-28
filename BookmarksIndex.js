'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  ListView,
  TouchableHighlight,
  View,
} from 'react-native';

const REQUEST_URL = 'https://tabre.herokuapp.com/api/v1/bookmarks/';

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
    return (
      <TouchableHighlight onPress={() => {
        this.props.navigator.push({ name: 'bookmarkScreen', bookmark: bookmark.id, bookmarkName: bookmark.name, navigator: this.props.navigator });
      }}>
        <View style={styles.container}>
          <Text style={{fontWeight: 'bold'}}>{bookmark.name}</Text>
          <Text>{bookmark.url}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 20,
    margin: 5,
  },
   listView: {
     margin: 10,
     paddingTop: 20,
     backgroundColor: '#F5FCFF',
 },
});

module.exports = BookmarksIndex;
