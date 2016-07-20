'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  ListView,
  TouchableHighlight,
  View,
} from 'react-native';

var AjaxRequests = require('./AjaxRequests');

class BookmarksIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }), loaded: false,
    };
    }

  componentWillMount() { AjaxRequests.fetchIndex.call(this) }


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
