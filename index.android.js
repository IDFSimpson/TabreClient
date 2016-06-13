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
  DatePickerAndroid,
  View
} from 'react-native';

// var REQUEST_URL = 'http://192.168.0.11:3000/api/v1/bookmarks/';
var REQUEST_URL = 'http://10.0.0.13:3000/api/v1/bookmarks/';
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
      var fetchAction = null;
      return (
        <View style={{flex: 1}}>
          <ToolbarAndroid
            navIcon={require('image!android_back_white')}
            onIconClicked={navigationOperations.pop}
            actions={toolbarActions}
            onActionSelected={this._onActionSelected.bind(this)}
            style={styles.toolbar}
            titleColor="white"
            title={route.bookmarkName}
            navigator={navigationOperations}
            fetchAction={fetchAction} />
          <BookmarkScreen navigator={navigationOperations} bookmark={route.bookmark} method={this.state} />
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

  _onActionSelected(position) {
    console.log('Selected ' + toolbarActions[position].title);
    switch (toolbarActions[position].title) {
      case ("Snooze"):
        this.setState({fetchAction: 'SNOOZE'});
        break;
      case ("Remove Bookmark"):
        this.setState({fetchAction: 'DELETE'});
        break;
      default:
        console.log('Fall through');
    }
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

  componentWillReceiveProps(){
    console.log('componentWillReceiveProps');
    this.props.method && console.log(this.props.method);
    if (this.props.method && this.props.method.fetchAction === 'POST') {
      this.postData();
    } else if (this.props.method && this.props.method.fetchAction === 'PATCH') {
      this.patch();
    } else if (this.props.method && this.props.method.fetchAction === 'SNOOZE') {
      this.patch();
    } else if  (this.props.method && this.props.method.fetchAction === 'DELETE') {
      this.deleteBookmark();
    } else {
      this.fetchData();
    }
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

  postData() {
    fetch(REQUEST_URL + this.props.bookmark, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
         firstParam: 'yourValue',
         secondParam: 'yourOtherValue',
      })
    })
  }
  patchData() {
    fetch(REQUEST_URL + this.props.bookmark, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
         firstParam: 'yourValue',
         secondParam: 'yourOtherValue',
      })
    })
  }
  patchSnooze() {
    fetch(REQUEST_URL + this.props.bookmark, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
         snooze_until: this.props.bookmark.snooze_until,
      })
    })
  }

  deleteBookmark() {
    console.log("deleting bookmark");
    fetch(REQUEST_URL + this.props.bookmark, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(_navigator.pop())
  }

  async showPicker(stateKey, options) {
    try {
      var newState = {};
      const {action, year, month, day} = await DatePickerAndroid.open(options);
      if (action === DatePickerAndroid.dismissedAction) {
        newState[stateKey + 'Text'] = 'dismissed';
      } else {
        var date = new Date(year, month, day);
        newState[stateKey + 'Text'] = date.toLocaleDateString();
        newState[stateKey + 'Date'] = date;
      }
      this.setState(newState);
    } catch ({code, message}) {
      console.warn(`Error in example '${stateKey}': `, message);
    }
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

var toolbarActions = [
  {title: 'Create', icon: require('image!ic_create_black_48dp'), show: 'always'},
  {title: 'Snooze', icon: require('image!ic_schedule_black_48dp'), show: 'always'},
  {title: 'View Website'},
  {title: 'Refresh'},
  {title: 'Share Link'},
  {title: 'Make Note'},
  {title: 'Add Tag'},
  {title: 'Remove Bookmark'},
  {title: 'Settings', icon: require('image!ic_settings_black_48dp'), show: 'always'},
];

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
