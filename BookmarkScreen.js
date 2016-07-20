'use strict';

import React, { Component } from 'react';
import {
  DatePickerAndroid,
  StyleSheet,
  Text,
  WebView,
  View,
} from 'react-native';

const REQUEST_URL = 'https://tabre.herokuapp.com/api/v1/bookmarks/';

var AjaxRequests   = require('./AjaxRequests');

class BookmarkScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookmark: null,
    };
  }

  componentWillReceiveProps(){
    this.props.method.fetchAction && this.props.method.fetchAction.call(this);
  }

  componentWillMount() { AjaxRequests.fetchData.call(this); }


  render() {
    if (!this.state.bookmarkData) {
      return this.renderLoadingView();
    }

    return this.renderBookmark(this.state.bookmarkData);
  }

  renderLoadingView() {
    return (
      <View style={styles.container}>
        <Text>Loading ... </Text>
      </View>
    );
  }

  renderBookmark(bookmark) {
    return (
      <View>
        <Text>{bookmark.url}</Text>
        <WebView
          style={styles.webView}
          source={{html: bookmark.scraped_content}}
          scalesPageToFit={this.state.scalesPageToFit}
        />
      </View>
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
   webView: {
     height: 350,
 },
});

module.exports = BookmarkScreen;
