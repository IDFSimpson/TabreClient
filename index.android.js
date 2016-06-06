'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  BackAndroid,
  Image,
  Navigator,
  ListView,
  StyleSheet,
  Text,
  ToolbarAndroid,
  TouchableHighlight,
  WebView,
  View
} from 'react-native';

var REQUEST_URL = 'http://192.168.0.11:3000/api/v1/bookmarks/';
// var REQUEST_URL = 'http://b50-80.local:3000/api/v1/bookmarks/';

var _navigator;
BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator && _navigator.getCurrentRoutes().length > 1) {
    _navigator.pop();
    return true;
  }
  return false;
});

class tab_reminder_rn_client extends Component {
  renderScene(route, navigationOperations) {
    _navigator = navigationOperations;
    if (route.name === 'bookmarksIndex') {
      return <BookmarksIndex navigator={navigationOperations} />
    }
    else if (route.name === 'bookmarkScreen') {
      return (
        <View style={{flex: 1}}>
          <ToolbarAndroid
            actions={[]}
            navIcon={require('image!android_back_white')}
            onIconClicked={navigationOperations.pop}
            style={styles.toolbar}
            titleColor="white"
            title={route.bookmarkName} />
          <BookmarkScreen navigator={navigationOperations} bookmark={route.bookmark} />
        </View>
      );
    }
  }

  render() {
    var initialRoute = {name: 'bookmarksIndex'};
    return (
      <Navigator
        initialRoute={initialRoute}
        renderScene={this.renderScene.bind(this)}
      />
    );
  }
}


class BookmarksIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
        renderRow = {this.renderBookmark}
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
    return (
      <TouchableHighlight onPress={() => {
        _navigator.push({ name: 'bookmarkScreen', bookmark: bookmark.id, bookmarkName: bookmark.name });
      }}>
        <View style={styles.container}>
          <Text>{bookmark.name}</Text>
          <Text> ({bookmark.url})</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

class BookmarkScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookmark: null,
    };
  }

  componentDidMount() { this.fetchData(); }

  fetchData() {
    fetch(REQUEST_URL + this.props.bookmark)
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({
        bookmarkData: responseData,
      });
    })
    .done();
  }

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
  toolbar: {
    backgroundColor: '#a9a9a9',
    height: 56,
  },
   listView: {
     margin: 10,
     paddingTop: 20,
     backgroundColor: '#F5FCFF',
 },
   webView: {
     height: 350,
 },
});

AppRegistry.registerComponent('tab_reminder_rn_client', () => tab_reminder_rn_client);
